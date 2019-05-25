import bcrypt from "bcryptjs";
import {
  Arg,
  Ctx,
  Mutation,
  Query,
  Resolver,
  UseMiddleware
} from "type-graphql";
import { v4 } from "uuid";
import { Role } from "../../entity/Role";
import { User } from "../../entity/User";
import { redis } from "../../redis";
import { MyContext } from "../../types/MyContext";
import { createConfirmationUrl } from "../../utils/createConfirmationUrl";
import { sendEmail } from "../../utils/sendEmail";
import {
  confirmUserPrefix,
  forgotPasswordPrefix
} from "../constants/redisPrefixes";
import { isAuth } from "../middleware/isAuth";
import { createBaseResolver } from "../shared/createBaseResolver";
import {
  ChangePasswordInput,
  CreateUserInput,
  GetUserByFilterInput,
  GetUserByRoleInput,
  UpdateUserInput
} from "./Inputs";

const BaseResolver = createBaseResolver(
  "User",
  User,
  CreateUserInput,
  UpdateUserInput,
  User
);

@Resolver(User)
export class UserResolver extends BaseResolver {
  @UseMiddleware(isAuth)
  @Query(() => [User], { name: `getAllUserByRole` })
  async getAllUserByRole(
    @Arg("data", () => GetUserByRoleInput, { nullable: true })
    data?: GetUserByRoleInput | null
  ) {
    // get admin role
    const role = await Role.findOne({ where: { title: "Admin" } });
    if (!role) {
      return [];
    }
    let selectedRole: Role[] | undefined = undefined;
    if (data) {
      selectedRole = await Role.find({
        where: {
          title:
            data.roleType === "*"
              ? { $nin: ["Admin", "Manager"] }
              : data.roleType
        }
      });
    }
    const user = await User.find({
      where: { roleID: { $ne: role.id.toString() } }
    });
    return user.filter(({ roleID }) =>
      selectedRole && selectedRole.length > 0
        ? !!selectedRole.find(r => r.id.toString() === roleID)
        : true
    );
  }

  @UseMiddleware(isAuth)
  @Query(() => [User], { name: `getAllUserByFilter` })
  async getAllUserByFiler(
    @Arg("data", () => GetUserByFilterInput, { nullable: true })
    data?: GetUserByFilterInput | null
  ) {
    const users = await this.getAllUserByRole({
      roleType: data && data.roleType ? data.roleType : undefined
    });
    if (users && data && data.approved !== undefined) {
      if (data.approved) {
        // show approved result
        return users.filter(({ appproved }) => appproved === true);
      }
      return users.filter(
        ({ appproved }) => appproved === false || appproved === undefined
      );
    }
    return users;
  }

  @Mutation(() => User, { name: `register` })
  async register(@Arg("data", () => CreateUserInput) data: CreateUserInput) {
    const hashedPassword = await bcrypt.hash(data.password, 12);
    const user = await super.create({
      ...data,
      password: hashedPassword,
      approved: true
    });
    await sendEmail(data.email, await createConfirmationUrl(user.id));
    return user;
  }

  @Mutation(() => [User], { name: `registerMulti` })
  async registerMulti(
    @Arg("data", () => [CreateUserInput]) data: CreateUserInput[]
  ) {
    const users: User[] = [];
    for (let i = 0; i < data.length; i++) {
      users.push(await this.register(data[i]));
    }
    return users;
    // const hashedPassword = await bcrypt.hash(data.password, 12);
    // const user = await super.create({
    //   ...data,
    //   password: hashedPassword,
    //   approved: true
    // });
    // await sendEmail(data.email, await createConfirmationUrl(user.id));
    // return user;
  }

  @Mutation(() => User)
  async login(
    @Arg("email") email: string,
    @Arg("password") password: string,
    @Ctx() ctx: MyContext
  ): Promise<User | Error> {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return new Error("User not found.");
    }
    // const { appproved, confirmed } = user;
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return new Error("Password is incorrect");
    }
    const userRole = await user.role();
    if (!userRole) {
      return new Error("User has no role assigned yet");
    }
    const { title } = userRole;
    if (title !== "Admin" && title !== "Manager") {
      return new Error("No Access");
    }
    if (title !== "Admin") {
      // check for confimed and approved
      // if (!appproved && !confirmed) {
      //   return new Error("Check your email inbox");
      // }
    }
    ctx.req.session!.userID = user.id;
    return user;
  }

  @Mutation(() => Boolean)
  async confirmUser(@Arg("token") token: string): Promise<boolean> {
    const userId = await redis.get(confirmUserPrefix + token);
    if (!userId) {
      return false;
    }
    const user = await User.findOne(userId);
    if (!user) {
      return false;
    }
    user.confirmed = true;
    user.save();
    redis.del(token);
    return true;
  }

  @UseMiddleware(isAuth)
  @Mutation(() => Boolean, { name: `approvedUser` })
  async approvedUser(
    @Arg("approved", () => Boolean) approved: boolean,
    @Arg("userID", () => String) userID: string
  ) {
    const user = await User.findOne(userID);
    if (!user) {
      return false;
    }
    user.appproved = approved;
    await user.save();
    return true;
  }

  @Mutation(() => Boolean)
  async forgotPassword(@Arg("email") email: string): Promise<boolean> {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return true;
    }
    const token = v4();
    await redis.set(forgotPasswordPrefix + token, user.id, "ex", 60 * 60 * 24); // 1 day expiration
    await sendEmail(
      email,
      `${process.env.FRONTEND_URL}/user/change-password/${token}`
    );
    return true;
  }

  @Mutation(() => User, { nullable: true })
  async changePassword(
    @Arg("data")
    { token, password }: ChangePasswordInput,
    @Ctx() ctx: MyContext
  ): Promise<User | null> {
    const userId = await redis.get(forgotPasswordPrefix + token);
    if (!userId) {
      return null;
    }
    const user = await User.findOne(userId);
    if (!user) {
      return null;
    }
    await redis.del(forgotPasswordPrefix + token);
    user.password = await bcrypt.hash(password, 12);
    await user.save();
    ctx.req.session!.userId = user.id;
    return user;
  }

  @Mutation(() => Boolean)
  async logout(@Ctx() ctx: MyContext): Promise<Boolean> {
    return new Promise((res, rej) =>
      ctx.req.session!.destroy(err => {
        if (err) {
          console.log(err);
          return rej(false);
        }
        ctx.res.clearCookie("qid");
        return res(true);
      })
    );
  }

  @Query(() => User, { nullable: true })
  async me(
    @Ctx()
    ctx: MyContext
  ) {
    const { userID } = ctx.req.session!;
    return userID ? User.findOne(userID) : null;
  }
}

import { Resolver, Mutation, Arg, Ctx } from "type-graphql";
import bcrypt from "bcryptjs";
import { v4 } from "uuid";
import { createBaseResolver } from "../shared/createBaseResolver";
import { User } from "../../entity/User";
import {
  CreateUserInput,
  UpdateUserInput,
  ChangePasswordInput
} from "./Inputs";
import { MyContext } from "../../types/MyContext";
import { redis } from "../../redis";
import { createConfirmationUrl } from "../../utils/createConfirmationUrl";
import { sendEmail } from "../../utils/sendEmail";
import {
  forgotPasswordPrefix,
  confirmUserPrefix
} from "../constants/redisPrefixes";

const BaseResolver = createBaseResolver(
  "User",
  User,
  CreateUserInput,
  UpdateUserInput,
  User
);

@Resolver(User)
export class UserResolver extends BaseResolver {
  @Mutation(() => User, { name: `register` })
  async register(@Arg("data", () => CreateUserInput) data: CreateUserInput) {
    const hashedPassword = await bcrypt.hash(data.password, 12);
    const user = await super.create({ ...data, password: hashedPassword });
    await sendEmail(data.email, await createConfirmationUrl(user.id));
    return user;
  }

  @Mutation(() => User, { nullable: true })
  async login(
    @Arg("email") email: string,
    @Arg("password") password: string,
    @Ctx() ctx: MyContext
  ): Promise<User | null> {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return null;
    }
    const valid = await bcrypt.compare(password, user.password);
    if (!valid || !user.confirmed || !user.appproved) {
      return null;
    }
    const userRole = await user.role();
    if (!userRole) {
      return null;
    }
    if (userRole.title === "Staff") {
      return null;
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
    await User.update({ id: parseInt(userId, 10) }, { confirmed: true });
    await redis.del(token);
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
}

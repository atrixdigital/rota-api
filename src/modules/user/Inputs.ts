import { MinLength } from "class-validator";
import { Field, InputType } from "type-graphql";
// import { SkillIDsInput } from "../shared/Inputs";

@InputType()
class BaseInput {
  @Field()
  firstName: string;

  @Field()
  lastName: string;

  @Field()
  email: string;

  @Field()
  password: string;

  @Field(() => Boolean, { defaultValue: false })
  approved?: boolean;

  @Field()
  roleID: string;
}

@InputType()
export class CreateUserInput extends BaseInput {}

@InputType()
export class UpdateUserInput extends BaseInput {}

@InputType()
export class ChangePasswordInput {
  @Field()
  token: string;

  @Field()
  @MinLength(5)
  password: string;
}

@InputType()
export class GetUserByRoleInput {
  @Field({ nullable: true })
  roleType?: string;
}
@InputType()
export class GetUserByFilterInput extends GetUserByRoleInput {
  @Field({ nullable: true })
  approved?: boolean;
}

// @InputType()
// export class AssignProjectSkillsInput extends SkillIDsInput {
//   @Field(() => String)
//   projectID: string;
// }

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

  @Field(() => Boolean, { nullable: true })
  approved?: boolean;

  @Field()
  roleID: string;
}

@InputType()
export class CreateUserInput extends BaseInput {}

@InputType()
export class UpdateUserInput extends BaseInput {}

// @InputType()
// export class AssignProjectSkillsInput extends SkillIDsInput {
//   @Field(() => String)
//   projectID: string;
// }

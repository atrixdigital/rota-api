import { Field, InputType } from "type-graphql";
// import { SkillIDsInput } from "../shared/Inputs";

@InputType()
export class CreateUserInput {
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

// @InputType()
// export class AssignProjectSkillsInput extends SkillIDsInput {
//   @Field(() => String)
//   projectID: string;
// }

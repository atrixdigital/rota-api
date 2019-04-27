import { Field, InputType } from "type-graphql";
// import { SkillIDsInput } from "../shared/Inputs";

@InputType()
class BaseInput {
  @Field()
  title: string;

  @Field()
  email: string;

  @Field()
  phone: string;

  @Field()
  userID: string;
}

@InputType()
export class CreateDepartmentInput extends BaseInput {}

@InputType()
export class UpdateDepartmentInput extends BaseInput {}

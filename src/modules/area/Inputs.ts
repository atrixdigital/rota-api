import { Field, InputType } from "type-graphql";
// import { SkillIDsInput } from "../shared/Inputs";

@InputType()
class BaseInput {
  @Field()
  title: string;

  @Field()
  departmentID: string;
}

@InputType()
export class CreateAreaInput extends BaseInput {}

@InputType()
export class UpdateAreaInput extends BaseInput {}

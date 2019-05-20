import { Field, InputType } from "type-graphql";
// import { SkillIDsInput } from "../shared/Inputs";

@InputType()
class BaseInput {
  @Field()
  title: string;

  @Field()
  adminID: string;
}

@InputType()
export class CreateHospitalInput extends BaseInput {}

@InputType()
export class UpdateHospitalInput extends BaseInput {}

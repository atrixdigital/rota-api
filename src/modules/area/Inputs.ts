import { Field, InputType } from "type-graphql";
// import { SkillIDsInput } from "../shared/Inputs";

@InputType()
class BaseInput {
  @Field()
  title: string;
}

@InputType()
export class CreateAreaInput extends BaseInput {}

@InputType()
export class UpdateAreaInput extends BaseInput {}

@InputType()
export class AreaIDInput {
  @Field(() => String)
  areaID: string;
}

@InputType()
export class AssignAreaDepartmentsInput extends AreaIDInput {
  @Field(() => [String])
  departmentIDs: string[];
}

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
  managerID: string;
}

@InputType()
export class CreateDepartmentInput extends BaseInput {}

@InputType()
export class UpdateDepartmentInput extends BaseInput {}

@InputType()
export class DepartmentIDInput {
  @Field(() => String)
  departmentID: string;
}

@InputType()
export class AssignDepartmentRolesInput extends DepartmentIDInput {
  @Field(() => [String])
  roleIDs: string[];
}

@InputType()
export class AssignDepartmentAreasInput extends DepartmentIDInput {
  @Field(() => [String])
  areaIDs: string[];
}

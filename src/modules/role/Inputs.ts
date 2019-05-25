import { Field, InputType } from "type-graphql";
// import { SkillIDsInput } from "../shared/Inputs";

@InputType()
class BaseInput {
  @Field()
  title: string;
}

@InputType()
export class CreateRoleInput extends BaseInput {}

@InputType()
export class UpdateRoleInput extends BaseInput {}

@InputType()
export class RoleIDInput {
  @Field(() => String)
  roleID: string;
}

@InputType()
export class AssignRoleDepartmentsInput extends RoleIDInput {
  @Field(() => [String])
  departmentIDs: string[];
}

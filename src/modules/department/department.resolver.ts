import { Resolver } from "type-graphql";
import { createBaseResolver } from "../shared/createBaseResolver";
import { Department } from "../../entity/Department";
import { CreateDepartmentInput, UpdateDepartmentInput } from "./Inputs";

const BaseResolver = createBaseResolver(
  "Department",
  Department,
  CreateDepartmentInput,
  UpdateDepartmentInput,
  Department
);

@Resolver(Department)
export class DepartmentResolver extends BaseResolver {}

import { Resolver } from "type-graphql";
import { createBaseResolver } from "../shared/createBaseResolver";
import { Role } from "../../entity/Role";
import { CreateRoleInput, UpdateRoleInput } from "./Inputs";

const BaseResolver = createBaseResolver(
  "Role",
  Role,
  CreateRoleInput,
  UpdateRoleInput,
  Role
);

@Resolver(Role)
export class RoleResolver extends BaseResolver {}

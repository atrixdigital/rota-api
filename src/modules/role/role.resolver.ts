import { Resolver, Query } from "type-graphql";
import { createBaseResolver } from "../shared/createBaseResolver";
import { Role } from "../../entity/Role";
import { CreateRoleInput, UpdateRoleInput } from "./Inputs";
// import { Not } from "typeorm";

const BaseResolver = createBaseResolver(
  "Role",
  Role,
  CreateRoleInput,
  UpdateRoleInput,
  Role
);

@Resolver(Role)
export class RoleResolver extends BaseResolver {
  @Query(() => [Role], { name: `getAllRoleNoAuth` })
  async getAllNoAuth() {
    return Role.find({ where: { title: { $ne: "Admin" } } });
  }
}

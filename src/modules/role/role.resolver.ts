import {
  Arg,
  FieldResolver,
  Mutation,
  Query,
  Resolver,
  Root,
  UseMiddleware
} from "type-graphql";
import { Department } from "../../entity/Department";
import { DepartmentRole } from "../../entity/DepartmentRole";
import { Role } from "../../entity/Role";
import { isAuth } from "../middleware/isAuth";
import { createBaseResolver } from "../shared/createBaseResolver";
import {
  AssignRoleDepartmentsInput,
  CreateRoleInput,
  UpdateRoleInput
} from "./Inputs";

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

  @UseMiddleware(isAuth)
  @FieldResolver()
  async departments(@Root() { id }: Role): Promise<Department[]> {
    return this.setUpRelation<
      Department,
      typeof DepartmentRole,
      DepartmentRole
    >(
      { propertyValue: id.toString(), property: "roleID" },
      DepartmentRole,
      new DepartmentRole(),
      "departmentID",
      "department"
    );
  }

  @UseMiddleware(isAuth)
  @Mutation(() => Role)
  async assignRoleDepartments(@Arg("data", () => AssignRoleDepartmentsInput)
  {
    departmentIDs,
    roleID
  }: AssignRoleDepartmentsInput): Promise<Role> {
    return this.assignRelationData<Role>(roleID, departmentIDs, {
      rEntity: DepartmentRole,
      where: {
        roleID,
        departmentID: { $in: [...departmentIDs] }
      },
      propertyName: "departmentID",
      basePropertyName: "roleID"
    });
  }

  @UseMiddleware(isAuth)
  @Mutation(() => Role)
  async assignRolesDepartments(
    @Arg("data", () => [AssignRoleDepartmentsInput])
    data: AssignRoleDepartmentsInput[]
  ): Promise<Role[]> {
    return Promise.all(data.map(d => this.assignRoleDepartments(d)));
  }
}

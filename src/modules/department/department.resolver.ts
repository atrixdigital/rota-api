import {
  Arg,
  FieldResolver,
  Mutation,
  Resolver,
  Root,
  UseMiddleware
} from "type-graphql";
import { Area } from "../../entity/Area";
import { Department } from "../../entity/Department";
import { DepartmentArea } from "../../entity/DepartmentArea";
import { DepartmentRole } from "../../entity/DepartmentRole";
import { Role } from "../../entity/Role";
import { isAuth } from "../middleware/isAuth";
import { createBaseResolver } from "../shared/createBaseResolver";
import {
  AssignDepartmentAreasInput,
  AssignDepartmentRolesInput,
  CreateDepartmentInput,
  UpdateDepartmentInput
} from "./Inputs";

const BaseResolver = createBaseResolver(
  "Department",
  Department,
  CreateDepartmentInput,
  UpdateDepartmentInput,
  Department
);

@Resolver(Department)
export class DepartmentResolver extends BaseResolver {
  @UseMiddleware(isAuth)
  @FieldResolver()
  async roles(@Root() { id }: Department): Promise<Role[]> {
    return this.setUpRelation<Role, typeof DepartmentRole, DepartmentRole>(
      { propertyValue: id.toString(), property: "departmentID" },
      DepartmentRole,
      new DepartmentRole(),
      "roleID",
      "role"
    );
  }

  @UseMiddleware(isAuth)
  @Mutation(() => Department)
  async assignDepartmentRoles(@Arg("data", () => AssignDepartmentRolesInput)
  {
    roleIDs,
    departmentID
  }: AssignDepartmentRolesInput): Promise<Department> {
    return this.assignRelationData<Department>(departmentID, roleIDs, {
      rEntity: DepartmentRole,
      where: {
        departmentID,
        roleID: { $in: [...roleIDs] }
      },
      propertyName: "roleID",
      basePropertyName: "departmentID"
    });
  }

  @UseMiddleware(isAuth)
  @Mutation(() => Department)
  async assignDepartmentsRoles(
    @Arg("data", () => [AssignDepartmentRolesInput])
    data: AssignDepartmentRolesInput[]
  ): Promise<Department[]> {
    return Promise.all(data.map(d => this.assignDepartmentRoles(d)));
  }

  @UseMiddleware(isAuth)
  @FieldResolver()
  async areas(@Root() { id }: Department): Promise<Area[]> {
    return this.setUpRelation<Area, typeof DepartmentArea, DepartmentArea>(
      { propertyValue: id.toString(), property: "departmentID" },
      DepartmentArea,
      new DepartmentArea(),
      "areaID",
      "area"
    );
  }

  @UseMiddleware(isAuth)
  @Mutation(() => Department)
  async assignDepartmentAreas(@Arg("data", () => AssignDepartmentAreasInput)
  {
    areaIDs,
    departmentID
  }: AssignDepartmentAreasInput): Promise<Department> {
    return this.assignRelationData<Department>(departmentID, areaIDs, {
      rEntity: DepartmentArea,
      where: {
        departmentID,
        areaID: { $in: [...areaIDs] }
      },
      propertyName: "areaID",
      basePropertyName: "departmentID"
    });
  }

  @UseMiddleware(isAuth)
  @Mutation(() => Department)
  async assignDepartmentsAreas(
    @Arg("data", () => [AssignDepartmentAreasInput])
    data: AssignDepartmentAreasInput[]
  ): Promise<Department[]> {
    return Promise.all(data.map(d => this.assignDepartmentAreas(d)));
  }

  @UseMiddleware(isAuth)
  @Mutation(() => Boolean)
  async removeDepartmentRoles(@Arg("data", () => AssignDepartmentRolesInput)
  {
    departmentID,
    roleIDs
  }: AssignDepartmentRolesInput): Promise<boolean> {
    return !!DepartmentRole.remove(
      await DepartmentRole.find({
        where: { departmentID: departmentID, roleID: { $in: [...roleIDs] } }
      })
    );
  }

  @UseMiddleware(isAuth)
  @Mutation(() => Boolean)
  async removeDepartmentsRoles(
    @Arg("data", () => [AssignDepartmentRolesInput])
    data: AssignDepartmentRolesInput[]
  ): Promise<boolean> {
    return !!Promise.all(data.map(d => this.removeDepartmentRoles(d)));
  }

  @UseMiddleware(isAuth)
  @Mutation(() => Boolean)
  async removeDepartmentAreas(@Arg("data", () => AssignDepartmentAreasInput)
  {
    departmentID,
    areaIDs
  }: AssignDepartmentAreasInput): Promise<boolean> {
    return !!DepartmentArea.remove(
      await DepartmentArea.find({
        where: { departmentID: departmentID, areaID: { $in: [...areaIDs] } }
      })
    );
  }

  @UseMiddleware(isAuth)
  @Mutation(() => Boolean)
  async removeDepartmentsAreas(
    @Arg("data", () => [AssignDepartmentAreasInput])
    data: AssignDepartmentAreasInput[]
  ): Promise<boolean> {
    return !!Promise.all(data.map(d => this.removeDepartmentAreas(d)));
  }
}

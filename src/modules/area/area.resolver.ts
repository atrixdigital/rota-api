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
import { isAuth } from "../middleware/isAuth";
import { createBaseResolver } from "../shared/createBaseResolver";
import {
  AssignAreaDepartmentsInput,
  CreateAreaInput,
  UpdateAreaInput
} from "./Inputs";

const BaseResolver = createBaseResolver(
  "Area",
  Area,
  CreateAreaInput,
  UpdateAreaInput,
  Area
);

@Resolver(Area)
export class AreaResolver extends BaseResolver {
  @UseMiddleware(isAuth)
  @FieldResolver()
  async departments(@Root() { id }: Area): Promise<Department[]> {
    return this.setUpRelation<
      Department,
      typeof DepartmentArea,
      DepartmentArea
    >(
      { propertyValue: id.toString(), property: "areaID" },
      DepartmentArea,
      new DepartmentArea(),
      "departmentID",
      "department"
    );
  }

  @UseMiddleware(isAuth)
  @Mutation(() => Area)
  async assignAreaDepartments(@Arg("data", () => AssignAreaDepartmentsInput)
  {
    departmentIDs,
    areaID
  }: AssignAreaDepartmentsInput): Promise<Area> {
    return this.assignRelationData<Area>(areaID, departmentIDs, {
      rEntity: DepartmentArea,
      where: {
        areaID,
        departmentID: { $in: [...departmentIDs] }
      },
      propertyName: "departmentID",
      basePropertyName: "areaID"
    });
  }

  @UseMiddleware(isAuth)
  @Mutation(() => Area)
  async assignAreasDepartments(
    @Arg("data", () => [AssignAreaDepartmentsInput])
    data: AssignAreaDepartmentsInput[]
  ): Promise<Area[]> {
    return Promise.all(data.map(d => this.assignAreaDepartments(d)));
  }
}

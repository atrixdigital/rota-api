import { BaseEntity, Column, Entity, ObjectID, ObjectIdColumn } from "typeorm";
import { Area } from "./Area";
import { Department } from "./Department";
import BaseMethods from "./shared/baseMethods";

@Entity()
export class DepartmentArea extends BaseEntity {
  @ObjectIdColumn()
  id: ObjectID;

  @Column()
  departmentID: string;

  @Column()
  areaID: string;

  async department(departmentID: string | null = null): Promise<Department> {
    return BaseMethods.getRelationData(
      Department,
      departmentID ? departmentID : this.departmentID
    );
  }

  async area(areaID: string | null = null): Promise<Area | null> {
    return BaseMethods.getRelationData(Area, areaID ? areaID : this.areaID);
  }
}

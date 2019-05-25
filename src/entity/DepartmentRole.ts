import { BaseEntity, Column, Entity, ObjectID, ObjectIdColumn } from "typeorm";
import { Department } from "./Department";
import { Role } from "./Role";
import BaseMethods from "./shared/baseMethods";

@Entity()
export class DepartmentRole extends BaseEntity {
  @ObjectIdColumn()
  id: ObjectID;

  @Column()
  departmentID: string;

  @Column()
  roleID: string;

  async department(departmentID: string | null = null): Promise<Department> {
    return BaseMethods.getRelationData(
      Department,
      departmentID ? departmentID : this.departmentID
    );
  }

  async role(roleID: string | null = null): Promise<Role | null> {
    return BaseMethods.getRelationData(Role, roleID ? roleID : this.roleID);
  }
}

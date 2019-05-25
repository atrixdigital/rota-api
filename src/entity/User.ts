import { Field, ID, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  Entity,
  Index,
  ObjectID,
  ObjectIdColumn
} from "typeorm";
import { Area } from "./Area";
import { Department } from "./Department";
import { Role } from "./Role";
import { Schedule } from "./Schedule";
import BaseMethods from "./shared/baseMethods";

@ObjectType()
@Entity()
export class User extends BaseEntity {
  @Field(() => ID)
  @ObjectIdColumn()
  id: ObjectID;

  @Field()
  @Column()
  firstName: string;

  @Field()
  @Column()
  lastName: string;

  @Field()
  name(): string {
    return this.firstName + " " + this.lastName;
  }

  @Field()
  @Column()
  @Index({ unique: true })
  email: string;

  @Field()
  @Column()
  password: string;

  @Field()
  @Column()
  phone: string;

  @Field({ defaultValue: false })
  @Column({ type: Boolean, default: false })
  appproved: boolean;

  @Column("bool", { default: false })
  confirmed: boolean;

  @Column()
  roleID: string;

  @Field(() => Role, { nullable: true })
  async role(): Promise<Role | null> {
    return BaseMethods.getRelationData(Role, this.roleID);
  }

  @Column({ nullable: true })
  departmentID?: string;

  @Column({ nullable: true })
  areaID?: string;

  @Field(() => Department, { nullable: true })
  async department(): Promise<Department | null> {
    const role = await this.role();
    if (!role) {
      return null;
    }
    if (role.title === "Admin") {
      return null;
    }
    if (role.title === "Manager") {
      return BaseMethods.getRelationDataCondition(Department, {
        where: {
          managerID: this.id.toString()
        }
      });
    }
    if (!this.departmentID) {
      return null;
    }
    return BaseMethods.getRelationData(Department, this.departmentID);
  }

  @Field(() => Area, { nullable: true })
  async area(): Promise<Area | null> {
    if (!this.areaID) {
      return null;
    }
    return BaseMethods.getRelationData(Area, this.areaID);
  }

  @Field(() => [Schedule])
  async schedules(): Promise<Schedule[]> {
    return BaseMethods.getMultiRelationData(Schedule, {
      where: {
        staffID: this.id.toString()
      }
    });
  }
}

import { Field, ID, ObjectType } from "type-graphql";
import { BaseEntity, Column, Entity, ObjectID, ObjectIdColumn } from "typeorm";
import { Area } from "./Area";
import { Department } from "./Department";
import { Role } from "./Role";
import BaseMethods from "./shared/baseMethods";
import { User } from "./User";

@ObjectType()
@Entity()
export class Schedule extends BaseEntity {
  @Field(() => ID)
  @ObjectIdColumn()
  id: ObjectID;

  @Field()
  @Column()
  startTime: string;

  @Field()
  @Column()
  endTime: string;

  @Field()
  @Column()
  startDay: number;

  @Field({ nullable: true })
  @Column({ nullable: true })
  notes?: string;

  @Field()
  @Column()
  coreShift: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  joinTime?: string;

  @Column({ nullable: true })
  staffID?: string;

  @Column()
  roleID: string;

  @Column()
  areaID: string;

  @Column({ nullable: true })
  departmentID?: string;

  @Field(() => User, { nullable: true })
  async staff(): Promise<User | null> {
    if (!this.staffID) {
      return null;
    }
    return BaseMethods.getRelationData(User, this.staffID);
  }

  @Field(() => Role, { nullable: true })
  async role(): Promise<Role | null> {
    return BaseMethods.getRelationData(Role, this.roleID);
  }

  @Field(() => Area, { nullable: true })
  async area(): Promise<Area | null> {
    return BaseMethods.getRelationData(Area, this.areaID);
  }

  @Field(() => Department, { nullable: true })
  async department(): Promise<Department | null> {
    if (!this.departmentID) {
      return null;
    }
    return BaseMethods.getRelationData(Department, this.departmentID);
  }
}

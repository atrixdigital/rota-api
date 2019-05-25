import { Field, ID, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  Entity,
  Index,
  ObjectID,
  ObjectIdColumn
} from "typeorm";
import { Department } from "./Department";

@ObjectType()
@Entity()
export class Area extends BaseEntity {
  @Field(() => ID)
  @ObjectIdColumn()
  id: ObjectID;

  @Field()
  @Column()
  @Index({ unique: true })
  title: string;

  // @Column()
  // departmentID: string;

  // @Field(() => Department, { nullable: true })
  // async department(): Promise<Department | null> {
  //   return BaseMethods.getRelationData(Department, this.departmentID);
  // }

  @Field(() => [Department])
  departments: Department[];
}

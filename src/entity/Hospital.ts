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
import BaseMethods from "./shared/baseMethods";
import { User } from "./User";

@ObjectType()
@Entity()
export class Hospital extends BaseEntity {
  @Field(() => ID)
  @ObjectIdColumn()
  id: ObjectID;

  @Field()
  @Column()
  title: string;

  @Column()
  @Index({ unique: true })
  adminID: string;

  @Field(() => User, { nullable: true })
  async admin(): Promise<User | null> {
    return BaseMethods.getRelationData(User, this.adminID);
  }

  @Field(() => [Department])
  async departments(): Promise<Department[]> {
    return BaseMethods.getMultiRelationData(Department, {
      where: { hospitalID: this.id.toString() }
    });
  }
}

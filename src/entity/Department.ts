import { Field, ID, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  Entity,
  Index,
  ObjectID,
  ObjectIdColumn
} from "typeorm";
import { Hospital } from "./Hospital";
import BaseMethods from "./shared/baseMethods";
import { User } from "./User";

@ObjectType()
@Entity()
export class Department extends BaseEntity {
  @Field(() => ID)
  @ObjectIdColumn()
  id: ObjectID;

  @Field()
  @Column()
  title: string;

  @Field()
  @Column()
  email: string;

  @Field()
  @Column()
  phone: string;

  @Column()
  hospitalID: string;

  @Column()
  @Index({ unique: true })
  managerID: string;

  @Field(() => Hospital, { nullable: true })
  async hospital(): Promise<Hospital | null> {
    return BaseMethods.getRelationData(Hospital, this.hospitalID);
  }

  @Field(() => [User])
  async staffs(): Promise<User[]> {
    return BaseMethods.getMultiRelationData(User, {
      where: {
        deparmtnetID: this.id.toString()
      }
    });
  }

  @Field(() => User)
  async manager(): Promise<User | null> {
    return BaseMethods.getRelationData(User, this.managerID);
  }
}

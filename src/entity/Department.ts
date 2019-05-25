import { Field, ID, ObjectType } from "type-graphql";
import { BaseEntity, Column, Entity, ObjectID, ObjectIdColumn } from "typeorm";
import { Area } from "./Area";
import { Hospital } from "./Hospital";
import { Role } from "./Role";
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
  managerID: string;

  @Field(() => [Role])
  roles: Role[];

  @Field(() => [Area])
  areas: Area[];

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

import { Entity, ObjectID, ObjectIdColumn, Column, BaseEntity } from "typeorm";
import { ObjectType, Field, ID } from "type-graphql";
import { User } from "./User";
import BaseMethods from "./shared/baseMethods";

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
  userID: string;

  @Field(() => User, { nullable: true })
  async user(): Promise<User | null> {
    return BaseMethods.getRelationData(User, this.userID);
  }
}

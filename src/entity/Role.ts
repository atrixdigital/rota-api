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
export class Role extends BaseEntity {
  @Field(() => ID)
  @ObjectIdColumn()
  id: ObjectID;

  @Field()
  @Column()
  @Index({ unique: true })
  title: string;

  @Field(() => [User])
  async users(): Promise<User[]> {
    return BaseMethods.getMultiRelationData(User, {
      where: { roleID: this.id }
    });
  }

  @Field(() => [Department])
  departments: Department[];
}

import {
  Entity,
  ObjectID,
  ObjectIdColumn,
  Column,
  BaseEntity,
  Index
} from "typeorm";
import { ObjectType, Field, ID } from "type-graphql";
import { User } from "./User";
import BaseMethods from "./shared/baseMethods";

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
}

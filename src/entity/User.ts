import {
  Entity,
  ObjectID,
  ObjectIdColumn,
  Column,
  BaseEntity,
  Index
} from "typeorm";
import { ObjectType, Field, ID } from "type-graphql";
import { Role } from "./Role";
import { Department } from "./Department";
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

  @Field(() => [Department])
  async departments(): Promise<Department[]> {
    return BaseMethods.getMultiRelationData(Department, {
      where: { userID: this.id }
    });
  }
}

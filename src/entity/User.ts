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
import { Role } from "./Role";
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

  @Column({ nullable: true })
  deparmtnetID?: string;

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

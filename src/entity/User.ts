import { Entity, ObjectID, ObjectIdColumn, Column, BaseEntity } from "typeorm";
import { ObjectType, Field, ID } from "type-graphql";
import { Role } from "./Role";
import { Department } from "./Department";

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
  @Column({ unique: true })
  email: string;

  @Field()
  @Column()
  password: string;

  @Field({ defaultValue: false })
  @Column({ type: Boolean, default: false })
  appproved: boolean;

  @Column()
  roleID: string;

  @Field(() => Role)
  role: Role;

  @Field(() => [Department])
  departments: Department[];
}

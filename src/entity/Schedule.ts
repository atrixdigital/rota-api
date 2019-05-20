import { Field, ID, ObjectType } from "type-graphql";
import { BaseEntity, Column, Entity, ObjectID, ObjectIdColumn } from "typeorm";
import BaseMethods from "./shared/baseMethods";
import { User } from "./User";

@ObjectType()
@Entity()
export class Schedule extends BaseEntity {
  @Field(() => ID)
  @ObjectIdColumn()
  id: ObjectID;

  @Field()
  @Column()
  startTime: string;

  @Field()
  @Column()
  endTime: string;

  @Field()
  @Column()
  totalHours: number;

  @Field({ nullable: true })
  @Column({ nullable: true })
  joinTime?: string;

  @Column()
  staffID: string;

  @Field(() => User, { nullable: true })
  async staff(): Promise<User | null> {
    return BaseMethods.getRelationData(User, this.staffID);
  }
}

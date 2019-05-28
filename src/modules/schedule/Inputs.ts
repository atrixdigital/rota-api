import { Field, InputType } from "type-graphql";

@InputType()
class BaseInput {
  @Field()
  startTime: number;

  @Field()
  endTime: number;

  @Field({ nullable: true })
  notes?: string;

  @Field({ nullable: true })
  coreShift?: boolean;

  @Field({ nullable: true })
  locumShift?: boolean;

  @Field({ nullable: true })
  staffName?: string;

  @Field({ nullable: true })
  joinTime?: string;

  @Field({ nullable: true })
  staffID?: string;

  @Field()
  roleID: string;

  @Field()
  areaID: string;

  @Field({ nullable: true })
  departmentID?: string;
}

@InputType()
export class CreateScheduleInput extends BaseInput {}

@InputType()
export class UpdateScheduleInput extends BaseInput {}

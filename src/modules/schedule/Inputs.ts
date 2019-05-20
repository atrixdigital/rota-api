import { Field, InputType } from "type-graphql";

@InputType()
class BaseInput {
  @Field()
  startTime: string;

  @Field()
  endTime: string;

  @Field()
  totalHours: number;

  @Field({ nullable: true })
  joinTime?: string;

  @Field()
  staffID: string;
}

@InputType()
export class CreateScheduleInput extends BaseInput {}

@InputType()
export class UpdateScheduleInput extends BaseInput {}

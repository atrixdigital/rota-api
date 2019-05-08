import { Resolver } from "type-graphql";
import { createBaseResolver } from "../shared/createBaseResolver";

import { Schedule } from "../../entity/Schedule";
import { CreateScheduleInput, UpdateScheduleInput } from "./Inputs";

const BaseResolver = createBaseResolver(
  "Schedule",
  Schedule,
  CreateScheduleInput,
  UpdateScheduleInput,
  Schedule
);

@Resolver(Schedule)
export class ScheduleResolver extends BaseResolver {}

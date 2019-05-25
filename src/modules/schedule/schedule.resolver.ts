import { Arg, Ctx, Query, Resolver, UseMiddleware } from "type-graphql";
import { Department } from "../../entity/Department";
import { Schedule } from "../../entity/Schedule";
import { MyContext } from "../../types/MyContext";
import { isAuth } from "../middleware/isAuth";
import { createBaseResolver } from "../shared/createBaseResolver";
import { CreateScheduleInput, UpdateScheduleInput } from "./Inputs";

const BaseResolver = createBaseResolver(
  "Schedule",
  Schedule,
  CreateScheduleInput,
  UpdateScheduleInput,
  Schedule
);

@Resolver(Schedule)
export class ScheduleResolver extends BaseResolver {
  @UseMiddleware(isAuth)
  @Query(() => [Schedule], { name: `getMySchedules` })
  async getMySchedules(
    @Ctx() ctx: MyContext,
    @Arg("startDay", () => Number) startDay: number
  ): Promise<Schedule[]> {
    const userID = ctx.req.session!.userID;
    const department = await Department.findOne({
      where: { managerID: userID }
    });
    if (!department) {
      return [];
    }
    return Schedule.find({
      where: { departmentID: department.id.toString(), startDay }
    });
  }
}

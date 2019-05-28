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
    @Arg("startDate", () => Number) startDate: number
  ): Promise<Schedule[]> {
    const userID = ctx.req.session!.userID;
    const department = await Department.findOne({
      where: { managerID: userID }
    });
    if (!department) {
      return [];
    }
    const schedules = await Schedule.find({
      where: { departmentID: department.id.toString() }
    });
    return schedules.filter(({ startTime }) => {
      const withOutTime = {
        startTime: new Date(startTime).setHours(0, 0, 0, 0),
        startDate: new Date(startDate).setHours(0, 0, 0, 0)
      };
      return (
        new Date(withOutTime.startTime).getTime() ===
        new Date(withOutTime.startDate).getTime()
      );
    });
  }
}

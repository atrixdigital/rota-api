import { Resolver } from "type-graphql";
import { Area } from "../../entity/Area";
import { createBaseResolver } from "../shared/createBaseResolver";
import { CreateAreaInput, UpdateAreaInput } from "./Inputs";
// import { Not } from "typeorm";

const BaseResolver = createBaseResolver(
  "Area",
  Area,
  CreateAreaInput,
  UpdateAreaInput,
  Area
);

@Resolver(Area)
export class AreaResolver extends BaseResolver {}

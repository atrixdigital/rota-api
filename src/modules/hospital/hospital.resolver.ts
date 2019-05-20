import { Resolver } from "type-graphql";
import { Hospital } from "../../entity/Hospital";
import { createBaseResolver } from "../shared/createBaseResolver";
import { CreateHospitalInput, UpdateHospitalInput } from "./Inputs";

const BaseResolver = createBaseResolver(
  "Hospital",
  Hospital,
  CreateHospitalInput,
  UpdateHospitalInput,
  Hospital
);

@Resolver(Hospital)
export class HospitalResolver extends BaseResolver {}

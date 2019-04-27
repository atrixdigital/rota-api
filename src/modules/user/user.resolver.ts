import { Resolver } from "type-graphql";
import { createBaseResolver } from "../shared/createBaseResolver";
import { User } from "../../entity/User";
import { CreateUserInput, UpdateUserInput } from "./Inputs";

const BaseResolver = createBaseResolver(
  "User",
  User,
  CreateUserInput,
  UpdateUserInput,
  User
);

@Resolver(User)
export class UserResolver extends BaseResolver {}

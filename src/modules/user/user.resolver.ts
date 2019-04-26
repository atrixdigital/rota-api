import { Resolver } from "type-graphql";
import { createBaseResolver } from "../shared/createBaseResolver";
import { User } from "../../entity/User";
import { CreateUserInput } from "./Inputs";

const BaseResolver = createBaseResolver("User", User, CreateUserInput, User);

@Resolver(User)
export class UserResolver extends BaseResolver {}

import { User } from "./User";
import { SignInProviderId } from "components/AuthProvider";

export type CurrentUser = () => User | undefined
export type SignIn = () => (providerId?: SignInProviderId) => Promise<User>
export type SignOut = () => () => Promise<void>

import { AuthProvider } from "services/auth";
import { User } from "./User";

export type CurrentUser = () => User | undefined
export type SignIn = () => (provider?: AuthProvider) => Promise<User>
export type SignOut = () => () => Promise<void>
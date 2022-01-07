import { User } from 'types/User'
import { createContext } from 'react'
import { asyncNop, nop } from 'utils/nop'

export type Auth = {
  user?: User;
  signIn: () => void;
  signOut: () => Promise<void>;
  signInAnonymously: () => Promise<User>;
};
export const AuthContext = createContext<Auth>({
  signIn: nop,
  signOut: asyncNop,
  signInAnonymously: () => new Promise<User>(nop)
})

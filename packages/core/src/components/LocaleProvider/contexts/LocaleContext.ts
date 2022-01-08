import { createContext } from 'react'

export type Locale = {
  messages: {
    [key: string]: string;
  };
  functions: {
    [key: string]: (...args: any[]) => void;
  };
};
export const LocaleContext = createContext<Locale>({
  messages: {},
  functions: {}
})

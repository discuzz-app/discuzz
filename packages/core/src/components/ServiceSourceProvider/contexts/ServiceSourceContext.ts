import { createContext } from 'react'
import { Auth, Data } from 'services/source'

export type ServiceSource = {
  auth?: Auth;
  data?: Data;
};
export const ServiceSourceContext = createContext<ServiceSource>({})

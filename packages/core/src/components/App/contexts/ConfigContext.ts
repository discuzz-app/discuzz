import { config } from 'config/app'
import { createContext, FunctionComponent } from 'react'

export type Config = {
  baseUrl?: string;
  richText?: boolean;
  padding?: number;
  pagination?: number;
  viewer?: FunctionComponent;
  composer?: FunctionComponent;
};
export const ConfigContext = createContext<Config>(config)

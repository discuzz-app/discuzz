import { config } from 'config/app'
import { createContext } from 'react'

export type Config = {
  baseUrl?: string;
  richText?: boolean;
  padding?: number;
  pagination?: number;
  viewer: any;
  composer: any;
};
export const ConfigContext = createContext<Config>(config)

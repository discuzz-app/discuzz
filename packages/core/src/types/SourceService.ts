import { ServiceSource } from "components/ServiceSourceProvider";

export type Source = (config: {
  [key: string]: string
}) => ServiceSource
import React from 'react'
import { ServiceSourceContext } from './contexts/ServiceSourceContext'
import { useCurrentSource } from 'services/source'
export { useDataSource } from './hooks/useDataSource'
export type { ServiceSource } from './contexts/ServiceSourceContext'

type ServiceSourceProviderProps = {
  config: {
    [key: string]: string
  },
  children: JSX.Element,
};

export const ServiceSourceProvider = ({ config, children }: ServiceSourceProviderProps) => {
  const source = useCurrentSource(config)

  return (
    <ServiceSourceContext.Provider value={source}>
      {children}
    </ServiceSourceContext.Provider>
  )
}

import React, { useState, useEffect } from 'react';
import { ServiceSourceContext } from './contexts/ServiceSourceContext'
export { useDataSource } from './hooks/useDataSource'
export { useAuthSource } from './hooks/useAuthSource'
export type { ServiceSource } from './contexts/ServiceSourceContext'
import { Auth, Data } from 'services/source'

type ServiceSourceProviderProps = {
  source: any,
  children: JSX.Element,
};

export const ServiceSourceProvider = ({ source, children }: ServiceSourceProviderProps) => {
  const [auth, setAuth] = useState<Auth | undefined>(undefined)
  const [data, setData] = useState<Data | undefined>(undefined)

  useEffect(() => {
    Promise.resolve(source.auth(source.config))
      .then((authObject: Auth) => {
        Promise.resolve(source.data(source.config, authObject))
          .then(setData)

        setAuth(authObject)

      })
  }, [source])

  return (auth && data) ? (
    <ServiceSourceContext.Provider value={{
      auth,
      data
    }}>
      {children}
    </ServiceSourceContext.Provider>
  ) : null
}

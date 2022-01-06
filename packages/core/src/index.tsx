// eslint-disable-next-line no-use-before-define
import React from 'react'

import { App, Config } from 'components/App'

import { SnackbarProvider } from 'notistack'

import { ServiceSourceProvider } from 'components/ServiceSourceProvider'
import { AuthProvider, SignInProviderId } from 'components/AuthProvider'

import { config as appConfig } from 'config/app'
import { LocaleProvider } from 'components/LocaleProvider'


export { createProvider, prefersLocale } from 'utils/locale'
export type { ProviderProps } from 'utils/locale'
export { SignInProviderId } from 'components/AuthProvider'
export type { Config } from 'components/App'
export type { ComposerProps } from 'components/PostComposer'
export type { ContentProps } from 'components/PostCard'


export type DiscuzzCoreProps = {
  url: string,
  service: {
    [key: string]: string
  },
  auths: SignInProviderId[],
  config?: Config,

  locale: any
}


export const DiscuzzCore = ({
  url,
  service,
  auths: authEnabledProviders,
  config,
  locale
}: DiscuzzCoreProps) => {
  const configObject: Config = {
    ...appConfig,
    ...(config || {})
  }

  return (
    <SnackbarProvider maxSnack={1}>
      <ServiceSourceProvider config={service}>
        <LocaleProvider provider={locale}>
          <AuthProvider enabledProviders={authEnabledProviders}>
            <App url={url} config={configObject}/>
          </AuthProvider>
        </LocaleProvider>
      </ServiceSourceProvider>
    </SnackbarProvider>
  )
}

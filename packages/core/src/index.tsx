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
export { SignInProviderId, useAuth } from 'components/AuthProvider'
export type { Config } from 'components/App'
export type { ComposerProps } from 'components/PostComposer'
export type { ContentProps } from 'components/PostCard'
export type { ServiceSource } from 'components/ServiceSourceProvider'
export { trace, log, warn, fatal } from 'utils/logger'
export type { CurrentUser, SignIn, SignOut } from 'types/AuthService'
export type  { User } from 'types/User'
export type  { Post } from 'types/Post'
export type { PendingPost } from 'types/PendingPost'
export { EMPTY_SYMBOL } from 'constants/composer'
export { PostUpdateResult } from 'enums/PostUpdateResult'
export { PendingPostUpdateResult } from 'enums/PostUpdateResult'
export { RequestState } from 'enums/RequestState'
export type { Auth, Data } from 'services/source'
export { loadService } from 'services/source'

export type {
  AddPostCommand,
  EditPostCommand,
  PostListQuery,
  PostQuery,
  RemovePostCommand,
  TogglePostVoteCommand,
  ApprovePendingPostCommand,
  EditPendingPostCommand,
  PendingPostListQuery,
  RejectPendingPostCommand
} from 'types/PostService'

export type DiscuzzCoreProps = {
  url: string,
  service: any,
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
      <ServiceSourceProvider source={service}>
        <LocaleProvider provider={locale}>
          <AuthProvider enabledProviders={authEnabledProviders}>
            <App url={url} config={configObject}/>
          </AuthProvider>
        </LocaleProvider>
      </ServiceSourceProvider>
    </SnackbarProvider>
  )
}

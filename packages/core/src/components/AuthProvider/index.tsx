import React, { useCallback, useState, Fragment } from 'react'
import { AuthContext, Auth } from './contexts/AuthContext'
import { SignInDialog } from './components/SignInDialog'
import { SignInProvider } from './config/signInProviders'
import { useSnackbar } from 'notistack'
import { useCurrentUser, useSignIn, useSignOut } from 'services/auth'
import { SignInProviderId } from './enums/SignInProviderId'
export { useAuth } from './hooks/useAuth'
export type { Auth } from './contexts/AuthContext'
export { SignInProviderId } from './enums/SignInProviderId'

type AuthProviderProps = {
  enabledProviders: SignInProviderId[]
  children: JSX.Element,
};

export const AuthProvider = ({ enabledProviders, children }: AuthProviderProps) => {
  const { enqueueSnackbar } = useSnackbar()
  const user = useCurrentUser()
  const signIn = useSignIn()
  const signOut = useSignOut()

  const [signInDialogIsOpen, toggleSignInDialog] = useState(false)

  const providerValue: Auth = {
    user,
    signIn: useCallback(() => {
      toggleSignInDialog(true)
    }, []),

    signOut: async () => signOut(),
    signInAnonymously: async () => signIn()
  }

  return (
    <Fragment>
      <AuthContext.Provider value={providerValue}>
        {children}
      </AuthContext.Provider>

      <SignInDialog
        enabledProviders={enabledProviders}
        open={signInDialogIsOpen}
        onProviderSelected={async (provider?: SignInProvider) => {
          if (provider) {
            try {
              await signIn(provider.id)
            } catch (error) {
              if (error instanceof Error) {
                enqueueSnackbar(error.message, {
                  variant: 'error'
                })
              } else {
                console.error('Sign In error', error)
              }
            }
          }

          toggleSignInDialog(false)
        }}
      />
    </Fragment>
  )
}

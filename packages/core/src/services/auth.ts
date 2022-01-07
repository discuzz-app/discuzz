import { useAuthSource } from 'components/ServiceSourceProvider'
import { CurrentUser, SignIn, SignOut } from 'types/AuthService'

export const useCurrentUser: CurrentUser = () => {
  const auth = useAuthSource()

  return auth!.useCurrentUser()
}

export const useSignIn: SignIn = () => {
  const auth = useAuthSource()

  return auth!.useSignIn()
}
export const useSignOut: SignOut = () => {
  const auth = useAuthSource()

  return auth!.useSignOut()
}

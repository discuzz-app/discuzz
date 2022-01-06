import { useDataSource } from 'components/ServiceSourceProvider'
import { useAuthSource } from 'components/ServiceSourceProvider/hooks/useAuthSource'
import {
  AuthProvider,
  IdTokenResult,
  onAuthStateChanged,
  signInWithPopup,
  signOut as firebaseAuthSignOut,
  signInAnonymously as firebaseAuthSignInAnonymously
} from 'firebase/auth'
import { doc, Firestore, getDoc } from 'firebase/firestore'
import { log } from 'utils/logger'
import md5 from 'md5'
import { useCallback, useEffect, useState } from 'react'
import { CurrentUser, SignIn, SignOut } from 'types/AuthService'
import { User } from 'types/User'
import { asyncNop, nop } from 'utils/nop'
export type { User, AuthProvider } from 'firebase/auth'
export {
  GoogleAuthProvider,
  FacebookAuthProvider,
  TwitterAuthProvider,
  GithubAuthProvider,
  OAuthProvider
} from 'firebase/auth'

const createAnonymousUser = () =>
  ({
    uid: '',
    displayName: null,
    photoURL: null,
    emailVerified: false,
    isAnonymous: true,
    metadata: {},
    providerData: [],
    refreshToken: '',
    tenantId: '',
    delete: asyncNop,
    getIdToken: () => new Promise<string>(nop),
    getIdTokenResult: () => new Promise<IdTokenResult>(nop),
    reload: asyncNop,
    toJSON: () => ({}),
    email: '',
    phoneNumber: '',
    providerId: ''
  } as User)

const decorate = async (user: User, firestore?: Firestore) => {
  const decoratedUser: any = user

  if (decoratedUser.uid && decoratedUser.isAnonymous) {
    decoratedUser.displayName = null
    decoratedUser.photoURL = `https://www.gravatar.com/avatar/${md5(
      user.uid
    )}?d=identicon`

    try {
      await getDoc(doc(firestore!, 'check', 'requireAnonymousModeration'))
      decoratedUser.canSavePost = true
      log('anon can save post')
    } catch (error) {
      // console.error('Checking moderation error', error)
    }
  } else if (decoratedUser.emailVerified) {
    try {
      await getDoc(doc(firestore!, 'check', 'imAdmin'))
      decoratedUser.isAdmin = true
      decoratedUser.canSavePost = true
      log('admin')
    } catch (error) {
      // console.error('Checking admin error', error)
      try {
        await getDoc(doc(firestore!, 'check', 'requireModeration'))
        decoratedUser.canSavePost = true
        log('verified can save post')
      } catch (error) {
        // console.error('Checking moderation error', error)
      }
    }
  }
  return decoratedUser
}

export const useCurrentUser: CurrentUser = () => {
  const firestore = useDataSource()
  const auth = useAuthSource()
  const [user, setUser] = useState<User | undefined>(undefined)

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(
      auth!,
      async (currentUser: any) => {
        if (currentUser) {
          setUser(await decorate(currentUser, firestore))
        } else {
          setUser(createAnonymousUser())
        }
      }
    )

    return unsubscribeAuth
  }, [auth, firestore])

  return user
}

export const useSignIn: SignIn = () => {
  const auth = useAuthSource()
  const firestore = useDataSource()

  const signIn = useCallback(
    async (provider?: AuthProvider) => {
      if (provider === undefined) {
        return decorate((await firebaseAuthSignInAnonymously(auth!)).user, firestore)
      } else {
        return signInWithPopup(auth!, provider)
      }
    },
    [auth]
  )

  return signIn
}
export const useSignOut: SignOut = () => {
  const auth = useAuthSource()

  const signOut = useCallback(async () => firebaseAuthSignOut(auth!), [auth])

  return signOut
}

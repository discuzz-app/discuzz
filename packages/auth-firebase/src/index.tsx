import { FirebaseApp, getApp, initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import {
  getFirestore
} from 'firebase/firestore'

import {
  IdTokenResult,
  onAuthStateChanged,
  signInWithPopup,
  signOut as firebaseAuthSignOut,
  signInAnonymously as firebaseAuthSignInAnonymously,
  GoogleAuthProvider,
  FacebookAuthProvider,
  TwitterAuthProvider,
  GithubAuthProvider,
  OAuthProvider
} from 'firebase/auth'
import { doc, Firestore, getDoc } from 'firebase/firestore'
import {
  log, CurrentUser, SignIn, SignOut, User, SignInProviderId, Auth
} from '@discuzz/core'
import md5 from 'md5'
import { useCallback, useEffect, useState } from 'react'

const nop = () => { }
const asyncNop = async () => { }

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


export default (config: { [key: string]: string }): Auth => {
  let currentApp: (FirebaseApp | null) = null
  const appName = (config.id || 'discuzz') + '_auth'
  try {
    currentApp = getApp(appName)
  } catch (error) {
    currentApp = initializeApp(config, appName)
  }

  const auth = getAuth(currentApp!)
  const firestore = getFirestore(currentApp!)

  const useCurrentUser: CurrentUser = () => {
    const [user, setUser] = useState<User | undefined>(undefined)

    useEffect(() => {
      if (!firestore) return
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

  const useSignIn: SignIn = () => {
    const signIn = useCallback(
      async (providerId?: SignInProviderId) => {
        if (providerId === undefined) {
          return decorate((await firebaseAuthSignInAnonymously(auth!)).user, firestore)
        } else {
          let provider = null
          switch (providerId) {
            case SignInProviderId.GOOGLE:
              provider = new GoogleAuthProvider()
              break;
            case SignInProviderId.FACEBOOK:
              provider = new FacebookAuthProvider()
              break;
            case SignInProviderId.TWITTER:
              provider = new TwitterAuthProvider()
              break;
            case SignInProviderId.GITHUB:
              provider = new GithubAuthProvider()
              break;
            case SignInProviderId.MICROSOFT:
              provider = new OAuthProvider('microsoft.com')
              break;
            case SignInProviderId.APPLE:
              provider = new OAuthProvider('apple.com')
              provider.addScope('name')
              provider.addScope('email')
              break;
            case SignInProviderId.YAHOO:
              provider = new OAuthProvider('yahoo.com')
              break;
          }

          if (provider === null) {
            throw new Error('SIGN_IN_PROVIDER_NOT_AVAILABLE')
          }

          return signInWithPopup(auth!, provider)
        }
      },
      [auth]
    )

    return signIn
  }

  const useSignOut: SignOut = () => {
    const signOut = useCallback(async () => firebaseAuthSignOut(auth!), [auth])

    return signOut
  }

  return {
    useCurrentUser,
    useSignIn,
    useSignOut,
    data: {
      app: currentApp
    }
  }
}

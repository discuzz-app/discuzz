export type { User, AuthProvider } from './firebase/auth'
export {
  GoogleAuthProvider,
  FacebookAuthProvider,
  TwitterAuthProvider,
  GithubAuthProvider,
  OAuthProvider,
  useCurrentUser,
  useSignIn,
  useSignOut
} from './firebase/auth'

// export type { User, AuthProvider } from './memory/auth'
// export {
//   GoogleAuthProvider,
//   FacebookAuthProvider,
//   TwitterAuthProvider,
//   GithubAuthProvider,
//   OAuthProvider,
//   useCurrentUser,
//   useSignIn,
//   useSignOut
// } from './memory/auth'

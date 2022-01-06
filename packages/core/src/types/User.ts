import { User as BaseUser } from 'services/auth'

export type User = BaseUser & {
  isAdmin?: boolean
  canSavePost?: boolean

  uid: string
  isAnonymous: boolean
  emailVerified: boolean
  photoURL: string | null
  displayName: string | null
};

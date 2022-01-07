export type User = {
  isAdmin?: boolean
  canSavePost?: boolean

  uid: string
  isAnonymous: boolean
  emailVerified: boolean
  photoURL: string | null
  displayName: string | null
};

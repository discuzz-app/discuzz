import { initializeApp } from 'firebase/app'
import { initializeAppCheck, ReCaptchaV3Provider } from 'firebase/app-check'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { useMemo } from 'react'
import { Source } from 'types/SourceService'
export type { Auth } from 'firebase/auth'
export type { Firestore as Data } from 'firebase/firestore'

export const useCurrentSource: Source = (config: {
  [key: string]: string
}) => {
  const firebase = useMemo(() => {
    const app = initializeApp(config)
    const auth = getAuth(app)
    const firestore = getFirestore(app)

    if (config.recaptchaKey) {
      initializeAppCheck(app, {
        provider: new ReCaptchaV3Provider(config.recaptchaKey),
        isTokenAutoRefreshEnabled: true
      })
    }

    return {
      auth,
      data: firestore
    }
  }, [config])

  return firebase
}

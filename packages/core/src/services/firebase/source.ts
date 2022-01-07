import { initializeApp } from 'firebase/app'
import { initializeAppCheck, ReCaptchaV3Provider } from 'firebase/app-check'
import { getAuth } from 'firebase/auth'
import {
  getFirestore,
  enableIndexedDbPersistence,
  Firestore
} from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { log, warn } from 'utils/logger'
export type { Auth } from 'firebase/auth'
export type { Firestore as Data } from 'firebase/firestore'

export const useCurrentSource = (config: { [key: string]: string }) => {
  const [data, setData] = useState<Firestore | undefined>(undefined)

  const app = initializeApp(config)
  const auth = getAuth(app)
  const firestore = getFirestore(app)

  if (config.recaptchaKey) {
    initializeAppCheck(app, {
      provider: new ReCaptchaV3Provider(config.recaptchaKey),
      isTokenAutoRefreshEnabled: true
    })
  }

  useEffect(() => {
    ;(async () => {
      try {
        await enableIndexedDbPersistence(firestore)
        log('Offline support enabled!')
      } catch (error) {
        warn('Offline support failed!', error)
      }

      setData(firestore)
    })()
  }, [config])

  return {
    auth,
    data
  }
}

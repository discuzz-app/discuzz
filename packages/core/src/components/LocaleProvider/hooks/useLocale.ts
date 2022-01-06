import { useContext } from 'react'
import { LocaleContext } from '../contexts/LocaleContext'

export const useLocale = () => {
  const locale = useContext(LocaleContext)

  return locale
}

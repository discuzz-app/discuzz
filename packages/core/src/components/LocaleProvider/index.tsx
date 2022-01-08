import React from 'react'
export { useLocale } from './hooks/useLocale'
export { LocaleContext } from './contexts/LocaleContext'
export type { Locale } from './contexts/LocaleContext'

type LocaleProviderProps = {
  provider: any,
  children: JSX.Element
}

export const LocaleProvider = ({ provider: Provider, children }: LocaleProviderProps) => {
  return (
    <Provider>
      {children}
    </Provider>
  )
}

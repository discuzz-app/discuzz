import React from 'react'
import { LocaleContext, Locale } from 'components/LocaleProvider'

export type ProviderProps = {
  children: JSX.Element
}

// eslint-disable-next-line react/display-name
export const createProvider = (value: Locale) => ({ children }: ProviderProps) => {
  return (
    <LocaleContext.Provider value={value}>
      {children}
    </LocaleContext.Provider>
  )
}

export const prefersLocale = (navigator.language && navigator.language.split('-')[0]) || 'en'

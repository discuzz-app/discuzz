import React from 'react'
import { ThemeProvider } from '@mui/material/styles'
import ScopedCssBaseline from '@mui/material/ScopedCssBaseline'
import {
  DiscuzzCore,
  SignInProviderId,
  Config
} from '@discuzz/core'
import { prefersDarkMode } from 'utils/darkMode'
import { darkTheme, lightTheme } from 'config/mui'
import { Theme } from 'enums/Theme'
export { Theme } from 'enums/Theme'
export { prefersDarkMode } from 'utils/darkMode'
export { createProvider } from '@discuzz/core'
export type { ComposerProps, ContentProps, Config } from '@discuzz/core'

export type DiscuzzProps = {
  url: string,
  service: {
    [key: string]: string
  },
  auths: SignInProviderId[],
  theme?: Theme,
  config?: Config,

  locale: any
};

export const Discuzz = ({
  url,
  service,
  auths,
  theme = Theme.AUTO,
  config,
  locale
}: DiscuzzProps) => {
  return (
    <ThemeProvider theme={
      (theme === Theme.AUTO ? prefersDarkMode : (theme === Theme.DARK)) ? darkTheme : lightTheme
    }>
      <ScopedCssBaseline enableColorScheme>
        <DiscuzzCore
          url={url}
          service={service}
          auths={auths}
          config={config}
          locale={locale}
        />
      </ScopedCssBaseline>
    </ThemeProvider>
  )
}

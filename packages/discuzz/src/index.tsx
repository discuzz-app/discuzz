import React from 'react'
import { ThemeProvider } from '@mui/material/styles'
import ScopedCssBaseline from '@mui/material/ScopedCssBaseline'
import {
  DiscuzzCore,
  SignInProviderId,
  Config,
  ServiceSource
} from '@discuzz/core'
import { prefersDarkMode } from 'utils/darkMode'
import { darkTheme, lightTheme } from 'config/mui'
import { Theme } from 'enums/Theme'
export { Theme } from 'enums/Theme'
export { prefersDarkMode } from 'utils/darkMode'
export { createProvider, Auth, loadService } from '@discuzz/core'
export type { ComposerProps, ContentProps, Config, ServiceSource } from '@discuzz/core'

import logger, { LogLevelDesc } from 'loglevel'

export type DiscuzzProps = {
  url: string,
  service: ServiceSource,
  auths: SignInProviderId[],
  theme?: Theme,
  config?: Config,

  locale: any,
  logLevel?: LogLevelDesc | any
};

export const Discuzz = ({
  url,
  service,
  auths,
  theme = Theme.AUTO,
  config,
  locale,
  logLevel = 'warn'
}: DiscuzzProps) => {
  logger.setLevel(logLevel)

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

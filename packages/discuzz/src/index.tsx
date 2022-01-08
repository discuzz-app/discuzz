import React, { useEffect, useMemo } from 'react'
import { ThemeProvider, createTheme } from '@mui/material/styles'
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
  theme?: Theme | any,
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
  useEffect(() => {
    console.log('[@discuzz/discuzz] LogLevel: ' + logLevel)

    logger.setLevel(logLevel)
  }, [logLevel])

  const muiTheme: any = useMemo(() => {
    let themeObject = theme
    if (typeof themeObject === 'string') {
      themeObject = (theme === Theme.AUTO ? prefersDarkMode : (theme === Theme.DARK)) ? darkTheme : lightTheme
    }

    return createTheme(themeObject)
  }, [theme, prefersDarkMode])


  return (
    <ThemeProvider theme={muiTheme}>
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

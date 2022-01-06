import React from 'react'
import { useConfig } from 'components/App'
import useTheme from '@mui/material/styles/useTheme'

export type ComposerProps = {
  onChange: (newValue: string) => void
  value: string
  placeholder: string
  theme?: string
}

// seems a bug with bundler
(global as any).process = (global as any).process || {
  env: {
    ...(process as any).env
  }
}

export const Composer = (props: ComposerProps) => {
  const config = useConfig()
  const theme = useTheme()
  const Composer = config.composer

  return (
    <Composer {...props} theme={theme.palette.mode}/>
  )
}

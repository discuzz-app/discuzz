import React from 'react'
import { useConfig } from 'components/App'
import { useTheme } from '@mui/material/styles'
import InputBase from '@mui/material/InputBase'

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

const DefaultComposer = ({ onChange, value, placeholder, theme }: ComposerProps) => {
  return (
    <InputBase
      sx={{
        color: `${theme === 'dark' ? '#fff' : '#000'} !important`
      }}
      fullWidth
      placeholder={placeholder}
      value={value}
      multiline
      maxRows={3}
      onChange={(event) => {
        onChange(event.target.value)
      }}
    />
  )
}

export const Composer = (props: ComposerProps) => {
  const config = useConfig()
  const theme = useTheme()
  const Composer = config.composer || DefaultComposer

  return (
    <Composer {...props} theme={theme.palette.mode}/>
  )
}

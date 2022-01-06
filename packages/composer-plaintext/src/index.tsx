import React from 'react'
import InputBase from '@mui/material/InputBase'
import { ComposerProps } from '@discuzz/core'

const Composer = ({ onChange, value, placeholder, theme }: ComposerProps) => {
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
export default Composer

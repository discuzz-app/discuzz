import React from 'react'
import InputBase from '@mui/material/InputBase'
import { ComposerProps } from '@discuzz/core'

const Composer = ({ onChange, value, placeholder }: ComposerProps) => {
  return (
    <InputBase
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

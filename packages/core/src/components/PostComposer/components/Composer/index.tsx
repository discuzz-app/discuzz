import React from 'react'
import { useConfig } from 'components/App'

export type ComposerProps = {
  onChange: (newValue: string) => void
  value: string
  placeholder: string
}

export const Composer = (props: ComposerProps) => {
  const config = useConfig()
  const Composer = config.composer

  return (
    <Composer {...props} />
  )
}

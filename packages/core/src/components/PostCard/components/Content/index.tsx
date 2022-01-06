import React from 'react'
import { useConfig } from 'components/App'



export type ContentProps = {
  children: string
}

export const Content = (props: ContentProps) => {
  const config = useConfig()
  const Viewer = config.viewer

  return (
    <Viewer {...props} />
  )
}

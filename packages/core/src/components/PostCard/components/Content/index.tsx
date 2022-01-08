import React, { Fragment } from 'react'
import { useConfig } from 'components/App'



export type ContentProps = {
  children: string
}


const DefaultViewer = ({ children }: ContentProps) => {
  const content = children.split('\n').reduce((acc: JSX.Element[], item: string, index: number) => {
    acc.push(<Fragment key={index}>{item}</Fragment>)
    acc.push(<br key={`${index}_br`} />)
    return acc
  }, [])
  return (
    <Fragment>
      {content}
    </Fragment>
  )
}

export const Content = (props: ContentProps) => {
  const config = useConfig()
  const Viewer = config.viewer || DefaultViewer

  return (
    <Viewer {...props} />
  )
}

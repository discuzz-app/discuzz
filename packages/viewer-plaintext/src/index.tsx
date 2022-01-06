import React, { Fragment } from 'react'
import { ContentProps } from '@discuzz/core'

const Content = ({ children }: ContentProps) => {
  const content = children.split('\n').reduce((acc: JSX.Element[], item: string, index: number) => {
    acc.push(<Fragment key={index}>{item}</Fragment>)
    acc.push(<br key={`${index}_br`} />)
    return acc
  }, [])
  return (<Fragment>
    {content}
  </Fragment>)
}
export default Content

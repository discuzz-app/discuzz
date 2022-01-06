import React from 'react'
import Markdown from 'markdown-to-jsx'
import { ContentProps } from '@discuzz/discuzz'

const Content = ({ children }: ContentProps) => {
  return (<Markdown>{children}</Markdown>)
}
export default Content

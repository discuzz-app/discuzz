import React, { Fragment } from 'react'
import { PostList } from 'components/PostList'
import { PostComposer } from 'components/PostComposer'

type FullViewProps = {
  url: string
}

export const FullView = ({ url }: FullViewProps) => {
  return (
    <Fragment>
      <PostComposer url={url} />
      <PostList
        level={0}
        url={url}
        parent={null}
      />
    </Fragment>
  )
}

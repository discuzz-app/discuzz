import React from 'react'
import { usePostQuery } from 'services/post'
import { PostCard } from 'components/PostCard'

type SinglePostViewProps = {
  id: string
}

export const SinglePostView = ({ id }: SinglePostViewProps) => {
  const { post } = usePostQuery(id)

  return post
    ? (
      <PostCard level={0} post={post} />
    )
    : null
}

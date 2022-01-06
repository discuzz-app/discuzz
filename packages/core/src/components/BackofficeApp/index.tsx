import React from 'react'
import { useAuth } from 'components/AuthProvider'
import { ReviewPostList } from 'components/PendingPostList'
import { usePendingPostQuery } from 'services/post'

export const BackofficeApp = () => {
  const { user } = useAuth()
  const { pendingPosts } = usePendingPostQuery()

  return (
    (user && user.isAdmin)
      ? (
        <ReviewPostList
          posts={pendingPosts}
        />
        )
      : null
  )
}

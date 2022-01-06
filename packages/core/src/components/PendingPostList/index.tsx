import React from 'react'
import { ReviewPostCard } from '../PendingPostCard'
import { TransitionGroup } from 'react-transition-group'
import Slide from '@mui/material/Slide'
import { PendingPost } from 'types/PendingPost'

type ReviewPostLisProps = {
  posts: PendingPost[]
}

export const ReviewPostList = ({
  posts
}: ReviewPostLisProps
) => {
  return (
    <TransitionGroup>
      {posts.map((post: PendingPost) => (
        <Slide direction="up" key={post.id}>
          <div>
            <ReviewPostCard post={post} />
          </div>
        </Slide>
      ))
      }
    </TransitionGroup>
  )
}

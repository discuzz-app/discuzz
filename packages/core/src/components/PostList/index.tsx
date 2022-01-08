import React, { useRef } from 'react'
import { Post } from 'types/Post'
import { PostCard } from '../PostCard'
import { TransitionGroup } from 'react-transition-group'
import Slide from '@mui/material/Slide'
import { usePostListQuery } from 'services/post'
import { LoadMoreButton } from 'components/Buttons/LoadMoreButton'

import { useIntersectionObserver } from 'hooks/useIntersectionObserver'
import { useConfig } from 'components/App'
import { RequestState } from 'enums/RequestState'

type PostLisProps = {
  url: string
  parent: Post | null
  level: number
}

export const PostList = ({ url, parent, level }: PostLisProps) => {
  const { pagination } = useConfig()
  const { posts, loadMore, hasMore, queryState } = usePostListQuery(url, pagination!, parent)

  const loadMoreButtonRef = useRef()

  useIntersectionObserver({
    target: loadMoreButtonRef,
    onIntersect: loadMore,
    enabled: hasMore
  })

  return (
    <div>
      <TransitionGroup>
        {posts.map((post: Post) => (
          <Slide direction="up" key={post.id}>
            <div>
              <PostCard
                level={level}
                post={post}
              />
            </div>
          </Slide>
        ))
        }
      </TransitionGroup>

      <LoadMoreButton loading={queryState === RequestState.LOADING} buttonRef={loadMoreButtonRef} hasMore={hasMore} onClick={loadMore} />
    </div>

  )
}

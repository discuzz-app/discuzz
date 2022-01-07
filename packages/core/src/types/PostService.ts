import { PendingPost } from "./PendingPost"
import { Post } from "./Post"
import { RequestState } from 'enums/RequestState'
import { PendingPostUpdateResult, PostUpdateResult } from "enums/PostUpdateResult"

export type PostQuery = (id: string) => {
  post: Post | null,
  queryState: RequestState
}
export type PostListQuery = (url: string, pagination: number, parent: Post | null) => {
  posts: Post[],
  loadMore: () => void,
  hasMore: boolean,
  queryState: RequestState
}
export type AddPostCommand = () => (contents: string, url?: string, parent?: Post) => Promise<PostUpdateResult>

export type EditPostCommand = () => (post: Post, contents: string) => Promise<PostUpdateResult>

export type RemovePostCommand = () => (post: Post) => Promise<PostUpdateResult>

export type TogglePostVoteCommand = () => (post: Post) => Promise<PostUpdateResult>

export type PendingPostListQuery = () => {
  pendingPosts: PendingPost[]
}
export type EditPendingPostCommand = () => (pendingPost: PendingPost, contents: string) => Promise<PendingPostUpdateResult>

export type RejectPendingPostCommand = () => (pendingPost: PendingPost) => Promise<PendingPostUpdateResult>

export type ApprovePendingPostCommand = () => (pendingPost: PendingPost) => Promise<PendingPostUpdateResult>

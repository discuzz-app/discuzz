import { CurrentUser, SignIn, SignOut } from "types/AuthService"

import {
  AddPostCommand,
  EditPostCommand,
  PostListQuery,
  PostQuery,
  RemovePostCommand,
  TogglePostVoteCommand,
  PendingPostListQuery,
  EditPendingPostCommand,
  RejectPendingPostCommand,
  ApprovePendingPostCommand
} from 'types/PostService'

export type Auth = {
  useCurrentUser: CurrentUser
  useSignIn: SignIn
  useSignOut: SignOut
  data: {
    [key: string]: any
  }
}

export type Data = {
  usePostQuery: PostQuery
  usePostListQuery: PostListQuery
  useAddPostCommand: AddPostCommand
  useEditPostCommand: EditPostCommand
  useRemovePostCommand: RemovePostCommand
  useTogglePostVoteCommand: TogglePostVoteCommand
  usePendingPostQuery: PendingPostListQuery
  useEditPendingPostCommand: EditPendingPostCommand
  useRejectPendingPostCommand: RejectPendingPostCommand
  useApprovePendingPostCommand: ApprovePendingPostCommand
}

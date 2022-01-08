import { useDataSource } from 'components/ServiceSourceProvider'
import { Post } from 'types/Post'
import {
  AddPostCommand,
  ApprovePendingPostCommand,
  EditPendingPostCommand,
  EditPostCommand,
  PendingPostListQuery,
  PostListQuery,
  PostQuery,
  RejectPendingPostCommand,
  RemovePostCommand,
  TogglePostVoteCommand
} from 'types/PostService'

export const usePostQuery: PostQuery = (id: string) => {
  const data = useDataSource()
  return data!.usePostQuery(id)
}

export const usePostListQuery: PostListQuery = (url: string, pagination: number, parent: Post | null) => {
  const data = useDataSource()
  return data!.usePostListQuery(url, pagination, parent)
}

export const useAddPostCommand: AddPostCommand = () => {
  const data = useDataSource()
  return data!.useAddPostCommand()
}

export const useEditPostCommand: EditPostCommand = () => {
  const data = useDataSource()
  return data!.useEditPostCommand()
}

export const useRemovePostCommand: RemovePostCommand = () => {
  const data = useDataSource()
  return data!.useRemovePostCommand()
}

export const useTogglePostVoteCommand: TogglePostVoteCommand = () => {
  const data = useDataSource()
  return data!.useTogglePostVoteCommand()
}

export const usePendingPostQuery: PendingPostListQuery = () => {
  const data = useDataSource()
  return data!.usePendingPostQuery()
}

export const useEditPendingPostCommand: EditPendingPostCommand = () => {
  const data = useDataSource()
  return data!.useEditPendingPostCommand()
}
export const useRejectPendingPostCommand: RejectPendingPostCommand = () => {
  const data = useDataSource()
  return data!.useRejectPendingPostCommand()
}
export const useApprovePendingPostCommand: ApprovePendingPostCommand = () => {
  const data = useDataSource()
  return data!.useApprovePendingPostCommand()
}

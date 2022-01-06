import { PostAuthor } from './PostAuthor'

export type PendingPost = {
  id: string;

  paths: string[];
  parentId?: string;
  postId?: string;

  url: string;
  author: PostAuthor;
  contents: string;

  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
};

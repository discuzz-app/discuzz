import { PostAuthor } from './PostAuthor'

export type Post = {
  id: string;

  paths: string[];
  parentId: string | null;

  url: string;
  author: PostAuthor;
  contents: string;

  replied: number;
  voted: number;
  voters: {
    [key: string]: number;
  };


  approvedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
  savedAt?: Date;
  deletedAt?: Date;

};

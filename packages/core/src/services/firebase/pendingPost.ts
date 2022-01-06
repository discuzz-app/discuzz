import { useAuth } from 'components/AuthProvider'
import { EMPTY_SYMBOL } from 'constants/composer'
import { useDataSource } from 'components/ServiceSourceProvider'
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  DocumentData,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  QueryDocumentSnapshot,
  serverTimestamp,
  SnapshotOptions,
  updateDoc
} from 'firebase/firestore'
import { PendingPost } from 'types/PendingPost'
import { useCallback, useEffect, useState } from 'react'
import { updatePostReplied } from './post'
import { PENDING_POST_COLLECTION, POST_COLLECTION } from './constants'

import {
  ApprovePendingPostCommand,
  EditPendingPostCommand,
  PendingPostListQuery,
  RejectPendingPostCommand
} from 'types/PostService'
import { PendingPostUpdateResult } from 'enums/PostUpdateResult'

export const usePendingPostQuery: PendingPostListQuery = () => {
  const { user } = useAuth()
  const firestore = useDataSource()
  const [posts, setPosts] = useState<PendingPost[]>([])

  const updatePosts = useCallback(
    (postsSnap) => {
      const posts: PendingPost[] = []

      postsSnap.forEach((postDoc: DocumentData) => {
        posts.push(postDoc.data())
      })

      setPosts(posts)
    },
    [setPosts]
  )

  useEffect(() => {
    if (user && user.isAdmin) {
      const postsQuery = query(
        collection(firestore!, PENDING_POST_COLLECTION)
      ).withConverter(pendingPostConverter)

      getDocs(postsQuery).then(updatePosts).catch(console.error)
      const unsubscribeQuery = onSnapshot(postsQuery, updatePosts)

      return unsubscribeQuery
    }
    return () => {

    }
  }, [user, firestore, updatePosts])

  return { pendingPosts: posts }
}

const pendingPostContentsIsInvalid = (contents: string): boolean => {
  return !contents || contents === EMPTY_SYMBOL
}

export const useEditPendingPostCommand: EditPendingPostCommand = () => {
  const { user } = useAuth()
  const firestore = useDataSource()

  const editPendingPost = useCallback(
    async (pendingPost: PendingPost, contents: string) => {
      if (pendingPostContentsIsInvalid(contents)) {
        return PendingPostUpdateResult.FAIL
      }

      const postDoc = doc(firestore!, PENDING_POST_COLLECTION, pendingPost.id)
      await updateDoc(postDoc, {
        contents,
        updatedAt: serverTimestamp()
      })

      return PendingPostUpdateResult.SUCCESS
    },
    [firestore, user]
  )

  return editPendingPost
}
export const useRejectPendingPostCommand: RejectPendingPostCommand = () => {
  const { user } = useAuth()
  const firestore = useDataSource()

  const rejectPendingPost = useCallback(
    async (pendingPost: PendingPost) => {
      const postDoc = doc(firestore!, PENDING_POST_COLLECTION, pendingPost.id)
      await deleteDoc(postDoc)

      return PendingPostUpdateResult.SUCCESS
    },
    [firestore, user]
  )

  return rejectPendingPost
}
export const useApprovePendingPostCommand: ApprovePendingPostCommand = () => {
  const { user } = useAuth()
  const firestore = useDataSource()

  const approvePendingPost = useCallback(
    async (pendingPost: PendingPost) => {
      const pendingPostDoc = doc(
        firestore!,
        PENDING_POST_COLLECTION,
        pendingPost.id
      )
      const post = await getDoc(pendingPostDoc)
      const data: any = {
        approvedAt: serverTimestamp(),
        savedAt: serverTimestamp()
      }

      const postData = post.data()
      if (pendingPost.postId) {
        const postDoc = doc(firestore!, POST_COLLECTION, pendingPost.postId)
        await updateDoc(postDoc, {
          ...data,
          contents: postData!.contents,
          updatedAt: postData!.updatedAt
        })
      } else {
        await addDoc(collection(firestore!, POST_COLLECTION), {
          ...postData,
          ...data,
          replied: 0,
          voted: 1,
          voters: {
            [postData!.author.id]: 1
          }
        })

        updatePostReplied(firestore!, postData!)
      }
      await deleteDoc(pendingPostDoc)

      return PendingPostUpdateResult.SUCCESS
    },
    [firestore, user]
  )

  return approvePendingPost
}

const pendingPostConverter = {
  toFirestore(data: PendingPost): DocumentData {
    const doc: any = {
      id: data.id,
      paths: data.paths,

      url: data.url,
      author: {
        id: data.author.id
      },
      contents: data.contents
    }

    if (data.author.photoUrl) doc.author.photoUrl = data.author.photoUrl
    if (data.author.name) doc.author.name = data.author.name

    if (data.postId) doc.postId = data.postId
    if (data.createdAt) doc.createdAt = data.createdAt
    if (data.updatedAt) doc.updatedAt = data.updatedAt
    if (data.deletedAt) doc.deletedAt = data.deletedAt

    return doc
  },
  fromFirestore(
    snapshot: QueryDocumentSnapshot,
    options: SnapshotOptions
  ): PendingPost {
    const data = snapshot.data(options)!

    const post: PendingPost = {
      id: snapshot.id,

      paths: data.paths,

      url: data.url,
      author: {
        id: data.author.id,
        name: data.author.name,
        photoUrl: data.author.photoUrl
      },
      contents: data.contents
    }

    if (data.author.photoUrl) post.author.photoUrl = data.author.photoUrl
    if (data.paths.length > 0) {
      post.parentId = data.paths[data.paths.length - 1]
    }
    if (data.postId) post.postId = data.postId
    if (data.createdAt) post.createdAt = data.createdAt.toDate()
    if (data.updatedAt) post.updatedAt = data.updatedAt.toDate()
    if (data.deletedAt) post.deletedAt = data.deletedAt.toDate()

    return post
  }
}

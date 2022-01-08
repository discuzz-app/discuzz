import { initializeAppCheck, ReCaptchaV3Provider } from 'firebase/app-check'
import {
  getFirestore,
  enableIndexedDbPersistence,
  addDoc as firestoreAddDoc,
  collection,
  deleteField,
  doc,
  DocumentData,
  DocumentSnapshot,
  endAt,
  getDocs,
  increment,
  limit,
  onSnapshot,
  orderBy,
  query,
  QueryDocumentSnapshot,
  serverTimestamp,
  SnapshotOptions,
  startAfter,
  updateDoc as firestoreUpdateDoc,
  QuerySnapshot,
  where,
  DocumentReference,
  CollectionReference,

  deleteDoc as firestoreDeleteDoc,
  getDoc
} from 'firebase/firestore'

import {
  EMPTY_SYMBOL,
  AddPostCommand,
  EditPostCommand,
  PostListQuery,
  PostQuery,
  RemovePostCommand,
  TogglePostVoteCommand,
  User,
  Post as BasePost,
  fatal,
  log,
  PostUpdateResult,
  RequestState,
  useAuth,
  PendingPostListQuery,
  PendingPost,
  EditPendingPostCommand,
  RejectPendingPostCommand,
  ApprovePendingPostCommand,
  PendingPostUpdateResult,
  Auth
} from '@discuzz/core'

import { useCallback, useEffect, useState } from 'react'
import { useImmer } from 'use-immer'


const PENDING_POST_COLLECTION = 'pending_posts'
const POST_COLLECTION = 'posts'

type Post = BasePost & {
  snapshot?: DocumentSnapshot
}

export default async (config: { [key: string]: string }, auth: Auth) => {
  const app = auth.data.app
  const firestore = getFirestore(app)

  try {
    await enableIndexedDbPersistence(firestore)
  } catch (error) {
    console.error('Offline support failed!', error)
  }

  if (config.recaptchaKey) {
    initializeAppCheck(app, {
      provider: new ReCaptchaV3Provider(config.recaptchaKey),
      isTokenAutoRefreshEnabled: true
    })
  }

  const usePostQuery: PostQuery = (id: string) => {
    const [post, setPost] = useState<Post | null>(null)
    const [queryState, setQueryState] = useState<RequestState>(
      RequestState.INITIAL
    )

    const updatePost = useCallback(
      (postSnap) => {
        setPost(postSnap.data()!)
        setQueryState(RequestState.SUCCESS)
      },
      [setPost, setQueryState]
    )

    useEffect(() => {
      const postQuery = doc(firestore, POST_COLLECTION, id).withConverter(
        postConverter
      )

      setQueryState(RequestState.LOADING)
      // getDoc(postQuery).then(updatePost)
      const unsubscribeQuery = onSnapshot(postQuery, updatePost)

      return unsubscribeQuery
    }, [id])

    return {
      post,
      queryState
    }
  }

  const usePostListQuery: PostListQuery = (
    url: string,
    pagination: number,
    parent: Post | null = null
  ) => {
    const [posts, setPosts] = useImmer<Post[]>([])
    const [queryState, setQueryState] = useState<RequestState>(
      RequestState.INITIAL
    )
    const [isReachedEnd, toggleReachedEnd] = useState<boolean>(false)
    const [lastPostDoc, setLastPostDoc] = useState<DocumentSnapshot | null>(null)
    const [cursor, setCursor] = useState<DocumentSnapshot | null>(null)

    const normalizePosts = useCallback((postsSnap: QuerySnapshot) => {
      const tmpPosts: Post[] = []

      postsSnap.forEach((postDoc: DocumentData) => {
        const data = postDoc.data()

        if (data.createdAt) {
          tmpPosts.push(data)
        }
      })

      return tmpPosts
    }, [])

    const updatePostsFromList = useCallback(
      (postsSnap: QuerySnapshot) => {
        const tmpPosts = normalizePosts(postsSnap)

        log('update posts from list', tmpPosts)
        setPosts((draft) => {
          for (let i = 0; i < tmpPosts.length; i++) {
            draft.push(tmpPosts[i])
          }
        })

        setQueryState(RequestState.SUCCESS)
        if (tmpPosts.length < pagination) {
          toggleReachedEnd(false)
        } else {
          toggleReachedEnd(true)
        }
      },
      [setPosts, normalizePosts, setQueryState]
    )
    const updatePostsFromSubscriber = useCallback(
      (postsSnap: QuerySnapshot) => {
        const tmpPosts = normalizePosts(postsSnap)

        log('update posts from sub', tmpPosts)
        setPosts((draft) => {
          for (let i = tmpPosts.length - 1; i >= 0; i--) {
            const tmpPost = tmpPosts[i]
            const index = draft.findIndex((post) => post.id === tmpPost.id)

            if (index === -1) {
              log('add post from sub', tmpPost.id, tmpPost)
              draft.unshift(tmpPost)
            } else {
              log('replace post from sub', tmpPost.id, tmpPost)
              draft[index] = tmpPost
            }
          }
        })
      },
      [setPosts, normalizePosts]
    )
    useEffect(() => {
      if (posts.length > 0 && posts[posts.length - 1].createdAt) {
        if (
          lastPostDoc === null ||
          lastPostDoc.id !== posts[posts.length - 1].id
        ) {
          setLastPostDoc(posts[posts.length - 1].snapshot!)
        }
      }
    }, [posts, lastPostDoc])

    useEffect(() => {
      if (parent === null || parent.replied > 0) {
        const queryArgs: any[] = [
          where('url', '==', url),
          where('parentId', '==', parent ? parent.id : null),
          orderBy('createdAt', 'desc'),
          limit(pagination)
        ]

        if (cursor !== null) {
          queryArgs.push(startAfter(cursor))
        }

        setQueryState(RequestState.LOADING)


        const postsQuery = query(
          collection(firestore, POST_COLLECTION),
          ...queryArgs
        ).withConverter(postConverter)

        getDocs(postsQuery)
          .then(updatePostsFromList)
          .catch((error: Error) => {
            fatal('query post failed', error)
            setQueryState(RequestState.FAIL)
          })
      } else if (parent.replied === 0) {
        setQueryState(RequestState.SUCCESS)
      }
    }, [url, parent, cursor, updatePostsFromList, setQueryState])

    useEffect(() => {
      if (queryState === RequestState.SUCCESS) {
        if (posts.length === 0) {
          const queryArgs: any[] = [
            where('url', '==', url),
            where('parentId', '==', parent ? parent.id : null),
            where('savedAt', '>', new Date()),
            orderBy('savedAt', 'desc')
          ]

          const postsSubscribe = query(
            collection(firestore, POST_COLLECTION),
            ...queryArgs
          ).withConverter(postConverter)

          const unsubscribeQuery = onSnapshot(
            postsSubscribe,
            updatePostsFromSubscriber
          )

          return unsubscribeQuery
        }
      }
      return () => {

      }
    }, [queryState, posts])

    useEffect(() => {
      if (lastPostDoc) {
        const queryArgs: any[] = [
          where('url', '==', url),
          where('parentId', '==', parent ? parent.id : null),
          where('savedAt', '>', new Date()),
          orderBy('savedAt', 'desc'),
          endAt(lastPostDoc)
        ]

        const postsSubscribe = query(
          collection(firestore, POST_COLLECTION),
          ...queryArgs
        ).withConverter(postConverter)

        const unsubscribeQuery = onSnapshot(
          postsSubscribe,
          updatePostsFromSubscriber
        )

        return unsubscribeQuery
      }
      return () => {

      }
    }, [url, parent, lastPostDoc, updatePostsFromSubscriber])

    const loadMore = useCallback(() => {
      if (posts.length > 0) {
        setCursor(posts[posts.length - 1].snapshot!)
      }
    }, [posts, setCursor])

    return {
      posts,
      loadMore,
      hasMore: parent === null ? isReachedEnd : parent.replied > posts.length,
      queryState
    }
  }

  const postContentsIsInvalid = (contents: string): boolean => {
    return contents === '' || contents === EMPTY_SYMBOL
  }

  const updateDoc = async (doc: DocumentReference, data: any) => {
    log('Update Doc', doc.id, data)
    return await firestoreUpdateDoc(doc, {
      ...data,
      savedAt: serverTimestamp()
    })
  }

  const addDoc = async (collection: CollectionReference, data: any) => {
    log('Add Doc', collection.path, data, collection)
    return await firestoreAddDoc(collection, {
      ...data,
      savedAt: serverTimestamp()
    })
  }

  const deleteDoc = async (doc: DocumentReference) => {
    log('Delete Doc', doc)
    return await firestoreDeleteDoc(doc)
  }

  const useAddPostCommand: AddPostCommand = () => {
    const { user, signInAnonymously } = useAuth()

    const addPost = useCallback(
      async (contents: string, url?: string, parent?: Post) => {
        if (postContentsIsInvalid(contents)) {
          return PostUpdateResult.INVALID
        }

        let loggedInUser: User = user!

        if (loggedInUser && !loggedInUser.uid) {
          loggedInUser = await signInAnonymously()
        }

        const data: any = {
          paths: parent ? [...parent.paths, parent.id] : [],
          parentId: parent ? parent.id : null,

          url: parent ? parent.url : url,
          author: {
            id: loggedInUser.uid,
            name: loggedInUser.displayName,
            photoUrl: loggedInUser.photoURL || ''
          },
          contents,

          createdAt: serverTimestamp()
        }

        if (loggedInUser.canSavePost) {
          const postData: any = {
            ...data,

            voted: 1,
            replied: 0,
            voters: {
              [loggedInUser.uid]: 1
            },

            // savedAt: serverTimestamp(),
            approvedAt: serverTimestamp()
          }

          log("add post directly", postData)

          await addDoc(collection(firestore, POST_COLLECTION), postData)

          await updatePostReplied(postData)

          return PostUpdateResult.UPDATED
        } else {
          const postData: any = {
            ...data
          }

          await addDoc(collection(firestore, PENDING_POST_COLLECTION), postData)

          return PostUpdateResult.PENDING
        }
      },
      [signInAnonymously, user]
    )

    return addPost
  }

  const useEditPostCommand: EditPostCommand = () => {
    const { user } = useAuth()

    const editPost = useCallback(
      async (post: Post, contents: string) => {
        if (postContentsIsInvalid(contents)) {
          return PostUpdateResult.INVALID
        }

        const data: any = {
          contents: contents,
          updatedAt: serverTimestamp()
        }

        if (user!.canSavePost) {
          const postDoc = doc(firestore!, POST_COLLECTION, post.id)

          const postData: any = {
            ...data
            // savedAt: serverTimestamp()
          }

          await updateDoc(postDoc, postData)

          return PostUpdateResult.UPDATED
        } else {
          const postData: any = {
            ...data,
            postId: post.id,

            paths: [],
            parentId: null,
            author: {
              id: user!.uid,
              name: '',
              photoUrl: ''
            }
          }

          await addDoc(collection(firestore, PENDING_POST_COLLECTION), postData)

          return PostUpdateResult.PENDING
        }
      },
      [user]
    )

    return editPost
  }

  const useRemovePostCommand: RemovePostCommand = () => {
    const removePost = useCallback(
      async (post: Post) => {
        const postDoc = doc(firestore, POST_COLLECTION, post.id)

        await updateDoc(postDoc, {
          contents: '',
          // savedAt: serverTimestamp(),
          deletedAt: serverTimestamp()
        })

        return PostUpdateResult.UPDATED
      },
      []
    )

    return removePost
  }

  const useTogglePostVoteCommand: TogglePostVoteCommand = () => {
    const { user, signIn } = useAuth()

    const togglePostVote = useCallback(
      async (post: Post) => {
        if (user?.emailVerified) {
          log('toggle vote', post.id, 'voters', post.voters, 'from', user.uid)

          const postDoc = doc(firestore, POST_COLLECTION, post.id)

          if (post.voters[user!.uid]) {
            log('remove vote', user.uid)

            await updateDoc(postDoc, {
              [`voters.${user.uid}`]: deleteField(),
              // savedAt: serverTimestamp(),
              voted: increment(-1)
            })
          } else {
            log('add vote', user.uid)

            await updateDoc(postDoc, {
              [`voters.${user.uid}`]: 1,
              // savedAt: serverTimestamp(),
              voted: increment(1)
            })
          }

          return PostUpdateResult.UPDATED
        } else {
          signIn()

          return PostUpdateResult.INVALID
        }
      },
      [user]
    )

    return togglePostVote
  }

  const updatePostReplied = async (
    data: DocumentData
  ) => {
    const parentId =
      data!.paths.length === 0 ? undefined : data!.paths[data!.paths.length - 1]
    if (parentId) {
      log("increase post replied", parentId)

      const parentDoc = doc(firestore, POST_COLLECTION, parentId)
      await updateDoc(parentDoc, {
        // savedAt: serverTimestamp(),
        replied: increment(1)
      })
    }

    // const rootParentId = data!.paths.length <= 1 ? undefined : data!.paths[0]
    // if (rootParentId) {
    //   const rootParentDoc = doc(firestore, POST_COLLECTION, rootParentId)
    //   await updateDoc(rootParentDoc, {
    //     savedAt: serverTimestamp(),
    //     replied: increment(1)
    //   })
    // }
  }

  const postConverter = {
    toFirestore(data: Post): DocumentData {
      const doc: any = {
        id: data.id,
        paths: data.paths,
        parentId: data.parentId,

        url: data.url,
        author: {
          id: data.author.id
        },
        contents: data.contents,

        voted: data.voted,
        replied: data.replied,
        voters: data.voters
      }

      if (data.author.photoUrl) doc.author.photoUrl = data.author.photoUrl
      if (data.author.name) doc.author.name = data.author.name
      if (data.approvedAt) doc.approvedAt = data.approvedAt
      if (data.savedAt) doc.savedAt = data.savedAt
      if (data.createdAt) doc.createdAt = data.createdAt
      if (data.updatedAt) doc.updatedAt = data.updatedAt
      if (data.deletedAt) doc.deletedAt = data.deletedAt

      return doc
    },
    fromFirestore(
      snapshot: QueryDocumentSnapshot,
      options: SnapshotOptions
    ): Post {
      const data = snapshot.data(options)!

      const post: Post = {
        id: snapshot.id,

        paths: data.paths,
        parentId: data.parentId,

        url: data.url,
        author: {
          id: data.author.id,
          name: data.author.name,
          photoUrl: data.author.photoUrl
        },
        contents: data.contents,

        replied: data.replied,
        voted: data.voted,
        voters: data.voters,

        snapshot
      }

      if (data.author.photoUrl) post.author.photoUrl = data.author.photoUrl
      if (data.paths.length > 0) {
        post.parentId = data.paths[data.paths.length - 1]
      }

      if (data.approvedAt) post.approvedAt = data.approvedAt.toDate()
      if (data.savedAt) post.savedAt = data.savedAt.toDate()
      if (data.createdAt) post.createdAt = data.createdAt.toDate()
      if (data.updatedAt) post.updatedAt = data.updatedAt.toDate()
      if (data.deletedAt) post.deletedAt = data.deletedAt.toDate()

      return post
    }
  }







  const usePendingPostQuery: PendingPostListQuery = () => {
    const { user } = useAuth()
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
          collection(firestore, PENDING_POST_COLLECTION)
        ).withConverter(pendingPostConverter)

        getDocs(postsQuery).then(updatePosts).catch(console.error)
        const unsubscribeQuery = onSnapshot(postsQuery, updatePosts)

        return unsubscribeQuery
      }
      return () => {

      }
    }, [user, updatePosts])

    return { pendingPosts: posts }
  }

  const pendingPostContentsIsInvalid = (contents: string): boolean => {
    return !contents || contents === EMPTY_SYMBOL
  }

  const useEditPendingPostCommand: EditPendingPostCommand = () => {
    const { user } = useAuth()

    const editPendingPost = useCallback(
      async (pendingPost: PendingPost, contents: string) => {
        if (pendingPostContentsIsInvalid(contents)) {
          return PendingPostUpdateResult.FAIL
        }

        const postDoc = doc(firestore, PENDING_POST_COLLECTION, pendingPost.id)
        await updateDoc(postDoc, {
          contents,
          updatedAt: serverTimestamp()
        })

        return PendingPostUpdateResult.SUCCESS
      },
      [user]
    )

    return editPendingPost
  }
  const useRejectPendingPostCommand: RejectPendingPostCommand = () => {
    const { user } = useAuth()

    const rejectPendingPost = useCallback(
      async (pendingPost: PendingPost) => {
        const postDoc = doc(firestore, PENDING_POST_COLLECTION, pendingPost.id)
        await deleteDoc(postDoc)

        return PendingPostUpdateResult.SUCCESS
      },
      [user]
    )

    return rejectPendingPost
  }
  const useApprovePendingPostCommand: ApprovePendingPostCommand = () => {
    const { user } = useAuth()

    const approvePendingPost = useCallback(
      async (pendingPost: PendingPost) => {
        const pendingPostDoc = doc(
          firestore,
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
          const postDoc = doc(firestore, POST_COLLECTION, pendingPost.postId)
          await updateDoc(postDoc, {
            ...data,
            contents: postData!.contents,
            updatedAt: postData!.updatedAt
          })
        } else {
          await addDoc(collection(firestore, POST_COLLECTION), {
            ...postData,
            ...data,
            replied: 0,
            voted: 1,
            voters: {
              [postData!.author.id]: 1
            }
          })

          updatePostReplied(postData!)
        }
        await deleteDoc(pendingPostDoc)

        return PendingPostUpdateResult.SUCCESS
      },
      [user]
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


  return {
    usePostQuery,
    usePostListQuery,
    useAddPostCommand,
    useEditPostCommand,
    useRemovePostCommand,
    useTogglePostVoteCommand,
    usePendingPostQuery,
    useEditPendingPostCommand,
    useRejectPendingPostCommand,
    useApprovePendingPostCommand
  }
}

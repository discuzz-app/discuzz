import { createProvider } from '@discuzz/core'
import locale from 'date-fns/locale/en-US'
import { formatDistance } from 'date-fns'

const Provider = createProvider({
  messages: {
    test: 'Hi',
    anonymous: 'Anonymous',
    admin: 'Administrator',
    signIn: 'Sign in',
    signInWith: 'Sign in with',
    signOut: 'Sign out',
    send: 'Send',
    replyHere: 'Reply...',
    reply: 'Reply',
    replyNow: 'Reply',
    deletedAt: 'Deleted',
    updatedAt: 'Edited',
    cancel: 'Cancel',
    close: 'Close',
    sureDelete: 'Sure',
    save: 'Save',
    postHere: 'Write something nice…',
    managePendingPosts: 'Post Manager',
    edit: 'Edit post',
    delete: 'Delete post',
    approve: 'Approve post',
    postAdded: 'Your post has been added',
    postUpdated: 'Post has been updated',
    pendingPostUpdated: 'Pending post has been updated',
    pendingPostApproved: 'Pending post has been approved',
    pendingPostDeleted: 'Pending post has been rejected',
    postSubmitted: 'Your post has been submitted for review',
    postChangeSubmitted: 'Your change has been submitted for review',
    postDeleted: 'Post has been deleted',
    readMore: 'Show replies',
    readLess: 'Hide replies',
    like: 'Like',
    likes: 'Likes',
    loadMore: 'Load more...',
    expandMore: 'Expand',
    expandLess: 'Collapse'
  },
  functions: {
    formatDateDistance: (from: Date, to: Date, options: any = {}) => formatDistance(from, to, {
      ...options,
      locale
    })
  }
})

export default Provider

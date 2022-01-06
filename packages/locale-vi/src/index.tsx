import { createProvider } from '@discuzz/core'
import locale from 'date-fns/locale/vi'
import { formatDistance } from 'date-fns'

const Provider = createProvider({
  messages: {
    test: 'Xin chào',
    anonymous: 'Người ẩn danh',
    admin: 'Người quản trị',
    signIn: 'Đăng nhập',
    signInWith: 'Đăng nhập với',
    signOut: 'Đăng xuất',
    send: 'Gửi',
    replyHere: 'Trả lời bình luận...',
    reply: 'Trả lời',
    replyNow: 'Gửi',
    deletedAt: 'Đã xóa',
    updatedAt: 'Đã sửa đổi',
    cancel: 'Hủy',
    close: 'Đóng',
    sureDelete: 'Chắc chắn',
    save: 'Lưu',
    postHere: 'Bình luận của bạn…',
    managePendingPosts: 'Quản lý',
    edit: 'Sửa nội dung',
    delete: 'Xóa nội dung',
    approve: 'Phê duyệt nội dung',
    postAdded: 'Bình luận đã được đăng',
    postUpdated: 'Nội dung đã được cập nhật',
    pendingPostUpdated: 'Nội dung đã được cập nhật',
    pendingPostApproved: 'Bình luận đã được phê duyệt',
    pendingPostDeleted: 'Bình luận đã bị từ chối',
    postSubmitted: 'Bình luận đã được gửi chờ phê duyệt',
    postChangeSubmitted: 'Nội dung đã được gửi chờ phê duyệt',
    postDeleted: 'Bình luận đã bị xóa',
    expandMore: 'Xem trả lời',
    expandLess: 'Thu gọn',
    like: 'Thích',
    likes: 'Thích',
    loadMore: 'Xem thêm...',
    readMore: 'Xem trả lời',
    readLess: 'Thu gọn'
  },
  functions: {
    formatDateDistance: (from: Date, to: Date, options: any = {}) => formatDistance(from, to, {
      ...options,
      locale
    })
  }
})

export default Provider

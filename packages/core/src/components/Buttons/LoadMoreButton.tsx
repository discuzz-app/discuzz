import React from 'react'
import { useLocale } from 'components/LocaleProvider'
import LoadingButton from '@mui/lab/LoadingButton'
import { useSizeCheck } from 'hooks/useSizeCheck'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'

type LoadMoreButtonProps = {
  buttonRef: any,
  onClick: () => void,
  hasMore: boolean,
  loading: boolean
}
export const LoadMoreButton = ({ buttonRef, onClick, hasMore, loading }: LoadMoreButtonProps) => {
  const { messages } = useLocale()

  const smSize = useSizeCheck('sm')

  return (hasMore)
    ? (
      <LoadingButton loading={loading} ref={buttonRef} color="inherit" fullWidth onClick={onClick}>
        <MoreHorizIcon />&nbsp; {smSize ? null : messages.loadMore}
      </LoadingButton>
    )
    : (
      <div ref={buttonRef} />
    )
}

import React from 'react'
import IconButton from '@mui/material/IconButton'
import { useSizeCheck } from 'hooks/useSizeCheck'
import ReplyIcon from '@mui/icons-material/Reply'
import LoadingButton from '@mui/lab/LoadingButton'
import { useLocale } from 'components/LocaleProvider'

type ReplyButtonProps = {
  loading: boolean
}

export const ReplyButton = ({ loading }: ReplyButtonProps) => {
  const { messages } = useLocale()
  const smSize = useSizeCheck('sm')

  return smSize
    ? (
      <IconButton color="primary" type="submit">
        <ReplyIcon />
      </IconButton>
    )
    : (
      <LoadingButton loading={loading}
        loadingPosition="end" variant="contained" size="small" type="submit" sx={{
          ml: 1,
          pl: 3,
          pr: 3
        }} endIcon={<ReplyIcon />}>
        {messages.replyNow}
      </LoadingButton>
    )
}

import React, { MouseEventHandler } from 'react'
import IconButton from '@mui/material/IconButton'
import { useSizeCheck } from 'hooks/useSizeCheck'
import SmsOutlinedIcon from '@mui/icons-material/SmsOutlined'
import { useLocale } from 'components/LocaleProvider'
import Button from '@mui/material/Button'


type QuickReplyButtonProps = {
  onClick: MouseEventHandler
}

export const QuickReplyButton = ({ onClick }: QuickReplyButtonProps) => {
  const { messages } = useLocale()
  const smSize = useSizeCheck('sm')

  const color = '#888'

  return smSize
    ? (
      <IconButton sx={{
        minWidth: 30,
        color
      }} color="inherit" onClick={onClick}>
        <SmsOutlinedIcon />
      </IconButton>
    )
    : (
      <Button sx={{
        height: 36,
        mr: 1,
        color
      }}
        color="inherit"
        size="small" onClick={onClick} startIcon={<SmsOutlinedIcon />}>
        {messages.reply}
      </Button>
    )
}

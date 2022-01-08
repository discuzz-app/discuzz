import React, { MouseEventHandler } from 'react'
import { useSizeCheck } from 'hooks/useSizeCheck'
import Button from '@mui/material/Button'
import { useLocale } from 'components/LocaleProvider'


type LikeButtonProps = {
  onClick: MouseEventHandler | undefined
  disabled: boolean
  count: number
  liked: boolean
  icon: JSX.Element
}

export const LikeButton = ({ disabled, count, liked, onClick, icon }: LikeButtonProps) => {
  const smSize = useSizeCheck('sm')
  const { messages } = useLocale()

  const color = liked ? 'success' : '#888'

  return smSize
    ? (
      <Button sx={{
        height: 36,
        minWidth: 30,
        color
      }}
        disabled={disabled}
        size="small"
        onClick={onClick}
        startIcon={icon}>
          {count > 0 ? count : null}
      </Button>
    )
    : (
      <Button sx={{
        height: 36,
        mr: 1,
        color
      }}
        disabled={disabled}
        size="small"
        onClick={onClick}
        startIcon={icon}>
          {count > 0 ? `${count} ` : ''}{count > 1 ? messages.likes : messages.like}
      </Button>
    )
}

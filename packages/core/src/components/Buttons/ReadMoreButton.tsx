import React, { MouseEventHandler } from 'react'
import IconButton from '@mui/material/IconButton'
import { useSizeCheck } from 'hooks/useSizeCheck'
import { useLocale } from 'components/LocaleProvider'
import Button from '@mui/material/Button'
import Badge from '@mui/material/Badge'
import CodeIcon from '@mui/icons-material/Code'
import CodeOffIcon from '@mui/icons-material/CodeOff'


type ReadMoreButtonProps = {
  onClick: MouseEventHandler
  expanded: boolean
  count: number
}

export const ReadMoreButton = ({ count, expanded, onClick }: ReadMoreButtonProps) => {
  const { messages } = useLocale()
  const smSize = useSizeCheck('sm')

  if (count === 0) return null

  const icon = expanded ? <CodeOffIcon /> : <CodeIcon />
  const color = '#888'

  return (
    <Badge badgeContent={expanded ? 0 : count} color="primary" sx={{
      '& .MuiBadge-badge': {
        mt: 0.9,
        mr: -0.5
      }
    }}>
      {smSize
        ? (
          <IconButton sx={{
            color
          }} onClick={onClick} type="submit">
            {icon}
          </IconButton>
        )
        : (
          <Button sx={{
            height: 36,
            color
          }}
            color="inherit"
            size="small" onClick={onClick} startIcon={icon}>
            {expanded ? messages.readLess : messages.readMore}
          </Button>
        )}
    </Badge>
  )
}

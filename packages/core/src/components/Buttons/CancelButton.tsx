import React, { MouseEventHandler } from 'react'
import IconButton from '@mui/material/IconButton'
import Button from '@mui/material/Button'
import { useSizeCheck } from 'hooks/useSizeCheck'
import ClearIcon from '@mui/icons-material/Clear'
import { SxProps } from '@mui/material'

type CancelButtonProps = {
  onClick: MouseEventHandler
  children: JSX.Element | string
  sx: SxProps
}

export const CancelButton = ({ onClick, children, sx }: CancelButtonProps) => {
  const smSize = useSizeCheck('sm')

  return smSize
    ? (
      <IconButton
        color="inherit"
        onClick={onClick}
        sx={sx}
      >
        <ClearIcon />
      </IconButton>
    )
    : (
      <Button
        size="small"
        onClick={onClick}
        color="inherit"
        sx={sx}>
        {children}
      </Button>
    )
}

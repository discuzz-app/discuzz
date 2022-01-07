import React from 'react'
import styled from '@mui/material/styles/styled'
import IconButton, { IconButtonProps } from '@mui/material/IconButton'
import KeyboardDoubleArrowDownIcon from '@mui/icons-material/KeyboardDoubleArrowDown'

interface ExpandMoreProps extends IconButtonProps {
  expanded: boolean;
}

export const ExpandButton = styled((props: ExpandMoreProps) => {
  const { expanded, ...other } = props
  return (
    <IconButton {...other}>
      <KeyboardDoubleArrowDownIcon />
    </IconButton>
  )
})(({ theme, expanded }) => ({
  transform: !expanded ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest
  })
}))

import React from 'react'
import { useTheme } from '@mui/material/styles'
import IconButton from '@mui/material/IconButton'
import useMediaQuery from '@mui/material/useMediaQuery'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import { SlideUpTransition } from 'utils/transitions'
import CloseIcon from '@mui/icons-material/Close'
import { BackofficeApp } from '.'
import { useLocale } from 'components/LocaleProvider'

type BackofficeDialogProps = {
  onClose: () => void,
  open: boolean
}

const BackofficeDialog = ({ onClose, open, ...props }: BackofficeDialogProps) => {
  const { messages } = useLocale()
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'))

  return (
    <Dialog
      open={open}
      fullWidth
      fullScreen={fullScreen}
      onClose={onClose}
      TransitionComponent={SlideUpTransition}
      scroll='paper'
      aria-labelledby="scroll-dialog-title"
      aria-describedby="scroll-dialog-description"
      {...props}
    >
      <DialogTitle id="scroll-dialog-title">
        {messages.managePendingPosts}
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 10,
            color: (theme) => theme.palette.grey[500]
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers={true}>
        <BackofficeApp />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{messages.close}</Button>
      </DialogActions>
    </Dialog>
  )
}

export default BackofficeDialog

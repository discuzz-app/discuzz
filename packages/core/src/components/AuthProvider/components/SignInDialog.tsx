import React from 'react'
import Avatar from '@mui/material/Avatar'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import ListItemText from '@mui/material/ListItemText'
import DialogTitle from '@mui/material/DialogTitle'
import Dialog from '@mui/material/Dialog'
import { providers, SignInProvider } from '../config/signInProviders'
import { SlideUpTransition } from 'utils/transitions'

import { useLocale } from 'components/LocaleProvider'
import { SignInProviderId } from '../enums/SignInProviderId'

type SignInDialogProps = {
  enabledProviders: SignInProviderId[]
  open: boolean
  onProviderSelected: (provider?: SignInProvider) => void
}

export const SignInDialog = ({ enabledProviders, open, onProviderSelected }: SignInDialogProps) => {
  const { messages } = useLocale()
  const closeDialog = () => {
    onProviderSelected(undefined)
  }

  const selectProvider = (provider: SignInProvider) => {
    onProviderSelected(provider)
  }

  return (
    <Dialog TransitionComponent={SlideUpTransition} onClose={closeDialog} open={open}>
      <DialogTitle>{messages.signInWith}</DialogTitle>
      <List sx={{ pt: 0 }}>
        {enabledProviders.map((providerId) => {
          const provider: SignInProvider = providers[providerId]

          return (
            <ListItem button onClick={() => selectProvider(provider)} key={providerId}>
              <ListItemAvatar sx={{
                minWidth: 45
              }}>
                <Avatar
                  sx={provider.icon?.styles}
                  src={provider.icon?.source}
                />
              </ListItemAvatar>
              <ListItemText primary={provider.name} />
            </ListItem>
          )
        })}
      </List>
    </Dialog>
  )
}

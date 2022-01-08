import React from 'react'
import { useAuth } from 'components/AuthProvider'
import { useLocale } from 'components/LocaleProvider'
import Button from '@mui/material/Button'
import LoginIcon from '@mui/icons-material/Login'
import { useSizeCheck } from 'hooks/useSizeCheck'
import { IconButton } from '@mui/material'

export const SignInButton = () => {
  const { messages } = useLocale()
  const { user, signIn } = useAuth()

  const smSize = useSizeCheck('sm')

  return (user && user.isAnonymous)
    ? (
      smSize
        ? (
          <IconButton color="primary" onClick={() => signIn()}>
            <LoginIcon />
          </IconButton>
        )
        : (
          <Button onClick={() => signIn()} variant="outlined" startIcon={<LoginIcon />}>
            {messages.signIn}
          </Button >
        )
    )
    : null
}

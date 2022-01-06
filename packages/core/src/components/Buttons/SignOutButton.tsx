import React, { useState } from 'react'
import { useAuth } from 'components/AuthProvider'
import { useLocale } from 'components/LocaleProvider'
import LoadingButton from '@mui/lab/LoadingButton'
import LogoutIcon from '@mui/icons-material/Logout'

import { useSizeCheck } from 'hooks/useSizeCheck'
import { IconButton } from '@mui/material'

export const SignOutButton = () => {
  const [isSigningOut, toggleSigningOut] = useState(false)
  const { messages } = useLocale()
  const { user, signOut } = useAuth()
  const smSize = useSizeCheck('sm')

  return (user && !user.isAnonymous)
    ? (
      smSize
        ? (
          <IconButton color="warning" onClick={signOut}>
            <LogoutIcon />
          </IconButton>
        )
        : (
          <LoadingButton loading={isSigningOut} loadingPosition="start"
            onClick={async () => {
              toggleSigningOut(true)
              await signOut()
              setTimeout(() => toggleSigningOut(false), 1000)
            }} color="warning" startIcon={<LogoutIcon />}>
            {messages.signOut}
          </LoadingButton>
        )
    )
    : null
}

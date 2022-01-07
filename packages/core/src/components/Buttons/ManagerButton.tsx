import React, { useState, Fragment } from 'react'
import { useAuth } from 'components/AuthProvider'
import { useLocale } from 'components/LocaleProvider'
import Button from '@mui/material/Button'
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings'

import IconButton from '@mui/material/IconButton'
import { useSizeCheck } from 'hooks/useSizeCheck'

import BackofficeDialog from 'components/BackofficeApp/BackofficeDialog'
// const BackofficeDialog = lazy(() => import('components/BackofficeApp/BackofficeDialog'))

export const ManagerButton = () => {
  const { messages } = useLocale()
  const { user } = useAuth()
  const [backofficeDialogIsOpen, toggleBackofficeDialog] = useState(false)
  const smSize = useSizeCheck('sm')

  if (!user || !user.isAdmin) return null

  return (
    <Fragment>
      {smSize
        ? (
          <IconButton color="success" onClick={() => toggleBackofficeDialog(true)}>
            <AdminPanelSettingsIcon />
          </IconButton>
        )
        : (
          <Button sx={{
            mr: 1
          }} color="success" onClick={() => toggleBackofficeDialog(true)} startIcon={<AdminPanelSettingsIcon />}>
            {messages.managePendingPosts}
          </Button>
        )}

      <BackofficeDialog
        open={backofficeDialogIsOpen}
        onClose={() => toggleBackofficeDialog(false)}
      />
    </Fragment>
  )
}

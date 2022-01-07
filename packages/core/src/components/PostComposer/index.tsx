import React, { useCallback, useState, Fragment } from 'react'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import Avatar from '@mui/material/Avatar'
import SendIcon from '@mui/icons-material/Send'
import { useAuth } from 'components/AuthProvider'

import PersonIcon from '@mui/icons-material/Person'
import { Composer } from './components/Composer'
import { EMPTY_SYMBOL } from 'constants/composer'
import Slide from '@mui/material/Slide'
import LoadingButton from '@mui/lab/LoadingButton'
import { useLocale } from 'components/LocaleProvider'
import { useAddPostCommand } from 'services/post'
import { ManagerButton } from 'components/Buttons/ManagerButton'
import { SignInButton } from 'components/Buttons/SignInButton'
import { SignOutButton } from 'components/Buttons/SignOutButton'
import { useSnackbar } from 'notistack'
import { PostUpdateResult } from 'enums/PostUpdateResult'
import { warn } from 'utils/logger'
export { Composer } from './components/Composer'
export type { ComposerProps } from './components/Composer'

type PostComposerProps = {
  url: string
}

export const PostComposer = ({ url }: PostComposerProps) => {
  const { messages } = useLocale()
  const { user } = useAuth()
  const { enqueueSnackbar } = useSnackbar()

  const [contents, setContents] = useState<string>('')
  const [isPostingPost, togglePostingPost] = useState(false)

  const addPostCommand = useAddPostCommand()

  const addPost = useCallback(async () => {
    togglePostingPost(true)

    const newContents = contents
    setContents('')

    const result = await addPostCommand(
      newContents, url
    )

    if (result === PostUpdateResult.UPDATED) {
      enqueueSnackbar(messages.postAdded, {
        variant: 'success'
      })
    } else if (result === PostUpdateResult.PENDING) {
      enqueueSnackbar(messages.postSubmitted, {
        variant: 'warning'
      })
    } else {
      warn('add post returns unexpected result', result)
    }

    setTimeout(() => togglePostingPost(false), 1)
  }, [
    togglePostingPost,
    setContents,
    contents,
    url,
    enqueueSnackbar,
    messages
  ])

  return user
    ? (
      <Fragment>
        <Card>
          <CardHeader
            avatar={
              user.photoURL
                ? (
                  <Avatar
                    sx={{ width: 24, height: 24, mr: -1 }}
                    src={user.photoURL}
                  />
                )
                : (
                  <PersonIcon />
                )
            }
            action={(
              <Fragment>
                <SignInButton />
                <ManagerButton />
                <SignOutButton />
              </Fragment>
            )}
            sx={{
              bgcolor: 'divider',
              pt: 1,
              pb: 1
            }}
            title={user.displayName || messages.anonymous}
          />

          <CardContent sx={{
            pb: 0
          }}>
            <Composer
              placeholder={messages.postHere}
              value={contents}
              onChange={(value: string) => {
                setContents(value)
              }}
            />
          </CardContent>

          <Slide
            in={contents !== '' && contents !== EMPTY_SYMBOL}
            mountOnEnter
            unmountOnExit
            direction='up'
          >
            <CardActions>
              <LoadingButton loading={isPostingPost} loadingPosition="end" variant="contained" sx={{
                ml: 'auto',
                mr: 1
              }} onClick={addPost} endIcon={<SendIcon />}>
                {messages.send}
              </LoadingButton>

            </CardActions>
          </Slide>
        </Card>

      </Fragment>
    )
    : null
}

import React, { Fragment } from 'react'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import { useCallback, useState } from 'react'
import ModeEditTwoToneIcon from '@mui/icons-material/ModeEditTwoTone'
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone'
import { Composer } from 'components/PostComposer'
import { EMPTY_SYMBOL } from 'constants/composer'
import { Content, Timestamp } from 'components/PostCard'
import Slide from '@mui/material/Slide'
import { useLocale } from 'components/LocaleProvider'
import GradingTwoToneIcon from '@mui/icons-material/GradingTwoTone'

import DoNotDisturbAltIcon from '@mui/icons-material/DoNotDisturbAlt'
import { PendingPost } from 'types/PendingPost'
import Link from '@mui/material/Link'
import { useApprovePendingPostCommand, useEditPendingPostCommand, useRejectPendingPostCommand } from 'services/post'

import Tooltip from '@mui/material/Tooltip'
import { PendingPostUpdateResult } from 'enums/PostUpdateResult'
import { useSnackbar } from 'notistack'

type ReviewPostCardProps = {
  children?: JSX.Element | null,
  post: PendingPost
}

export const ReviewPostCard = ({ post, children }: ReviewPostCardProps) => {
  const { messages, functions } = useLocale()

  const { enqueueSnackbar } = useSnackbar()
  const [isDeleting, toggleDeleting] = useState(false)
  const [isEditing, toggleEditing] = useState(false)

  const [contents, setContents] = useState<string>('')

  const editPendingPostCommand = useEditPendingPostCommand()
  const rejectPendingPostCommand = useRejectPendingPostCommand()
  const approvePendingPostCommand = useApprovePendingPostCommand()

  const editPendingPost = useCallback(async () => {
    const result = await editPendingPostCommand(post, contents)

    if (result === PendingPostUpdateResult.SUCCESS) {
      enqueueSnackbar(messages.pendingPostUpdated, {
        variant: 'success'
      })
    }
    toggleEditing(false)
  }, [
    post,
    contents,
    enqueueSnackbar,
    messages,
    toggleEditing
  ])
  const rejectPendingPost = useCallback(async () => {
    const result = await rejectPendingPostCommand(post)

    if (result === PendingPostUpdateResult.SUCCESS) {
      enqueueSnackbar(messages.pendingPostDeleted, {
        variant: 'success'
      })
    }
    toggleDeleting(false)
  }, [
    toggleDeleting,
    post,
    enqueueSnackbar,
    messages
  ])
  const approvePendingPost = useCallback(async () => {
    const result = await approvePendingPostCommand(post)

    if (result === PendingPostUpdateResult.SUCCESS) {
      enqueueSnackbar(messages.pendingPostApproved, {
        variant: 'success'
      })
    }
  }, [
    post,
    enqueueSnackbar,
    messages
  ])

  return (
    <Card sx={{
      mt: 1,
      mb: 1
    }}>
      <CardHeader
        avatar={
          <Avatar sx={{ width: 24, height: 24, mr: -1 }} src={post.author.photoUrl} />
        }
        title={
          <Fragment>
            {(post.author.name || messages.anonymous)}
            <Timestamp color="error"> ({post.createdAt ? functions.formatDateDistance(post.createdAt, new Date(), { addSuffix: true }) : '...'})</Timestamp>
          </Fragment>
        }
        sx={{
          mb: -3
        }}

        action={!post.deletedAt && (
          <div style={{
            height: 40,
            display: 'flex',
            justifyContent: 'center'
          }}>
            {isDeleting
              ? (
                <Fragment>
                  <Button size="small" onClick={() => toggleDeleting(false)} color="inherit" sx={{
                    mr: 0.5
                  }}>
                    {messages.cancel}
                  </Button>

                  <Button color="error" variant="contained" onClick={rejectPendingPost} size="small" sx={{
                  }} endIcon={post.postId ? <DoNotDisturbAltIcon /> : <DeleteTwoToneIcon />}>
                    {messages.sureDelete}
                  </Button>
                </Fragment>
              )
              : isEditing
                ? (
                  <Fragment>
                    <Button size="small" onClick={() => toggleEditing(false)} color="inherit" sx={{
                      mr: 0.5
                    }}>
                      {messages.cancel}
                    </Button>

                    <Slide
                      direction='left'
                      mountOnEnter unmountOnExit
                      in={contents !== '' && contents !== EMPTY_SYMBOL}>
                      <Button variant="contained" onClick={editPendingPost} size="small" sx={{
                      }} endIcon={<ModeEditTwoToneIcon />}>
                        {messages.save}
                      </Button>
                    </Slide>
                  </Fragment>
                )
                : (
                  <Fragment>

                    <Tooltip title={messages.edit} arrow>
                      <IconButton onClick={() => toggleEditing(true)}>
                        <ModeEditTwoToneIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title={messages.delete} arrow>
                      {post.postId
                        ? (
                          <IconButton color="error" onClick={() => toggleDeleting(true)}>
                            <DoNotDisturbAltIcon />
                          </IconButton>
                        )
                        : (
                          <IconButton color="error" onClick={() => toggleDeleting(true)}>
                            <DeleteTwoToneIcon />
                          </IconButton>
                        )}
                    </Tooltip>
                    <Tooltip title={messages.approve} arrow>
                      <IconButton color="success" onClick={approvePendingPost}>
                        <GradingTwoToneIcon />
                      </IconButton>
                    </Tooltip>
                  </Fragment>
                )}
          </div>
        )}
      />
      <CardContent>
        {isEditing
          ? (
            <Composer
              placeholder={messages.postHere}
              value={contents || post.contents}
              onChange={(value: string) => {
                setContents(value)
              }}
            />
          )
          : (
            <Typography component="div" variant="body1" color="text.secondary" sx={{
              mb: -2
            }}>
              {post.deletedAt
                ? (
                  <Fragment>
                    <Timestamp>{messages.deletedAt} {functions.formatDateDistance(post.deletedAt, new Date(), { addSuffix: true })}</Timestamp>
                  </Fragment>
                )
                : (
                  <Fragment>
                    <Content>{post.contents}</Content>

                    <br />
                    <Link href={post.url} target="_blank">{post.url}</Link>

                    {post.updatedAt && (
                      <Typography sx={{
                        mt: 1
                      }}>
                        <Timestamp>{messages.updatedAt} {functions.formatDateDistance(post.updatedAt, new Date(), { addSuffix: true })}</Timestamp>
                      </Typography>
                    )}

                  </Fragment>
                )}

            </Typography>
          )}
      </CardContent>

      <CardContent sx={{
        mt: -2,
        mb: -2
      }}>
        {children}
      </CardContent>
    </Card>
  )
}

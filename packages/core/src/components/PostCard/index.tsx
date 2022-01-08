import React, { MouseEvent, useCallback, useState, Fragment } from 'react'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import OutlinedInput from '@mui/material/OutlinedInput'

import { Post } from 'types/Post'
import ModeEditTwoToneIcon from '@mui/icons-material/ModeEditTwoTone'
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone'
import { Composer } from 'components/PostComposer'
import { EMPTY_SYMBOL } from 'constants/composer'
import { useAuth } from 'components/AuthProvider'
import { Content } from './components/Content'
import Slide from '@mui/material/Slide'
import { useLocale } from 'components/LocaleProvider'
import ThumbUpIcon from '@mui/icons-material/ThumbUp'
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined'
import { Timestamp } from './components/Timestamp'
import { useAddPostCommand, useEditPostCommand, useRemovePostCommand, useTogglePostVoteCommand } from 'services/post'
import Tooltip from '@mui/material/Tooltip'
import { useSizeCheck } from 'hooks/useSizeCheck'
import { CancelButton } from 'components/Buttons/CancelButton'
import { ReplyButton } from 'components/Buttons/ReplyButton'
import { ShareButton } from 'components/Buttons/ShareButton'
import { useTheme } from '@mui/material'
import { QuickReplyButton } from 'components/Buttons/QuickReplyButton'
import { ReadMoreButton } from 'components/Buttons/ReadMoreButton'
import { ExpandButton } from 'components/Buttons/ExpandButton'
import { LikeButton } from 'components/Buttons/LikeButton'
import Collapse from '@mui/material/Collapse'
import { PostList } from 'components/PostList'
import { useSnackbar } from 'notistack'
import { PostUpdateResult } from 'enums/PostUpdateResult'
export { Content } from './components/Content'
export type { ContentProps } from './components/Content'
export { Timestamp } from './components/Timestamp'

type PostCardProps = {
  post: Post,
  level: number,
  fullCollapsed?: boolean
}

export const PostCard = ({ post, level, fullCollapsed = false }: PostCardProps) => {
  const { messages, functions } = useLocale()
  const smSize = useSizeCheck('sm')
  const theme = useTheme()
  const { user } = useAuth()
  const { enqueueSnackbar } = useSnackbar()
  const [isDeleting, toggleDeleting] = useState(false)
  const [isEditing, toggleEditing] = useState(false)
  const [isReplying, toggleReplying] = useState(false)
  const [isExpanding, toggleExpanding] = useState(level < 1)
  const [isFullCollapsed, toggleFullCollapsed] = useState(fullCollapsed)

  const [contents, setContents] = useState<string>('')
  const [replyingContents, setReplyingContents] = useState<string>('')

  const [isPostingReply, togglePostingReply] = useState(false)

  const addPostCommand = useAddPostCommand()
  const editPostCommand = useEditPostCommand()
  const removePostCommand = useRemovePostCommand()
  const togglePostVoteCommand = useTogglePostVoteCommand()

  const addPost = useCallback(async (event) => {
    event.preventDefault()
    togglePostingReply(true)

    const newContents = replyingContents
    setReplyingContents('')

    const result = await addPostCommand(
      newContents,
      undefined,
      post
    )

    if (result === PostUpdateResult.UPDATED) {
      enqueueSnackbar(messages.postAdded, {
        variant: 'success'
      })
    } else if (result === PostUpdateResult.PENDING) {
      enqueueSnackbar(messages.postSubmitted, {
        variant: 'warning'
      })
    }

    togglePostingReply(false)
    toggleFullCollapsed(false)
    toggleExpanding(true)
    setTimeout(() => toggleReplying(false), 300)
  }, [
    post,
    addPostCommand,
    enqueueSnackbar,
    replyingContents,
    togglePostingReply,
    setReplyingContents,
    toggleFullCollapsed,
    toggleExpanding,
    toggleReplying,
    messages
  ])

  const editPost = useCallback(async (event: MouseEvent) => {
    event.stopPropagation()
    const result = await editPostCommand(post, contents)
    if (result === PostUpdateResult.UPDATED) {
      enqueueSnackbar(messages.postUpdated, {
        variant: 'success'
      })
    } else if (result === PostUpdateResult.PENDING) {
      enqueueSnackbar(messages.postChangeSubmitted, {
        variant: 'warning'
      })
    }
    toggleEditing(false)
  }, [
    post,
    editPostCommand,
    toggleEditing,
    contents,
    enqueueSnackbar,
    messages
  ])

  const removePost = useCallback(async (event: MouseEvent) => {
    event.stopPropagation()
    const result = await removePostCommand(post)

    if (result === PostUpdateResult.UPDATED) {
      enqueueSnackbar(messages.postDeleted, {
        variant: 'warning'
      })
    }

    toggleDeleting(false)
  }, [
    post,
    removePostCommand,
    toggleDeleting,
    enqueueSnackbar,
    messages
  ])

  const togglePostVote = useCallback(async () => {
    await togglePostVoteCommand(post)
  }, [togglePostVoteCommand, post])

  return (
    <Card sx={{
      ...{
        mt: 1,
        mb: 1
      },
      ...(level > 0
        ? {
          bgcolor: 'primary.contrastText',
          '&:before': {
            content: '""',
            display: 'block',
            width: '6px',
            height: '2px',
            position: 'absolute',
            marginLeft: '-7px',
            background: theme.palette.mode === 'dark' ? '#303030' : '#e5e5e5',
            marginTop: '24px'
          }
        }
        : {})
    }}>
      <CardHeader
        avatar={
          <Avatar sx={{ width: 24, height: 24, mr: -1 }} src={post.author.photoUrl} />
        }
        onClick={() => {
          toggleFullCollapsed(!isFullCollapsed)
        }}
        title={
          <Fragment>
            {(post.author.name || messages.anonymous)}
            {!smSize && <Timestamp color="error"> ({post.createdAt ? functions.formatDateDistance(post.createdAt, new Date(), { addSuffix: true }) : '...'})</Timestamp>}
          </Fragment>
        }
        sx={{
          bgcolor: 'divider',
          cursor: isFullCollapsed ? 's-resize' : 'n-resize',
          pt: 1,
          pb: 1
        }}

        action={
          <div style={{
            height: 40,
            display: 'flex',
            justifyContent: 'center'
          }}>
            {!post.deletedAt && user && (user.isAdmin || user.uid === post.author.id) && (
              <Fragment>
                {isDeleting
                  ? (
                    <Fragment>
                      <CancelButton
                        onClick={(event: MouseEvent) => {
                          event.stopPropagation()
                          toggleDeleting(false)
                        }}
                        sx={{
                          mr: 0.5
                        }}
                      >
                        {messages.cancel}
                      </CancelButton>
                      <Button color="error" variant="contained" onClick={removePost} size="small" sx={{
                      }} endIcon={<DeleteTwoToneIcon />}>
                        {messages.sureDelete}
                      </Button>
                    </Fragment>
                  )
                  : isEditing
                    ? (
                      <Fragment>
                        <CancelButton
                          onClick={(event: MouseEvent) => {
                            event.stopPropagation()
                            toggleEditing(false)
                          }}
                          sx={{
                            mr: 0.5
                          }}
                        >
                          {messages.cancel}
                        </CancelButton>

                        <Slide
                          direction='left'
                          mountOnEnter unmountOnExit
                          in={contents !== '' && contents !== EMPTY_SYMBOL}>
                          <Button variant="contained" onClick={editPost} size="small" sx={{
                          }} endIcon={<ModeEditTwoToneIcon />}>
                            {messages.save}
                          </Button>
                        </Slide>
                      </Fragment>
                    )
                    : (
                      <Fragment>
                        <Tooltip title={messages.delete} arrow>
                          <IconButton color="error" onClick={(event: MouseEvent) => {
                            event.stopPropagation()
                            toggleDeleting(true)
                          }}>
                            <DeleteTwoToneIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title={messages.edit} arrow>
                          <IconButton onClick={(event: MouseEvent) => {
                            event.stopPropagation()
                            toggleEditing(true)
                          }}>
                            <ModeEditTwoToneIcon />
                          </IconButton>
                        </Tooltip>

                      </Fragment>
                    )}

              </Fragment>
            )}

            <ExpandButton
              color="inherit"
              expanded={!isFullCollapsed}
            />

          </div>
        }
      />

      <Collapse in={!isFullCollapsed}>
        <CardContent>
          {isEditing
            ? (
              <Composer
                value={contents || post.contents}
                placeholder={messages.postHere}
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
        <div
          style={{
            padding: 6,
            height: 56,
            marginBottom: -6,
            width: 'calc(100% - 12px)',
            position: 'relative'
          }}>

          <Slide
            direction='right'
            mountOnEnter unmountOnExit
            in={isReplying}
          >
            <form style={{
              width: '100%',
              position: 'absolute'
            }} onSubmit={addPost}>
              <OutlinedInput
                sx={{
                  height: 45
                }}
                autoFocus={true}
                value={replyingContents}
                onChange={(event) => {
                  setReplyingContents(event.target.value)
                }}
                placeholder={messages.replyHere}
                fullWidth
                startAdornment={
                  <Slide
                    direction='right'
                    mountOnEnter unmountOnExit
                    in={replyingContents !== '' && replyingContents !== EMPTY_SYMBOL}>
                    <InputAdornment position="start" sx={{
                      mr: 2
                    }}>
                      <Avatar sx={{ width: 24, height: 24, mr: -1 }} src={user ? (user.photoURL || '') : ''} />
                    </InputAdornment>
                  </Slide>
                }
                endAdornment={
                  <Fragment>
                    <CancelButton
                      sx={{
                        ml: 1
                      }}
                      onClick={() => toggleReplying(false)}
                    >
                      {messages.cancel}
                    </CancelButton>

                    <Slide
                      direction='left'
                      mountOnEnter unmountOnExit
                      in={replyingContents !== '' && replyingContents !== EMPTY_SYMBOL}>
                      <div>
                        <ReplyButton loading={isPostingReply} />
                      </div>
                    </Slide>
                  </Fragment>
                }
              />
            </form>
          </Slide>
          <Slide
            direction='left'
            mountOnEnter unmountOnExit
            in={!isReplying}>
            <div style={{
              paddingTop: 8,
              paddingBottom: 8,
              width: 'calc(100% - 28px)',
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between'
            }}>
              <div>
                <LikeButton
                  count={post.voted}
                  disabled={post.deletedAt !== undefined}
                  liked={(user && post.voters[user.uid] !== undefined)!}
                  onClick={togglePostVote}
                  icon={(user && post.voters[user.uid]) ? <ThumbUpIcon /> : <ThumbUpOutlinedIcon />} />

                <QuickReplyButton
                  onClick={() => toggleReplying(true)}
                />

                <ReadMoreButton
                  count={post.replied}
                  expanded={isExpanding}
                  onClick={() => toggleExpanding(!isExpanding)}
                />

              </div>
              <ShareButton
                post={post}
              />

            </div>
          </Slide>
        </div>

        <div style={{
          padding: 6,
          marginBottom: -6
        }}>
          {isExpanding
            ? (
              <PostList
                url={post.url}
                level={level + 1}
                parent={post}
              />
            )
            : null}
        </div>
      </Collapse>
    </Card>
  )
}

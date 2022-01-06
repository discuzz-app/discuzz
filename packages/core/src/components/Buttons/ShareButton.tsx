import React, { Fragment } from 'react'
import Avatar from '@mui/material/Avatar'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import IconButton from '@mui/material/IconButton'
import { useSizeCheck } from 'hooks/useSizeCheck'
import ShareIcon from '@mui/icons-material/Share'
import Button from '@mui/material/Button'
import { Post } from 'types/Post'
import { useConfig } from 'components/App'

type ShareButtonProps = {
  post: Post
}
export const ShareButton = ({ post } : ShareButtonProps) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }
  const smSize = useSizeCheck('sm')
  const config = useConfig()

  const color = '#888'

  return (
    <Fragment>
      {smSize
        ? (
          <IconButton sx={{
            mr: -5,
            color
          }} onClick={handleClick}>
            <ShareIcon />
          </IconButton>
        )
        : (
          <Button sx={{
            height: 36,
            mr: -5,
            color
          }}
            onClick={handleClick}
            size="small" endIcon={<ShareIcon />}>
            Share
          </Button>
        )}
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1.5,
            '& .MuiAvatar-root': {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1
            },
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0
            }
          }
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={() => {
          global.open(`https://www.facebook.com/sharer.php?t=${post.contents}&u=${config.baseUrl}c/${post.id}`)
        }}>
          <Avatar sx={{
            bgcolor: '#4267B2'
          }} src="https://platform-cdn.sharethis.com/img/facebook.svg" />&nbsp; Facebook
        </MenuItem>
        <MenuItem onClick={() => {
          global.open(`https://twitter.com/intent/tweet?text=${post.contents}&url=${config.baseUrl}c/${post.id}`)
        }}>
          <Avatar sx={{
            bgcolor: '#55acee',
            img: {
              width: '80%',
              height: 'auto'
            }
          }} src="https://platform-cdn.sharethis.com/img/twitter.svg" />&nbsp; Twitter
        </MenuItem>
        <MenuItem onClick={() => {
          global.open(`https://www.linkedin.com/sharing/share-offsite/?url=${config.baseUrl}c/${post.id}`)
        }}>
          <Avatar sx={{
            bgcolor: '#0077b5',
            img: {
              width: '80%',
              height: 'auto'
            }
          }} src="https://platform-cdn.sharethis.com/img/linkedin.svg" />&nbsp; LinkedIn
        </MenuItem>
      </Menu>
    </Fragment>
  )
}

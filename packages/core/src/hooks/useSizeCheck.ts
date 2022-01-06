import useMediaQuery from '@mui/material/useMediaQuery'
import useTheme from '@mui/material/styles/useTheme'
import { Breakpoint } from '@mui/material'

export const useSizeCheck = (size: Breakpoint | number) => {
  const theme = useTheme()
  const check = useMediaQuery(theme.breakpoints.down(size))

  return check
}

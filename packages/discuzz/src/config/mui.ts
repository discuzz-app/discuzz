export const lightTheme = {
  palette: {
    mode: 'light',
    background: {
      default: 'rgba(0,0,0,0)'
    }
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          border: 1,
          borderColor: '#e5e5e5',
          borderStyle: 'solid'
        }
      }
    }
  }
}

export const darkTheme = {
  palette: {
    mode: 'dark',
    background: {
      default: 'rgba(0,0,0,0)',
      paper: '#181A1B'
    }
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          border: 1,
          borderColor: '#303030',
          borderStyle: 'solid'
        }
      }
    }
  }
}

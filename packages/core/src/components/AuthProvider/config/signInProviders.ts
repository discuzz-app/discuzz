import { SxProps } from '@mui/material'
import { SignInProviderId } from '../enums/SignInProviderId'

export type SignInProvider = {
  id: SignInProviderId;
  name: string;
  icon?: {
    source: string;
    styles: SxProps;
  };
};

type SignInProviders = {
  // eslint-disable-next-line no-unused-vars
  [key in SignInProviderId]: SignInProvider;
};

const baseIconStyles: SxProps = {
  p: 0.5,
  mr: -10,
  width: 20,
  height: 20
}

export const providers: SignInProviders = {
  [SignInProviderId.GOOGLE]: {
    id: SignInProviderId.GOOGLE,
    name: 'Google',
    icon: {
      source:
        'https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg',
      styles: {
        bgcolor: '#fff',
        ...baseIconStyles
      }
    },
    // implementation: () => new GoogleAuthProvider()
  },

  [SignInProviderId.APPLE]: {
    id: SignInProviderId.APPLE,
    name: 'Apple',
    icon: {
      source: 'https://unpkg.com/simple-icons@v6/icons/apple.svg',
      styles: {
        bgcolor: '#000',
        ...baseIconStyles,
        img: {
          filter: 'invert(1)'
        }
      }
    },
    // implementation: () => {
    //   const provider = new OAuthProvider('apple.com')
    //   provider.addScope('name')
    //   provider.addScope('email')

    //   return provider
    // }
  },

  [SignInProviderId.FACEBOOK]: {
    id: SignInProviderId.FACEBOOK,
    name: 'Meta (Facebook)',
    icon: {
      source: 'https://seeklogo.com/images/M/meta-icon-new-facebook-2021-logo-83520C311D-seeklogo.com.png',
      styles: {
        bgcolor: '#fff',
        ...baseIconStyles,
        img: {
          height: 'auto'
        }
      }
    },
    // implementation: () => new FacebookAuthProvider()
  },
  [SignInProviderId.TWITTER]: {
    id: SignInProviderId.TWITTER,
    name: 'Twitter',
    icon: {
      source: 'https://unpkg.com/simple-icons@v6/icons/twitter.svg',
      styles: {
        bgcolor: '#1DA1F2',
        ...baseIconStyles,
        img: {
          filter: 'invert(1)'
        }
      }
    },
    // implementation: () => new TwitterAuthProvider()
  },

  [SignInProviderId.MICROSOFT]: {
    id: SignInProviderId.MICROSOFT,
    name: 'Microsoft',
    icon: {
      source:
        'https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/microsoft.svg',
      styles: {
        bgcolor: '#2F2F2F',
        ...baseIconStyles
      }
    },
    // implementation: () => new OAuthProvider('microsoft.com')
  },

  [SignInProviderId.YAHOO]: {
    id: SignInProviderId.YAHOO,
    name: 'Yahoo',
    icon: {
      source: 'https://unpkg.com/simple-icons@v6/icons/yahoo.svg',
      styles: {
        bgcolor: '#720e9e',
        ...baseIconStyles,
        img: {
          filter: 'invert(1)'
        }
      }
    },
    // implementation: () => new OAuthProvider('yahoo.com')
  },

  [SignInProviderId.GITHUB]: {
    id: SignInProviderId.GITHUB,
    name: 'GitHub',
    icon: {
      source: 'https://unpkg.com/simple-icons@v6/icons/github.svg',
      styles: {
        bgcolor: '#333',
        ...baseIconStyles,
        img: {
          filter: 'invert(1)'
        }
      }
    },
    // implementation: () => new GithubAuthProvider()
  }
}

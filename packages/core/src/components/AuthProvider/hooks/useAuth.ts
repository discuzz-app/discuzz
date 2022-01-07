import { useContext } from 'react'
import { AuthContext } from '../contexts/AuthContext'

export const useAuth = () => {
  const auth = useContext(AuthContext)

  return auth
}

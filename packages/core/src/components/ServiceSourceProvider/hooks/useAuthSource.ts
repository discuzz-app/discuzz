import { useContext } from 'react'
import { ServiceSourceContext } from '../contexts/ServiceSourceContext'

export const useAuthSource = () => {
  const source = useContext(ServiceSourceContext)

  return source.auth
}

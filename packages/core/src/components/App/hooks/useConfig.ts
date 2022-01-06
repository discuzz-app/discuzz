import { useContext } from 'react'
import { ConfigContext } from '../contexts/ConfigContext'

export const useConfig = () => {
  const config = useContext(ConfigContext)

  return config
}

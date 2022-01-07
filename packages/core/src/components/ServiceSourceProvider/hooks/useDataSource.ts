import { useContext } from 'react'
import { ServiceSourceContext } from '../contexts/ServiceSourceContext'

export const useDataSource = () => {
  const source = useContext(ServiceSourceContext)

  return source.data
}

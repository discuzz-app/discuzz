import React from 'react'
import { ConfigContext, Config } from './contexts/ConfigContext'
import { SinglePostView } from './components/SinglePostView'
import { FullView } from './components/FullView'
export { useConfig } from './hooks/useConfig'
export type { Config } from './contexts/ConfigContext'

type AppProps = {
  url: string,
  config: Config
}

export const App = ({ url, config }: AppProps) => {
  const postId = url.indexOf('ft:') === 0 ? url.substr(3) : null

  return (
    <div style={{
      padding: config.padding
    }}>
      <ConfigContext.Provider value={config}>
        {postId
          ? (
            <SinglePostView id={postId} />
          )
          : (
            <FullView url={url} />
          )}
      </ConfigContext.Provider>
    </div>
  )
}

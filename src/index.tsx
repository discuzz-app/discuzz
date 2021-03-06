import React, { lazy, Suspense } from 'react'
import ReactDOM from 'react-dom'
import { Discuzz, Config, prefersDarkMode, loadService } from '@discuzz/discuzz'

const LocaleProviderEn = lazy(() => import('@discuzz/locale-en'))
const LocaleProviderVi = lazy(() => import('@discuzz/locale-vi'))

const ComposerMarkdown = lazy(() => import('@discuzz/composer-markdown'))

const ViewerMarkdown = lazy(() => import('@discuzz/viewer-markdown'))

const AuthFirebase = loadService(() => import('@discuzz/auth-firebase'))
const DataFirestore = loadService(() => import('@discuzz/data-firestore'))

export class WebComponent extends HTMLElement {
  connectedCallback() {
    const service = JSON.parse(this.getAttribute('service')!.replace(/'/g, '"'))!

    const serviceSource: any = {
      config: service.config
    }
    if (service.auth === 'firebase') {
      serviceSource.auth = AuthFirebase
    }
    if (service.data === 'firestore') {
      serviceSource.data = DataFirestore
    }



    const options: any = {
      url: this.getAttribute('url') || global.location.href,
      service: serviceSource,
      auths: JSON.parse(this.getAttribute('auths')!.replace(/'/g, '"'))!
    }

    if (this.getAttribute('theme')) {
      try {
        options.theme = JSON.parse(this.getAttribute('theme')!.replace(/'/g, '"'))!
      } catch (err) {
        options.theme = this.getAttribute('theme')
      }
    }
    if (this.getAttribute('locale')) {
      options.locale = this.getAttribute('locale')!
    }

    const config: Config = {
      baseUrl: this.getAttribute('baseUrl') || ''
    }

    if (this.getAttribute('richText')) {
      config.richText = this.getAttribute('richText')! === 'true'
    }
    if (this.getAttribute('padding')) {
      config.padding = Number(this.getAttribute('padding'))
    }
    if (this.getAttribute('pagination')) {
      config.pagination = Number(this.getAttribute('pagination'))
    }

    let logLevel: any
    if (this.getAttribute('logLevel')) {
      logLevel = this.getAttribute('logLevel')
    }

    options.config = config

    ReactDOM.render(
      (
        <Suspense fallback={<span>...</span>}>
          <Discuzz
            url={options.url}
            service={options.service}
            auths={options.auths}
            theme={options.theme}
            config={{
              ...options.config,
              composer: options.config.richText ? ComposerMarkdown : null,
              viewer: options.config.richText ? ViewerMarkdown : null
            }}
            locale={options.locale === 'vi' ? LocaleProviderVi : LocaleProviderEn}
            logLevel={logLevel}
          />
        </Suspense>
      ),
      this
    )
  }
}

(global as any).prefersDarkMode = prefersDarkMode

if (process.env.NODE_ENV === 'development') {
  customElements.define('x-discuzz-dev', WebComponent)

  const url = new URL(global.location.toString())
  const pathname = url.pathname.toString()
  const ftUrl = pathname.indexOf('/c/') === 0 ? `ft:${pathname.substr(3)}` : ''
  const ftLocale = url.searchParams.get('locale') || 'en'
  const ftTheme = url.searchParams.get('theme') || 'auto'

  document.getElementById('root')!.innerHTML = `
    <x-discuzz-dev
      url="${ftUrl}"  
      locale="${ftLocale}"  
      theme="${ftTheme}"  
      baseUrl="${process.env.PUBLIC_URL || '/'}"
      service="${process.env.REACT_APP_SERVICE_CONFIG}"
      auths="${process.env.REACT_APP_AUTHS}"
      pagination="2"
      logLevel="debug"
  ></x-discuzz-dev>
  `
} else if (global.customElements) {
  customElements.define('x-discuzz', WebComponent)
}

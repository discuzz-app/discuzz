import React, { lazy, Suspense } from 'react'
import ReactDOM from 'react-dom'
import { Discuzz, Config, Theme, prefersDarkMode } from '@discuzz/discuzz'

const LocaleProviderEn = lazy(() => import('@discuzz/locale-en'))
const LocaleProviderVi = lazy(() => import('@discuzz/locale-vi'))

const ComposerPlaintext = lazy(() => import('@discuzz/composer-plaintext'))
const ComposerMarkdown = lazy(() => import('@discuzz/composer-markdown'))

const ViewerPlaintext = lazy(() => import('@discuzz/viewer-plaintext'))
const ViewerMarkdown = lazy(() => import('@discuzz/viewer-markdown'))

export class WebComponent extends HTMLElement {
  connectedCallback() {
    const options: any = {
      url: this.getAttribute('url') || global.location.href,
      service: JSON.parse(this.getAttribute('service')!.replace(/'/g, '"'))!,
      auths: JSON.parse(this.getAttribute('auths')!.replace(/'/g, '"'))!
    }

    if (this.getAttribute('theme')) {
      options.theme = this.getAttribute('theme') as Theme
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
              composer: options.config.richText ? ComposerMarkdown : ComposerPlaintext,
              viewer: options.config.richText ? ViewerMarkdown : ViewerPlaintext
            }}
            locale={options.locale === 'vi' ? LocaleProviderVi : LocaleProviderEn}
          />
        </Suspense>
      ),
      this
    )
  }
}

(global as any).prefersDarkMode = prefersDarkMode

if (process.env.NODE_ENV === 'production') {
  if (global.customElements) {
    customElements.define('x-firetalk', WebComponent)
  }
} else {
  customElements.define('x-firetalk-dev', WebComponent)

  const url = new URL(global.location.toString())
  const pathname = url.pathname.toString()
  const ftUrl = pathname.indexOf('/c/') === 0 ? `ft:${pathname.substr(3)}` : ''
  const ftLocale = url.searchParams.get('locale') || 'en'
  const ftTheme = url.searchParams.get('theme') || 'auto'

  document.getElementById('root')!.innerHTML = `
    <x-firetalk-dev
      url="${ftUrl}"  
      locale="${ftLocale}"  
      theme="${ftTheme}"  
      baseUrl="${process.env.PUBLIC_URL || '/'}"
      service="${process.env.REACT_APP_SERVICE_CONFIG}"
      auths="${process.env.REACT_APP_AUTHS}"
      pagination="2"
  ></x-firetalk>
  `
}

<div align="center">
  <p>
    <h3>
      <b>
        Discuzz
      </b>
    </h3>
  </p>
  <p>
    <b>
      Open source Comment System
    </b>
  </p>
  <p>

  </p>
  <br />
  <p>

![Discuzz](./docs/img.jpg)

  </p>
</div>

<details open>
  <summary><b>Table of contents</b></summary>

---

- [Homepage](#homepage)
- [Features](#features)
- [Usage](#usage)
	- [Examples](#examples)
	- [Firebase](#firebase)
	- [Web Component](#web-component)
	- [React Component](#react-component)
	- [Advanced usages](#advanced-usages)
- [Contributing](#contributing)
- [Changelog](#changelog)
- [License](#license)

---

</details>

## **Homepage**

[discuzz.mph.am](https://discuzz.mph.am/)

## **Features**

- Discuzz is an open source comment system, that you can embed in your website to increase reader engagement, grow audience and traffic. 
- Supporting Firestore as the data storage, with Realtime and Offline support. You can use Discuzz easily without any backend server.
- With Firebase Auth support, you can provide many ways to authenticate for your users.
- You can easily config the access control, to adjust permissions (Example: open to all people, or only authenticated users, or you can also turn on moderation mode for every comments) 
- Customizable theme, with built-in light/dark theme.
- Also, you can [write your own Authentication provider and Data provider](#advanced-usages), and configure them with Discuzz.

**To suggest anything, please join our [Discussion board](https://github.com/discuzz-app/discuzz/discussions).**


## **Usage**

You can embed Discuzz in many ways:
- As a Web Component
- As a React Component
- ...

### **Examples**
There are several example integrations, which you can [check here](https://github.com/discuzz-app?q=example)

### **Firebase**

If you want to use Firebase as the Authentication & Data provider, you'd need to create a Firebase project, and add a web platform. It will give you the config parameters.

![ABI](./docs/firebase-web-code.png)

### **Web Component**
You can embed Discuzz in your website with the following code

```html
<script src="https://discuzz.mph.am/static/js/main.js"></script>
<x-discuzz
  service="{'auth':'[AUTH PROVIDER]','data':'[DATA PROVIDER]','config':'[SERVICE CONFIG]'}"
  auths="[IDENTITY PROVIDER LIST]"
></x-discuzz>
```

**Example**
```html
<script src="https://discuzz.mph.am/static/js/main.js"></script>
<x-discuzz 
  service="{'auth':'firebase', 'data': 'firestore', 'config': {'apiKey':'AIzaSyDm837cbdbvkrAdYL9TAqUF3iML6UvZXk4','authDomain':'fire-talk-88.firebaseapp.com','projectId':'fire-talk-88','storageBucket':'fire-talk-88.appspot.com','messagingSenderId':'719566664522','appId':'1:719566664522:web:e1a9d26be22387e55b47b3'}}" 
  auths="['google', 'apple', 'facebook', 'github', 'twitter', 'microsoft', 'yahoo']"
/></x-discuzz>
```

### **React Component**

**Install dependencies**
1) Discuzz component
```bash
yarn add @discuzz/discuzz
```
2) Locale
```bash
yarn add @discuzz/locale-en date-fns
```
3) Auth & Data provider
```bash
yarn add @discuzz/auth-firebase @discuzz/data-firestore firebase
```

**Example component usage**
```jsx
import { Discuzz } from '@discuzz/discuzz'

import LocaleProviderEn from '@discuzz/locale-en'
import AuthFirebase from '@discuzz/auth-firebase'
import DataFirestore from '@discuzz/data-firestore'

function App() {
  return (
    <Discuzz
      url={global.location && global.location.href}
      service={{
        auth: AuthFirebase,
        data: DataFirestore,
        config: {
          apiKey: "AIzaSyDm837cbdbvkrAdYL9TAqUF3iML6UvZXk4",
          authDomain: "fire-talk-88.firebaseapp.com",
          projectId: "fire-talk-88",
          storageBucket: "fire-talk-88.appspot.com",
          messagingSenderId: "719566664522",
          appId: "1:719566664522:web:e1a9d26be22387e55b47b3"
        }
      }}
      auths={['google', 'apple', 'facebook', 'github', 'twitter', 'microsoft', 'yahoo']}
      locale={LocaleProviderEn}
    />
  )
}
```


### **Advanced usages**


**Code splitting & Lazy load**

You can config Discuzz to load services and providers on-demand with `Suspense`.

```jsx
import { lazy, Suspense } from 'react'
import { Discuzz, loadService } from '@discuzz/discuzz'

const LocaleProviderEn = lazy(() => import('@discuzz/locale-en'))

const AuthFirebase = loadService(() => import('@discuzz/auth-firebase'))
const DataFirestore = loadService(() => import('@discuzz/data-firestore'))

function App() {
  return (
    <Suspense fallback={<span>Loading...</span>}>
      <Discuzz
        url={global.location && global.location.href}
        service={{
          auth: AuthFirebase,
          data: DataFirestore,
          config: {
            apiKey: "AIzaSyDm837cbdbvkrAdYL9TAqUF3iML6UvZXk4",
            authDomain: "fire-talk-88.firebaseapp.com",
            projectId: "fire-talk-88",
            storageBucket: "fire-talk-88.appspot.com",
            messagingSenderId: "719566664522",
            appId: "1:719566664522:web:e1a9d26be22387e55b47b3"
          }
        }}
        auths={['google', 'apple', 'facebook', 'github', 'twitter', 'microsoft', 'yahoo']}
        locale={LocaleProviderEn}
      />
    </Suspense>
  );
}
```

On NextJS, you can lazy load modules with `next/dynamic`.

```jsx
import lazy from 'next/dynamic'
import { Discuzz, loadService } from '@discuzz/discuzz'

const LocaleProviderEn = lazy(() => import('@discuzz/locale-en'), { ssr: false })

const AuthFirebase = loadService(() => import('@discuzz/auth-firebase'))
const DataFirestore = loadService(() => import('@discuzz/data-firestore'))

function App() {
  return (
    <Discuzz
      url={global.location && global.location.href}
      service={{
        auth: AuthFirebase,
        data: DataFirestore,
        config: {
          apiKey: "AIzaSyDm837cbdbvkrAdYL9TAqUF3iML6UvZXk4",
          authDomain: "fire-talk-88.firebaseapp.com",
          projectId: "fire-talk-88",
          storageBucket: "fire-talk-88.appspot.com",
          messagingSenderId: "719566664522",
          appId: "1:719566664522:web:e1a9d26be22387e55b47b3"
        }
      }}
      auths={['google', 'apple', 'facebook', 'github', 'twitter', 'microsoft', 'yahoo']}
      locale={LocaleProviderEn}
    />
  );
}
```


**Markdown support**

```bash
yarn add @discuzz/viewer-markdown @discuzz/composer-markdown rich-markdown-editor styled-components
```
```jsx
import { Discuzz } from '@discuzz/discuzz'

const LocaleProviderEn = lazy(() => import('@discuzz/locale-en'))
const ComposerMarkdown = lazy(() => import('@discuzz/composer-markdown'))
const ViewerMarkdown = lazy(() => import('@discuzz/viewer-markdown'))

const AuthFirebase = loadService(() => import('@discuzz/auth-firebase'))
const DataFirestore = loadService(() => import('@discuzz/data-firestore'))

function App() {
  return (
    <Suspense fallback={<span>Loading...</span>}>
      <Discuzz
        url={global.location && global.location.href}
        service={{
          auth: AuthFirebase,
          data: DataFirestore,
          config: {
            apiKey: "AIzaSyDm837cbdbvkrAdYL9TAqUF3iML6UvZXk4",
            authDomain: "fire-talk-88.firebaseapp.com",
            projectId: "fire-talk-88",
            storageBucket: "fire-talk-88.appspot.com",
            messagingSenderId: "719566664522",
            appId: "1:719566664522:web:e1a9d26be22387e55b47b3"
          }
        }}
        auths={['google', 'apple', 'facebook', 'github', 'twitter', 'microsoft', 'yahoo']}
        config={{
          composer: ComposerMarkdown,
          viewer: ViewerMarkdown
        }}
        locale={LocaleProviderEn}
      />
    </Suspense>
  )
}
```


**Theming**

By default, Discuzz will check the current user's browser light/dark preference to setup theme palette.

You can set it manually by passing `light` or `dark` to the `theme` parameter.

Discuzz is built on top of MUI library. You can fully customize by passing a theme object into the `theme` parameter.


**Custom locale provider**

You could write your own locale provider, using `createProvider` function, then pass it to the `<Discuzz/>` component.

**Custom data & authentication provider**

You could also write your own data & authentication provider to using other services instead of Firebase, as long as it fullfills the `Auth` and `Data` type.

**Tip:** You can take a look at [auth-firebase](./packages/auth-firebase) and [data-firestore](./packages/data-firestore).


## **Contributing**

Please contribute using [GitHub Flow](https://guides.github.com/introduction/flow). Create a branch, add commits, and then [open a pull request](https://github.com/@discuzz-app/discuzz/compare).

## **License**

This project is licensed under the [GNU General Public License v3.0](https://opensource.org/licenses/gpl-3.0.html) - see the [`LICENSE`](LICENSE) file for details.

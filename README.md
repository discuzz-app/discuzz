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

**To suggest anything, please join our [Discussion board](https://github.com/discuzz-app/discuzz/discussions).**


## **Usage**

You can embed Discuzz in many ways:
- As a Web Component
- As a React Component
- ...

### **Firebase**

You'd need to create a Firebase project, and add a web platform. It will give you the config parameters.

![ABI](./docs/firebase-web-code.png)

### **Web Component**
You can embed Discuzz in your website with the following code

```html
<script src="https://discuzz.mph.am/static/js/main.js"></script>
<x-discuzz 
  service="--- PUT THE SERVICE CONFIG HERE ---" 
  auths="-- PUT THE AUTHENTICATION METHODS YOU WANT HERE ---"
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
import { Discuzz, loadService } from '@discuzz/discuzz'

const LocaleProviderEn = lazy(() => import('@discuzz/locale-en'))

const AuthFirebase = loadService(() => import('@discuzz/auth-firebase'))
const DataFirestore = loadService(() => import('@discuzz/data-firestore'))

function App() {
  return (
    <Suspense fallback={<span>Loading...</span>}>
      <Discuzz
        url={global.location.href}
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


### **Advanced usages**

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
        url={global.location.href}
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
  );
}
```

**Theming**

By default, Discuzz will check the current user's browser light/dark preference to setup the correct theme.

Discuzz is built on top of MUI library. You can customize by using the `<ThemeProvider/>` component, to wrap outside the `<DiscuzzCore />` component.


**Custom locale provider**

You could write your own locale provider, using `createProvider` function, then pass it to the `<Discuzz/>` component.

**Custom data & authentication provider**

You could also write your own data & authentication provider to using other services instead of Firebase, as long as it fullfills the `Auth` and `Data` type.

**Tip:** You can take a look at [auth-firebase](./packages/auth-firebase) and [data-firestore](./packages/data-firestore).


## **Contributing**

Please contribute using [GitHub Flow](https://guides.github.com/introduction/flow). Create a branch, add commits, and then [open a pull request](https://github.com/@discuzz/discuzz/compare).

## **License**

This project is licensed under the [GNU General Public License v3.0](https://opensource.org/licenses/gpl-3.0.html) - see the [`LICENSE`](LICENSE) file for details.

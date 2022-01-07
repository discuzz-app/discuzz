<div align="center">
<b>

Firebase Authentication for [Discuzz](https://github.com/discuzz-app/discuzz)

</b>

Authenticate users by integrating with federated identity providers

</div>



<details open>
  <summary><b>Table of contents</b></summary>

---

- [Homepage](#homepage)
- [Supported Identity providers](#supported-identity-providers)
- [Usage](#usage)
	- [Web Component](#web-component)
	- [React Component](#react-component)
- [Contributing](#contributing)
- [Changelog](#changelog)
- [License](#license)

---

</details>

## **Homepage**

[discuzz.mph.am](https://discuzz.mph.am/)

## **Supported Identity providers**
- Google
- Meta (Facebook)
- Twitter
- GitHub
- Yahoo
- Microsoft
- Apple

**To suggest anything, please join our [Discussion board](https://github.com/discuzz-app/discuzz/discussions).**

## **Usage**

### **Web Component**

```html
<script src="https://discuzz.mph.am/static/js/main.js"></script>
<x-discuzz
  service="{'auth':'firebase','data':'[DATA PROVIDER NAME]','config':'[FIREBASE CONFIG]'}"
  auths="[IDENTITY PROVIDER LIST]"
></x-discuzz>
```

**Example**
```html
<script src="https://discuzz.mph.am/static/js/main.js"></script>
<x-discuzz
  service="{'auth':'firebase','data':'firestore','config':{'apiKey':'AIzaSyDm837cbdbvkrAdYL9TAqUF3iML6UvZXk4','authDomain':'fire-talk-88.firebaseapp.com','projectId':'fire-talk-88','storageBucket':'fire-talk-88.appspot.com','messagingSenderId':'719566664522','appId':'1:719566664522:web:e1a9d26be22387e55b47b3'}}"
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


## **Contributing**

Please contribute using [GitHub Flow](https://guides.github.com/introduction/flow). Create a branch, add commits, and then [open a pull request](https://github.com/@discuzz/discuzz/compare).

## **License**

This project is licensed under the [GNU General Public License v3.0](https://opensource.org/licenses/gpl-3.0.html) - see the [`LICENSE`](LICENSE) file for details.

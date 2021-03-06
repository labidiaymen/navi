# <a href='https://frontarm.com/navi/'><img src='/media/logo-title.png' height='100' alt='Navi Logo' aria-label='frontarm.com/navi' /></a>

[![NPM](https://img.shields.io/npm/v/navi.svg)](https://www.npmjs.com/package/navi)

**Navi lets you create big, fast, CDN-delivered websites with great SEO & SMO, and all without ejecting from create-react-app.**

📡 Effortlessly fetch async content from anywhere<br />
🔥 Built-in code splitting and page loading transitions<br />
👌 A dead-simple API<br />
🏷️ Great TypeScript support<br />
📜 Scroll management that just works<br />
♿️ Page `<title>` management for accessibility<br />
🚀 Optimize SEO with static HTML for each page<br />
🗺️ Generate JSON site maps at runtime or build time<br />
⚠️ Console warnings when a `<Link>` points to a 404<br />

Just getting started?

- [View the docs &raquo;](https://frontarm.com/navi/)
- [Why Navi?](https://frontarm.com/navi/motivation/)
- [Play with the demoboard &raquo;](https://frontarm.com/demoboard/?id=1229d493-ffaf-4133-b384-0f7dfec85af5)


Quick Start
-----------

At it's core, Navi is just a router. You can use it with any React app – just add the `navi` and `react-navi` packages to your project:

```bash
npm install --save navi react-navi
```

If you'd like a more full featured starter, you can get started with [Create React/Navi App](https://frontarm.com/navi/create-react-navi-app/):

```bash
npx create-react-navi-app my-app
cd my-app
npm start
```

Or if you want to create a blog, use [create-react-blog](https://github.com/frontarm/create-react-blog):

```bash
npx create-react-blog react-blog
cd react-blog
npm start
```


The minimal example
-------------------

*You can view [this example with live editors](https://frontarm.com/navi/guides/minimal-example/) on the documentation website.*

After spinning up a fresh app with [create-react-app](https://github.com/facebook/create-react-app) and installing `navi` and `react-navi`, there are just three steps to getting a basic app running:

### 1. Declare some pages

To declare your pages, you'll use Navi's `createSwitch()` and `createPage()` functions. Switches are used to map paths to pages. Pages represent individual locations that you can navigate to.

```js
// pages/index.js
import { createPage, createSwitch } from 'navi'
import * as React from 'react'
import { NavLink } from 'react-navi'

export default createSwitch({
  paths: {
    '/': createPage({
      title: "Navi",
      content:
        <div>
          <h2>Navi</h2>
          <p>A router/loader for React</p>
          <nav><NavLink href='/reference'>API Reference</NavLink></nav>
        </div>
    }),

    '/reference': createPage({
      title: "API Reference",
      getContent: () => import('./reference.js')
    }),
  }
})
```

As you'll see later, your content can be *anything*. You can return markdown, JSON, or even arbitrary functions! But `react-navi` has special support for React elements and components, so let's start by defining the content that way.

But what about the `/reference` page? It's not returning an element or component. It's returning a *Promise* to a component -- and this is where Navi shines. When the user clicks the "API reference" link, instead of immediately rendering a blank page, Navi will wait until `reference.js` has loaded ---  and *then* it'll render the page.

```js
// pages/reference.js
import * as React from 'react'
import { NavLink } from 'react-navi'

export default function Reference() {
  return (
    <div>
      <h2>Reference</h2>
      <p>Coming soon.</p>
    </div>
  )
}
```

### 2. Create a `Navigation` object

Navi does all of the hard work within a `Navigation` object. This is where Navi watches for history events, matches URLs to pages and content, and turns all this info into an object that you can use.

To create a `Navigation`, just call `createBrowserNavigation()` within `index.js`, passing in the `pages` object that you defined earlier. Once you have a `Navigation`, wait for the content to be ready -- and then just render it, using `<NavProvider>` and any old `<App>` component.

```js
// index.js
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { NavProvider } from 'react-navi
import { createBrowserNavigation } from 'navi'
import pages from './pages'
import App from './App'

async function main() {
  let navigation = createBrowserNavigation({ pages })

  // Wait until async content is ready, or has failed.
  await navigation.steady()

  ReactDOM.render(
    // The NavProvider adds navigation state to context, which
    // is required to make Navi's other components work.
    <NavProvider navigation={navigation}>
      <App />
    </NavProvider>,
    document.getElementById('root')
  );
}

// Start the app
main()
```


### 3. Render the content within `<App>`

The `navigation` object that you just passed to `<NavProvider>` contains all of the information that you need to render your app. And while you *could* consume all of that information yourself, it's far simpler to just use Navi's built in components.

To start out, you'll only need one component: `<NavContent>`. All it does is render the first value of the first `content` or `getContent()` option in your route declarations.

```js
// App.js
import * as React from 'react'
import { NavContent, NavLink } from 'react-navi'
import './App.css'

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1 className="App-title">
          <NavLink href='/'>Navi</NavLink>
        </h1>
      </header>
      <NavContent />
    </div>
  );
}

export default App;
```

And that's it --- you've built a working app with asynchronous routes! Of course, this tiny app is just an example, but Navi handles real-world apps with ease. In fact, [Frontend Armory](https://frontarm.com) is built with Navi.

To finish off, let's add a couple real-world tweaks as a bonus step, just to see how easy it can be.


### Loading indicators

As Navi doesn't render the new page until it has loaded, there can sometimes be a large delay between clicking a link seeing the result. In cases like this, it's important to keep the user in the loop. To do so, you can check if there's a currently loading route using the `useLoadingRoute()` hook, and if there is, you can show a loading bar or some other indicator.

```js
import { NavContent, NavLink, useLoadingRoute } from 'react-navi'

function App() {
  let loadingRoute = useLoadingRoute()

  return (
    <div className="App">
      {
        // If `loadingRoute` isn't undefined, show a loading bar.
        loadingRoute &&
        <div className="App-loading-bar" />
      }
      <header className="App-header">
        <h1 className="App-title">
          <NavLink href='/'>Navi</NavLink>
        </h1>
      </header>
      <NavContent />
    </div>
  );
}
```


### Handling 404s

```js
import {
  NavContent,
  NavLink,
  NavNotFoundBoundary,
  useLoadingRoute
} from 'react-navi'

function App() {
  let loadingRoute = useLoadingRoute()

  return (
    <div className="App">
      {
        loadingRoute &&
        <div className="App-loading-bar" />
      }
      <header className="App-header">
        <h1 className="App-title">
          <NavLink href='/'>Navi</NavLink>
        </h1>
      </header>
      <NavNotFoundBoundary render={renderNotFound}>
        <NavContent />
      </NavNotFoundBoundary>
    </div>
  );
}

function renderNotFound() {
  return (
    <div className='App-error'>
      <h1>404 - Not Found</h1>
    </div>
  )
} 
```


More details
------------

This README only goes into the beginning of what you can do with Navi. For more details, see the [documentation website](https://frontarm.com/navi/). 


License
-------

Navi is MIT licensed.

# worker-fetch-looper

```bash
yarn add worker-fetch-looper
```

## Usage sample

```js
import { useFetchLooper } from 'worker-fetch-looper';

// Use in component:
const { state } = useFetchLooper({
  validate: {
    // NOTE: Request will not be sent if false (Worker runner will not be started)
    beforeRequest: (payload) => !document.hidden // Browser tab is active...
    // && !!payload.body.field_name && // Validate body...
  },
  cb: {
    // NOTE: Will be called on effect
    onUpdateState: (hookResult: { state }) => {
      const { state } = hookResult
      if (isDev) console.log('- state effect: new state!'); // State updated. Use new state...
    },
    // NOTE: Optional
    onCatch: (err) => {
      conosole.log(err)
    };
  },
  runnerAction: {
    type: 'check-room-state',
    payload: {
      url: `${REACT_APP_API_URL}/chat/api/common-notifs/check-room-state`,
      method: 'POST',
      body: { room_id: room, tsUpdate: sprintFeatureSnap.tsUpdate }
    }
  },
  timeout: 1000
});
```

## Based on [react-hooks-typescript-npm-starter](https://github.com/the-mes/react-hooks-typescript-npm-starter)

[![NPM version](https://img.shields.io/npm/v/react-hooks-typescript-npm-starter?style=flat-square)](https://www.npmjs.com/package/react-hooks-typescript-npm-starter)
[![NPM downloads](https://img.shields.io/npm/dm/react-hooks-typescript-npm-starter?style=flat-square)](https://www.npmjs.com/package/react-hooks-typescript-npm-starter)
[![NPM license](https://img.shields.io/npm/l/react-hooks-typescript-npm-starter?style=flat-square)](https://www.npmjs.com/package/react-hooks-typescript-npm-starter)
[![Codecov](https://img.shields.io/codecov/c/github/the-mes/react-hooks-typescript-npm-starter?style=flat-square)](https://codecov.io/gh/the-mes/react-hooks-typescript-npm-starter)
[![Travis](https://img.shields.io/travis/com/the-mes/react-hooks-typescript-npm-starter/main?style=flat-square)](https://travis-ci.com/the-mes/react-hooks-typescript-npm-starter)
[![Bundle size](https://img.shields.io/bundlephobia/min/react-hooks-typescript-npm-starter?style=flat-square)](https://bundlephobia.com/result?p=react-hooks-typescript-npm-starter)

## About

Short description about library

### Demo

- [Live – check website](#)
- [Playground – play with library in Storybook](#)

### Similar Projects / Alternatives / Idea

- [example](#) by [John Doe](#)
- [example-2](#) by [Jane Doe](#)

## How to Install

First, install the library in your project by npm:

```sh
npm install react-hooks-typescript-npm-starter
```

Or Yarn:

```sh
yarn add react-hooks-typescript-npm-starter
```

## Getting Started

**• Import hook in React application file:**

```js
import { useMyHook } from 'react-hooks-typescript-npm-starter';
```

#### Returned Values

<!-- TODO -->

## Example

```js
const { sum } = useMyHook();

const result = sum(2, 3); // 5
```

## License

This project is licensed under the MIT License © 2021-present Jakub Biesiada

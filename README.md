# worker-fetch-looper

```bash
yarn add worker-fetch-looper
```

## Usage sample

```js
import { useFetchLooper } from 'worker-fetch-looper';
import React, { useState, useEffect, useRef } from 'react';

const App = () => {
  const [counter, setCounter] = useState<number>(1)
  const [errCounter, setErrCounter] = useState<number>(0)
  const timeout = useRef<NodeJS.Timeout>()
  useEffect(() => {
    timeout.current = setTimeout(() => {
      setCounter((c) => c + 1)
    }, 5000)
    return () => {
      if (!!timeout.current) clearTimeout(timeout.current)
    }
  }, [counter])

  // -- Look:
  const { state } = useFetchLooper({
    validate: {
      // NOTE: Request will not be sent if false (Worker runner will not be started)
      beforeRequest: (payload: any) =>
        // !!payload.body.dynamic_field // Room selected
        !document.hidden, // Browser tab is active
    },
    cb: {
      onUpdateState: ({ state }: any) => {
        console.log('- state effect: new state!')
        console.log(state)
      },
      // Optional:
      onCatch: (err) => {
        console.log(err)
        setErrCounter((c) => c + 1)
      }
    },
    runnerAction: {
      type: 'check-room-state',
      payload: {
        url: `https://jsonplaceholder.typicode.com/todos/${counter}`,
        method: 'GET',
        // body: {},
      }
    },
    timeout: 1000,
  })
  // --

  return (
    <div>
      <pre style={{ whiteSpace: 'pre-wrap' }}>{JSON.stringify({ state, errCounter }, null, 2)}</pre>
    </div>
  );
}

/* OUTPUT SAMPLE:
{
  "state": {
    "res": {
      "userId": 1,
      "id": 10,
      "title": "illo est ratione doloremque quia maiores aut",
      "completed": true
    },
    "type": "check-room-state"
  },
  "errCounter": 0
}
*/
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

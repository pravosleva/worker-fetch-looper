# worker-fetch-looper

```bash
yarn add worker-fetch-looper
```

## Usage samples

### Simplest

```js
import React, { useState, useEffect, useRef } from 'react';
import { useFetchLooper, TRes } from 'worker-fetch-looper';

const App = () => {
  const { state } = useFetchLooper({
    timeout: 1000,
    runnerAction: {
      type: 'YOUR_CODE',
      payload: {
        url: 'https://jsonplaceholder.typicode.com/todos/1',
        method: 'GET'
      }
    }
  });

  return (
    <div>
      <pre style={{ whiteSpace: 'pre-wrap' }}>
        {JSON.stringify(state, null, 2)}
      </pre>
    </div>
  );
};
```

### Dynanic params

```js
import React, { useState, useEffect, useRef } from 'react';
import { useFetchLooper, TRes } from 'worker-fetch-looper';

enum ACTION_CODE {
  One = 'ACTION_CODE_1'
}

const App = () => {
  const [counter, setCounter] = useState<number>(1)
  const [errCounter, setErrCounter] = useState<number>(0)
  const timeout = useRef<NodeJS.Timeout>()
  useEffect(() => {
    timeout.current = setTimeout(() => { setCounter((c) => c + 1) }, 5000)
    return () => {
      if (!!timeout.current) clearTimeout(timeout.current)
    }
  }, [counter])

  const { state } = useFetchLooper({
    timeout: 1000,
    runnerAction: {
      type: 'ACTION_CODE_1',
      payload: {
        url: `https://jsonplaceholder.typicode.com/todos/${counter}`,
        method: 'GET',
        // body: {},
      }
    },
    validate: {
      // NOTE: Request will not be sent if false (Worker runner will not be started)
      beforeRequest: ({ type, payload }: { type: string, payload: any }) =>
        // !!payload.body.dynamic_field // Validate body
        !document.hidden, // Browser tab is active
      response: ({ res, type }: { res: TRes, type: string }) => {
        // console.log(res)
        return true
      }
    },
    cb: {
      onUpdateState: ({ res, type }: { res: TRes, type: string }) => {
        console.log(`- state effect: new state! type: ${type}`)
        try {
          switch (type) {
            case ACTION_CODE.One:
              // NOTE: Updates from Web Worker detected as effect!
              console.log(res) // Response by server
              break;
            default:
              console.log(res.id)
              break;
          }
        } catch (err) {
          console.log(err)
        }
      },
      // NOTE: But only for update state effect and !!validate?.response fuckup!
      // Not for each response.
      onCatch: ({ err, res, type }) => {
        console.log(err)
        setErrCounter((c) => c + 1)
      },
      // NOTE: But only for update state effect and !!validate?.response success!
      // Not for each response.
      onSuccess: ({ res, type }: { res: TRes, type: string }) => {
        console.table({ res: JSON.stringify(res), type })
      },
    },
  })

  return (
    <div>
      <pre style={{ whiteSpace: 'pre-wrap' }}>{JSON.stringify({ state, errCounter }, null, 2)}</pre>
    </div>
  );
}

/* OUTPUT SAMPLE:
{
  "state": {
    "userId": 1,
    "id": 15,
    "title": "ab voluptatum amet voluptas",
    "completed": true
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

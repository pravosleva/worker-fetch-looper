import { renderHook } from '@testing-library/react-hooks';
import { useFetchLooper } from '../src';

describe('useFetchLooper', () => {
  beforeEach(() => {
    // ...
  });

  afterEach(() => {
    // ...
  });

  it('GET /todos/1', () => {
    const { result } = renderHook(() =>
      useFetchLooper({
        intialState: {
          userId: 0,
          id: 0,
          title: 'default value',
          completed: false,
        },
        timeout: 1000,
        runnerAction: {
          type: 'YOUR_CODE',
          payload: {
            url: 'https://jsonplaceholder.typicode.com/todos/1',
            method: 'GET',
          },
        },
      })
    );

    expect(result.current.state).toEqual({
      userId: 0,
      id: 0,
      title: 'default value',
      completed: false,
    });
  });
});

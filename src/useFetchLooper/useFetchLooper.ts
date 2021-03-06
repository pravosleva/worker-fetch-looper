/* eslint-disable no-undef */
import { useEffect, useState, useRef } from 'react';
import { usePollingWorker, TWorkerFnParams } from './utils';
import { TRes } from './types';

export const useFetchLooper = ({
  timeout,
  validate,
  runnerAction,
  cb,
  intialState,
}: {
  intialState?: any;
  timeout: number;
  runnerAction: {
    type: string;
    payload: {
      url: string;
      method: 'POST' | 'GET';
      body?: any;
    };
  };
  validate?: {
    beforeRequest?: ({
      type,
      payload,
    }: {
      type: string;
      payload: any;
    }) => boolean;
    response?: ({ res, type }: { res: TRes; type: string }) => boolean;
  };
  cb?: {
    onUpdateState?: (hookResult: { res: TRes; type: string }) => void;
    onCatch?: ({
      err,
      type,
      res,
    }: {
      err: any;
      type: string;
      res: any;
    }) => void;
    onSuccess?: (hookResult: { res: TRes; type: string }) => void;
  };
}) => {
  // --- POLLING: v2
  const { type } = runnerAction;
  const { state, run } = usePollingWorker({
    intialState,
    // - NOTE: Callback source code for Blob
    fn: ({ payload, type }: { payload: TWorkerFnParams; type: string }) => {
      const { url, method, body } = payload;
      const fetchOpts: any = {
        method,
        headers: { 'Content-Type': 'application/json' },
      };
      if (body) fetchOpts.body = JSON.stringify(body);

      fetch(url, fetchOpts)
        .then((res: Response) => {
          // const _originalResDetails: Partial<Response> = {};
          // ['status', 'ok', 'statusText'].forEach((key) => {
          //   // @ts-ignore
          //   _originalResDetails[key] = res[key]
          // })
          return res.json();
        })
        .then((json: any) => {
          // @ts-ignore
          postMessage({ res: json, type });
        })
        .catch((err) => {
          console.log(err);
          // if (!!cb.onCatch) cb.onCatch({ err, type });
        });
    },
    // -
  });

  // -- LOOPER
  const [tick, setTick] = useState(0);
  const t = useRef<NodeJS.Timeout>();
  useEffect(() => {
    const runIfNecessary = () => {
      // console.log(`- run worker in effect #${tick}`);
      if (validate?.beforeRequest) {
        if (validate.beforeRequest(runnerAction)) {
          run(runnerAction);
        } else {
          // Skip...
        }
      } else {
        run(runnerAction);
      }
      setTick((c) => c + 1);
    };
    t.current = setTimeout(runIfNecessary, timeout);
    return () => {
      if (t.current) clearTimeout(t.current);
    };
  }, [JSON.stringify(runnerAction.payload), tick]);
  // --

  useEffect(() => {
    if (cb?.onUpdateState) {
      cb.onUpdateState({ res: state, type });
    }
    if (validate?.response) {
      try {
        const isValid = validate.response({ res: state, type });

        if (isValid) {
          if (cb?.onSuccess) cb.onSuccess({ res: state, type });
        } else {
          throw new Error('Invalid param');
        }
      } catch (err) {
        if (cb?.onCatch) cb.onCatch({ err, res: state, type });
      }
    }
  }, [JSON.stringify(state)]);

  return { state };
};

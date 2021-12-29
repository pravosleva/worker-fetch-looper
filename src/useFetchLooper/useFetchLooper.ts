/* eslint-disable no-undef */
import { useEffect, useState, useRef } from 'react';
import { usePollingWorker, TWorkerFnParams } from './utils';

export const useFetchLooper = ({
  timeout,
  validate,
  runnerAction,
  cb,
}: {
  timeout: number;
  runnerAction: {
    type: string;
    payload: {
      url: string;
      method: 'POST' | 'GET';
      body?: any;
    };
  };
  validate: {
    beforeRequest: (payload: any) => boolean;
  };
  cb: {
    onUpdateState: (hookResult: { res: any; type: string }) => void;
    onCatch?: (err: any, type: string) => void;
  };
}) => {
  // --- POLLING: v2
  const { type } = runnerAction;
  const { state, run } = usePollingWorker({
    // - NOTE: Callback source code for Blob
    fn: ({ payload, type }: { payload: TWorkerFnParams; type: string }) => {
      const { url, method, body } = payload;
      const fetchOpts: any = {
        method,
        headers: { 'Content-Type': 'application/json' },
      };
      if (body) fetchOpts.body = JSON.stringify(body);
      fetch(url, fetchOpts)
        .then((res) => res.json())
        .then((json) => {
          // @ts-ignore
          postMessage({ res: json, type });
        })
        .catch((err) => {
          if (cb.onCatch) cb.onCatch(err, type);
        });
    },
    // -
  });

  // -- LOOPER
  const [tick, setTick] = useState(0);
  const t = useRef<NodeJS.Timeout>();
  useEffect(() => {
    if (validate.beforeRequest(runnerAction.payload)) {
      const req = () => {
        // console.log(`- run worker in effect #${tick}`);
        run(runnerAction);
        setTick((c) => c + 1);
      };
      t.current = setTimeout(req, timeout);
    }
    return () => {
      if (t.current) clearTimeout(t.current);
    };
  }, [JSON.stringify(runnerAction.payload), tick]);
  // --

  useEffect(() => {
    if (cb.onUpdateState) cb.onUpdateState({ res: state, type });
  }, [JSON.stringify(state)]);

  return { state };
};

import { useRef, useState } from 'react';

const workerHandler = (fn: (arg: any) => void) => {
  onmessage = (nativeWorkerEvt: any) => {
    // console.log(nativeWorkerEvt.data); // { type: string, payload: any }
    fn(nativeWorkerEvt.data);
  };
};

type TProps = {
  fn: (arg: any) => void;
  intialState?: any;
};

export const usePollingWorker = ({ fn, intialState }: TProps) => {
  const [state, setState] = useState<any>(intialState || null);
  const workerRef = useRef<Worker | null>(null);

  const run = (arg: { type: string; payload: any }) => {
    try {
      const worker = new Worker(
        URL.createObjectURL(
          new Blob([`(${workerHandler.toString()})(${fn.toString()})`], {
            type: 'text/javascript',
          })
        )
      );
      workerRef.current = worker;
      workerRef.current.onmessage = (e) => {
        // console.log(e.data.res)
        setState({ ...e.data.res, _details: e.data._originalResDetails });
        if (workerRef.current) {
          workerRef.current.terminate();
          workerRef.current = null;
        }
      };
      if (workerRef.current) workerRef.current.postMessage(arg);
    } catch (err) {
      console.log(err);
    }
  };

  return {
    state,
    run,
  };
};

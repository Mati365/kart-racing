import {useEffect} from 'react';

import usePromiseCallback from './usePromiseCallback';

const usePromise = (fn, {keys, ...promiseFlags} = {keys: []}) => {
  const [promiseExecutor, promiseState] = usePromiseCallback(
    fn,
    {
      ...promiseFlags,
      initialPromiseState: {
        loading: true,
      },
    },
  );

  useEffect(
    () => {
      promiseExecutor();
    },
    keys,
  );

  return promiseState;
};

export default usePromise;
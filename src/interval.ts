import { useEffect, useState, useCallback } from 'react';

// Why can't we use "Function" here?
type ArbitraryFunction = (...args: any[]) => any

export function useCallbackWithInterval<T extends ArbitraryFunction>(callback: T, deps: any[], delay: number): T {
  const [ timer, setTimer ] = useState(0);

  useEffect(
    () => {
      const handler = () => {
        setTimer((timer) => timer + 1)
      }

      if (delay !== null) {
        const id = setInterval(handler, delay);
        return () => clearInterval(id);
      }
    },
    // eslint-disable-next-line
    [...deps, delay]
  )

  return useCallback(callback, [...deps, callback, timer])
}

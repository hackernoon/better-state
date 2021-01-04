import { useState, useEffect, useRef, useCallback } from "react";

import useUpdateState from "./useUpdateState";

const useAwaitState = (initialState = null) => {
  const [state, updateState] = useUpdateState(initialState);
  const [promises, updatePromises, setPromises] = useUpdateState([]);
  const promiseRef = useRef();

  useEffect(() => promiseRef.current = promises);

  useEffect(() => {
    updatePromises(Promise.resolve(state));
  }, [state]);

  // record state changes

  const prevStateRef = useRef();
  useEffect(() => {
    prevStateRef.current = state;
  });

  const nextState = useCallback(() => {
    return Promise.all(promises).then((resolvedValues) => {
      setPromises([]);
      return state;
    });
  }, [promiseRef]);

  return [state, updateState, nextState];
}

export default useAwaitState;
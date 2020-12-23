import {useState, useEffect, useCallback, useMemo, useRef} from "react";
import get from "lodash/get";
import mitt from "mitt";
import {createPatch} from "rfc6902";

import useUpdateState from "./useUpdateState";

const defaultInitialState = null;

const rfcToMittPath = (pathspec) => {
  return pathspec.replace(/\//g, ".");
}

const useListenerState = (initialState = defaultInitialState) => {
  let [state, updateState] = useUpdateState(initialState);
  const emitter = useRef(mitt());

  // record state changes
  const prevStateRef = useRef();
  useEffect(() => {
    prevStateRef.current = state;
  });

  useEffect(() => {
    emitter.current.emit("*");

    const prevState = prevStateRef.current;
    const stateDiff = createPatch(prevState, state);
    stateDiff.forEach((diffSpec) => {
      emitter.current.emit(rfcToMittPath(diffSpec.path), diffSpec.value);
    });
  }, [state]);

  return [state, updateState, emitter.current];
};

export default useListenerState;

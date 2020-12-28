import {useState, useEffect, useCallback, useMemo, useRef} from "react";
import get from "lodash/get";
import mitt from "mitt";
import {createPatch} from "rfc6902";

import useUpdateState from "./useUpdateState";

const defaultInitialState = null;

const rfcToMittPath = (pathspec) => {
  return pathspec.replace(/\//g, ".");
}

const useEmitterState = (initialState = defaultInitialState) => {
  let [state, updateState] = useUpdateState(initialState);
  const emitter = useRef(mitt());

  // record state changes
  const prevStateRef = useRef();
  useEffect(() => {
    prevStateRef.current = state;
  });

  useEffect(() => {
    const prevState = prevStateRef.current;
    const stateDiff = createPatch(prevState, state);
    stateDiff.forEach((diffSpec) => {
      const mittPath = diffSpec.path === "" ? "." : rfcToMittPath(diffSpec.path);
      emitter.current.emit(mittPath, diffSpec.value);
    });
  }, [state]);

  // add "once" method to emitter
  useEffect(() => {
    const once = (path, fn) => {
      const wrapper = () => {
        fn();
        emitter.current.off(path, wrapper);
      };

      emitter.current.on(path, wrapper);
    };

    emitter.current.once = once.bind(emitter.current);
  }, [emitter.current]);

  return [state, updateState, emitter.current];
};

export default useEmitterState;

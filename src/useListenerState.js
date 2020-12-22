import {useState, useEffect, useCallback, useMemo, useRef} from "react";
import get from "lodash/get";

import useUpdateState from "./useUpdateState";

const defaultInitialState = null;
const initialListenerState = {
  callbacks: {}
};

const useListenerState = (initialState = defaultInitialState) => {
  let [state, updateState] = useUpdateState(initialState);
  const [listeners, updateListeners, setListeners] = useUpdateState(initialListenerState);

  useEffect(() => console.log("useListenerState update: ", state));

  const addListener = useCallback((fieldpath, fn) => {
    const fullPath = `callbacks.${fieldpath}`

    if (fieldpath && fn && typeof fieldpath === "string" && typeof fn === "function") {
      // listen for changes on a specific fieldpath
      updateListeners(fullPath, [fn]);
    } else if (fieldpath && !fn && typeof fieldpath === "function") {
      // listen for any changes
      fn = fieldpath;
      updateListeners("callbacks.*", [fn]);
    } else {
      throw new Error("InvalidParameterError: you must pass a fieldpath string, or a fieldpath and a function.");
    }
  }, [listeners]);

  const removeListener = useCallback((fieldpath, fn) => {
    const fullPath = `callbacks.${fieldpath}`

    if (!fn && typeof fieldpath === 'string') {
      // remove all listeners for the fieldpath
      updateListeners("callbacks.*", []);
    } else if (fieldpath && fn && typeof fieldpath === "string" && typeof fn === "function") {
      // remove the listener that was passed in
      updateListeners(fieldpath, listeners.filter((l) => l !== fn));
    } else if (arguments.length === 0) {
      updateListeners({ callbacks: {} });
    } else {
      throw new Error("InvalidParameterError: you must pass no parameters, or a fieldpath string, or a fieldpath and a function.");
    }
  }, [listeners]);

  const listenOnce = useCallback((fieldpath, fn) => {
    if (fieldpath && fn && typeof fieldpath === "string" && typeof fn === "function") {
      // nothing special, just pass the params along and listen for changes once on the given path
    } else if (fieldpath && !fn && typeof fieldpath === "function") {
      // listening for any changes, so change the vars to match
      fn = fieldpath;
      fieldpath = "*";
    } else {
      throw new Error("InvalidParameterError: you must pass a fieldpath string, or a fieldpath and a function.");
    }

    const wrapper = (newState) => {
      fn(newState);
      listeners.off(fieldpath, wrapper);
    };

    listeners.on(fieldpath, wrapper);
  }, []);

  // record state changes
  const prevStateRef = useRef();
  useEffect(() => {
    prevStateRef.current = state;
  });

  useEffect(() => {
    const prevState = prevStateRef.current;

    Object.entries(listeners.callbacks).forEach(([fieldpath, fieldListeners]) => {
      if (fieldpath === "*") {
        fieldListeners.forEach((listener) => {
          listener(state);
        });

        return;
      }

      if (get(state, fieldpath) !== get(prevState, fieldpath)) {
        fieldListeners.forEach(listener => {
          listener(get(state, fieldpath));
        });
      }
    });
  }, [state]);

  listeners.on = addListener;
  listeners.off = removeListener;
  listeners.once = listenOnce;

  return [state, updateState, listeners];
};

export default useListenerState;

import {useState, useEffect, useCallback, useMemo, useRef} from "react";
import get from "lodash/get";

const defaultInitialState = null;
const initialListenerState = {};

const useListenerState = (initialState = defaultInitialState) => {
  let [state, setState] = useState(initialState);
  const [listeners, setListeners] = useState(initialListenerState);

  const addListener = useCallback((fieldpath, fn) => {
    if (fieldpath && fn && typeof fieldpath === "string" && typeof fn === "function") {
      // listen for changes on a specific fieldpath
      setListeners({ ...listeners, [fieldpath]: [...get(listeners, fieldpath, []), fn] });
    } else if (fieldpath && !fn && typeof fieldpath === "function") {
      // listen for any changes
      fn = fieldpath;
      setListeners({ ...listeners, "*": [...get(listeners, "*", []), fn] });
    } else {
      throw new Error("InvalidParameterError: you must pass a fieldpath string, or a fieldpath and a function.");
    }
  }, [listeners]);

  const removeListener = useCallback((fieldpath, fn) => {
    if (!fn && typeof fieldpath === 'string') {
      // remove all listeners for the fieldpath
      setListeners({ ...listeners, [fieldpath]: [] });
    } else if (fieldpath && fn && typeof fieldpath === "string" && typeof fn === "function") {
      // remove the listener that was passed in
      setListeners(listeners.filter((l) => l !== fn));
    } else if (arguments.length === 0) {
      setListeners(initialListenerState);
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
      state.off(fieldpath, wrapper);
    };

    state.on(fieldpath, wrapper);
  }, []);

  // record state changes
  const prevStateRef = useRef();
  useEffect(() => {
    prevStateRef.current = state;
  });

  useEffect(() => {
    const prevState = prevStateRef.current;

    Object.entries(listeners).forEach(([fieldpath, fieldListeners]) => {
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

  state = new state.constructor(state);
  state.on = addListener;
  state.off = removeListener;
  state.once = listenOnce;

  return [state, setState, listeners];
};

export default useListenerState;

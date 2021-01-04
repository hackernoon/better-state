// NOTE: this was an attempt to consolidate the hooks into a single hook
// it may be removed in the future

import { useState, useRef, useEffect, useCallback } from "react";
import { isString, get, set, cloneDeep, isObject, isArray, isNil, isFunction } from "lodash";
import mitt from "mitt";

const useBetterState = (initialState = null) => {
  // the core state value
  const [state, setState] = useState(initialState);
  // tracking state updates via promises
  const [promises, setPromises] = useState([]);
  const promiseRef = useRef([]);
  const emitter = useRef(mitt());

  // emitter updates
  useEffect(() => {
    const prevState = prevStateRef.current;
    const stateDiff = createPatch(prevState, state);
    stateDiff.forEach((diffSpec) => {
      const mittPath = diffSpec.path === "" ? "." : rfcToMittPath(diffSpec.path);
      emitter.current.emit(mittPath, diffSpec.value);
    });
  }, [state]);

  // every time state updates, push a Promise with the value on the promise queue
  useEffect(() => {
    setPromises([...promises, Promise.resolve(state)]);
  }, [state]);

  useEffect(() => {
    promiseRef.current = promises;
  }, [promises]);

  const updateState = useCallback((pathname, newState) => {
    if (pathname && newState && isString(pathname)) {
      // regular pathname + value update
      let stateCopy = cloneDeep(state);
      if (pathname === ".") {
        stateCopy = newState;
      } else {
        set(stateCopy, pathname, newState);
      }

      setState(stateCopy);
      return stateCopy;
    } else if (pathname && !newState) {
      // single param mode
      newState = pathname;
      if (isArray(state) && isArray(newState)) {
        const newStateConcat = state.concat(newState)
        setState(newStateConcat);
        return newStateConcat;
      } else if (isArray(state) && !isArray(newState)) {
        const newStateConcat = state.concat([newState]);
        setState(newStateConcat);
        return newStateConcat;
      } else if (isArray(newState)) {
        setState(newState);
        return newState;
      } else if (isObject(newState)) {
        // upsert object
        const newStateSpread = { ...state, ...newState };
        setState(newStateSpread);
        return newStateSpread;
      } else if (!isObject(newState) && !isNil(newState) && !isFunction(newState)) {
        // new state is a primitive value, just set the state to that value
        setState(newState);
        return newState;
      } else if (isFunction(newState)) {
        // set the value of the function -- by default, passing a function will use useState's function handler
        setState(() => newState);
        return newState;
      } else if (isNil(newState)) {
        // do nothing, the dev may have not meant to pass a nil value
        return state;
      } else {
        throw new Error("InvalidParameterError: updateState requires either a pathstring/value pair, or a single value to upsert");
      }
    } else {
      throw new Error("InvalidParameterError: updateState requires either a pathstring/value pair, or a single value to upsert");
    }
  }, []);

  return [state, setState, { updateState, nextState }]
};
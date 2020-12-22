import { useState, useEffect } from "react";
import { isString, get, set, cloneDeep, isObject, isArray, isNil, isFunction } from "lodash";

export const useUpdateState = (initialState) => {
  if (typeof initialState === "undefined" || initialState == null) {
    initialState = {};
  }
  const [state, setState] = useState(initialState);

  useEffect(() => console.log(state));

  const updateState = (pathname, newState) => {
    try {
      if (pathname && newState && isString(pathname)) {
        // regular pathname / value update
        
        let stateCopy = cloneDeep(state);
        set(stateCopy, pathname, newState);
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
    } catch (err) {
      console.error(err);
      console.log("state: ", state);
      console.log("pathname: ", pathname);
      console.log("newState: ", newState);
    }
  };

  return [state, updateState, setState];
};

export default useUpdateState;

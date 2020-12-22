import { useState, useEffect } from "react";
import { isString, get, set, cloneDeep, isObject } from "lodash";

export const useUpdateState = (initialState = {}) => {
  const [state, setState] = useState(initialState);

  useEffect(() => console.log("useUpdateState change:", state));

  const updateState = (pathname, newState) => {
    if (!isObject(pathname) && !newState) {
      console.log("updateState: setting primitive");
      // setting a primitive, just overwrite the value
      setState(newState);
    } else if (pathname && newState && isString(pathname)) {
      console.log('updateState: both params present')
      let stateCopy = cloneDeep(state);
      let existingPathValue = get(stateCopy, pathname, {});

      if (newState === null) {
        console.log("updateState: newState is null");
        stateCopy = initialState;
      } else if (Array.isArray(existingPathValue) && Array.isArray(newState)) {
        console.log("updateState: both arrays")
        // both are arrays
        set(stateCopy, pathname, existingPathValue.concat(newState));
      } else if (Array.isArray(existingPathValue)) {
        console.log("updateState: existingArray")
        // only the existing value is an array, so append the value
        set(stateCopy, pathname, [...existingPathValue, newState]);
      } else {
        console.log("updateState: object fallback")
        // just assume it's an object
        set(stateCopy, pathname, newState);
      }

      setState(stateCopy);
    } else if (pathname === null && !newState) {
      console.log("updateState: only param null")
      // null is a special case used to reset the state (you can't update "null")
      setState(null);
    } else {
      console.log("updateState: outer object fallback")
      // assume state is an object
      setState({ ...state, ...newState });
    }

    return newState;
  };

  return [state, updateState, setState];
};

export default useUpdateState;

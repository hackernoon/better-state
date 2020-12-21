import { useState } from "react";
import { isString, get, set, cloneDeep, isObjectLike } from "lodash";

export const useUpdateState = (initialState = {}) => {
  const [state, setState] = useState(initialState);

  const updateState = (pathname, newState) => {
    if (!isObjectLike(pathname) && !newState) {
      // setting a primitive, just overwrite the value
      setState(newState);
    } else if (pathname && newState && isString(pathname)) {
      let stateCopy = cloneDeep(state);
      let existingPathValue = get(stateCopy, pathname, {});

      if (newState === null) {
        stateCopy = null;
      } else if (Array.isArray(existingPathValue) && Array.isArray(newState)) {
        // both are arrays
        set(stateCopy, pathname, existingPathValue.concat(newState));
      } else if (Array.isArray(existingPathValue)) {
        // only the existing value is an array, so append the value
        set(stateCopy, pathname, [...existingPathValue, newState]);
      } else {
        // just assume it's an object
        set(stateCopy, pathname, newState);
      }

      setState(stateCopy);
    } else if (pathname === null && !newState) {
      // null is a special case used to reset the state (you can't update "null")
      setState(null);
    } else {
      // assume state is an object
      setState({ ...state, ...newState });
    }

    return newState;
  };

  return [state, updateState, setState];
};

export default useUpdateState;

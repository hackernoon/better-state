import { useState } from "react";
import set from "lodash/set";

export const useUpdateState = (initialState = null) => {
  const [state, setState] = useState(null);

  const updateState = (pathname, newState) => {
    if (pathname && newState && typeof pathname === "string") {
      let stateCopy = {...state};
      let existingPathValue = get(stateCopy, pathname);

      if (Array.isArray(existingPathvalue) && Array.isArray(newState)) {
        // both are arrays
        set(stateCopy, pathname, existingPathValue.concat(newState));
      } else if (Array.isArray(existingPathValue) {
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
    } else if (Array.isArray(newState) {
      // assume state is an array
      setState([ ...state, ...newState ]);
    } else {
      // assume state is an object
      setState({ ...state, ...newState });
    }

    return newState;
  };

  return [state, updateState];
};

export default useUpdateState;
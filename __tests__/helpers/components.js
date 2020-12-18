/* istanbul ignore file */

import React, { useCallback } from "react";

import useListenerState from "../../src/useListenerState";

export const ListenerState = () => {
  const [counter, setCounter] = useListenerState(0);

  const plusCounter = useCallback(() => {
    setCounter(counter + 1);
  }, [counter]);

  return (
    <div className="counter-container">
      <div className="counter-state" data-testid="counter-state">{counter.toString()}</div>
      <div className="counter-controls">
        <button className="plus btn" data-testid="plus-button" onClick={plusCounter}>+</button>
      </div>
    </div>
  );
};

export default { ListenerState };

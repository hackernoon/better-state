/* istanbul ignore file */

import React, { useCallback } from "react";

import useListenerState from "../../src/useListenerState";

export const ListenerState = () => {
  const [counter, setCounter] = useListenerState(0);

  const plusCounter = useCallback(() => {
    setCounter(counter + 1);
  }, [counter]);

  const addTestListener = useCallback(() => {
    counter.on(() => setCounter(10));
  }, []);

  return (
    <div className="counter-container">
      <div className="state">
        <div className="counter-state" data-testid="counter-state">{counter.toString()}</div>
        <div className="listener-state" data-testid="listener-state">{counter.listeners.length}</div>
      </div>
      <div className="counter-controls">
        <button className="plus btn" data-testid="plus-button" onClick={plusCounter}>+</button>
        <button className="add-listener btn" data-testid="listener-button" onClick={addTestListener}>Add Listener</button>
      </div>
    </div>
  );
};

export default { ListenerState };

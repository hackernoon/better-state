import React, { useState, useCallback } from "react";
import { render, fireEvent, waitFor, waitForElementToBeRemoved } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";

import useListenerState from "../src/useListenerState";

const ListenerState = () => {
  const [counter, updateCounter, listeners] = useListenerState(0);
  const [showSuccess, setShowSuccess] = useState(true);

  const plusCounter = useCallback(() => {
    updateCounter(counter + 1);
  }, [counter]);

  const addTestListener = useCallback(() => {
    // set a value that could only be set by a callback
    // just as an example, so the test can see the effect
    listeners.on(() => setShowSuccess(true));
  }, [counter]);

  return (
    <div className="counter-container">
      <div className="state">
        <div className="counter-state" data-testid="counter-state">{counter || "0"}</div>
        <div className="success-sate" data-testid="success-state">{showSuccess && "success"}</div>
        <div className="listener-state" data-testid="listener-state">{Object.keys(listeners.callbacks).length}</div>
      </div>
      <div className="counter-controls">
        <button className="plus btn" data-testid="plus-button" onClick={plusCounter}>+</button>
        <button className="add-listener btn" data-testid="listener-button" onClick={addTestListener}>Add Listener</button>
      </div>
    </div>
  );
};

test("it sets the default state", async () => {
  const { getByTestId } = render(<ListenerState />);
  fireEvent.click(getByTestId("plus-button"));
  await waitFor(() => expect(getByTestId("counter-state")).toHaveTextContent("1"));
});

test("it listens for state changes on the entire object", async () => {
  const { getByTestId } = render(<ListenerState />);
  
  fireEvent.click(getByTestId("listener-button"));
  await waitFor(() => expect(getByTestId("listener-state")).toHaveTextContent("1"));

  fireEvent.click(getByTestId("plus-button"));
  await waitFor(() => expect(getByTestId("success-state")).toHaveTextContent("success"));
});

test.todo("it stops listening for changes");
test.todo("it listens for changes once");
test.todo("it listens for changes on a particular object.path.like.this");

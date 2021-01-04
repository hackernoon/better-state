import React, { useState } from "react";
import { render, fireEvent, waitFor, waitForElementToBeRemoved } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";

import useAwaitState from "../src/useAwaitState";

const AwaitState = () => {
  const [counter, updateCounter, nextState] = useAwaitState(0);
  const [isDone, setIsDone] = useState(false);
  const [nextValue, setNextValue] = useState(null);

  const increment = async () => {
    updateCounter(42);
    const nextStateResult = await nextState();
    setNextValue(nextStateResult);
  };

  return (
    <div className="await-state">
      <button data-testid="increment">++</button>
      <div data-testid="counter">{counter}</div>
      <div data-testid="is-done">{isDone ? "1" : "0"}</div>
      <div data-testid="next-value">{nextValue}</div>
    </div>
  )
};

test("it awaits the result of the setState/updateState call", async () => {
  const { getByTestId } = render(<AwaitState />);

  await waitFor(() => expect(getByTestId("is-done")).toHaveTextContent("0"));
  fireEvent.click(getByTestId("increment"));
  await waitFor(() => expect(getByTestId("counter")).toHaveTextContent("42"));
  await waitFor(() => expect(getByTestId("is-done")).toHaveTextContent("1"));
});

test.todo("it returns the new state");

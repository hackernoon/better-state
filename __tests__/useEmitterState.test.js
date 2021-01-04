import React, { useState, useCallback, useMemo, useEffect } from "react";
import { render, fireEvent, waitFor, waitForElementToBeRemoved } from "@testing-library/react";
import sinon from "sinon";
import "@testing-library/jest-dom/extend-expect";

import useEmitterState from "../src/useEmitterState";

const EmitterState = ({ callback }) => {
  const [counter, updateCounter, emitter] = useEmitterState(0);

  const plusCounter = useCallback(() => {
    updateCounter(counter + 1);
  }, [counter]);

  const addTestEmitter = () => {
    emitter.on(".", callback);
  };

  const removeTestEmitter = () => {
    emitter.off(".", callback);
  };

  const addOnceEmitter = () => {
    emitter.once(".", callback);
  };

  return (
    <div className="counter-container">
      <div className="state">
        <div className="counter-state" data-testid="counter-state">{counter || "0"}</div>
        <div className="emitter-count" data-testid="emitter-count">{emitter.all.size}</div>
      </div>

      <div className="counter-controls">
        <button className="plus btn" data-testid="plus-button" onClick={plusCounter}>+</button>
        <button className="add-listener btn" data-testid="listener-button" onClick={addTestEmitter}>Add Listener</button>
        <button className="once-listener btn" data-testid="once-listener" onClick={addOnceEmitter}>Listen once</button>
        <button data-testid="remove-listener" onClick={removeTestEmitter}>Remove listener</button>
      </div>
    </div>
  );
};

test("it sets the default state", async () => {
  const { getByTestId } = render(<EmitterState />);
  fireEvent.click(getByTestId("plus-button"));
  await waitFor(() => expect(getByTestId("counter-state")).toHaveTextContent("1"));
});

test.only("it listens for state changes on the entire object", async () => {
  const callback = sinon.fake();
  const { getByTestId } = render(<EmitterState callback={callback} />);
  
  fireEvent.click(getByTestId("listener-button"));
  await waitFor(() => expect(getByTestId("emitter-count")).toHaveTextContent("1"));
  fireEvent.click(getByTestId("plus-button"));
  
  await waitFor(() => expect(getByTestId("counter-state")).toHaveTextContent("1"));
  await waitFor(() => expect(callback.called).toBeTruthy());
});

test("it stops listening for changes", async () => {
  const { getByTestId } = render(<EmitterState />);

  fireEvent.click(getByTestId("listener-button"));
  await waitFor(() => expect(getByTestId("listener-count")).toHaveTextContent("1"));

  fireEvent.click(getByTestId("plus-button"));
  await waitFor(() => expect(getByTestId("emitter-state")).toHaveTextContent("1"));

  fireEvent.click(getByTestId("remove-listener"));
  await waitFor(() => expect(getByTestId("listener-count")).toHaveTextContent("0"));

  fireEvent.click(getByTestId("plus-button"));
  await waitFor(() => expect(getByTestId("emitter-state")).toHaveTextContent("1"));
});

test("it listens for changes once", async () => {
  const { getByTestId } = render(<EmitterState />);

  fireEvent.click(getByTestId("once-listener"));
  await waitFor(() => expect(getByTestId("listener-count")).toHaveTextContent("1"));

  fireEvent.click(getByTestId("plus-button"));
  await waitFor(() => expect(getByTestId("emitter-state")).toHaveTextContent("1"));
  
  await waitFor(() => expect(getByTestId("listener-count")).toHaveTextContent("0"));
  fireEvent.click(getByTestId("plus-button"));
  await waitFor(() => expect(getByTestId("emitter-state")).toHaveTextContent("1"));
});

test.todo("it listens for changes on a particular object.path.like.this");

import React, { useState, useCallback, useMemo, useEffect } from "react";
import { render, fireEvent, waitFor } from "@testing-library/react";
import { renderHook, act } from '@testing-library/react-hooks'
import sinon from "sinon";
import "@testing-library/jest-dom/extend-expect";

import useEmitterState from "../src/useEmitterState";

test("it sets the default state", async () => {
  const { result } = renderHook(() => useEmitterState(0));
  let [state, updateState, emitter] = result.current;

  act(() => {
    updateState(state + 1);
  });

  state = result.current[0];
  expect(state).toBe(1);
});

test.only("it listens for state changes on the entire object", async () => {
  const callback = sinon.fake();
  const { result, waitForNextUpdate } = renderHook(() => useEmitterState(0));
  
  let [state, updateState, emitter] = [0, 1, 2];

  result.current[emitter].on(".", callback);
  
  act(() => {
    result.current[updateState](42);
  });

  await waitFor(() => expect(callback.called).toBe(true));
});

test("it stops listening for changes", async () => {
  const { result } = renderHook(() => useEmitterState(0));

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
  const { result } = renderHook(() => useEmitterState(0));

  fireEvent.click(getByTestId("once-listener"));
  await waitFor(() => expect(getByTestId("listener-count")).toHaveTextContent("1"));

  fireEvent.click(getByTestId("plus-button"));
  await waitFor(() => expect(getByTestId("emitter-state")).toHaveTextContent("1"));
  
  await waitFor(() => expect(getByTestId("listener-count")).toHaveTextContent("0"));
  fireEvent.click(getByTestId("plus-button"));
  await waitFor(() => expect(getByTestId("emitter-state")).toHaveTextContent("1"));
});

test.todo("it listens for changes on a particular object.path.like.this");

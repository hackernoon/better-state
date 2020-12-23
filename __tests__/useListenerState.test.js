import React from "react";
import { render, fireEvent, waitFor, waitForElementToBeRemoved } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";

import { ListenerState } from "./helpers/test_components";

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

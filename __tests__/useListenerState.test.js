import React from "react";
import { render, fireEvent, waitFor, screen } from "@testing-library/react";
import ReactTestUtils from "react-dom/test-utils";
import "@testing-library/jest-dom/extend-expect";

import { ListenerState } from "./helpers/components";

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
  await waitFor(() => expect(getByTestId("counter-state")).toHaveTextContent("-1"))
});

test.todo("it stops listening for changes");
test.todo("it listens for changes once");
test.todo("it listens for changes on a particular object.path.like.this");

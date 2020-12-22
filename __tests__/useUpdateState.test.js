import React from "react";
import { render, fireEvent, waitFor, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";

import { UpdateState } from "./helpers/components";

test("it updates object state", async () => {
  const { getByTestId } = render(<UpdateState />);

  fireEvent.change(getByTestId("name"), { target: { value: "Foo Bar" } });
  fireEvent.change(getByTestId("address", { target: { value: "1234 Baz St, Exampleville, CA 94555" } }));
  fireEvent.submit(getByTestId("form"));
  await waitFor(expect(getByTestId("address-count")).toHaveTextContent("1"));
});

test.todo("it updates array state");
test.todo("it updates object state with a fieldpath");
test.todo("it updates array state with a fieldpath");
test.todo("it resets state when null is the only parameter");
test.todo("it just writes over primitive state");

import React, { useState } from "react";
import { render, fireEvent, waitFor, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";

import useUpdateState from "../src/useUpdateState";

const Constants = {
  COMPLEX_STATE: "42",
  SIMPLE_STATE: "23",
  NOT_FOUND_STATE: "404"
};

const UpdateState = () => {
  // use regular state for the form fields,
  // and useUpdateState on the overall "database"

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [addressBook, updateAddressBook] = useUpdateState({});
  const [personList, updatePersonList] = useUpdateState([]);
  const [complexObject, updateComplexObject, setComplexObject] = useUpdateState();
  const [complexArray, updateComplexArray] = useUpdateState([]);

  const handleSubmit = (ev) => {
    ev.preventDefault();

    // you could also write `updateAddressBook(name, address)` and it should "just work"
    // but here, we want to show how you can pass an object and it'll merge w/ current state
    const bookEntry = {
      [name]: address
    };

    const newPerson = { name, address };

    updateAddressBook(bookEntry);
    updatePersonList(newPerson);
    setName("");
    setAddress("");
  };

  const complexify = () => {
    updateComplexObject("a.b.c", Constants.COMPLEX_STATE);
  };

  const complexifyArray = () => {
    updateComplexArray("[0].answer", Constants.COMPLEX_STATE);
  };

  const resetComplexObject = () => {
    setComplexObject(null);
  };

  const simplify = () => {
    setComplexObject(Constants.SIMPLE_STATE);
  };

  return (
    <div className="update-state-example">
      <div className="address-count" data-testid="address-count">{Object.keys(addressBook).length}</div>
      <form onSubmit={handleSubmit} data-testid="form">
        <input type="text" name="name" placeholder="name" value={name}
            onChange={ev => setName(ev.target.value)} data-testid="name" />
        <input type="text" name="address" placeholder="address" value={address} 
            onChange={ev => setAddress(ev.target.value)} data-testid="address" />
        <button type="submit" data-testid="submit-btn">Submit</button>
      </form>

      <div className="person-list">
        {personList.map((person, idx) => (
          <div className="person" data-testid={`person-${idx}`} key={idx}>
            <p>Name:&nbsp;<span data-testid={`person-${idx}-name`}>{person.name}</span></p>
            <p>Address:&nbsp;<span data-testid={`person-${idx}-address`}>{person.aaddress}</span></p>
          </div>
        ))}
      </div>

      <div className="complex-state">
        <div className="object-state" data-testid="object-state">{(complexObject === Constants.SIMPLE_STATE) ? complexObject : (complexObject?.a?.b?.c || Constants.NOT_FOUND_STATE)}</div>
        <div className="array-state" data-testid="array-state">{complexArray?.[0]?.answer}</div>

        <div className="complex-state-controls">
          <button className="complexify" data-testid="complexify" onClick={complexify}>++complexity</button>
          <button className="simplify" data-testid="simplify" onClick={simplify}>--complexity</button>
          <button className="complexify-array" data-testid="complexify-array" onClick={complexifyArray}>++complexityArray</button>
          <button className="reset" data-testid="reset" onClick={resetComplexObject}>reset complex object</button>
        </div>
      </div>
    </div>
  );
};

test("it updates object state", async () => {
  const { getByTestId } = render(<UpdateState />);

  const name = "Foo Bar";
  const addr = "314 Pi Circle, Mathtown, MI 48628";

  fireEvent.change(getByTestId("name"), { target: { value: name } });
  await waitFor(() => expect(getByTestId("name").value).toBe(name));

  fireEvent.change(getByTestId("address"), { target: { value: addr } });
  await waitFor(() => expect(getByTestId("address").value).toBe(addr));

  fireEvent.submit(getByTestId("form"));
  await waitFor(() => expect(getByTestId("address-count")).toHaveTextContent("1"));
});

test("it updates array state", async () => {
  const { getByTestId } = render(<UpdateState />);

  const name = "Marty McFly";
  const addr = "248 US Hwy 12, Irish Hills, MI 48586";

  fireEvent.change(getByTestId("name"), { target: { value: name } });
  await waitFor(() => expect(getByTestId("name").value).toBe(name));

  fireEvent.change(getByTestId("address"), { target: { value: addr } });
  await waitFor(() => expect(getByTestId("address").value).toBe(addr));

  fireEvent.submit(getByTestId("form"));
  await waitFor(() => expect(getByTestId("address-count")).toHaveTextContent("1"));

  await waitFor(() => expect(getByTestId("person-0-name")).toHaveTextContent(name));
});

test("it updates object state with a fieldpath", async () => {
  const { getByTestId } = render(<UpdateState />);

  fireEvent.click(getByTestId("complexify"));
  await waitFor(() => expect(getByTestId("object-state")).toHaveTextContent(Constants.COMPLEX_STATE));
});

test("it updates array state with a fieldpath", async () => {
  const { getByTestId } = render(<UpdateState />);

  fireEvent.click(getByTestId("complexify-array"));
  await waitFor(() => expect(getByTestId("array-state")).toHaveTextContent(Constants.COMPLEX_STATE));
});

test("it resets state with the third parameter, the default setState", async () => {
  const { getByTestId } = render(<UpdateState />);

  fireEvent.click(getByTestId("complexify"));
  await waitFor(() => expect(getByTestId("object-state")).toHaveTextContent(Constants.COMPLEX_STATE));

  fireEvent.click(getByTestId("reset"));
  await waitFor(() => expect(getByTestId("object-state")).toHaveTextContent(Constants.NOT_FOUND_STATE));
});

test("it just writes over primitive state", async () => {
  const { getByTestId } = render(<UpdateState />);

  fireEvent.click(getByTestId("complexify"));
  await waitFor(() => expect(getByTestId("object-state")).toHaveTextContent(Constants.COMPLEX_STATE));

  fireEvent.click(getByTestId("simplify"));
  await waitFor(() => expect(getByTestId("object-state")).toHaveTextContent(Constants.SIMPLE_STATE));
});

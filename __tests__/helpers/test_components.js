/* istanbul ignore file */

import React, { useCallback, useEffect, useState } from "react";

import useListenerState from "../../src/useListenerState";
import useUpdateState from "../../src/useUpdateState";

export const UpdateState = () => {
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

  useEffect(() => console.log(personList));

  const complexify = () => {
    updateComplexObject("a.b.c", 123);
  };

  const complexifyArray = () => {
    updateComplexArray("[0].answer", 42);
  };

  const resetComplexObject = () => {
    setComplexObject(null);
  }

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
        <div className="object-state" data-testid="object-state">{complexObject?.a?.b?.c || "404"}</div>
        <div className="array-state" data-testid="array-state">{complexArray?.[0]?.answer}</div>

        <div className="complex-state-controls">
          <button className="complexify" data-testid="complexify" onClick={complexify}>++complexity</button>
          <button className="complexify-array" data-testid="complexify-array" onClick={complexifyArray}>++complexityArray</button>
          <button className="reset" data-testid="reset" onClick={resetComplexObject}>reset complex object</button>
        </div>
      </div>
    </div>
  );
};

export const ListenerState = () => {
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

export default { ListenerState, UpdateState };

/* istanbul ignore file */

import React, { useCallback } from "react";

import useListenerState from "../../src/useListenerState";

export const ListenerState = () => {
  const [counter, setCounter, listeners] = useListenerState(0);

  const plusCounter = useCallback(() => {
    setCounter(counter + 1);
  }, [counter]);

  const addTestListener = useCallback(() => {
    // set a value that could only be set by a callback
    // just as an example, so the test can see the effect
    listeners.on(() => setCounter(-1));
  }, []);

  return (
    <div className="counter-container">
      <div className="state">
        <div className="counter-state" data-testid="counter-state">{counter.toString()}</div>
        <div className="listener-state" data-testid="listener-state">{Object.keys(listeners.callbacks).length}</div>
      </div>
      <div className="counter-controls">
        <button className="plus btn" data-testid="plus-button" onClick={plusCounter}>+</button>
        <button className="add-listener btn" data-testid="listener-button" onClick={addTestListener}>Add Listener</button>
      </div>
    </div>
  );
};

export const UpdateState = () => {
  // use regular state for the form fields,
  // and useUpdateState on the overall "database"

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [addressBook, updateAddressBook] = useUpdateState({});

  const handleSubmit = (ev) => {
    ev.preventDefault();

    // you could also write `updateAddressBook(name, address)` and it should "just work"
    // but here, we want to show how you can pass an object and it'll merge w/ current state
    updateAddressBook({ [name]: address });
    setName("");
    setAddress("");
  };

  return (
    <div className="update-state-example">
      <div className="address-count" data-testid="address-count">{Object.keys(addressBook).length}</div>
      <form onSubmit={handleSubmit}>
        <input type="text" name="name" placeholder="name" value={name}
            onChange={ev => setName(ev.target.value)} data-testid="name" />
        <input type="text" name="address" placeholder="address" value={address} 
            onChange={ev => setAddress(ev.target.value)} data-testid="address" />
        <button type="submit" data-testid="submit-btn">Submit</button>
      </form>
    </div>
  );
};

export default { ListenerState, UpdateState };

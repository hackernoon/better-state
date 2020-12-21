# better-state

A better way to approach state in React.

## Intro

We at [Hacker Noon](https://hackernoon.com/?ref=github.com) found a few problems with the existing state solutions in functional components in React. Namely:

1. `useState` and `useReducer` do not immediately update state. You have to use `useEffect` to know when state has truly changed.
2. `useReducer` is cumbersome to use to manage state. I've done it a million times and hated it every time.
3. `useState` is meant for primitive values, not complex, deeply nested objects.
4. `useContext` is incredibly useful, but also requires a lot of boilerplate.

Hence, we made `better-state`! In `better-state`, there are a few hooks:

- [`useUpdateState`](#use-update-state): a building block that lets us update the state by default instead of setting the whole value (perfect for object state).
- [`useListenerState`](#use-listener-state): allows you to listen for state changes, either on the whole object or on a specific property.
- [`useAwaitState`](#use-await-state): lets you write code like `const nextState = await setState({ ... })` and be sure that the state has changed.
- [`useBetterState`](#use-better-state): the combination of `useListenerState` and `useAwaitState`, you get the best of both worlds.
- [`useSharedState`](#use-shared-state): the granddaddy of them all, lets you use better-state across components.

## Hooks

Here's the documentation so far for the hooks. We'll try to add more examples and codesandboxen and such as we go

### useUpdateState

This hook is more of a building block, but it's an important one, and we believe it can be used to build other tools suitable for deeply nested state objects.

In short, it lets you update a deeply nested object with `a.path.string.like.this` that specifies dot-separated fields, much like Firebase update syntax or Ember's object setters.

Here's how you might use it:

```javascript
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
```

### useListenerState

This hook is the base of the library, really. It allows you to attach state change listeners anywhere in your code, as opposed to a `useEffect`, which must happen at the top level of a component or hook, and must use tertiary state to communicate effects back to the code that needs it.

We prefer a different route, starting with simple state event listeners. Here's how you use it:

```javascript
export default function MyComponent({ initialState }) {
  const [state, setState, listeners] = useListenerState(initialState);  // nothing really different here

  const addListener = (field) => {
    const stateLogger = (newState) => {
      console.log("NEWS OF THE WORLD: ", newState);
    };

    // here's where things get a bit weird
    listeners.on(field, stateLogger);
  };


  return (
    <div className="example">
      <div className="state">{state.count}</div>
      <button className="add-listener btn" onClick={() => addListener("count")}>Add Logger</button>
      <button className="increment btn" onClick={increment}>++counter</button>
    </div>
  )
};
```

### And the rest...

More to come! We're developing v1 of the library as we speak -- check the `v1` branch if you're curious, but please don't use it until it's all been tested. Stay tuned!

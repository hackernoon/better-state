# react-better-state-management

_A better way to approach state in React._

## Intro

I've found a few problems with the existing state solutions in functional components in React. Namely:

1. `useState` and `useReducer` do not immediately update state. You have to use `useEffect` to know when state has truly changed.
2. `useReducer` is cumbersome to use to manage state. I've done it a million times and hated it every time.
3. `useState` is meant for primitive values, not complex, deeply nested objects.
4. `useContext` is incredibly useful, but also requires a lot of boilerplate.

Hence, we have `better-state`! In better state, there will be a few hooks:

- `useListenerState`: allows you to listen for state changes, either on the whole object or on a specific property.
- `useAwaitState`: lets you write code like `const nextState = await setState({ ... })` and be sure that the state has changed.
- `useBetterState`: the combination of `useListenerState` and `useAwaitState`, you get the best of both worlds.
- `useSharedState`: the granddaddy of them all, lets you use better-state across components.

More to come...

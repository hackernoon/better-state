import {useState, useEffect, useCallback, useMemo} from "react";

const defaultInitialState = null;

const useListenerState = (initialState = defaultInitialState) => {
  const [state, setState] = useState(initialState);
  const [listeners, setListeners] = useState([]);

  const addListener = useCallback((fn) => {
    setListeners([...listeners, fn]);
  }, [listeners]);

  const removeListener = useCallback((fn) => {
    setListeners(listeners.filter((l) => l !== fn));
  }, [listeners]);

  const listenOnce = useCallback((fn) => {
    const wrapper = () => {
      fn();
      state.off(wrapper);
    };

    state.on(wrapper);
  }, []);

  useEffect(() => {
    listeners.forEach(listener => listener(state));
  }, [state]);

  state.on = addListener;
  state.off = removeListener;
  state.once = listenOnce;

  return [state, setState];
};

export default useListenerState;

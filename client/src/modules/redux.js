import api from "../api/axios.js";

export function createStore(reducer, initState) {
  let state = initState;
  const listeners = [];

  const getState = () => state;

  const dispatch = async (action) => {
    state = await reducer(state, action);
    listeners.forEach((listener) => listener());
  };

  const subscribe = (listener) => {
    listeners.push(listener);
  };

  return {
    getState,
    dispatch,
    subscribe,
  };
}

// add action
export function addAction(data) {
  return {
    data,
    type: "ADD",
  };
}

// remove action
export function removeAction(data) {
  return {
    data,
    type: "REMOVE",
  };
}

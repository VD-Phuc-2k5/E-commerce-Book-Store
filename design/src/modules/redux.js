export function createStore(reducer, initState) {
  let state = initState;
  const listeners = [];

  const getState = () => state;

  const dispatch = (action) => {
    state = reducer(state, action);
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

export function storeData(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

export function createStore(reducer) {
  let state = reducer(undefined, {});
  const subscribers = [];
  return {
    getState() {
      return state;
    },
    dispatch(action) {
      state = reducer(state, action);
      subscribers.forEach((subscriber) => subscriber());
    },
    subscribe(subscriber) {
      subscribers.push(subscriber);
    },
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

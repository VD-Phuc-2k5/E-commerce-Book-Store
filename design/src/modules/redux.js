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

export async function storeData(key, data) {
  if (!data) {
    const response = await api.get(`cart/${data.id}`);
    if (response.status === 200) {
      const cartResponse = await api.put(`cart/${data.id}`, data);
      return cartResponse.data;
    } else {
      const deleteResponse = await api.delete(`cart/${data.id}`);
      return deleteResponse.data;
    }
  }
}

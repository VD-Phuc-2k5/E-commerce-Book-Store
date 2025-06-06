const API_URL = "http://localhost:3000";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
    "Cache-Control": "no-cache, no-store, must-revalidate",
    Pragma: "no-cache",
    Expires: "0",
  },
  //   withCredentials: true,
});

api.interceptors.request.use((config) => {
  const separator = config.url?.includes("?") ? "&" : "?";
  config.url = `${config.url}${separator}_t=${new Date().getTime()}`;
  return config;
});

export async function get(url) {
  const getResponse = await api.get(url);
  if (getResponse.status === 200) {
    return getResponse.data;
  } else {
    throw new Error(`GET request failed with status ${getResponse.status}`);
  }
}

export async function post(url, data) {
  const postResponse = await api.post(url, data);
  if (postResponse.status === 200 || postResponse.status === 201) {
    return postResponse.data;
  } else {
    throw new Error(`POST request failed with status ${postResponse.status}`);
  }
}

export async function put(url, data) {
  const putResponse = await api.put(url, data);
  if (putResponse.status === 200) {
    return putResponse.data;
  } else {
    throw new Error(`PUT request failed with status ${putResponse.status}`);
  }
}

export async function del(url) {
  const deleteResponse = await api.delete(url);
  if (deleteResponse.status === 200 || deleteResponse.status === 204) {
    return deleteResponse.data;
  } else {
    throw new Error(
      `DELETE request failed with status ${deleteResponse.status}`
    );
  }
}

export default api;

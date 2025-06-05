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

export default api;

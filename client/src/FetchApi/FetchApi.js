import { routes } from "../routes.js";

const fetchAPi = async (routesId) => {
  const API_URL = "http://localhost:3000";
  const route = Object.entries(routes).find(([_, id]) => id === routesId)[0];

  return fetch(`${API_URL}/${route}`).then((res) => res.json());
};

export default fetchAPi;

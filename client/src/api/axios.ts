import axios from "axios";

const baseURL = "";
const token = sessionStorage.getItem("token");

export default axios.create({
  baseURL: baseURL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  },
});

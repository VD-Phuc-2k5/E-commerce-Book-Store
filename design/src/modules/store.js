// stateManager.js
import { createStore } from "./redux.js";
import cartReducer from "./cart.js";
import wishListReducer from "./wishlist.js";
import bookReducer from "./book.js";
import api from "../api/axios.js";

const initCartValues = JSON.parse(localStorage.getItem("cartItems") ?? "[]");
const initWishValues = JSON.parse(
  localStorage.getItem("wishListItems") ?? "[]"
);

let cartStore = createStore(cartReducer, initCartValues);
let wishStore = createStore(wishListReducer, initWishValues);

const API_URL = "http://localhost:3000";

// Hàm để khởi tạo bookStore
async function initializeBookStore() {
  try {
    const response = await api.get("/books");
    const books = response.data;
    return createStore(bookReducer, books);
  } catch (error) {
    return createStore(bookReducer, []);
  }
}

// Xuất các hàm getter
export const getCartStore = () => cartStore;
export const getWishStore = () => wishStore;
export const getBookStore = async () => {
  return initializeBookStore().then((bookStore) => bookStore);
};

initializeBookStore();

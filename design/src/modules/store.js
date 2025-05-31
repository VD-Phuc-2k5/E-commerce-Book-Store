// stateManager.js
import { createStore } from "./redux.js";
import cartReducer from "./cart.js";
import wishListReducer from "./wishlist.js";
import bookReducer from "./book.js";
import csvToJson from "./csvToJson.js";
import { classifyCategories, removeDuplicateBooks } from "./book.js";

const initCartValues = JSON.parse(localStorage.getItem("cartItems") ?? "[]");
const initWishValues = JSON.parse(
  localStorage.getItem("wishListItems") ?? "[]"
);

let cartStore = createStore(cartReducer, initCartValues);
let wishStore = createStore(wishListReducer, initWishValues);

// Hàm để khởi tạo bookStore
async function initializeBookStore() {
  try {
    const response = await fetch("../../data/book_data.csv");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const csv = await response.text();

    return createStore(
      bookReducer,
      removeDuplicateBooks(classifyCategories(csvToJson(csv)))
    );
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

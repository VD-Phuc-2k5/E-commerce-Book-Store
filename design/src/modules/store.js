// stateManager.js
import { createStore } from "./redux.js";
import cartReducer from "./cart.js";
import wishListReducer from "./wishlist.js";
import bookReducer from "./book.js";
import { get } from "../api/axios.js";

const initCart = await get("cart");
const initWishList = await get("wishlist");

let cartStore = createStore(cartReducer, initCart);
let wishStore = createStore(wishListReducer, initWishList);

// Hàm để khởi tạo bookStore
async function initializeBookStore() {
  try {
    const books = await get("books");
    return createStore(bookReducer, books ?? []);
  } catch {
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

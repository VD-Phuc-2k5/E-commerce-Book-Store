// stateManager.js
import { createStore } from "./redux.js";
import cartReducer from "./cart.js";
import wishListReducer from "./wishlist.js";

const initCartValues = JSON.parse(localStorage.getItem("cartItems") ?? "[]");
const initWishValues = JSON.parse(
  localStorage.getItem("wishListItems") ?? "[]"
);
const cartStore = createStore(cartReducer, initCartValues);
const wishStore = createStore(wishListReducer, initWishValues);

export const getCartStore = () => cartStore;
export const getWishStore = () => wishStore;

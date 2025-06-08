// stateManager.js
import { createStore } from "./redux.js";
import cartReducer from "./cart.js";
import wishListReducer from "./wishlist.js";
import { get } from "../api/axios.js";

const initCart = await get("cart");
const initWishList = await get("wishlist");

let cartStore = createStore(cartReducer, initCart.data);
let wishStore = createStore(wishListReducer, initWishList);

// Xuất các hàm getter
export const getCartStore = () => cartStore;
export const getWishStore = () => wishStore;

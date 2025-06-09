import { loadDB } from "../db.js";

export async function getCheckoutItems(req, res) {
  const db = await loadDB();
  const cartItems = db.data.cart;
  return res.status(200).json({
    data: cartItems,
  });
}

import { loadDB } from "../db.js";

// GET /cart
export async function getCart(req, res) {
  const db = await loadDB();
  return res.status(200).json({
    data: db.data.cart,
  });
}

// POST /cart
export async function addToCart(req, res) {
  const db = await loadDB();
  const { id, title, author, cost, quantity } = req.body;
  const cartItem = { id, title, author, cost, quantity, createAt: Date.now() };
  db.data.cart.push(cartItem);
  await db.write();
  return res.status(201).json({
    data: cartItem,
  });
}

// PUT /cart/:id
export async function updateCart(req, res) {
  const db = await loadDB();
  const { id } = req.params;
  const { quantity } = req.body;

  const cartItem = db.data.cart.find((item) => item.id == id);
  if (!cartItem) {
    return res.status(404).json({ message: "Cart item not found" });
  }

  cartItem.quantity = quantity;
  await db.write();
  return res.status(200).json({ data: cartItem });
}

// DELETE /cart/:id
export async function deleteFromCart(req, res) {
  const db = await loadDB();
  const { id } = req.params;

  const deletedItem = db.data.cart.find((item) => item.id == id);
  if (!deletedItem) {
    return res.status(404).json({ message: "Cart item not found" });
  }

  db.data.cart = db.data.cart.filter((item) => item.id != id);
  await db.write();

  return res.status(200).json({ data: deletedItem });
}

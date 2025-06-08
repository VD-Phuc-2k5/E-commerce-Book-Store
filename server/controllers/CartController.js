import { loadDB } from "../db.js";
import getCurrentDateTime from "../modules/getCurrentDate.js";

// GET /cart
export async function getCart(req, res) {
  const db = await loadDB();
  const { page = 1, limit = 10 } = req.query;

  const cartItems = db.data.cart;

  // Phân trang
  const pageNum = parseInt(page);
  const limitNum = Math.max(parseInt(limit), 1);
  const total = cartItems.length;
  const pages = Math.ceil(total / limitNum);
  const startIndex = (pageNum - 1) * limitNum;
  const paginatedResults = cartItems.slice(startIndex, startIndex + limitNum);

  return res.status(200).json({
    data: {
      total,
      page: pageNum,
      pages,
      limit: limitNum,
      data: paginatedResults,
    },
  });
}

// POST /cart
export async function addToCart(req, res) {
  const db = await loadDB();
  await db.update(({ cart }) =>
    cart.push({
      ...req.body,
      createdAt: getCurrentDateTime(),
    })
  );
  return res.status(201).json({
    data: {
      ...req.body,
      createdAt: getCurrentDateTime(),
    },
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

  console.log(`DELETE ${id} FROM CART`);

  const deletedItem = db.data.cart.find((item) => item.id == id);
  if (!deletedItem) {
    return res.status(404).json({ message: "Cart item not found" });
  }

  db.data.cart = db.data.cart.filter((item) => item.id !== id);
  await db.write();
  return res.status(200).json({ data: deletedItem });
}

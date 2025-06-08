import { loadDB } from "../db.js";
import getCurrentDateTime from "../modules/getCurrentDate.js";

// GET /wishlist
export async function getWishList(req, res) {
  console.log("GET WishList");
  const db = await loadDB();
  return res.status(200).json({
    data: db.data.wishlist,
  });
}

// POST /WishList
export async function addToWishList(req, res) {
  console.log("ADD TO WISHLIST");
  const db = await loadDB();
  await db.update(({ wishlist }) =>
    wishlist.push({
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

// DELETE /WishList/:id
export async function deleteFromWishList(req, res) {
  const db = await loadDB();
  const { id } = req.params;

  console.log(`DELETE ${id} FROM WISHLIST`);

  const deletedItem = db.data.wishlist.find((item) => item.id == id);
  if (!deletedItem) {
    return res.status(404).json({ message: "WishList item not found" });
  }

  db.data.wishlist = db.data.wishlist.filter((item) => item.id !== id);
  await db.write();
  return res.status(200).json({ data: deletedItem });
}

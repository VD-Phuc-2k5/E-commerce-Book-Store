import { loadDB } from "../db.js";

export async function getCategory(req, res) {
  const db = await loadDB();
  return res.status(200).json({
    data: {
      data: db.data.category_tree,
    },
  });
}

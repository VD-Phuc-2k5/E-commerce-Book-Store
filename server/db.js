import { JSONFilePreset } from "lowdb/node";

const defaultData = {
  books: [],
  cart: [],
  wishlist: [],
  category_tree: [],
  articles: [],
  accounts: [],
};

const db = await JSONFilePreset("db.json", defaultData);

export async function loadDB() {
  await db.read();
  return db;
}

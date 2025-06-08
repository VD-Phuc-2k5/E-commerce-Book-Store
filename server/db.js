import { JSONFilePreset } from "lowdb/node";

const defaultData = {
  books: [],
  cart: [],
  wishlist: [],
};

const db = await JSONFilePreset("db.json", defaultData);

export async function loadDB() {
  await db.read();
  return db;
}

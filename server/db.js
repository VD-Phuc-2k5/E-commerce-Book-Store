import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";

export async function loadDB() {
  const adapter = new JSONFile("db.json");
  const db = new Low(adapter);
  await db.read();

  db.data ||= {
    books: [],
    cart: [],
    wishlist: [],
  };

  return db;
}

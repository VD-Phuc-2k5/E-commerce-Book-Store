import { loadDB } from "../db.js";

export async function getAccounts(req, res) {
  const db = await loadDB();
  return res.status(200).json({
    data: db.data.accounts,
  });
}

export async function signUp(req, res) {
  const db = await loadDB();
  db.data.accounts.push(req.body);
  await db.write();
  return res.status(201).json({
    message: "tao tai khoan thanh cong",
  });
}

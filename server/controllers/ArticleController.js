import { loadDB } from "../db.js";

export async function getArticle(_, res) {
    const db = await loadDB();
    let articles = db.data.articles || [];
    return res.status(200).json({ data: articles })
}
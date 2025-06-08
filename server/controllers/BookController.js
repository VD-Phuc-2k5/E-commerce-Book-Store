import applyExactFilters from "../modules/applyExactFilters.js";
import applyCostRangeFilter from "../modules/applycostRangeFilter.js";
import createFuse from "../modules/createFuseObj.js";
import { loadDB } from "../db.js";

// GET /books
export async function getBooks(req, res) {
  const {
    title,
    author,
    category,
    avg_rating,
    minCost,
    maxCost,
    search,
    page = 1,
    limit = 10,
  } = req.query;

  const db = await loadDB();
  let results = db.data.books || [];

  if (search) {
    const fuse = createFuse(results, [
      "title",
      "author",
      "category",
      "avg_rating",
    ]);
    results = fuse.search(search).map((r) => r.item);
  } else {
    results = applyExactFilters(results, {
      title,
      author,
      category,
      avg_rating,
    });
  }

  // Lọc theo khoảng giá
  if (minCost || maxCost) {
    results = applyCostRangeFilter(results, minCost, maxCost);
  }

  // Phân trang
  const pageNum = parseInt(page);
  const limitNum = Math.max(parseInt(limit), 1);
  const total = results.length;
  const pages = Math.ceil(total / limitNum);
  const startIndex = (pageNum - 1) * limitNum;
  const paginatedResults = results.slice(startIndex, startIndex + limitNum);

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

export async function getBookById(req, res) {
  const { id } = req.params;
  const db = await loadDB();
  const books = db.data.books || [];
  const book = books.find((b) => String(b.id) === String(id));

  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }

  return res.status(200).json({ data: book });
}

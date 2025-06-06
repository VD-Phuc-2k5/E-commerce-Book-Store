import fs from "fs";
import path from "path";

function saveFile(data, fileName) {
  // Lưu toàn bộ dữ liệu vào file JSON
  const outputDir = path.join(process.cwd(), "data");
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const outputPath = path.join(outputDir, fileName);
  fs.writeFileSync(outputPath, JSON.stringify(data, null, 2), "utf8");

  console.log(`✅ Đã ưu thành công vào file ${outputPath}`);
}

// 1. Đọc dữ liệu từ file JSON
const data = fs.readFileSync("./db.json", "utf-8");
let bookData = JSON.parse(data);

bookData = bookData.filter((book) => book?.id === 0 || book?.id);

// 2. Gán ID từ spid hoặc tạo mới
function extractOrGenerateId(book, existingIds) {
  try {
    const url = new URL(book.link);
    const spid = url.searchParams.get("spid");
    const idFromUrl = spid ? parseInt(spid, 10) : null;

    if (idFromUrl && !existingIds.has(idFromUrl)) {
      return idFromUrl;
    }

    // Nếu không có spid hoặc spid đã tồn tại
    let newId = 1;
    while (existingIds.has(newId)) {
      newId++;
    }
    return newId;
  } catch (err) {
    console.error("Invalid URL:", book.link);
    // fallback tạo ID nếu URL bị lỗi
    let fallbackId = 1;
    while (existingIds.has(fallbackId)) {
      fallbackId++;
    }
    return fallbackId;
  }
}

// 3. Gán ID và lưu vào mảng mới
const existingIds = new Set();
const booksWithIds = bookData.map((book) => {
  const id = extractOrGenerateId(book, existingIds);
  existingIds.add(id);
  return { ...book, id };
});

// 4. Loại bỏ các sản phẩm trùng ID (giữ lại bản đầu tiên)
const uniqueBooksMap = new Map();
booksWithIds.forEach((book) => {
  if (!uniqueBooksMap.has(book.id)) {
    uniqueBooksMap.set(book.id, book);
  }
});

const uniqueBooks = Array.from(uniqueBooksMap.values());
console.log(`✅ Done! Số sách sau khi xử lý: ${uniqueBooks.length}`);

saveFile(
  uniqueBooks.map(({ id, link, ...book }) => {
    const cost = book?.cost ?? 0;
    const discount = book?.discount ?? 0;
    return {
      id: String(id),
      title: book?.title ?? "",
      author: book?.author ?? "",
      cost,
      discount,
      quantity: book?.quantity ?? 0,
      category: book?.category ?? "",
      n_review: book?.n_rating ?? 0,
      avg_rating: book?.rating ?? 0,
      manufacturer: book?.manufacturer ?? "",
      imgUrl: book?.imgUrl ?? "",
      description: book?.description ?? "",
    };
  }),
  "db.json"
);

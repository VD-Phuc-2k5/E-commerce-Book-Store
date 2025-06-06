import { getBookStore } from "./store.js";
import { get } from "../api/axios.js";

// Hàm để trộn ngẫu nhiên một mảng (thuật toán Fisher-Yates)
export function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

async function getBooks(n) {
  const [topSellingRes, bookStore] = await Promise.all([
    get("/books?avg_rating=5"),
    getBookStore(),
  ]);

  const topSellingBooksRaw = topSellingRes;
  const shuffledTopSelling = shuffleArray([...topSellingBooksRaw]);

  const carousel = shuffledTopSelling.slice(0, 8);
  const topSellingBooks = shuffledTopSelling.slice(0, 9);

  return {
    carousel,
    home: [
      {
        title: "What's Good",
        books: topSellingBooks,
      },
    ],
  };
}

export default getBooks;

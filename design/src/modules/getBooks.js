import { getBookStore } from "./store.js";
import api from "../api/axios.js";

// Hàm để trộn ngẫu nhiên một mảng (thuật toán Fisher-Yates)
export function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

async function getBooks(n) {
  const restopSellingBooks = await api.get("/books?avg_rating=5");
  const topSellingBooks = restopSellingBooks.data;
  const books = (await getBookStore()).getState();
  const randomBooks = shuffleArray([...books]).slice(0, n);

  return {
    carousel: shuffleArray([...topSellingBooks]).slice(0, 8),
    home: [
      {
        title: "What's Good",
        books: shuffleArray([...topSellingBooks]).slice(0, 9),
      },
      {
        title: "New Arrival",
        books: randomBooks,
      },
    ],
  };
}

export default getBooks;

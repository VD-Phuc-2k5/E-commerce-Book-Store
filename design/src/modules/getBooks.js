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
  const [topSellingRes, randomBookRes] = await Promise.all([
    get("books?avg_rating=5&page=1&limit=9"),
    get(`books?page=1&limit=${n}`),
  ]);

  const shuffledTopSelling = shuffleArray([...randomBookRes.data]);
  const carousel = shuffledTopSelling.slice(0, 8);

  return {
    carousel,
    home: [
      {
        title: "What's Good",
        books: topSellingRes.data,
      },
    ],
  };
}

export default getBooks;

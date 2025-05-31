import { getBookStore } from "./store.js";

// Hàm để trộn ngẫu nhiên một mảng (thuật toán Fisher-Yates)
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

async function getBooks(n) {
  const books = (await getBookStore()).getState();

  // Lọc sách có avg_rating từ 4-5 sao
  const highRatedBooks = books.filter((book) => {
    const rating = parseFloat(book.avg_rating);
    return rating >= 4.0 && rating <= 5.0;
  });

  // Sắp xếp theo số luong review
  const sortedByPopularity = [...highRatedBooks].sort((a, b) => {
    return parseInt(b.n_review) - parseInt(a.n_review);
  });

  // Lấy 100 sách bán chạy nhất
  const topSellingBooks = sortedByPopularity.slice(0, n);

  // Tạo một Set chứa product_id của các sách bán chạy để kiểm tra trùng lặp
  const topSellingIds = new Set(topSellingBooks.map((book) => book.product_id));

  // Lọc ra các sách không nằm trong danh sách bán chạy
  const otherBooks = books.filter(
    (book) => !topSellingIds.has(book.product_id)
  );

  // Trộn ngẫu nhiên các sách còn lại
  const shuffledBooks = shuffleArray([...otherBooks]);

  // Lấy 100 sách ngẫu nhiên
  const randomBooks = shuffledBooks.slice(0, n);

  // Định dạng kết quả theo yêu cầu
  return {
    carousel: shuffleArray([...highRatedBooks]).slice(0, 8),
    home: [
      {
        title: "What's Good",
        books: topSellingBooks,
      },
      {
        title: "New Arrival",
        books: randomBooks,
      },
    ],
  };
}

export default getBooks;

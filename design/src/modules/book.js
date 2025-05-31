function bookReducer(state, action) {
  switch (action.state) {
    default:
      return state;
  }
}

export function removeDuplicateBooks(books) {
  const uniqueBooksMap = new Map();

  books.forEach((book) => {
    uniqueBooksMap.set(book.product_id, book);
  });

  return Array.from(uniqueBooksMap.values());
}

export function classifyCategories(books) {
  const categories = {
    Fiction: [
      "Tiểu Thuyết",
      "Truyện dài",
      "Truyện ngắn - Tản văn - Tạp Văn",
      "Truyện Giả tưởng - Huyền Bí - Phiêu Lưu",
      "Truyện trinh thám",
      "Truyện kể cho bé",
      "Truyện đam mỹ",
      "Truyện ngôn tình",
      "Truyện kinh dị",
      "Truyện tranh",
      "Truyện cười",
      "Truyện kiếm hiệp",
      "Light novel",
    ],
    "Non-Fiction": [
      "Sách tư duy - Kỹ năng sống",
      "Sách kinh tế học",
      "Sách tài chính",
      "Sách Học Tiếng Anh",
      "Sách Học Tiếng Hoa",
      "Sách Học Tiếng Nhật",
      "Sách Học Tiếng Hàn",
      "Sách hướng nghiệp - Kỹ năng mềm",
      "Sách giáo dục",
      "Sách Làm Cha Mẹ",
      "Sách phong tục - Tập quán",
      "Sách phong thủy - Kinh Dịch",
      "Sách khởi nghiệp",
      "Sách tham khảo cấp II",
      "Sách Làm Đẹp",
      "Sách nấu ăn",
      "Sách tâm lý tuổi teen",
      "Sách chiêm tinh - Horoscope",
      "Sách nghệ thuật sống đẹp",
    ],
    Classic: ["Tác phẩm kinh điển"],
    Adventure: ["Du ký", "Truyện phiêu lưu", "Truyện giả tưởng"],
    Mystery: ["Truyện trinh thám", "Thám Tử Lừng Danh Conan"],
    Science: ["Sách khoa học", "Sách sinh học", "Sách vật lý"],
    History: ["Lịch Sử Thế Giới", "Lịch Sử Việt Nam"],
    "Self-Help": [
      "Sách tư duy - Kỹ năng sống",
      "Sức Mạnh Của Tĩnh Lặng",
      "Thiền Tập Cho Người Bận Rộn",
    ],
    Children: ["Văn học thiếu nhi", "Truyện kể cho bé"],
    Romance: ["Truyện ngôn tình", "Tình Đầu Nhạt Phai"],
    Comics: ["Truyện tranh", "Manga", "Light novel"],
    Philosophy: ["Triết Học"],
    Health: ["Y Học Dinh Dưỡng", "Sức Mạnh Của Tĩnh Lặng"],
    Cooking: ["Sách nấu ăn"],
    Art: ["Mỹ Thuật - Kiến Trúc"],
    Business: ["Bài học kinh doanh", "Sách marketing - Bán hàng"],
    Travel: ["Sách Địa Danh - Du Lịch"],
    Uncategorized: [],
  };

  books.forEach((book) => {
    const title = book.category.toLowerCase();
    let assignedCategory = "Uncategorized";

    // Kiểm tra nếu category chỉ là số hoặc undefined
    if (
      !isNaN(book.category) ||
      !book?.category ||
      book.category.trim() === ""
    ) {
      assignedCategory = "Uncategorized";
    } else {
      let foundCategory = false;
      for (const [category, keywords] of Object.entries(categories)) {
        if (keywords.some((keyword) => title.includes(keyword.toLowerCase()))) {
          assignedCategory = category;
          foundCategory = true;
          break;
        }
      }
    }

    // Cập nhật thể loại cho sách
    book.category = assignedCategory;
  });

  return books;
}

export default bookReducer;

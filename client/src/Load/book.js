// load book

export function loadBookDetail(API_URL, bookId) {
  const loadinghandle = (book) => {
    const book = books.find((b) => b.id === bookId);
    if (!book) return;

    document.getElementById("bookDetailTitle").textContent = book.name;
    document.getElementById("bookDetailName").textContent = book.name;
    document.getElementById("bookDetailImage").src = book.image;
    document.getElementById("bookDetailImage").alt = book.name;
    document.getElementById("bookDetailPrice").textContent = formatCurrency(
      book.price
    );
    document.getElementById("bookDetailOldPrice").textContent = formatCurrency(
      book.oldPrice
    );
    document.getElementById("bookDetailDiscount").textContent = `-${Math.round(
      (1 - book.price / book.oldPrice) * 100
    )}%`;
    document.getElementById("bookDetailAuthor").textContent = book.author;
    document.getElementById("bookDetailPublisher").textContent = book.publisher;
    document.getElementById("bookDetailPages").textContent = book.pages;
    document.getElementById("bookDetailStatus").textContent = book.status;
    document.getElementById("bookDetailRating").innerHTML = getStarsHTML(
      book.rating
    );
    document.getElementById(
      "bookDetailReviewCount"
    ).textContent = `(${book.reviews} đánh giá)`;
    document.getElementById("bookDetailDescription").textContent =
      book.description;
    document.getElementById("bookDetailISBN").textContent = book.isbn;
    document.getElementById("bookDetailYear").textContent = book.year;
    document.getElementById("bookDetailLanguage").textContent = book.language;
    document.getElementById("bookDetailDimensions").textContent =
      book.dimensions;
    document.getElementById("bookDetailWeight").textContent = book.weight;
    document.getElementById("bookDetailCover").textContent = book.cover;

    // Reset quantity input
    document.getElementById("quantityInput").value = 1;

    // Update add to cart button
    const addToCartBtn = document.getElementById("addToCartBtn");
    addToCartBtn.onclick = () => {
      const quantity = parseInt(document.getElementById("quantityInput").value);
      addToCart(book.id, quantity);
    };

    // Load categories
    const category = categories.find((c) => c.id === book.category);
    if (category) {
      document.getElementById("bookDetailCategories").innerHTML = `
                      <a href="#" class="category-badge">${category.name}</a>
                  `;
    }
  };

  // fetch api to loading book details
  fetch(`${API_URL}/books`)
    .then((res) => res.json())
    .then((book) => loadinghandle(book));
}

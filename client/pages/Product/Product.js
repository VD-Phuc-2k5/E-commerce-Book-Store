import { getCartStore } from "../../src/modules/store.js";
import priceFormat from "../../src/modules/priceFormat.js";
import createProduct from "../../src/modules/createProductDom.js";
import { addAction } from "../../src/modules/redux.js";
import capitalizeWords from "../../src/modules/capitalizeWords.js";
import { shuffleArray } from "../../src/modules/getBooks.js";
import pagination from "../../src/modules/pagination.js";
import { get } from "../../src/api/axios.js";

// Quantity controls
function increaseQuantity() {
  const quantityInput = document.getElementById("quantity");
  const currentValue = parseInt(quantityInput.value);
  if (currentValue < parseInt(quantityInput.max)) {
    quantityInput.value = currentValue + 1;
  }
}

function decreaseQuantity() {
  const quantityInput = document.getElementById("quantity");
  const currentValue = parseInt(quantityInput.value);
  if (currentValue > parseInt(quantityInput.min)) {
    quantityInput.value = currentValue - 1;
  }
}

// Function to generate star rating HTML based on avg_rating without rounding
function generateStarRating(rating) {
  const fullStars = Math.floor(rating);
  const partialFill = rating % 1;
  let starsHTML = "";

  // Generate full stars
  for (let i = 0; i < fullStars; i++) {
    starsHTML +=
      '<span class="star-rating"><i class="fa-solid fa-star"></i></span>';
  }

  // Generate partial star if needed (using text to show percentage)
  if (partialFill > 0) {
    const percentage = Math.round(partialFill * 100);
    starsHTML += `<span class="star-rating" title="${percentage}%"><i class="fa-solid fa-star-half-stroke"></i></span>`;
  }

  // Generate empty stars
  const emptyStars = 5 - fullStars - (partialFill > 0 ? 1 : 0);
  for (let i = 0; i < emptyStars; i++) {
    starsHTML +=
      '<span class="star-rating"><i class="fa-regular fa-star"></i></span>';
  }

  return starsHTML;
}

function renderBooks(books, selector) {
  shuffleArray(...[books]).forEach((book) => {
    const bookElement = createProduct(
      book.id,
      book.imgUrl,
      book.title,
      book.author,
      book.cost,
      book.description.substring(0, 100) + "...",
      ["col-lg-4", "col-md-6", "col-12"]
    );
    selector.appendChild(bookElement);
  });
}

async function productPage() {
  const productPage = document.querySelector("#product_page");
  // Get the current URL
  const currentUrl = window.location.href;
  // Create a URL object
  const url = new URL(currentUrl);
  // Use URLSearchParams to get the query parameters
  const params = new URLSearchParams(url.search);
  // Get specific parameters
  const product_id = params.get("id");

  const bookResponse = await get(`/books/${product_id}`);

  const {
    id,
    title,
    author,
    cost,
    discount,
    quantity,
    category,
    n_review,
    avg_rating,
    manufacturer,
    imgUrl,
    description,
  } = bookResponse;

  const old_cost =
    discount === 0 ? cost : Math.floor(cost * (1 - discount / 100));

  if (productPage) {
    productPage.innerHTML = `
        <!-- Breadcrumb -->
          <nav class="breadcrumb" id="breadcrumb">
            <div class="breadcrumb-list">
              <a href="/" class="breadcrumb-link">Trang chủ</a>
              <span>/</span>
              <a href="/all-books" class="breadcrumb-link">Sách</a>
              <span>/</span>
              <a href="/all-books?category=${category}" class="breadcrumb-link">${category}</a>
              <span>/</span>
              <span class="breadcrumb-current">${title}</span>
            </div>
          </nav>
    
          <!-- Main Product Section -->
          <div class="product-section container-fluid">
            <div class="row">
              <!-- Product Image -->
              <div class="product-image-container col-lg-5 col-12"></div>
    
              <!-- Product Details -->
              <div class="product-details col-lg-7 col-12">
                <div>
                  <h1 class="product-title">${title}</h1>
                  <p class="product-author ${author == "" ? "no-author" : ""}">
                    By <span class="author-name">${capitalizeWords(
                      author
                    )}</span>
                  </p>
                </div>
    
                <!-- Price -->
                <div class="price-container">
                  <span class="current-price">${priceFormat(cost)}</span>
                  <span class="original-price ${
                    discount == 0 ? "no-discount" : ""
                  }">${priceFormat(old_cost)}</span>
                  <span class="discount-badge ${
                    discount == 0 ? "no-discount" : ""
                  }">${discount}%
                  </span>
                </div>
    
                <!-- Rating -->
                <div class="rating-container">
                  ${generateStarRating(avg_rating)}
                  <span class="rating-count">(${priceFormat(
                    n_review
                  )} đánh giá)</span>
                </div>
    
                <!-- Quantity Selector -->
                <div class="quantity-section">
                  <label class="quantity-label">Số lượng:</label>
                  <div class="quantity-controls">
                    <button class="quantity-btn">-</button>
                    <input
                      type="number"
                      id="quantity"
                      value="1"
                      min="1"
                      max="10"
                      class="quantity-input" />
                    <button class="quantity-btn">+</button>
                  </div>
                </div>
    
                <!-- Stock Status -->
                <div class="stock-status">
                  <span class="stock-indicator"></span>
                  <span class="stock-text">Còn hàng: ${priceFormat(
                    quantity
                  )} sản phẩm</span>
                </div>
    
                <!-- Product Info -->
                <div class="product-info">
                  <div class="info-row">
                    <span class="info-label">Thể loại:</span>
                    <span class="info-value">${category}</span>
                  </div>
                  <div class="info-row">
                    <span class="info-label">Nhà xuất bản:</span>
                    <span class="info-value">${manufacturer}</span>
                  </div>
                  <div class="info-row">
                    <span class="info-label">Mã sản phẩm:</span>
                    <span class="info-value">#${id}</span>
                  </div>
                </div>
    
                <!-- Add to Cart Button -->
                <button class="add-to-cart-btn">
                  <i class="fa-solid fa-cart-shopping"></i>
                  <span>${
                    getCartStore()
                      .getState()
                      .find((item) => item.id === id)
                      ? "Update To Cart"
                      : "Add To Cart"
                  } </span>
                </button>
              </div>
            </div>
            
          <!-- Description Section -->
          <section class="description-section">
            <h2 class="description-title">Mô tả sản phẩm</h2>
              <div class="description-text collapsed" id="descriptionText">
                ${description}
              </div>
              <button class="read-more-btn" id="readMoreBtn">
                <i class="fas fa-chevron-down"></i>
                <span>Xem thêm</span>
              </button>
            </section>
          </div>
    
          <!-- Related Products Section -->
          <div class="related-section">
            <h2 class="related-title">Sản phẩm liên quan</h2>
            <div class="row" id="related-products-container">
              <div id="page-container" class="page-container col-12">
                <div class="page-slide col-12">
                  <div class="row page col-12"></div>
                </div>
              </div>

              <div
                class="d-flex flex-column flex-md-row justify-content-center align-items-center mt-4">
                <nav aria-label="Page navigation">
                  <ul id="pagination" class="pagination">
                  </ul>
                </nav>
              </div>
            </div>
          </div>
        `;
    const quantityBtns = document.querySelectorAll(".quantity-btn");
    quantityBtns[0].addEventListener("click", () => {
      decreaseQuantity();
    });

    quantityBtns[1].addEventListener("click", () => {
      increaseQuantity();
    });

    // add curr book to wishlist
    const productImgWrap = document.querySelector(".product-image-container");
    productImgWrap.appendChild(
      createProduct(id, imgUrl, title, author, cost, description)
    );

    // add curr book to cart
    const addToCartBtn = document.querySelector(".add-to-cart-btn");
    if (addToCartBtn) {
      addToCartBtn.addEventListener("click", () => {
        const quantityInput = document.getElementById("quantity");
        const action = addAction({
          id,
          imageUrl: imgUrl,
          title,
          author,
          cost,
          quantity: Number(quantityInput.value),
        });
        getCartStore().dispatch(action);
      });
    }

    pagination(6, encodeURI(`books?category=${category}`), renderBooks, 2);

    // Read more functionality
    const descriptionText = document.getElementById("descriptionText");
    const readMoreBtn = document.getElementById("readMoreBtn");

    readMoreBtn.addEventListener("click", () => {
      if (descriptionText.classList.contains("collapsed")) {
        descriptionText.classList.remove("collapsed");
        descriptionText.classList.add("expanded");
        readMoreBtn.innerHTML =
          '<i class="fas fa-chevron-up"></i><span>Thu gọn</span>';
      } else {
        descriptionText.classList.remove("expanded");
        descriptionText.classList.add("collapsed");
        readMoreBtn.innerHTML =
          '<i class="fas fa-chevron-down"></i><span>Xem thêm</span>';
      }
    });

    // prevent default event of tag a
    const aEl = document.querySelectorAll("a");
    aEl.forEach((aDom) => {
      aDom.addEventListener("click", (e) => {
        e.preventDefault();
        window.appRouter.navigate(
          encodeURI(e.currentTarget.getAttribute("href"))
        );
      });
    });
  }
}

productPage();

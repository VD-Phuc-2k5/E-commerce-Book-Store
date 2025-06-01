import { getBookStore, getCartStore } from "../../src/modules/store.js";
import priceFormat from "../../src/modules/priceFormat.js";
import createProduct from "../../src/modules/createProductDom.js";
import { addAction } from "../../src/modules/redux.js";
import setFireworks from "../../src/modules/setFireworks.js";

// Quantity controls
function increaseQuantity() {
  const quantityInput = document.getElementById("quantity");
  const currentValue = parseInt(quantityInput.value);
  if (currentValue < parseInt(quantityInput.max)) {
    quantityInput.value = currentValue + 1;
  }
}

function getRandomRelatedProducts(books, currentProductId, count = 4) {
  // Filtrar para excluir el producto actual
  const availableProducts = books.filter(
    (book) => book.product_id !== currentProductId
  );

  // Si hay menos productos disponibles que los solicitados, devolver todos los disponibles
  if (availableProducts.length <= count) {
    return availableProducts;
  }

  // Seleccionar productos aleatorios
  const randomProducts = [];
  const usedIndices = new Set();

  while (
    randomProducts.length < count &&
    usedIndices.size < availableProducts.length
  ) {
    const randomIndex = Math.floor(Math.random() * availableProducts.length);

    if (!usedIndices.has(randomIndex)) {
      randomProducts.push(availableProducts[randomIndex]);
      usedIndices.add(randomIndex);
    }
  }

  return randomProducts;
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

async function productPage() {
  const productPage = document.querySelector("#product_page");
  // Get the current URL
  const currentUrl = window.location.href;
  // Create a URL object
  const url = new URL(currentUrl);
  // Use URLSearchParams to get the query parameters
  const params = new URLSearchParams(url.search);
  // Get specific parameters
  const id = params.get("id");
  // get product data
  const books = (await getBookStore()).getState();
  const {
    product_id,
    title,
    author,
    old_cost,
    cost,
    quantity,
    category,
    n_review,
    avg_rating,
    manufacturer,
    imgUrl,
    description,
  } = books.find((book) => book?.product_id === id);

  if (productPage) {
    productPage.innerHTML = `
        <!-- Breadcrumb -->
          <nav class="breadcrumb" id="breadcrumb">
            <div class="breadcrumb-list">
              <a href="/" class="breadcrumb-link">Trang chủ</a>
              <span>/</span>
              <a href="#" class="breadcrumb-link">Sách</a>
              <span>/</span>
              <a href="#" class="breadcrumb-link">${category}</a>
              <span>/</span>
              <span class="breadcrumb-current">${title}</span>
            </div>
          </nav>
    
          <!-- Main Product Section -->
          <div class="product-section container-fluid">
            <div class="row">
              <!-- Product Image -->
              <div class="product-image-container col-lg-6 col-12"></div>
    
              <!-- Product Details -->
              <div class="product-details col-lg-6 col-12">
                <div>
                  <h1 class="product-title">${title}</h1>
                  <p class="product-author">
                    By <span class="author-name">${author}</span>
                  </p>
                </div>
    
                <!-- Price -->
                <div class="price-container">
                  <span class="current-price">${priceFormat(
                    Number(cost)
                  )}</span>
                  <span class="original-price">${priceFormat(
                    Number(old_cost)
                  )}</span>
                  <span class="discount-badge">${(
                    ((Number(old_cost) - Number(cost)) / Number(old_cost)) *
                    100
                  ).toFixed(0)}%
                  </span>
                </div>
    
                <!-- Rating -->
                <div class="rating-container">
                  ${generateStarRating(avg_rating)}
                  <span class="rating-count">(${priceFormat(
                    Number(n_review)
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
                    Number(quantity)
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
                    <span class="info-value">#${product_id}</span>
                  </div>
                </div>
    
                <!-- Add to Cart Button -->
                <button class="add-to-cart-btn">
                  <i class="fa-solid fa-cart-shopping"></i>
                  <span>Add to cart</span>
                </button>
              </div>
            </div>
    
            <!-- Description Section -->
            <div class="description-section">
              <h2 class="description-title">Description</h2>
              <p class="description-text">${description}</p>
            </div>
          </div>
    
          <!-- Related Products Section -->
          <div class="related-section container-fluid">
            <h2 class="related-title">You might also like</h2>
            <div class="row" id="related-products-container"></div>
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
      createProduct(id, imgUrl, title, author, cost, description, id)
    );

    // add curr book to cart
    const addToCartBtn = document.querySelector(".add-to-cart-btn");
    if (addToCartBtn) {
      addToCartBtn.addEventListener("click", () => {
        const quantityInput = document.getElementById("quantity");
        const action = addAction({
          id: product_id,
          imageUrl: imgUrl,
          title,
          author,
          cost,
          quantity: Number(quantityInput.value),
        });
        getCartStore().dispatch(action);
      });
    }

    // render relation books
    const relatedProductsContainer = document.getElementById(
      "related-products-container"
    );
    const relatedProducts = getRandomRelatedProducts(books, product_id, 6);

    relatedProducts.forEach((product) => {
      const productElement = createProduct(
        product.product_id,
        product.imgUrl,
        product.title,
        product.author,
        product.cost,
        product.description.substring(0, 100) + "...",
        product.product_id,
        ["col-lg-4", "col-md-6", "col-12"]
      );
      relatedProductsContainer.appendChild(productElement);
    });

    setFireworks("wishlist");
  }
}

productPage();

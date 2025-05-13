import addToCart from "./addToCart.js";
import priceFormat from "./priceFormat.js";

function createProduct(
  imageUrl,
  title,
  author,
  cost,
  idx,
  breakPointClasses = []
) {
  const productItemWrap = document.createElement("div");
  if (breakPointClasses) {
    breakPointClasses.forEach((breakPointClass) => {
      productItemWrap.classList.add(breakPointClass);
    });
  } else {
    productItemWrap.classList.add("col-md-12");
  }

  const productItem = document.createElement("div");
  productItem.classList.add("product-item", "card");

  // innerHTML
  productItem.innerHTML = `
    <div class="product__image">
      <img
        src="${imageUrl}"
        class="card-img-top"
        alt="product-${idx}.jpg" />
      <div class="product__image__overlay"></div>
    </div>
    <div class="card-body product__body">
      <div>
        <h5 class="card-title product__title" style="font-weight: 600; text-align: left">
          ${title} <br />
          <span>By ${author}</span>
        </h5>

        <button
          class="procduct__wishlist-btn wishlist"
          id="wishlistBtn">
          <i class="fa-solid fa-heart"></i>
        </button>
      </div>

      <p class="card-text product__desc">
        Some quick example text to build on the card title and make up
        the bulk of the card’s content.
      </p>

      <div>
        <div class="product__cost" style="font-weight: 600">
          ${priceFormat(Number(cost))} đ
        </div>
        <button class="product__cart-btn">
          <i class="fa-solid fa-cart-shopping"></i>
          Add To Cart
        </button>
      </div>
    </div>  
  `;

  productItem
    .querySelector(".product__cart-btn")
    .addEventListener("click", () => {
      addToCart(imageUrl, title, author, cost);
    });

  productItemWrap.appendChild(productItem);
  return productItemWrap;
}

export default createProduct;

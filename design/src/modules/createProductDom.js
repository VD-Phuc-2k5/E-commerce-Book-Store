import priceFormat from "./priceFormat.js";
import { addAction, removeAction } from "./redux.js";
import { getCartStore, getWishStore } from "./store.js";

function createProduct(
  id,
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
  productItem.id = `product-item${id}`;
  // innerHTML
  productItem.innerHTML = `
    <div class="product__image">
      <img
        src="${imageUrl}"
        class="card-img-top"
        alt="product-${idx}.jpg" loading="lazy"/>
      <div class="product__image__overlay"></div>
    </div>
    <div class="card-body product__body">
      <div>
        <h5 class="card-title product__title" style="font-weight: 600; text-align: left">
          ${title} <br />
          <span>By ${author}</span>
        </h5>

        <button
          class="product__wishlist-btn wishlist ${
            JSON.parse(localStorage.getItem("wishListItems") ?? "[]")
              .map((item) => item.id)
              .includes(id)
              ? "liked"
              : ""
          }">
          <i class="fa-solid fa-heart"></i>
        </button>
      </div>

      <p class="card-text product__desc">
        Some quick example text to build on the card title and make up
        the bulk of the card’s content.
      </p>

      <div>
        <div class="product__cost" style="font-weight: 600">
          ${priceFormat(Number(cost))}
        </div>
        <button class="product__cart-btn">
          <i class="fa-solid fa-cart-shopping"></i>
          Add To Cart
        </button>
      </div>
    </div>  
  `;

  let callbackFunc;
  productItem.addEventListener("click", (e) => {
    // Neu bam vao nut them san pham vao gio hang
    if (
      e.target.classList.contains("fa-cart-shopping") ||
      e.target.classList.contains("product__cart-btn")
    ) {
      const action = addAction({ imageUrl, title, author, cost, quantity: 1 });
      getCartStore().dispatch(action);
    }
    // Neu bam vao nut them sach yeu thich
    if (
      e.target.classList.contains("fa-heart") ||
      e.target.classList.contains("product__wishlist-btn")
    ) {
      const wishlistBtn = productItem.querySelector(".product__wishlist-btn");
      let action;
      if (wishlistBtn.classList.contains("liked")) {
        action = addAction({
          id,
          imageUrl,
          title,
          author,
          cost,
        });
      } else {
        action = removeAction({
          id,
          imageUrl,
          title,
          author,
          cost,
        });
      }
      getWishStore().dispatch(action);
    }
  });

  productItemWrap.appendChild(productItem);
  return productItemWrap;
}

export default createProduct;

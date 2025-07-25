import priceFormat from "./priceFormat.js";
import { addAction, removeAction } from "./redux.js";
import { getCartStore, getWishStore } from "./store.js";
import capitalizeWords from "./capitalizeWords.js";
import createFireworks from "./createFireworks.js";

function createProduct(
  id,
  imageUrl,
  title,
  author,
  cost,
  desc,
  breakPointClasses = []
) {
  const productItemWrap = document.createElement("div");
  productItemWrap.className = "col-12";
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
  productItem.innerHTML = "";
  productItem.innerHTML = `
    <div class="product__image">
      <img
        src="${imageUrl}"
        class="card-img-top"
        alt="product-${id}.jpg" loading="lazy"/>
      <div class="product__image__overlay"></div>
    </div>
    <div class="card-body product__body">
      <div>
        <h5 class="card-title product__title" style="font-weight: 600; text-align: left">
          <span>${title}</span>
          <span class=${!author ? "no-author" : ""}>By ${capitalizeWords(
    author
  )}</span>
        </h5>
          
        <button
          class="product__wishlist-btn wishlist ${
            getWishStore()
              .getState()
              .map((item) => item.id)
              .includes(id)
              ? "liked"
              : ""
          }">
          <i class="fa-solid fa-heart"></i>
        </button>
      </div>

      <p class="card-text product__desc">${desc}</p>

      <div class="product__controls">
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

  productItem.addEventListener("click", (e) => {
    // Neu bam vao nut them san pham vao gio hang
    if (
      e.target.classList.contains("fa-cart-shopping") ||
      e.target.classList.contains("product__cart-btn")
    ) {
      const action = addAction({
        id,
        imageUrl,
        title,
        author,
        cost,
        quantity: 1,
      });
      getCartStore().dispatch(action);
    }
    // Neu bam vao nut them sach yeu thich
    else if (
      e.target.classList.contains("fa-heart") ||
      e.target.classList.contains("product__wishlist-btn")
    ) {
      const nColor = 2;
      const colors = ["#28F77D", "#365947"];

      const wishlistBtn = productItem.querySelector(".product__wishlist-btn");
      let action;

      if (!wishlistBtn.classList.contains("liked")) {
        action = addAction({
          id,
          imageUrl,
          title,
          author,
          cost,
        });
        createFireworks(wishlistBtn, colors, nColor);
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
      const wishListBtns = document.querySelectorAll(
        `#product-item${id} .product__wishlist-btn`
      );
      wishListBtns.forEach((wishListBtn) => {
        wishListBtn.classList.toggle("liked");
      });
    } else window.appRouter.navigate(encodeURI(`/product?id=${id}`));
  });

  productItemWrap.appendChild(productItem);
  return productItemWrap;
}

export default createProduct;

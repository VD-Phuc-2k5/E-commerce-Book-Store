function createProduct(imageUrl, title, author, cost, idx) {
  const productItem = document.createElement("div");
  productItem.classList.add("product-item", "card");

  // innerHTML
  productItem.innerHTML = `
        <div class="product-item__image">
            <img src=${imageUrl} class="card-img-top" alt="carousel-image${
    idx + 1
  }.jpg" />
        </div>

        <div class="product-item__title">
            <h3>${title}</h3>
        </div>

        <div class="product-item__author">
            <h4>By ${author}</h4>
        </div>

        <div class="product-item__price card-title">
            <h4>${cost} đ</h4>
        </div>

        <div class="product-item__button">
            <button type="button">
                <i class="fas fa-shopping-cart"></i>
                <span>Add To Cart</span>
            </button>
        </div>
    `;
  return productItem;
}

export default createProduct;

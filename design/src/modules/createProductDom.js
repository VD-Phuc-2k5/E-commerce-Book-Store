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
        <div class="product-item__image">
            <img src=${imageUrl} alt="carousel-image${idx + 1}.jpg" />
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

  productItemWrap.appendChild(productItem);
  return productItemWrap;
}

export default createProduct;

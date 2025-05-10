import { home_products } from "../../src/data/data.js";
import createProduct from "../../src/modules/createProductDom.js";

const productList = document.querySelector(".home__product_list");

// load product in home
home_products.forEach(({ title, products }) => {
  const h2 = document.createElement("h2");
  h2.classList.add("home__product_list__title");
  h2.innerText = title;
  productList.appendChild(h2);
  products.forEach(({ imageUrl, title, author, cost }, idx) => {
    const productItem = createProduct(imageUrl, title, author, cost, idx, [
      "col-lg-3",
      "col-md-6",
      "col-xs-12",
    ]);
    productList.appendChild(productItem);
  });
});

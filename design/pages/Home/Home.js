import { home_products } from "../../src/data/data.js";
import createProduct from "../../src/modules/createProductDom.js";
import setFireworks from "../../src/modules/setFireworks.js";

function Home() {
  const productList = document.querySelector(".home__product_list");

  // load product in home
  home_products.forEach(({ title, products }) => {
    if (title) {
      const h1 = document.createElement("h1");
      h1.classList.add("home__product_list__title");
      h1.innerText = title;
      productList.appendChild(h1);
    }
    products.forEach(({ id, imageUrl, title, author, cost }, idx) => {
      const productItem = createProduct(
        id,
        imageUrl,
        title,
        author,
        cost,
        idx,
        ["col-lg-4", "col-md-6", "col-12"]
      );
      productList.appendChild(productItem);
    });
  });

  setFireworks("wishlist");
}

Home();

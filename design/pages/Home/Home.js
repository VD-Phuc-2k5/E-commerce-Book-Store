import createProduct from "../../src/modules/createProductDom.js";
import getBooks from "../../src/modules/getBooks.js";

async function Home() {
  const productList = document.querySelector(".home__product_list");
  const home_products = await getBooks(9);

  // load product in home
  home_products.home.forEach(({ title, books }) => {
    if (title) {
      const h1 = document.createElement("h1");
      h1.classList.add("home__product_list__title");
      h1.innerText = title;
      productList.appendChild(h1);
    }
    books.forEach(({ id, imgUrl, title, author, cost, description }) => {
      const productItem = createProduct(
        id,
        imgUrl,
        title,
        author,
        cost,
        description,
        ["col-lg-4", "col-md-6", "col-12"]
      );
      productList.appendChild(productItem);
    });
  });
}

Home();

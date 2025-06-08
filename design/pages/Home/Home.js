import createProduct from "../../src/modules/createProductDom.js";
import getBooks from "../../src/modules/getBooks.js";
import pagination from "../../src/modules/pagination.js";
import lazyLoadImg from "../../src/modules/lazyloadImg.js";

// render  books
function renderBooks(books, selector) {
  selector.innerHTML = "";

  books.forEach((book) => {
    const bookDOM = createProduct(
      book.id,
      book.imgUrl,
      book.title,
      book.author,
      book.cost,
      book.description,
      ["col-lg-4", "col-md-6", "col-12"]
    );
    selector.appendChild(bookDOM);
  });
}

async function Home() {
  lazyLoadImg();

  const productList = document.querySelector(".home__product_list");
  const home_products = await getBooks(9);
  // load top seliing books
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

  // load new Arrivals title
  const h1 = document.createElement("h1");
  h1.classList.add("home__product_list__title");
  h1.innerText = "New Arrivals";
  productList.appendChild(h1);

  // load books after pagination
  pagination(27, "/books", renderBooks);
}

Home();

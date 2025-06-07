import lazyLoadImg from "../../src/modules/lazyloadImg.js";
import createProduct from "../../src/modules/createProductDom.js";
import pagination from "../../src/modules/pagination.js";

lazyLoadImg();

const booksContainer = document.querySelector("#booksContainer");

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
      ["col-lg-6", "col-12"]
    );
    selector.appendChild(bookDOM);
  });
}

if (booksContainer) {
  pagination(27, "/books", renderBooks);
}

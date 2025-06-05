import createProduct from "./createProductDom.js";
import getBooks from "./getBooks.js";

function setupCarousel(slider, duration, gap) {
  let isSliding = false;

  function getItemWidth() {
    const item = slider.firstElementChild;
    const width = item.offsetWidth;
    return width + gap;
  }

  function slideNext() {
    if (isSliding) return;
    isSliding = true;

    const shift = getItemWidth();

    slider.style.transition = "transform 0.5s ease";
    slider.style.transform = `translateX(-${shift}px)`;

    setTimeout(() => {
      slider.style.transition = "none";
      slider.appendChild(slider.firstElementChild);
      slider.style.transform = "translateX(0)";
      isSliding = false;
    }, 500);
  }

  function slidePrev() {
    if (isSliding) return;
    isSliding = true;

    const shift = getItemWidth();

    // Bước 1: Dời phần tử cuối lên đầu, nhưng giữ nguyên vị trí trượt để tạo hiệu ứng ngược
    slider.style.transition = "none";
    slider.prepend(slider.lastElementChild);
    slider.style.transform = `translateX(-${shift}px)`;

    // Bước 2: Kích hoạt animation trượt về 0
    setTimeout(() => {
      slider.style.transition = "transform 0.5s ease";
      slider.style.transform = "translateX(0)";
    }, 10);

    setTimeout(() => {
      isSliding = false;
    }, 510);
  }

  // Auto carousel
  let interval = setInterval(slideNext, duration);

  // Button listeners
  document.getElementById("nextBtn").addEventListener("click", () => {
    clearInterval(interval);
    slideNext();
    interval = setInterval(slideNext, duration);
  });

  document.getElementById("prevBtn").addEventListener("click", () => {
    clearInterval(interval);
    slidePrev();
    interval = setInterval(slideNext, duration);
  });
}

async function carouselLoader(gap, duration) {
  const books = await getBooks(50);
  const slider = document.getElementById("slider");
  if (slider) {
    slider.style = `
        gap: ${gap}px;
        width: calc(${books.carousel.length} / var(--nav-carousel-item) * 100%  + ${gap}px);
    `;

    books.carousel.forEach(({ id, imgUrl, title, author, cost }) => {
      // Create individual product item
      const productItem = createProduct(id, imgUrl, title, author, cost);
      // Append to current group
      slider.appendChild(productItem);
    });
    setupCarousel(slider, duration, gap);
  }
}

export default carouselLoader;

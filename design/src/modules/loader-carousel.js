import { carrouselInDropdown } from "../data/data.js";

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
  const interval = setInterval(slideNext, duration);

  // Button listeners
  document.getElementById("nextBtn").addEventListener("click", () => {
    clearInterval(interval);
    slideNext();
  });

  document.getElementById("prevBtn").addEventListener("click", () => {
    clearInterval(interval);
    slidePrev();
  });
}

function carouselLoader(gap, duration) {
  const slider = document.getElementById("slider");
  if (slider) {
    slider.style = `
        gap: ${gap}px;
        width: calc(${carrouselInDropdown.length} / var(--nav-carousel-item) * 100%  + ${gap}px);
    `;

    carrouselInDropdown.forEach(({ imageUrl, title, author, cost }, idx) => {
      // Create individual product item
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
      // Append to current group
      slider.appendChild(productItem);
    });
    setupCarousel(slider, duration, gap);
  }
}

export default carouselLoader;

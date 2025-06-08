import { get } from "../api/axios.js";

async function pagination(nItem, endPoint, render, mode = 1) {
  const url =
    mode === 1
      ? `${endPoint}?page=1&limit=${nItem}`
      : `${endPoint}&page=1&limit=${nItem}`;

  let paginationData = await get(url);
  let currentData = paginationData;
  let currentPage = 1;

  function renderPagination() {
    const pagination = document.getElementById("pagination");
    pagination.innerHTML = "";

    const firstBtn = `
          <li class="page-item ${currentPage === 1 ? "disabled" : ""}">
            <div class="page-link" data-page="1">Start</div>
          </li>
        `;
    pagination.innerHTML += firstBtn;

    const prevBtn = `
          <li class="page-item ${currentPage === 1 ? "disabled" : ""}">
            <div class="page-link" data-page="${currentPage - 1}">&laquo;</div>
          </li>
        `;
    pagination.innerHTML += prevBtn;

    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(currentData.pages, currentPage + 1);

    for (let i = startPage; i <= endPage; i++) {
      const pageBtn = `
            <li class="page-item ${i === currentPage ? "active" : ""}">
              <div class="page-link" data-page="${i}">${i}</div>
            </li>
          `;
      pagination.innerHTML += pageBtn;
    }

    const nextBtn = `
          <li class="page-item ${
            currentPage === currentData.pages ? "disabled" : ""
          }">
            <div class="page-link" data-page="${currentPage + 1}">&raquo;</div>
          </li>
        `;
    pagination.innerHTML += nextBtn;

    const lastBtn = `
          <li class="page-item ${
            currentPage === currentData.pages ? "disabled" : ""
          }">
            <div class="page-link" data-page="${currentData.pages}">End</div>
          </li>
        `;
    pagination.innerHTML += lastBtn;

    const pageLinks = document.querySelectorAll(".page-link");
    pageLinks.forEach((link) => {
      link.addEventListener("click", function (e) {
        e.preventDefault();
        const page = parseInt(this.getAttribute("data-page"));
        if (page && page !== currentPage) {
          changePage(page);
        }
      });
    });
  }

  // Hàm thay đổi trang với hiệu ứng trượt
  async function changePage(page) {
    const currPage = document.querySelector(".page:first-child");
    const pageSlide = document.querySelector(".page-slide");

    const url =
      mode === 1
        ? `${endPoint}?page=${page}&limit=${nItem}`
        : `${endPoint}&page=${page}&limit=${nItem}`;

    // Gọi API để lấy dữ liệu trang mới
    let paginationData = await get(url);

    let newPage = document.createElement("div");
    newPage.className = "page row col-12";
    pageSlide.appendChild(newPage);

    render(paginationData.data, newPage);

    const slideKeyframes = [
      { transform: "translateX(0)" },
      { transform: "translateX(-100%)" },
    ];

    const slideOut = pageSlide.animate(slideKeyframes, {
      duration: 800,
      easing: "ease-in-out",
    });

    slideOut.onfinish = () => {
      currPage.remove();
      currentPage = page;
      currentData = paginationData;
      renderPagination();
    };
  }

  // Khởi tạo trang
  renderPagination();
  render(paginationData.data, document.querySelector(".page:first-child"));
}

export default pagination;

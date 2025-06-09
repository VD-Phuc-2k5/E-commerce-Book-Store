import lazyLoadImg from "../../src/modules/lazyloadImg.js";
import createProduct from "../../src/modules/createProductDom.js";
import pagination from "../../src/modules/pagination.js";
import { get } from "../../src/api/axios.js";

lazyLoadImg();

const booksContainer = document.getElementById("booksContainer");
const searchBox = document.getElementById("searchBook");

const currentUrl = decodeURI(window.location.href);
const allBookUrl = new URL(currentUrl);
const params = new URLSearchParams(allBookUrl.search);
const category = params.get("category");
document.querySelector("#all-book .banner-overlay h2").innerText =
  category ?? "Shop";
const search = params.get("search");

function renderBooks(books, selector) {
  selector.innerHTML = "";

  if (!books.length) {
    selector.innerHTML = `
      <div class="text-center my-5">
        <img src="https://cdn-icons-png.flaticon.com/512/4076/4076549.png" alt="No books found" width="150" class="mb-4">
        <h2 class="text-muted">Không tìm thấy sách nào</h2>
        <p class="text-secondary">Hãy thử tìm kiếm với từ khóa khác hoặc kiểm tra lại bộ lọc của bạn.</p>
      </div>
    `;
    return;
  }

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

let url = "books";

if (booksContainer) {
  pagination(9, encodeURI(url), renderBooks);
}

if (searchBox) {
  let debounceTimer;
  if (search) {
    pagination(9, encodeURI(`books?search=${search}`), renderBooks, 2);
    searchBox.value = search;
  }

  searchBox.addEventListener("input", (e) => {
    clearTimeout(debounceTimer);

    debounceTimer = setTimeout(() => {
      const searchTerm = e.target.value;
      const searchParam = `search=${searchTerm}`;

      const searchUrl =
        url === "books" ? `books?${searchParam}` : `${url}&${searchParam}`;

      pagination(9, encodeURI(searchUrl), renderBooks, 2);
    }, 500);
  });
}

class TreeManager {
  constructor() {
    this.selectedItems = new Map();
    this.totalCount = 0;
    this.genresData = [];
    if (category) {
      this.initialCategory = category;
    }

    this.loadGenresData();
    this.initEventListeners();
    this.renderTree();
    this.updateStats();
  }

  async getGenresData() {
    const categoryRes = await get("category");
    return categoryRes.data;
  }

  async loadGenresData() {
    try {
      this.genresData = await this.getGenresData();
      this.renderTree();
      this.updateStats();

      if (this.initialCategory) {
        this.selectCategoryByName(this.initialCategory);
      }
    } catch (error) {
      console.error("Lỗi khi load dữ liệu genres:", error);
    }
  }

  selectCategoryByName(categoryName) {
    const findCategory = (nodes) => {
      for (const node of nodes) {
        if (node.name === categoryName) {
          return node;
        }
        if (node.children && node.children.length > 0) {
          const found = findCategory(node.children);
          if (found) return found;
        }
      }
      return null;
    };

    const categoryNode = findCategory(this.genresData);
    if (categoryNode) {
      const checkbox = document.getElementById(`node-${categoryNode.id}`);
      if (checkbox) {
        checkbox.checked = true;
        this.handleCheckboxChange(checkbox);
      }
    }
  }

  initEventListeners() {
    // Search functionality
    const searchInput = document.getElementById("treeSearch");
    let searchTimeout;
    searchInput.addEventListener("input", (e) => {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => {
        this.filterTree(e.target.value);
      }, 300);
    });
  }

  countNodes(nodes) {
    let count = 0;
    nodes?.forEach((node) => {
      count++;
      if (node.children && node.children.length > 0) {
        count += this.countNodes(node.children);
      }
    });
    return count;
  }

  buildPath(nodes, targetId, currentPath = []) {
    for (let node of nodes) {
      const newPath = [...currentPath, node.name];
      if (node.id === targetId) {
        return newPath;
      }
      if (node.children && node.children.length > 0) {
        const found = this.buildPath(node.children, targetId, newPath);
        if (found) return found;
      }
    }
    return null;
  }

  renderTree() {
    const container = document.getElementById("treeContainer");
    this.totalCount = this.countNodes(this.genresData);
    container.innerHTML = this.renderTreeNode(this.genresData);
    this.addEventListeners();
  }

  renderTreeNode(nodes, level = 0) {
    return nodes
      .map((node) => {
        const hasChildren = node.children && node.children.length > 0;

        return `
                  <div class="tree-node tree-level-${level}" data-id="${
          node.id
        }" data-level="${level}">
                    <div class="tree-item">
                        <div class="tree-content">
                            <div class="form-check">
                                <input class="form-check-input tree-checkbox" type="checkbox" 
                                      value="${node.id}" id="node-${
          node.id
        }" data-name="${node.name}">
                                <label class="form-check-label tree-label" for="node-${
                                  node.id
                                }">
                                    ${node.name}
                                </label>
                            </div>
                        </div>
                    </div>
                    ${
                      hasChildren
                        ? `<div class="tree-children">
                            ${this.renderTreeNode(node.children, level + 1)}
                        </div>`
                        : ""
                    }
                </div>
              `;
      })
      .join("");
  }

  addEventListeners() {
    // Checkbox change events
    document.querySelectorAll(".tree-checkbox").forEach((checkbox) => {
      checkbox.addEventListener("change", (e) => {
        this.handleCheckboxChange(e.target);
      });
    });
  }

  handleCheckboxChange(checkbox) {
    const nodeId = parseInt(checkbox.value);
    const nodeName = checkbox.getAttribute("data-name");
    const path = this.buildPath(this.genresData, nodeId);
    const isChecked = checkbox.checked;

    // Tìm node hiện tại trong dữ liệu
    const findNode = (nodes, id) => {
      for (let node of nodes) {
        if (node.id === id) return node;
        if (node.children && node.children.length > 0) {
          const found = findNode(node.children, id);
          if (found) return found;
        }
      }
      return null;
    };

    const currentNode = findNode(this.genresData, nodeId);

    // Hàm đệ quy để cập nhật tất cả checkbox con
    const updateChildCheckboxes = (children, checked) => {
      if (!children || children.length === 0) return;

      children.forEach((child) => {
        // Cập nhật trạng thái checkbox trong DOM
        const childCheckbox = document.getElementById(`node-${child.id}`);
        if (childCheckbox) {
          childCheckbox.checked = checked;
        }

        // Cập nhật selectedItems
        if (checked) {
          const childPath = this.buildPath(this.genresData, child.id);
          this.selectedItems.set(child.id, {
            name: child.name,
            path: childPath,
          });
        } else {
          this.selectedItems.delete(child.id);
        }

        // Đệ quy cho các con của con
        if (child.children && child.children.length > 0) {
          updateChildCheckboxes(child.children, checked);
        }
      });
    };

    // Xử lý checkbox hiện tại
    if (isChecked) {
      this.selectedItems.set(nodeId, {
        name: nodeName,
        path: path,
      });

      // Nếu node có con, cập nhật tất cả con
      if (
        currentNode &&
        currentNode.children &&
        currentNode.children.length > 0
      ) {
        updateChildCheckboxes(currentNode.children, true);
      }
    } else {
      this.selectedItems.delete(nodeId);

      // Nếu node có con, bỏ chọn tất cả con
      if (
        currentNode &&
        currentNode.children &&
        currentNode.children.length > 0
      ) {
        updateChildCheckboxes(currentNode.children, false);
      }
    }

    this.updateStats();
    this.updateBookList();
  }

  updateBookList() {
    const selectedCategoryNames = Array.from(this.selectedItems.values()).map(
      (item) => item.name
    );

    if (selectedCategoryNames.length === 0) {
      url = "books";
      pagination(9, encodeURI(url), renderBooks);
    } else {
      const categoryQuery = selectedCategoryNames.join(",");
      url = `books?categories=${categoryQuery}`;
      pagination(9, encodeURI(url), renderBooks, 2);
    }
  }

  removeItem(nodeId) {
    this.selectedItems.delete(nodeId);
    const checkbox = document.getElementById(`node-${nodeId}`);
    if (checkbox) {
      checkbox.checked = false;
    }
    this.updateStats();
    this.updateBookList();
  }

  filterTree(searchTerm) {
    const searchTermLower = searchTerm.toLowerCase();
    const allNodes = document.querySelectorAll(".tree-node");
    const noResults = document.getElementById("noResults");
    let visibleCount = 0;

    if (!searchTerm) {
      // Show all nodes if no search term
      allNodes.forEach((node) => {
        node.style.display = "block";
        visibleCount++;
      });
      noResults.style.display = "none";
    } else {
      allNodes.forEach((node) => {
        const label = node.querySelector(".tree-label");
        if (label) {
          const matches = label.textContent
            .toLowerCase()
            .includes(searchTermLower);
          node.style.display = matches ? "block" : "none";
          if (matches) visibleCount++;
        }
      });

      noResults.style.display = visibleCount === 0 ? "block" : "none";
    }

    document.getElementById("visibleCount").textContent = visibleCount;
  }

  updateStats() {
    document.getElementById("totalCategories").textContent = this.totalCount;
    document.getElementById("selectedCount").textContent =
      this.selectedItems.size;
    document.getElementById("visibleCount").textContent =
      document.querySelectorAll(
        '.tree-node[style*="block"], .tree-node:not([style])'
      ).length;
  }

  getSelectedData() {
    return Array.from(this.selectedItems.entries()).map(([id, item]) => ({
      id: id,
      name: item.name,
      path: item.path,
    }));
  }
}

// Initialize the tree manager
const treeManager = new TreeManager();

// Expose method to get selected data
window.getSelectedCategories = () => {
  return treeManager.getSelectedData();
};

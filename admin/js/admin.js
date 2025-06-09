import { showToast } from "./toast.js";
const sidebar = document.getElementById('sidebar');
const toggleBtn = document.getElementById('toggleSidebar');
const overlay = document.getElementById('sidebarOverlay');

// Mở sidebar
function openSidebar() {
    sidebar.classList.add('sidebar--open');
    overlay.classList.remove('hidden');
}

// Đóng sidebar
function closeSidebar() {
    sidebar.classList.remove('sidebar--open');
    overlay.classList.add('hidden');
}

// Toggle khi bấm nút
toggleBtn.addEventListener('click', function () {
    if (sidebar.classList.contains('sidebar--open')) {
        closeSidebar();
    } else {
        openSidebar();
    }
});

// Đóng khi bấm ra ngoài
overlay.addEventListener('click', closeSidebar);

// Đảm bảo sidebar ẩn khi resize về mobile
window.addEventListener('resize', function () {
    if (window.innerWidth > 768) {
        closeSidebar();
    }
});

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function () {
    // Navigation functionality
    const navLinks = document.querySelectorAll('.sidebar .nav-link');
    const contentSections = document.querySelectorAll('.content-section');
    const pageTitle = document.getElementById('pageTitle');
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.getElementById('mainContent');
    const toggleSidebar = document.getElementById('toggleSidebar');

    // Page titles mapping
    const pageTitles = {
        'dashboard': 'Dashboard',
        'categories': 'Book Categories',
        'books': 'Books Management',
        'users': 'Users Management',
        'blogs': 'Blogs Management',
        'transactions': 'Transactions Management'
    };

    // Navigation click handler
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();

            // Remove active class from all links and sections
            navLinks.forEach(l => l.classList.remove('active'));
            contentSections.forEach(s => s.classList.remove('active'));

            // Add active class to clicked link
            link.classList.add('active');

            // Show corresponding section
            const sectionId = link.getAttribute('data-section');
            const section = document.getElementById(sectionId);
            if (section) {
                section.classList.add('active');
                pageTitle.textContent = pageTitles[sectionId] || 'Dashboard';
            }
        });
    });

    // Sidebar toggle functionality
    if (toggleSidebar) {
        toggleSidebar.addEventListener('click', () => {
            sidebar.classList.toggle('collapsed');
            mainContent.classList.toggle('expanded');
        });
    }

    // Responsive sidebar for mobile
    function handleResize() {
        if (window.innerWidth <= 768) {
            sidebar.classList.add('collapsed');
            mainContent.classList.add('expanded');
        } else {
            sidebar.classList.remove('collapsed');
            mainContent.classList.remove('expanded');
        }
    }

    window.addEventListener('resize', handleResize);
    handleResize(); // Initial call

    // Add hover effects to stats cards
    const statsCards = document.querySelectorAll('.stats-card');
    statsCards.forEach(card => {
        card.addEventListener('mouseenter', function () {
            this.style.transform = 'translateY(-5px)';
        });
        card.addEventListener('mouseleave', function () {
            this.style.transform = 'translateY(0)';
        });
    });

    // Status badge click handlers
    const statusBadges = document.querySelectorAll('.badge');
    statusBadges.forEach(badge => {
        badge.addEventListener('click', function () {
            console.log('Status clicked:', this.textContent);
        });
    });

    // Initialize the dashboard
    initializeDashboard();
});

// Fetch data from db.json
async function fetchData() {
    try {
        const response = await fetch('db.json');
        const data = await response.json();
        showToast("Gọi dữ liệu thành công");
        return data;
    } catch (error) {
        showToast("Gọi dữ liệu không thành công");
        return null;
    }
}
// Biến lưu instance DataTable cho từng bảng
let userTable = null;
let bookTable = null;
let blogTable = null;
let transactionTable = null;
let recentTransactionsTable = null;

// Hàm khởi tạo DataTable cho từng bảng
function initTable(tableId, dataTableVar, options = {}) {
    if (window[dataTableVar]) {
        window[dataTableVar].destroy();
    }
    window[dataTableVar] = new simpleDatatables.DataTable(`#${tableId}`, {
        searchable: true,
        fixedHeight: true,
        perPage: 10,
        perPageSelect: [5, 10, 15, 20, 25],
        labels: {
            placeholder: "Search...",
            perPage: "Show ${select} entries",
            noRows: "No data to display",
            info: "Showing {start} to {end} of {rows} entries"
        },
        layout: {
            top: "{search}",
            bottom: "{info}{pager}"
        },
        ...options
    });
}

// Initialize DataTables
function initializeDataTables() {
    // Common options for all tables
    const commonOptions = {
        searchable: true,
        fixedHeight: true,
        perPage: 10,
        perPageSelect: [5, 10, 15, 20, 25],
        labels: {
            placeholder: "Search...",
            perPage: "Show ${select} entries",
            noRows: "No data to display",
            info: "Showing {start} to {end} of {rows} entries"
        },
        layout: {
            top: "{search}",
            bottom: "{info}{pager}"
        }
    };

    // Function to scroll table to top with smooth animation
    const scrollTableToTop = (tableId) => {
        const tableContainer = document.querySelector(`#${tableId}`).closest('.table-container');
        if (tableContainer) {
            const tableResponsive = tableContainer.querySelector('.table-responsive');
            if (tableResponsive) {
                const scrollToTop = () => {
                    const currentScroll = tableResponsive.scrollTop;
                    if (currentScroll > 0) {
                        tableResponsive.scrollTop = currentScroll - Math.max(currentScroll / 10, 10);
                        requestAnimationFrame(scrollToTop);
                    }
                };
                scrollToTop();
            }
        }
    };

    // Initialize DataTable for Recent Transactions
    const recentTransactionsTable = document.getElementById('recentTransactionsTable');
    if (recentTransactionsTable) {
        new simpleDatatables.DataTable("#recentTransactionsTable", {
            ...commonOptions,
            columns: [
                { select: 0, sort: "desc" },
                { select: 3, sort: "desc" },
                { select: 4, sort: "asc" }
            ]
        }).on('datatable.page', () => scrollTableToTop('recentTransactionsTable'));
    }

    // Initialize DataTable for Categories
    const categoriesTable = document.getElementById('categoriesTable');
    if (categoriesTable) {
        new simpleDatatables.DataTable("#categoriesTable", {
            ...commonOptions,
            columns: [
                { select: 0, sort: "asc" },
                { select: 1, sort: "asc" },
                { select: 3, sort: "desc" }
            ]
        }).on('datatable.page', () => scrollTableToTop('categoriesTable'));
    }

    // Initialize DataTable for Books
    const booksTable = document.getElementById('booksTable');
    if (booksTable) {
        new simpleDatatables.DataTable("#booksTable", {
            ...commonOptions,
            columns: [
                { select: 1, sort: "asc" },
                { select: 2, sort: "asc" },
                { select: 4, sort: "desc" },
                { select: 5, sort: "desc" }
            ]
        }).on('datatable.page', () => scrollTableToTop('booksTable'));
    }

    // Initialize DataTable for Users
    const usersTable = document.getElementById('usersTable');
    if (usersTable) {
        new simpleDatatables.DataTable("#usersTable", {
            ...commonOptions,
            columns: [
                { select: 0, sort: "asc" },
                { select: 1, sort: "asc" },
                { select: 5, sort: "desc" }
            ]
        }).on('datatable.page', () => scrollTableToTop('usersTable'));
    }

    // Initialize DataTable for Blogs
    const blogsTable = document.getElementById('blogsTable');
    if (blogsTable) {
        new simpleDatatables.DataTable("#blogsTable", {
            ...commonOptions,
            columns: [
                { select: 0, sort: "asc" },
                { select: 1, sort: "asc" },
                { select: 4, sort: "desc" }
            ]
        }).on('datatable.page', () => scrollTableToTop('blogsTable'));
    }

    // Initialize DataTable for Transactions
    const transactionsTable = document.getElementById('transactionsTable');
    if (transactionsTable) {
        new simpleDatatables.DataTable("#transactionsTable", {
            ...commonOptions,
            columns: [
                { select: 0, sort: "desc" },
                { select: 4, sort: "desc" },
                { select: 6, sort: "desc" }
            ]
        }).on('datatable.page', () => scrollTableToTop('transactionsTable'));
    }
}

// Initialize the dashboard
async function initializeDashboard() {
    const data = await fetchData();
    if (!data) return;

    // Render dashboard data
    renderDashboardStats(data.dashboard.stats);
    renderRecentTransactions(data.dashboard.recentTransactions);
    renderTopSellingBooks(data.dashboard.topSellingBooks);

    // Render other sections
    renderCategories(data.categories);
    renderBooks(data.books);
    renderUsers(data.users);
    renderBlogs(data.blogs);
    renderTransactions(data.transactions);

    // Initialize DataTables after rendering data
    initializeDataTables();
}

// Render dashboard stats
function renderDashboardStats(stats) {
    const statsContainer = document.querySelector('.row.g-4.mb-4');
    statsContainer.innerHTML = stats.map(stat => `
        <div class="col-xl-3 col-md-6">
            <div class="stats-card">
                <div class="d-flex align-items-center">
                    <div class="stats-card__icon" style="background: ${stat.gradient}">
                        <i class="${stat.icon}"></i>
                    </div>
                    <div class="ms-3">
                        <h3 class="mb-0">${stat.value.toLocaleString()}</h3>
                        <p class="text-muted mb-0">${stat.title}</p>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

// Render recent transactions
function renderRecentTransactions(transactions) {
    const tbody = document.querySelector('#recentTransactionsTable tbody');
    if (!tbody) return;

    tbody.innerHTML = transactions.map(tx => `
        <tr>
            <td>#${tx.id}</td>
            <td>${tx.customer}</td>
            <td>${tx.book}</td>
            <td>$${tx.amount.toFixed(2)}</td>
            <td><span class="badge bg-${tx.status === 'Completed' ? 'success' : 'warning'}">${tx.status}</span></td>
        </tr>
    `).join('');
}

// Render top selling books
function renderTopSellingBooks(books) {
    const listGroup = document.querySelector('#dashboard .list-group');
    if (!listGroup) return;

    listGroup.innerHTML = books.map(book => `
        <div class="list-group-item d-flex justify-content-between align-items-center border-0">
            <div>
                <h6 class="mb-1">${book.title}</h6>
                <small class="text-muted">${book.author}</small>
            </div>
            <span class="badge bg-primary rounded-pill">${book.sales} sales</span>
        </div>
    `).join('');
}

// Render categories
function renderCategories(categories) {
    const tbody = document.querySelector('#categoriesTable tbody');
    if (!tbody) return;

    tbody.innerHTML = categories.map(category => {
        let badgeClass = 'bg-secondary';
        if (category.status === 'Active') badgeClass = 'bg-success';
        else if (category.status === 'Out of quantity') badgeClass = 'bg-danger';
        else if (category.status === 'Incoming quantity') badgeClass = 'bg-warning';
        return `
            <tr>
                <td>${category.id}</td>
                <td>${category.name}</td>
                <td>${category.booksCount}</td>
                <td><span class="badge ${badgeClass}">${category.status}</span></td>
                <td>
                    <button class="btn btn-sm btn-outline-primary me-1">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-danger">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

// Lưu danh sách sách hiện tại để tra cứu nhanh
let currentBooks = [];

// Cập nhật currentBooks khi renderBooks
function renderBooks(books) {
    currentBooks = books;
    const tbody = document.querySelector('#booksTable tbody');
    if (!tbody) return;

    tbody.innerHTML = books.map(book => {
        const safeTitle = book.title.replace(/'/g, "\\'");
        return `
        <tr>
            <td>
                <div class="bg-light rounded d-flex align-items-center justify-content-center"
                    style="width: 40px; height: 50px;">
                    <i class="fas fa-book text-muted"></i>
                </div>
            </td>
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.category}</td>
            <td>$${book.cost.toFixed(2)}</td>
            <td>${book.quantity}</td>
            <td><span class="badge bg-success">Available</span></td>
            <td>
                <div class="btn-group" role="group">
                    <button type="button" class="btn btn-sm btn-outline-primary" title="Edit" onclick="editBook('${safeTitle}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button type="button" class="btn btn-sm btn-outline-info" title="View Details" onclick="viewBook('${safeTitle}')">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button type="button" class="btn btn-sm btn-outline-warning" title="Update Stock" onclick="updateStock('${safeTitle}')">
                        <i class="fas fa-boxes"></i>
                    </button>
                    <button type="button" class="btn btn-sm btn-outline-danger" title="Delete" onclick="deleteBook('${safeTitle}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `;
    }).join('');
}

function openEditBookModal(book, readonly = false) {
    document.getElementById('editBookTitle').value = book.title;
    document.getElementById('editBookAuthor').value = book.author;
    document.getElementById('editBookCategory').value = book.category;
    document.getElementById('editBookPrice').value = book.cost;
    document.getElementById('editBookStock').value = book.quantity;
    document.getElementById('editBookDescription').value = book.description || '';

    // Đặt readonly hoặc không
    [
        'editBookTitle',
        'editBookAuthor',
        'editBookCategory',
        'editBookPrice',
        'editBookStock',
        'editBookDescription',
        'editBookImage'
    ].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.readOnly = readonly;
        if (el && el.tagName === 'SELECT') el.disabled = readonly;
        if (el && el.type === 'file') el.disabled = readonly;
    });

    // Đổi tiêu đề modal
    document.getElementById('editBookModalTitle').textContent = readonly ? 'View Book' : 'Edit Book';
    // Ẩn/hiện nút Save
    document.querySelector('#editBookForm .btn-primary').style.display = readonly ? 'none' : '';

    // Hiện modal
    const modal = new bootstrap.Modal(document.getElementById('editBookModal'));
    modal.show();
}

function editBook(title) {
    const book = currentBooks.find(b => b.title === title);
    if (book) openEditBookModal(book, false);
    else showToast('Không tìm thấy sách!', 'error');
}

function viewBook(title) {
    const book = currentBooks.find(b => b.title === title);
    if (book) openEditBookModal(book, true);
    else showToast('Không tìm thấy sách!', 'error');
}

function updateStock(id) {
    showToast(`Cập nhật số lượng sách ID: ${id}`, "info");
}

function deleteBook(id) {
    if (confirm('Bạn có chắc chắn muốn xóa sách này?')) {
        showToast(`Đã xóa sách ID: ${id}`, "success");
    }
}

// Render users
function renderUsers(users) {
    const tbody = document.querySelector('#usersTable tbody');
    if (!tbody) return;

    tbody.innerHTML = users.map(user => {
        // Determine badge class based on status
        let badgeClass = 'bg-success'; // Default for Active
        if (user.status === 'Suspended') {
            badgeClass = 'bg-danger';
        } else if (user.status === 'Inactive') {
            badgeClass = 'bg-warning';
        }

        return `
            <tr>
                <td>${user.id}</td>
                <td>${user.name}</td>
                <td>${user.email}</td>
                <td>${user.phone}</td>
                <td><span class="badge bg-info">${user.role}</span></td>
                <td>${user.joinedDate}</td>
                <td><span class="badge ${badgeClass}">${user.status}</span></td>
                <td>
                    <button class="btn btn-sm btn-outline-primary me-1">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-warning me-1">
                        <i class="fas fa-ban"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-danger">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

// Render blogs
function renderBlogs(blogs) {
    const tbody = document.querySelector('#blogsTable tbody');
    if (!tbody) return;

    tbody.innerHTML = blogs.map(blog => `
        <tr>
            <td>${blog.id}</td>
            <td>${blog.title}</td>
            <td>${blog.author}</td>
            <td>${blog.category}</td>
            <td>${blog.views}</td>
            <td>${blog.comments}</td>
            <td><span class="badge bg-${blog.status === 'Published' ? 'success' : blog.status === 'Draft' ? 'warning' : 'secondary'}">${blog.status}</span></td>
            <td>
                <button class="btn btn-sm btn-outline-primary me-1">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-outline-info me-1">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="btn btn-sm btn-outline-danger">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

// Render transactions
function renderTransactions(transactions) {
    const tbody = document.querySelector('#transactionsTable tbody');
    if (!tbody) return;

    tbody.innerHTML = transactions.map(tx => `
        <tr>
            <td>#${tx.id}</td>
            <td>${tx.customer}</td>
            <td>${tx.seller}</td>
            <td>${tx.book}</td>
            <td>$${tx.amount.toFixed(2)}</td>
            <td>${tx.paymentMethod}</td>
            <td>${tx.date}</td>
            <td><span class="badge bg-${tx.status === 'Completed' ? 'success' : 'warning'}">${tx.status}</span></td>
            <td>
                <button class="btn btn-sm btn-outline-primary me-1">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="btn btn-sm btn-outline-info">
                    <i class="fas fa-receipt"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

// Navigation handling
document.querySelectorAll('.sidebar__nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const section = e.target.closest('.sidebar__nav-link').dataset.section;

        // Update active states
        document.querySelectorAll('.sidebar__nav-link').forEach(l => l.classList.remove('sidebar__nav-link--active'));
        e.target.closest('.sidebar__nav-link').classList.add('sidebar__nav-link--active');

        // Update content sections
        document.querySelectorAll('.content-section').forEach(s => s.classList.remove('content-section--active'));
        document.getElementById(section).classList.add('content-section--active');

        // Update page title
        document.getElementById('pageTitle').textContent = section.charAt(0).toUpperCase() + section.slice(1);
    });
});

// Sidebar toggle
document.getElementById('toggleSidebar').addEventListener('click', () => {
    document.getElementById('sidebar').classList.toggle('sidebar--collapsed');
    document.getElementById('mainContent').classList.toggle('main-content--expanded');
});

// Validate book data
function validateBook(bookData) {
    // Validate title
    if (!bookData.title || bookData.title.trim().length < 3) {
        showToast("Tên sách phải có ít nhất 3 ký tự", "error");
        return false;
    }

    // Validate author
    if (!bookData.author || bookData.author.trim().length < 2) {
        showToast("Tên tác giả phải có ít nhất 2 ký tự", "error");
        return false;
    }

    // Validate category
    if (!bookData.category) {
        showToast("Vui lòng chọn danh mục sách", "error");
        return false;
    }

    // Validate cost
    if (!bookData.cost || isNaN(bookData.cost) || bookData.cost <= 0) {
        showToast("Giá sách phải lớn hơn 0", "error");
        return false;
    }

    // Validate quantity
    if (!bookData.quantity || isNaN(bookData.quantity) || bookData.quantity < 0) {
        showToast("Số lượng sách không được âm", "error");
        return false;
    }

    // Validate image
    if (bookData.image) {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
        const maxSize = 5 * 1024 * 1024; // 5MB

        if (!allowedTypes.includes(bookData.image.type)) {
            showToast("Chỉ chấp nhận file ảnh (JPG, JPEG, PNG)", "error");
            return false;
        }

        if (bookData.image.size > maxSize) {
            showToast("Kích thước ảnh không được vượt quá 5MB", "error");
            return false;
        }
    }

    return true;
}

// Add new book
async function addBook(bookData) {
    try {
        // Validate book data
        if (!validateBook(bookData)) {
            return false;
        }

        // Create new book object
        const newBook = {
            title: bookData.title.trim(),
            author: bookData.author.trim(),
            category: bookData.category,
            cost: parseFloat(bookData.cost),
            quantity: parseInt(bookData.quantity),
            status: bookData.quantity > 0 ? "Available" : "Out of Stock"
        };

        // Show success message
        showToast("Thêm sách thành công!");

        // Reset form and close modal
        document.getElementById('addBookForm').reset();
        const modal = bootstrap.Modal.getInstance(document.getElementById('addBookModal'));
        modal.hide();

        return true;
    } catch (error) {
        showToast("Có lỗi xảy ra khi thêm sách", "error");
        console.error('Error adding book:', error);
        return false;
    }
}

// Handle add book form submission
document.getElementById('addBookForm')?.addEventListener('submit', async function (e) {
    e.preventDefault();

    const formData = new FormData(this);
    const bookData = {
        title: formData.get('title'),
        author: formData.get('author'),
        category: formData.get('category'),
        cost: formData.get('cost'),
        quantity: formData.get('quantity'),
        image: formData.get('image')
    };

    await addBook(bookData);
});

window.editBook = editBook;
window.viewBook = viewBook;
window.updateStock = updateStock;
window.deleteBook = deleteBook;
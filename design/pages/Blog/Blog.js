import initializeTinyMCE from "./modules/draft.js";
import { get } from "../../src/api/axios.js";

let articles = [];
let tinyMCEInitialized = false;
const articlesGrid = document.getElementById('articles-grid');
const loadMoreBtn = document.getElementById('load-more-btn');
const createBlogBtn = document.getElementById('create-blog-btn');
const editorModal = document.getElementById('editor-modal');
const editorClose = document.getElementById('editor-close');
const editorCancel = document.getElementById('editor-cancel');
const articleModal = document.getElementById('article-modal');
const modalClose = document.getElementById('modal-close');
const trendingArticles = document.getElementById('trending-articles');
let currentPage = 1;
const articlesPerPage = 6;

async function fetchArticles() {
    try {
        const res = await get('/articles')

        if (res) {
            console.log(res)
        }


        articles = res || [];

        renderArticles();
        renderTrendingArticles();
    } catch (error) {
        articlesGrid.innerHTML = `<p style="color:red;text-align:center;">Lỗi tải dữ liệu: ${error.message}</p>`;
    }
}

function getFilteredArticles() {
    return articles;
}

// Khởi tạo app
document.addEventListener('DOMContentLoaded', function () {
    initializeApp();
});

function initializeApp() {
    fetchArticles();
    setupEventListeners();
    initializeTinyMCE();
}

function setupEventListeners() {
    loadMoreBtn.addEventListener('click', loadMoreArticles);
    createBlogBtn.addEventListener('click', openBlogEditor);
    editorClose.addEventListener('click', closeBlogEditor);
    editorCancel.addEventListener('click', closeBlogEditor);
    modalClose.addEventListener('click', closeArticleModal);

    editorModal.addEventListener('click', function (e) {
        if (e.target === this) closeBlogEditor();
    });
    articleModal.addEventListener('click', function (e) {
        if (e.target === this) closeArticleModal();
    });

    document.getElementById('blog-form').addEventListener('submit', handleBlogSubmission);

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            if (articleModal.classList.contains('active')) closeArticleModal();
            if (editorModal.classList.contains('active')) closeBlogEditor();
        }
    });
}

function renderArticles() {
    const filteredArticles = getFilteredArticles();
    const articlesToShow = filteredArticles.slice(0, currentPage * articlesPerPage);

    articlesGrid.innerHTML = '';

    if (articlesToShow.length === 0) {
        articlesGrid.innerHTML = '<p style="text-align: center; color: var(--color-text-secondary); grid-column: 1 / -1; padding: 40px;">Không tìm thấy bài viết nào.</p>';
    } else {
        articlesToShow.forEach(article => {
            const articleElement = createArticleCard(article);
            articlesGrid.appendChild(articleElement);
        });
    }

    if (articlesToShow.length >= filteredArticles.length) {
        loadMoreBtn.style.display = 'none';
    } else {
        loadMoreBtn.style.display = 'block';
    }
}

function createArticleCard(article) {
    const card = document.createElement('div');
    card.className = 'article-card';
    card.onclick = () => openArticleModal(article);

    const formattedDate = new Date(article.date).toLocaleDateString('vi-VN');

    card.innerHTML = `
        <img src="${article.image}" alt="${article.title}" class="article-image" loading="lazy">
        <div class="article-content">
            <span class="article-category">${article.category}</span>
            <h3 class="article-title">${article.title}</h3>
            <p class="article-excerpt">${article.excerpt}</p>
            <div class="article-meta">
                <div class="article-author">
                    <img src="${article.avatar}" alt="${article.author}" class="author-avatar">
                    <div class="author-info">
                        <div class="author-name">${article.author}</div>
                        <div class="article-date">${formattedDate}</div>
                    </div>
                </div>
                <div class="article-stats">
                    <span class="stat">
                        <i class="fas fa-eye"></i>
                        ${article.views}
                    </span>
                    <span class="stat">
                        <i class="fas fa-heart"></i>
                        ${article.likes}
                    </span>
                </div>
            </div>
        </div>
    `;

    return card;
}

function renderTrendingArticles() {
    const sortedArticles = [...articles].sort((a, b) => b.views - a.views);
    const trending = sortedArticles.slice(0, 5);

    trendingArticles.innerHTML = '';

    trending.forEach((article, index) => {
        const trendingItem = document.createElement('div');
        trendingItem.className = 'trending-item';
        trendingItem.onclick = () => openArticleModal(article);

        trendingItem.innerHTML = `
            <div class="trending-number">${index + 1}</div>
            <div class="trending-title">${article.title}</div>
        `;

        trendingArticles.appendChild(trendingItem);
    });
}

function loadMoreArticles() {
    currentPage++;
    renderArticles();
}

function openArticleModal(article) {
    const articleDetail = document.getElementById('article-detail');
    const formattedDate = new Date(article.date).toLocaleDateString('vi-VN');

    articleDetail.innerHTML = `
        <img src="${article.image}" alt="${article.title}" style="width: 100%; height: 300px; object-fit: cover; border-radius: 8px; margin-bottom: 20px;">
        <span class="article-category">${article.category}</span>
        <h1 style="margin: 16px 0; font-size: 28px; line-height: 1.3;">${article.title}</h1>
        <div class="article-meta" style="margin-bottom: 24px; padding-bottom: 16px;">
            <div class="article-author">
                <img src="${article.avatar}" alt="${article.author}" class="author-avatar">
                <div class="author-info">
                    <div class="author-name">${article.author}</div>
                    <div class="article-date">${formattedDate}</div>
                </div>
            </div>
            <div class="article-stats">
                <span class="stat">
                    <i class="fas fa-eye"></i>
                    ${article.views}
                </span>
                <span class="stat">
                    <i class="fas fa-heart"></i>
                    ${article.likes}
                </span>
            </div>
        </div>
        <div class="article-content" style="line-height: 1.7; font-size: 16px;">
            ${article.content}
        </div>
    `;

    articleModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeArticleModal() {
    articleModal.classList.remove('active');
    document.body.style.overflow = '';
}

function openBlogEditor() {
    editorModal.classList.add('active');
    document.body.style.overflow = 'hidden';

    if (!tinyMCEInitialized) {
        initializeTinyMCE();
        tinyMCEInitialized = true;
    }
}

function closeBlogEditor() {
    editorModal.classList.remove('active');
    document.body.style.overflow = '';

    document.getElementById('blog-form').reset();
    if (window.tinymce && window.tinymce.get('blog-content')) {
        window.tinymce.get('blog-content').setContent('');
    }
}

function handleBlogSubmission(e) {
    e.preventDefault();

    const title = document.getElementById('blog-title').value;
    const category = document.getElementById('blog-category').value;

    let content = '';
    if (window.tinymce && window.tinymce.get('blog-content')) {
        content = window.tinymce.get('blog-content').getContent();
    } else {
        content = document.getElementById('blog-content').value;
    }

    if (!title || !content) {
        alert('Vui lòng điền đầy đủ thông tin!');
        return;
    }

    // Tạo bài viết mới (chỉ trên frontend)
    const newArticle = {
        id: articles.length > 0 ? Math.max(...articles.map(a => a.id)) + 1 : 1,
        title: title,
        excerpt: content.replace(/<[^>]*>/g, '').substring(0, 150) + '...',
        category: category,
        author: 'Người dùng mới',
        avatar: 'https://randomuser.me/api/portraits/lego/1.jpg',
        date: new Date().toISOString().split('T')[0],
        views: 0,
        likes: 0,
        image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400',
        content: content
    };

    articles.unshift(newArticle);

    currentPage = 1;
    renderArticles();
    renderTrendingArticles();

    closeBlogEditor();
    alert('Bài viết đã được xuất bản thành công!');
}


initializeApp()
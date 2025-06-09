/**
 * Khởi tạo TinyMCE editor cho modal viết bài
 * Đảm bảo gọi lại hàm này mỗi lần modal mở (sau khi textarea xuất hiện trong DOM)
 * Đảm bảo selector trùng với id của textarea
 */
function initializeTinyMCE() {
    // Nếu đã có instance TinyMCE thì remove trước khi init lại
    if (window.tinymce && tinymce.get('blog-content')) {
        tinymce.get('blog-content').remove();
    }
    tinymce.init({
        selector: '#blog-content',
        height: 500,
        plugins: [
            'anchor', 'autolink', 'charmap', 'codesample', 'emoticons', 'image', 'link',
            'lists', 'media', 'searchreplace', 'table', 'visualblocks', 'wordcount'
        ],
        toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | ' +
            'link image media table mergetags | addcomment showcomments | spellcheckdialog a11ycheck typography | ' +
            'align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat',
        tinycomments_mode: 'embedded',
        tinycomments_author: 'Author name',
        mergetags_list: [
            { value: 'First.Name', title: 'First Name' },
            { value: 'Email', title: 'Email' }
        ],
        skin: 'oxide',
        content_css: 'default',
        branding: false,
        menubar: false,
    });
}

export default initializeTinyMCE;

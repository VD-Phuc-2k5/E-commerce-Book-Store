import initializeTinyMCE from "./modules/draft.js";
function Blog() {
    const createBlogBtn = document.getElementById('createBlogBtn');
    const editorContainer = document.getElementById('editor-container');

    // Add click event listener to the button
    createBlogBtn.addEventListener('click', function () {
        // Toggle the visibility of the editor
        if (editorContainer.style.display === 'block') {
            editorContainer.style.display = 'none';
        } else {
            editorContainer.style.display = 'block';

            // Initialize TinyMCE when showing the editor
            initializeTinyMCE();
        }
    });
}
Blog()
export default function toastMsg() {
  // Show toast notification
  function showToast(message) {
    // Create toast container if it doesn't exist
    let toastContainer = document.getElementById("toast-container");

    if (!toastContainer) {
      toastContainer = document.createElement("div");
      toastContainer.id = "toast-container";
      toastContainer.className =
        "toast-container position-fixed bottom-0 end-0 p-3";
      document.body.appendChild(toastContainer);
    }

    // Create toast
    const toastId = "toast-" + Date.now();
    const toastHTML = `
                <div id="${toastId}" class="toast" role="alert" aria-live="assertive" aria-atomic="true">
                    <div class="toast-header">
                        <strong class="me-auto">BookHaven</strong>
                        <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
                    </div>
                    <div class="toast-body">
                        ${message}
                    </div>
                </div>
            `;

    toastContainer.innerHTML += toastHTML;

    const toastElement = document.getElementById(toastId);
    const toast = new bootstrap.Toast(toastElement, { delay: 3000 });
    toast.show();

    // Remove toast after it's hidden
    toastElement.addEventListener("hidden.bs.toast", () => {
      toastElement.remove();
    });
  }
}

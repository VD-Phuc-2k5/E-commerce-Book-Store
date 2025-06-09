import { getCartStore } from "../../src/modules/store.js";
import capitalizeWords from "../../src/modules/capitalizeWords.js";
import priceFormat from "../../src/modules/priceFormat.js";
import { showToast } from "../../src/modules/toast.js";

let cartData = [];
let selectedShipping = { method: "standard", cost: 35000 };
let selectedPayment = "";

// Load cart data
async function loadCart() {
  const loadingElement = document.getElementById("loadingCart");
  const errorElement = document.getElementById("errorMessage");
  const contentElement = document.getElementById("checkoutContent");

  contentElement.style.display = "block";
  loadingElement.style.display = "block";
  errorElement.style.display = "none";
  const response = getCartStore().getState();

  if (response.length) {
    updateTotal();
    loadingElement.style.display = "none";
  } else {
    loadingElement.style.display = "none";
    errorElement.style.display = "block";
    errorElement.textContent = "Không có sản phẩm trong giỏ hàng.";
  }
  cartData = response;
}

function displayCartItems() {
  const cartItemsContainer = document.getElementById("cartItems");
  cartItemsContainer.innerHTML = "";

  cartData.forEach((item) => {
    const itemElement = document.createElement("div");
    itemElement.className = "mb-3 pb-3 border-bottom";
    itemElement.innerHTML = `
      <div class="d-flex">
        <img src="${item.imageUrl}" alt="${
      item.title
    }" class="product-image me-3">
        <div class="flex-grow-1">
          <h6 class="mb-1">${item.title}</h6>
          <p class="text-muted small mb-1 ${item.author ? "" : "no-author"}">
            Tác giả: ${capitalizeWords(item.author)}
          </p>
          <div class="d-flex justify-content-between align-items-center">
            <span class="text-muted">Số lượng: ${item.quantity}</span>
            <span class="fw-bold">${priceFormat(
              item.cost * item.quantity
            )}</span>
          </div>
        </div>
      </div>
    `;

    itemElement.addEventListener("click", () => {
      window.appRouter.navigate(`/product?id=${item.id}`);
    });
    cartItemsContainer.appendChild(itemElement);
  });
}

function calculateSubtotal() {
  return cartData.reduce((total, item) => total + item.cost * item.quantity, 0);
}

function updateTotal() {
  const subtotal = calculateSubtotal();
  const total = subtotal + selectedShipping.cost;

  document.getElementById("subtotal").textContent = priceFormat(subtotal);
  document.getElementById("shippingCost").textContent = priceFormat(
    selectedShipping.cost
  );
  document.getElementById("totalAmount").textContent = priceFormat(total);
}

// Gán sự kiện chọn phương thức vận chuyển
function setupShippingOptions() {
  const shippingOptions = document.querySelectorAll(".shipping-option");
  if (shippingOptions.length) {
    shippingOptions[0].classList.add("selected");
  }

  shippingOptions.forEach((option) => {
    option.addEventListener("click", function () {
      shippingOptions.forEach((opt) => opt.classList.remove("selected"));
      this.classList.add("selected");
      selectedShipping = {
        method: this.dataset.method,
        cost: parseInt(this.dataset.cost),
      };
      updateTotal();
    });
  });
}

// Gán sự kiện chọn phương thức thanh toán
function setupPaymentMethods() {
  const paymentMethods = document.querySelectorAll(".payment-method");
  paymentMethods.forEach((method) => {
    method.addEventListener("click", function () {
      paymentMethods.forEach((pm) => pm.classList.remove("selected"));
      this.classList.add("selected");
      selectedPayment = this.dataset.method;
    });
  });
}

// Gán validate input
function setupFormValidation() {
  const formInputs = document.querySelectorAll(
    "#checkoutForm input, #checkoutForm select"
  );
  formInputs.forEach((input) => {
    input.addEventListener("input", () => {
      if (input.classList.contains("is-invalid")) {
        clearFieldError(input);
      }
    });

    input.addEventListener("blur", () => {
      validateSingleField(input);
    });
  });
}

// Gán sự kiện nút đặt hàng
function setupPlaceOrderButton() {
  document.getElementById("placeOrderBtn").addEventListener("click", () => {
    if (!selectedPayment) {
      showToast("Vui lòng chọn phương thức thanh toán");
      return;
    }

    const formValid = validateForm();
    if (formValid) {
      generatePaymentQR();
    }
  });
}

// Validate form tổng thể
function validateForm() {
  const requiredFields = [
    { id: "fullName", message: "Vui lòng nhập họ và tên" },
    { id: "phone", message: "Vui lòng nhập số điện thoại" },
    { id: "address", message: "Vui lòng nhập địa chỉ" },
    { id: "city", message: "Vui lòng chọn thành phố" },
    { id: "district", message: "Vui lòng nhập quận/huyện" },
  ];

  clearFormErrors();
  let isValid = true;

  requiredFields.forEach(({ id, message }) => {
    const field = document.getElementById(id);
    if (!field.value.trim()) {
      showFieldError(field, message);
      isValid = false;
    }
  });

  const email = document.getElementById("email").value.trim();
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    showFieldError(document.getElementById("email"), "Email không hợp lệ");
    isValid = false;
  }

  const phone = document
    .getElementById("phone")
    .value.trim()
    .replace(/\s/g, "");
  if (phone && !/^[0-9]{10,11}$/.test(phone)) {
    showFieldError(
      document.getElementById("phone"),
      "Số điện thoại không hợp lệ (10-11 số)"
    );
    isValid = false;
  }

  if (!isValid) {
    const firstError = document.querySelector(
      ".form-control.is-invalid, .form-select.is-invalid"
    );
    if (firstError) {
      firstError.scrollIntoView({ behavior: "smooth", block: "center" });
      firstError.focus();
    }
  }

  return isValid;
}

function showFieldError(field, message) {
  field.classList.add("is-invalid");
  const feedback = field.parentNode.querySelector(".invalid-feedback");
  if (feedback) feedback.textContent = message;
}

function clearFieldError(field) {
  field.classList.remove("is-invalid");
  const feedback = field.parentNode.querySelector(".invalid-feedback");
  if (feedback) feedback.textContent = "";
}

function clearFormErrors() {
  document
    .querySelectorAll(".form-control.is-invalid, .form-select.is-invalid")
    .forEach(clearFieldError);
}

function validateSingleField(field) {
  const value = field.value.trim();
  const fieldId = field.id;
  clearFieldError(field);

  if (field.hasAttribute("required") && !value) {
    const messages = {
      fullName: "Vui lòng nhập họ và tên",
      phone: "Vui lòng nhập số điện thoại",
      address: "Vui lòng nhập địa chỉ",
      city: "Vui lòng chọn thành phố",
      district: "Vui lòng nhập quận/huyện",
    };
    showFieldError(field, messages[fieldId] || "Trường này là bắt buộc");
    return false;
  }

  if (
    value &&
    fieldId === "email" &&
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
  ) {
    showFieldError(field, "Email không hợp lệ");
    return false;
  }

  if (
    value &&
    fieldId === "phone" &&
    !/^[0-9]{10,11}$/.test(value.replace(/\s/g, ""))
  ) {
    showFieldError(field, "Số điện thoại không hợp lệ (10-11 số)");
    return false;
  }

  return true;
}

// QR code hiển thị
function generatePaymentQR() {
  const total = calculateSubtotal() + selectedShipping.cost;
  const orderInfo = `Thanh toan don hang ${Date.now()}`;
  const qrData = `Amount: ${total} VND\nContent: ${orderInfo}\nBank: VietcomBank\nAccount: 1234567890`;

  const qr = qrcode(0, "M");
  qr.addData(qrData);
  qr.make();

  document.getElementById("qrcode").innerHTML = qr.createImgTag(4);
  document.getElementById("paymentAmount").textContent = priceFormat(total);
  document.getElementById("paymentContent").textContent = orderInfo;

  const modal = new bootstrap.Modal(document.getElementById("paymentModal"));
  modal.show();
}

document.querySelector(".btn-close")?.addEventListener("click", () => {
  document
    .querySelectorAll(".modal-backdrop")
    ?.forEach((item) => item.remove());
});

// Init
getCartStore().subscribe(() => {
  if (window.location.pathname === "/checkout") {
    loadCart();
    displayCartItems();
    updateTotal();
    setupShippingOptions();
    setupPaymentMethods();
    setupFormValidation();
    setupPlaceOrderButton();
  }
});

getCartStore().dispatch({ type: "" });

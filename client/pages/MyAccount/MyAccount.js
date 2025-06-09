import { post } from "../../src/api/axios.js";
import { showToast } from "../../src/modules/toast.js";

// Function to show error message for specific input
function showError(inputId, message) {
  const errorMessageEl = document.getElementById(inputId);
  errorMessageEl.textContent = message;
}

// Function to clear error message for specific input
function clearError(inputId) {
  const errorMessageEl = document.getElementById(inputId);
  errorMessageEl.textContent = "";
}

// Function to validate email format
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
}

// Function to validate password
function validatePassword(password) {
  return password.length >= 3;
}

// Handle Sign Up
const signUpButton = document.querySelector(
  ".myAccount__form__register .myAccount__form__button"
);

if (signUpButton) {
  signUpButton.addEventListener("click", async () => {
    clearError("registerEmailError");
    clearError("registerPasswordError");
    const email = document.querySelector(
      ".myAccount__form__register input[type='email']"
    ).value;
    const password = document.querySelector("#passwordInputRegister").value;

    // Validate fields
    if (!validateEmail(email)) {
      showError("registerEmailError", "Please enter a valid email address.");
      return;
    }
    if (!validatePassword(password)) {
      showError(
        "registerPasswordError",
        "Password must be at least 6 characters long."
      );
      return;
    }

    try {
      const res = await post("signup", { email, password });
      showToast(res.message);
    } catch (err) {
      showToast("Tài khoản đã tồn tại.");
    }
  });
}

// Handle Login
const loginButton = document.querySelector(
  ".myAccount__form__login .myAccount__form__button"
);
if (loginButton) {
  loginButton.addEventListener("click", async () => {
    clearError("loginEmailError");
    clearError("loginPasswordError");
    const email = document.querySelector(
      ".myAccount__form__login input[type='email']"
    ).value;
    const password = document.querySelector("#passwordInputLogin").value;

    // Validate fields
    if (!validateEmail(email)) {
      showError("loginEmailError", "Please enter a valid email address.");
      return;
    }
    if (!validatePassword(password)) {
      showError(
        "loginPasswordError",
        "Password must be at least 6 characters long."
      );
      return;
    }

    // Call API to log in
    try {
      const res = await post("login", { email, password });
      sessionStorage.setItem("role", res.role);

      if (res.role === "admin") window.location.href = "http://localhost:5174";
      showToast(res.message);
    } catch {
      showToast("Đăng nhập thất bại");
    }
  });
}

// Show and hide password handler
const toggleLogin = document.querySelector("#togglePasswordLoginBtn");
if (toggleLogin) {
  toggleLogin.addEventListener("click", () => {
    const passwordInputEl = document.querySelector("#passwordInputLogin");
    const currInputType = passwordInputEl.getAttribute("type");
    const nextInputType = currInputType === "password" ? "text" : "password";
    passwordInputEl.setAttribute("type", nextInputType);

    toggleLogin.classList.toggle("fa-eye-slash");
    toggleLogin.classList.toggle("fa-eye");
  });
}

const toggleRegister = document.querySelector("#togglePasswordRegisterBtn");
if (toggleRegister) {
  toggleRegister.addEventListener("click", () => {
    const passwordInputEl = document.querySelector("#passwordInputRegister");
    const currInputType = passwordInputEl.getAttribute("type");
    const nextInputType = currInputType === "password" ? "text" : "password";
    passwordInputEl.setAttribute("type", nextInputType);

    toggleRegister.classList.toggle("fa-eye-slash");
    toggleRegister.classList.toggle("fa-eye");
  });
}

// Show and hide login form and register form handler
const form = document.querySelector("#myAccount__form");
const controlBtns = document.querySelectorAll(
  ".myAccount__form__controls button"
);

if (controlBtns) {
  controlBtns[0].addEventListener("click", () => {
    form.classList.remove("active");
    document.querySelector(".myAccount__form__register").style.display =
      "block";
    document.querySelector(".myAccount__form__login").style.display = "none";
    document.querySelector(".myAccount__form__verification").style.display =
      "none";
  });

  controlBtns[1].addEventListener("click", () => {
    form.classList.add("active");
    document.querySelector(".myAccount__form__register").style.display = "none";
    document.querySelector(".myAccount__form__login").style.display = "block";
    document.querySelector(".myAccount__form__verification").style.display =
      "none";
  });
}

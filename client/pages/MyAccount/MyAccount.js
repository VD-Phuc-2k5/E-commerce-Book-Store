import { post } from "../../src/api/axios.js";

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
  signUpButton.addEventListener("click", () => {
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

    // Call API to create account
    fetch("/api/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          alert("Account created successfully!");
          sendVerificationCode(email);
        } else {
          showError(
            "registerEmailError",
            data.message || "Error creating account."
          );
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        showError("registerEmailError", "An error occurred. Please try again.");
      });
  });
}

// Handle Login
const loginButton = document.querySelector(
  ".myAccount__form__login .myAccount__form__button"
);
if (loginButton) {
  loginButton.addEventListener("click", () => {
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
    fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          alert("Login successful!");
        } else {
          showError("loginEmailError", data.message || "Error logging in.");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        showError("loginEmailError", "An error occurred. Please try again.");
      });
  });
}

// Function to send verification code
function sendVerificationCode(email) {
  fetch("/api/send-verification-code", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        alert("Verification code sent to your email!");
        document.querySelector(".myAccount__form__register").style.display =
          "none";
        document.querySelector(".myAccount__form__verification").style.display =
          "block";
      } else {
        showError(
          "registerEmailError",
          data.message || "Error sending verification code."
        );
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      showError(
        "registerEmailError",
        "An error occurred while sending verification code."
      );
    });
}

// Handle verification code input
const verificationInputs = document.querySelectorAll(".verification-code");

verificationInputs.forEach((input, index) => {
  input.addEventListener("input", (e) => {
    // Chuyển đến ô tiếp theo khi nhập
    if (e.target.value.length === 1 && index < verificationInputs.length - 1) {
      verificationInputs[index + 1].focus();
    }
    // Quay lại ô trước nếu ô hiện tại bị xóa
    if (e.target.value.length === 0 && index > 0) {
      verificationInputs[index - 1].focus();
    }
  });
});

// Handle verification code submission
const verifyCodeButton = document.getElementById("verifyCodeButton");
if (verifyCodeButton) {
  verifyCodeButton.addEventListener("click", () => {
    clearError("verificationCodeError");

    // Lấy mã xác minh từ các ô input
    const verificationCode = Array.from(verificationInputs)
      .map((input) => input.value)
      .join("");

    // Validate verification code
    if (verificationCode.length < 6) {
      showError(
        "verificationCodeError",
        "Please enter the complete verification code."
      );
      return;
    }

    // Call API to verify code
    fetch("/api/verify-code", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ code: verificationCode }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          alert("Email verified successfully!");
        } else {
          showError(
            "verificationCodeError",
            data.message || "Error verifying code."
          );
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        showError(
          "verificationCodeError",
          "An error occurred. Please try again."
        );
      });
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

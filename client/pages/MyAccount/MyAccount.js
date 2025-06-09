// show and hide password handler
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

// show and hide login form and register form handler
const form = document.querySelector("#myAccount__form");
const controlBtns = document.querySelectorAll(
  ".myAccount__form__controls button"
);

if (controlBtns) {
  controlBtns[0].addEventListener("click", () => {
    form.classList.remove("active");
  });

  controlBtns[1].addEventListener("click", () => {
    form.classList.add("active");
  });
}

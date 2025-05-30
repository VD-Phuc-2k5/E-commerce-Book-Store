const contactBtn = document.querySelector("#contactBtn");
const contactSection = document.querySelector("#contactSection");

if (contactBtn && contactSection) {
  contactBtn.addEventListener("click", () => {
    scrollTo({ top: contactSection?.offsetTop - 20 || 0, behavior: "smooth" });
  });
}

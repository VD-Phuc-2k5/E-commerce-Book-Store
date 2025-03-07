export default function navigate() {
  function navigateTo(page) {
    document.getElementById("homePage").style.display = "none";
    document.getElementById("catalogPage").style.display = "none";
    document.getElementById("bookDetail").style.display = "none";
    document.getElementById("checkoutPage").style.display = "none";
    document.getElementById("orderSuccessPage").style.display = "none";

    document.getElementById(page).style.display = "block";

    window.scrollTo(0, 0);
  }
}

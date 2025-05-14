export function showLoading() {
  const loadingBox = document.getElementById("loading-animation");
  loadingBox.classList.add("active");
  document.body.style = "overflow-y: hidden";
}

export function hideLoading(delay = 1000) {
  setTimeout(() => {
    const loading = document.getElementById("loading-animation");
    const loadingFadeOut = loading.animate([{ opacity: 1 }, { opacity: 0 }], {
      duration: 1000,
      easing: "ease-in-out",
    });

    loadingFadeOut.onfinish = () => {
      loading.classList.remove("active");
      document.body.style = "overflow-y: auto";
    };
  }, delay);
}

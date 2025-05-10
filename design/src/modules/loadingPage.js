export function showLoading() {
  document.getElementById("loading-animation").style.display = "flex";
}

export function hideLoading(delay = 2000) {
  setTimeout(() => {
    const loading = document.getElementById("loading-animation");
    loading.style = "animation: fadeOut 1s ease-in-out forwards";
  }, delay);
}

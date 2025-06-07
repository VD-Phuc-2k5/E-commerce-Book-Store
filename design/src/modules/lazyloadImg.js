function lazyLoadImg() {
  const blurredImageDiv = document.querySelector(".blurred-img");
  const img = blurredImageDiv.querySelector("img");
  function loaded() {
    blurredImageDiv.classList.add("loaded");
  }

  if (img.complete) {
    loaded();
  } else {
    img.addEventListener("load", loaded);
  }
}

export default lazyLoadImg;

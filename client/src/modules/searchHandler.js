const searchBox = document.querySelector("#dropSearch");

if (searchBox) {
  function handleSearch(query) {
    window.appRouter.navigate(encodeURI(`/all-books?search=${query}`));
  }

  searchBox.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      const searchValue = event.target.value.trim();

      if (searchValue !== "") {
        handleSearch(searchValue);
      }
    }
  });

  searchBox.addEventListener("change", () => {
    const searchValue = searchBox.value.trim();

    if (searchValue !== "") {
      handleSearch(searchValue);
    }
  });
}

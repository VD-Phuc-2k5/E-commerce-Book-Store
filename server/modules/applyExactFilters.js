const applyExactFilters = (data, { title, author, category, avg_rating }) => {
  let result = data;

  if (title) {
    result = result.filter((book) =>
      book.title.toLowerCase().includes(title.trim().toLowerCase())
    );
  }
  if (author) {
    result = result.filter((book) =>
      book.author.toLowerCase().includes(author.trim().toLowerCase())
    );
  }
  if (category) {
    result = result.filter((book) =>
      book.category.toLowerCase().includes(category.trim().toLowerCase())
    );
  }
  if (avg_rating) {
    const rating = parseFloat(avg_rating);
    result = result.filter((book) => Number(book.avg_rating) === rating);
  }

  return result;
};

export default applyExactFilters;

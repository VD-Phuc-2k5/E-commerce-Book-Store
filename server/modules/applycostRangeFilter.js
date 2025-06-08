const applyCostRangeFilter = (data, minCost, maxCost) => {
  const min = parseFloat(minCost) || 0;
  const max = parseFloat(maxCost) || Infinity;

  return data.filter((book) => {
    const cost = Number(book.cost);
    return !isNaN(cost) && cost >= min && cost <= max;
  });
};

export default applyCostRangeFilter;

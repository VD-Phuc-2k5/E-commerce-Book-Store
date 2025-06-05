function priceFormat(price) {
  price = String(price);
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

export default priceFormat;

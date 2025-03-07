const cart = [];
const activeOrderData = {};

export function addToCart(bookId, quantity = 1) {
  const book = books.find((b) => b.id === bookId);
  if (!book) return;

  const existingItemIndex = cart.findIndex((item) => item.id === bookId);

  if (existingItemIndex !== -1) {
    cart[existingItemIndex].quantity += quantity;
  } else {
    cart.push({
      id: book.id,
      name: book.name,
      price: book.price,
      image: book.image,
      quantity: quantity,
    });
  }

  updateCartUI();
  showToast("Đã thêm sách vào giỏ hàng!");
}

export function removeFromCart(bookId) {
  cart = cart.filter((item) => item.id !== bookId);
  updateCartUI();
}

export function updateCartQuantity(bookId, quantity) {
  const index = cart.findIndex((item) => item.id === bookId);
  if (index !== -1) {
    if (quantity <= 0) {
      removeFromCart(bookId);
    } else {
      cart[index].quantity = quantity;
      updateCartUI();
    }
  }
}

export function updateCartUI() {
  const cartItemsContainer = document.getElementById("cartItems");
  const cartCountElement = document.getElementById("cartCount");
  const cartTotalElement = document.getElementById("cartTotal");

  // Update cart count
  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
  cartCountElement.textContent = totalItems;

  // Update cart items
  if (cart.length === 0) {
    cartItemsContainer.innerHTML = `
                    <div class="text-center py-3">
                        <p>Giỏ hàng trống</p>
                    </div>
                `;
  } else {
    let cartItemsHTML = "";
    let cartTotal = 0;

    cart.forEach((item) => {
      const itemTotal = item.price * item.quantity;
      cartTotal += itemTotal;

      cartItemsHTML += `
                        <div class="cart-item d-flex">
                            <img src="${item.image}" alt="${
        item.name
      }" class="cart-item-img me-2">
                            <div class="flex-grow-1">
                                <div class="d-flex justify-content-between">
                                    <h6 class="mb-0">${item.name}</h6>
                                    <button class="btn btn-sm text-danger p-0 ms-2" onclick="removeFromCart(${
                                      item.id
                                    })">
                                        <i class="bi bi-x"></i>
                                    </button>
                                </div>
                                <div class="d-flex align-items-center mt-2">
                                    <div class="input-group input-group-sm" style="width: 100px;">
                                        <button class="btn btn-outline-secondary qty-btn" type="button" 
                                            onclick="updateCartQuantity(${
                                              item.id
                                            }, ${item.quantity - 1})">-</button>
                                        <input type="number" class="form-control text-center" value="${
                                          item.quantity
                                        }" 
                                            min="1" onchange="updateCartQuantity(${
                                              item.id
                                            }, parseInt(this.value))">
                                        <button class="btn btn-outline-secondary qty-btn" type="button" 
                                            onclick="updateCartQuantity(${
                                              item.id
                                            }, ${item.quantity + 1})">+</button>
                                    </div>
                                    <div class="ms-auto">${formatCurrency(
                                      item.price
                                    )}</div>
                                </div>
                            </div>
                        </div>
                    `;
    });

    cartItemsContainer.innerHTML = cartItemsHTML;
    cartTotalElement.textContent = formatCurrency(cartTotal);
  }
}

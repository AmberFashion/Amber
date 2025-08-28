// ---------- CART STATE ----------
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// ---------- ELEMENTS ----------
const cartCountEl = document.getElementById("cart-count");
const cartItemsEl = document.getElementById("cart-items");
const cartTotalEl = document.getElementById("cart-total");
const cartBtn = document.getElementById("cart-btn");
const cartModal = document.getElementById("cart-modal");
const closeCartBtn = document.getElementById("close-cart");
const clearCartBtn = document.getElementById("clear-cart");
const checkoutBtn = document.getElementById("checkout-btn");
const checkoutModal = document.getElementById("checkout-modal");
const closeCheckout = document.getElementById("close-checkout");
const orderPreview = document.getElementById("order-preview");
const orderInput = document.getElementById("order-input");
const totalInput = document.getElementById("total-input");
const checkoutForm = document.getElementById("checkout-form");

// ---------- HELPERS ----------
function formatINR(n) {
  return Number(n).toLocaleString("en-IN");
}

// Render cart items
function renderCart() {
  cartItemsEl.innerHTML = "";
  let total = 0;

  cart.forEach((item, idx) => {
    total += item.price;

    const li = document.createElement("li");
    li.textContent = `${item.name} — ₹${formatINR(item.price)}`;

    // Remove button
    const removeBtn = document.createElement("button");
    removeBtn.textContent = "Remove";
    removeBtn.addEventListener("click", () => {
      cart.splice(idx, 1);
      updateCart();
    });

    li.appendChild(removeBtn);
    cartItemsEl.appendChild(li);
  });

  cartTotalEl.textContent = formatINR(total);
  cartCountEl.textContent = cart.length;
  localStorage.setItem("cart", JSON.stringify(cart));
}

// ---------- ADD TO CART ----------
document.querySelectorAll(".add-to-cart").forEach(btn => {
  btn.addEventListener("click", e => {
    const card = e.target.closest(".product-card");
    const name = card.dataset.name;
    const price = parseFloat(card.dataset.price);
    cart.push({ name, price });
    updateCart();
  });
});

function updateCart() {
  renderCart();
}

// ---------- CART MODAL ----------
cartBtn.addEventListener("click", () => cartModal.style.display = "flex");
closeCartBtn.addEventListener("click", () => cartModal.style.display = "none");
clearCartBtn.addEventListener("click", () => { cart = []; updateCart(); });

// ---------- CHECKOUT ----------
checkoutBtn.addEventListener("click", () => {
  if(cart.length === 0) return alert("Cart is empty!");

  // Populate checkout form
  const lines = cart.map((item, idx) => `${idx+1}. ${item.name} — ₹${formatINR(item.price)}`);
  orderPreview.value = lines.join("\n");
  orderInput.value = cart.map(item => `${item.name}:${item.price}`).join("|");
  totalInput.value = cart.reduce((sum, item) => sum + item.price, 0);

  cartModal.style.display = "none";
  checkoutModal.style.display = "flex";
});

closeCheckout.addEventListener("click", () => checkoutModal.style.display = "none");

checkoutForm.addEventListener("submit", () => {
  cart = [];
  updateCart();
});

// Initial render
updateCart();

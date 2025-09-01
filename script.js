// ------- State -------
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// ------- Elements -------
const cartCountEl = document.getElementById("cart-count");
const cartBtn = document.getElementById("cart-btn");
const cartModal = document.getElementById("cart-modal");
const closeCartBtn = document.getElementById("close-cart");
const cartItemsEl = document.getElementById("cart-items");
const cartTotalEl = document.getElementById("cart-total");
const clearCartBtn = document.getElementById("clear-cart");
const checkoutBtn = document.getElementById("checkout-btn");

const checkoutModal = document.getElementById("checkout-modal");
const closeCheckout = document.getElementById("close-checkout");
const checkoutForm = document.getElementById("checkout-form");
const orderPreview = document.getElementById("order-preview");
const orderInput = document.getElementById("order-input");
const totalInput = document.getElementById("total-input");

// ------- Helpers -------
function formatINR(n) {
  return Number(n).toLocaleString("en-IN");
}

function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function renderCart() {
  cartItemsEl.innerHTML = "";
  let total = 0;

  cart.forEach((item, idx) => {
    total += item.price * item.quantity;

    const li = document.createElement("li");
    li.className = "cart-item";

    li.innerHTML = `
      <img src="${item.image || "Images/favicon.png"}" alt="${item.name}" class="cart-thumb">
      <div class="info">
        <h4>${item.name}</h4>
        <p>₹${formatINR(item.price)} × ${item.quantity}</p>
      </div>
      <button class="remove" data-index="${idx}">✖</button>
    `;

    cartItemsEl.appendChild(li);
  });

  cartTotalEl.textContent = formatINR(total);
  cartCountEl.textContent = cart.reduce((sum, i) => sum + i.quantity, 0);

  saveCart();
}

function updateCart() {
  renderCart();
}

// ------- Add to cart -------
document.querySelectorAll(".add-to-cart").forEach(btn => {
  btn.addEventListener("click", (e) => {
    const card = e.target.closest(".product-card");
    const name = card.dataset.name;
    const price = parseFloat(card.dataset.price);
    const image = card.querySelector("img").src;

    const existing = cart.find(i => i.name === name);
    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({ name, price, quantity: 1, image });
    }
    updateCart();
  });
});

// ------- Remove item -------
cartItemsEl.addEventListener("click", (e) => {
  if (e.target.classList.contains("remove")) {
    const idx = e.target.dataset.index;
    cart.splice(idx, 1);
    updateCart();
  }
});

// ------- Cart modal -------
cartBtn.addEventListener("click", () => cartModal.style.display = "flex");
closeCartBtn.addEventListener("click", () => cartModal.style.display = "none");
clearCartBtn.addEventListener("click", () => { cart = []; updateCart(); });

// ------- Checkout modal -------
checkoutBtn.addEventListener("click", () => {
  if (cart.length === 0) return;
  const lines = cart.map((i, idx) =>
    `${idx + 1}. ${i.name} — ₹${formatINR(i.price)} × ${i.quantity}`
  );
  const total = cart.reduce((s, i) => s + i.price * i.quantity, 0);

  orderPreview.value = lines.join("\n");
  orderInput.value = cart.map(i => `${i.name}:${i.price}×${i.quantity}`).join("|");
  totalInput.value = total;

  cartModal.style.display = "none";
  checkoutModal.style.display = "flex";
});

// ------- On Form Submit -------
checkoutForm.addEventListener("submit", () => {
  cart = [];
  updateCart();
  checkoutModal.style.display = "none";
  
});

// ------- Initial render -------
updateCart();
// ------- SLIDER -------
const slides = document.querySelector('.slides');
const slideItems = document.querySelectorAll('.slide');
const dotsContainer = document.querySelector('.dots');

let currentIndex = 0;
const realSlides = slideItems.length;
let dots = [];

// Create dots
for (let i = 0; i < realSlides; i++) {
  const dot = document.createElement('div');
  dot.classList.add('dot');
  if (i === 0) dot.classList.add('active');
  dot.addEventListener('click', () => goToSlide(i));
  dotsContainer.appendChild(dot);
  dots.push(dot);
}

function updateDots() {
  dots.forEach((dot, i) => {
    dot.classList.toggle('active', i === currentIndex);
  });
}

function showSlide(index) {
  currentIndex = (index + realSlides) % realSlides;
  slides.style.transform = `translateX(-${currentIndex * 100}%)`;
  updateDots();
}

function goToSlide(index) {
  showSlide(index);
  resetInterval();
}

function nextSlide() {
  showSlide(currentIndex + 1);
}

let slideInterval = setInterval(nextSlide, 3000);

function resetInterval() {
  clearInterval(slideInterval);
  slideInterval = setInterval(nextSlide, 3000);
}

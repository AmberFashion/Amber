// ------- State -------
let cart = [];

// ------- Elements -------
const cartCountEl   = document.getElementById("cart-count");
const cartBtn       = document.getElementById("cart-btn");
const cartModal     = document.getElementById("cart-modal");
const closeCartBtn  = document.getElementById("close-cart");
const cartItemsEl   = document.getElementById("cart-items");
const cartTotalEl   = document.getElementById("cart-total");
const clearCartBtn  = document.getElementById("clear-cart");
const checkoutBtn   = document.getElementById("checkout-btn");

const checkoutModal = document.getElementById("checkout-modal");
const closeCheckout = document.getElementById("close-checkout");
const checkoutForm  = document.getElementById("checkout-form");
const orderPreview  = document.getElementById("order-preview");
const orderInput    = document.getElementById("order-input");
const totalInput    = document.getElementById("total-input");

// ------- Helpers -------
function formatINR(n) {
  return Number(n).toLocaleString("en-IN");
}

function renderCart() {
  cartItemsEl.innerHTML = "";
  let total = 0;

  cart.forEach((item, idx) => {
    total += item.price;

    const li = document.createElement("li");

    const left = document.createElement("span");
    left.className = "title";
    left.textContent = `${item.name}`;

    const mid = document.createElement("span");
    mid.textContent = `₹${formatINR(item.price)}`;

    const rm = document.createElement("button");
    rm.className = "remove";
    rm.textContent = "Remove";
    rm.addEventListener("click", () => {
      cart.splice(idx, 1);
      updateCart();
    });

    li.appendChild(left);
    li.appendChild(mid);
    li.appendChild(rm);
    cartItemsEl.appendChild(li);
  });

  cartTotalEl.textContent = formatINR(total);
  cartCountEl.textContent = cart.length;
}

function updateCart() {
  renderCart();
}

// ------- Add to Cart -------
document.querySelectorAll(".add-to-cart").forEach(btn => {
  btn.addEventListener("click", (e) => {
    const card = e.target.closest(".product-card");
    const name = card.dataset.name;
    const price = parseFloat(card.dataset.price);
    cart.push({ name, price });
    updateCart();
  });
});

// ------- Cart Modal Controls -------
cartBtn.addEventListener("click", () => { cartModal.style.display = "flex"; });
closeCartBtn.addEventListener("click", () => { cartModal.style.display = "none"; });

clearCartBtn.addEventListener("click", () => {
  cart = [];
  updateCart();
});

// Close modals when backdrop clicked
[cartModal, checkoutModal].forEach(modal => {
  modal.addEventListener("click", (e) => {
    if (e.target === modal) modal.style.display = "none";
  });
});

// ------- Checkout -------
checkoutBtn.addEventListener("click", () => {
  if (cart.length === 0) return;

  const lines = cart.map((i, idx) => `${idx + 1}. ${i.name} — ₹${formatINR(i.price)}`);
  const total = cart.reduce((s, i) => s + i.price, 0);

  orderPreview.value = lines.join("\n");
  orderInput.value   = cart.map(i => `${i.name}:${i.price}`).join("|");
  totalInput.value   = total;

  cartModal.style.display = "none";
  checkoutModal.style.display = "flex";
});

closeCheckout.addEventListener("click", () => { checkoutModal.style.display = "none"; });

checkoutForm.addEventListener("submit", () => {
  cart = [];
  updateCart();
});

// Initial render
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

// Show slide + sync dots
function showSlide(index) {
  currentIndex = (index + realSlides) % realSlides; // <-- FIXED
  slides.style.transform = `translateX(-${currentIndex * 100}%)`;
  updateDots();
}

// Dot click navigation
function goToSlide(index) {
  showSlide(index);
  resetInterval();
}

// Autoplay loop
function nextSlide() {
  showSlide(currentIndex + 1);
}

// Autoplay every 3s
let slideInterval = setInterval(nextSlide, 3000);

// Reset autoplay
function resetInterval() {
  clearInterval(slideInterval);
  slideInterval = setInterval(nextSlide, 3000);
}

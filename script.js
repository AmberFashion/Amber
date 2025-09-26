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

// ------- Search Elements -------
const searchBar = document.getElementById("search-bar");
const searchBtn = document.getElementById("search-btn");
const resultsList = document.getElementById("search-results");
const products = document.querySelectorAll(".product-card");

// ------- Filters & Sorting Elements -------
const sizeFilters = document.querySelectorAll('input[name="size"]');
const colorFilters = document.querySelectorAll('input[name="color"]');
const priceFilters = document.querySelectorAll('input[name="price"]');
const sortSelect = document.getElementById('sort-products');
const clearFiltersBtn = document.getElementById('clear-filters');

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

checkoutForm.addEventListener("submit", () => {
  cart = [];
  updateCart();
  checkoutModal.style.display = "none";
});

// ------- Initial render -------
updateCart();

// ------- Slider -------
const slides = document.querySelector('.slides');
const slideItems = document.querySelectorAll('.slide');
const dotsContainer = document.querySelector('.dots');

let currentIndex = 0;
const totalSlides = slideItems.length;
let dots = [];

// Create dots
for (let i = 0; i < totalSlides; i++) {
  const dot = document.createElement('div');
  dot.classList.add('dot');
  if(i === 0) dot.classList.add('active');
  dot.addEventListener('click', () => goToSlide(i));
  dotsContainer.appendChild(dot);
  dots.push(dot);
}

function updateDots() {
  dots.forEach((dot, i) => dot.classList.toggle('active', i === currentIndex));
}

function showSlide(index) {
  currentIndex = (index + totalSlides) % totalSlides;
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

let slideInterval = setInterval(nextSlide, 4000); // 4 seconds per slide
function resetInterval() {
  clearInterval(slideInterval);
  slideInterval = setInterval(nextSlide, 4000);
}

// ------- Hamburger toggle -------
const hamburger = document.getElementById('hamburger');
const navLinks = document.querySelector('.nav-links');
const searchContainer = document.querySelector('.search-container');

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('active');
  searchContainer.classList.toggle('search-hidden', navLinks.classList.contains('active'));
});

// ------- Razorpay Checkout -------
document.getElementById("checkout-btn").addEventListener("click", async () => {
  const total = parseInt(document.getElementById("cart-total").innerText);
  const response = await fetch("http://localhost:5000/create-order", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ amount: total })
  });
  const order = await response.json();

  const options = {
    key: "rzp_test_RDy2KX1PBrQ5aV",
    amount: order.amount,
    currency: order.currency,
    name: "Amber Fashion",
    description: "T-Shirt Purchase",
    order_id: order.id,
    handler: async function (response) {
      const verifyRes = await fetch("http://localhost:5000/verify-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(response)
      });
      const verifyData = await verifyRes.json();
      if (verifyData.success) {
        alert("✅ Payment Successful! Order confirmed.");
        window.location.href = "thankyou.html";
      } else {
        alert("❌ Payment verification failed!");
      }
    },
    theme: { color: "#ff4e50" }
  };

  const rzp1 = new Razorpay(options);
  rzp1.open();
});

// ------- Fuse.js Search -------
const productList = Array.from(products).map(product => ({
  element: product,
  name: product.querySelector("h3").innerText,
  desc: product.querySelector(".short-desc").innerText
}));

const fuse = new Fuse(productList, {
  keys: ["name", "desc"],
  threshold: 0.4,
});

function searchProducts() {
  const query = searchBar.value.trim();
  resultsList.innerHTML = "";

  if (query === "") {
    products.forEach(p => p.style.display = "block");
    resultsList.style.display = "none";
    return;
  }

  const results = fuse.search(query);
  products.forEach(p => p.style.display = "none");

  if (results.length === 0) {
    const li = document.createElement("li");
    li.textContent = "No results found";
    li.style.color = "red";
    resultsList.appendChild(li);
    resultsList.style.display = "block";
    return;
  }

  results.forEach(res => {
    res.item.element.style.display = "block";

    const li = document.createElement("li");
    li.textContent = res.item.name;
    li.addEventListener("click", () => {
      res.item.element.scrollIntoView({ behavior: "smooth", block: "center" });
      resultsList.style.display = "none";
    });
    resultsList.appendChild(li);
  });

  resultsList.style.display = "block";
}

searchBtn.addEventListener("click", searchProducts);
searchBar.addEventListener("keyup", searchProducts);

// Dropdown elements
const sizeFilter = document.getElementById('size-filter');
const colorFilter = document.getElementById('color-filter');
const priceFilter = document.getElementById('price-filter');

// Filter function
function filterProducts() {
  const selectedSize = sizeFilter.value;
  const selectedColor = colorFilter.value;
  const selectedPrice = priceFilter.value;

  let visibleCount = 0;

  products.forEach(product => {
    const size = product.dataset.size;
    const color = product.dataset.color;
    const price = Number(product.dataset.price);

    let sizeMatch = selectedSize ? size === selectedSize : true;
    let colorMatch = selectedColor ? color === selectedColor : true;
    let priceMatch = true;

    if (selectedPrice) {
      const [min, max] = selectedPrice.split('-').map(Number);
      priceMatch = price >= min && price <= (max || Infinity);
    }

    const show = sizeMatch && colorMatch && priceMatch;
    product.style.display = show ? "block" : "none";
    if(show) visibleCount++;
  });

  document.getElementById('product-count')?.remove();
  const productCount = document.createElement('p');
  productCount.id = 'product-count';
  productCount.textContent = `${visibleCount} products found`;
  document.querySelector('.products').prepend(productCount);

  sortProducts();
}

// Event listeners
[sizeFilter, colorFilter, priceFilter, sortSelect].forEach(el =>
  el.addEventListener('change', filterProducts)
);

// Initial filter
document.addEventListener("DOMContentLoaded", filterProducts);

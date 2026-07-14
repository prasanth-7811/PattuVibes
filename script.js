const products = [
  { id: 1, name: "Crimson Cottonjute", type: "cottonjute", price: 12500, emoji: "🔴", badge: "Bestseller" },
  { id: 2, name: "Royal Blue Cottonjute", type: "cottonjute", price: 14000, emoji: "🔵", badge: "New" },
  { id: 3, name: "Golden Small Putta", type: "smallputta", price: 9800, emoji: "🟡", badge: "Popular" },
  { id: 4, name: "Ivory Small Putta", type: "smallputta", price: 11200, emoji: "⚪", badge: "" },
  { id: 5, name: "Parrot Green Big Putta", type: "bigputta", price: 18000, emoji: "🟢", badge: "Premium" },
  { id: 6, name: "Sunset Big Putta", type: "bigputta", price: 16500, emoji: "🟠", badge: "New" },
  { id: 7, name: "Magenta Cottonjute", type: "cottonjute", price: 13000, emoji: "🟣", badge: "" },
  { id: 8, name: "Rose Gold Small Putta", type: "smallputta", price: 10500, emoji: "🌸", badge: "Trending" },
  {
    id: 9, name: "Peacock Grace Kerala Saree", type: "kerala", price: 9500, badge: "Traditional",
    images: ["KERALA SAREE 1.jpeg", "KERALA SAREE 2.jpeg", "KERALA SAREE 3.jpeg", "KERALA SAREE 4.jpeg"]
  },
];

let cart = [];

function renderProducts(filter) {
  const grid = document.getElementById("productGrid");
  const filtered = filter === "all" ? products : products.filter(p => p.type === filter);
  grid.innerHTML = filtered.map(p => {
    if (p.type === "kerala") {
      return `
        <div class="product-card kerala-card" onclick="openSlider()">
          <div class="product-img kerala-img">
            ${p.badge ? `<span class="product-badge">${p.badge}</span>` : ""}
            <img src="${p.images[0]}" alt="${p.name}" style="width:100%;height:100%;object-fit:cover;"/>
          </div>
          <div class="product-info">
            <h3>${p.name}</h3>
            <p class="type">Kerala Silk</p>
            <div class="product-footer">
              <span class="price">₹${p.price.toLocaleString()}</span>
              <button class="add-to-cart" onclick="event.stopPropagation();addToCart(${p.id})">Add to Cart</button>
            </div>
          </div>
        </div>`;
    }
    return `
      <div class="product-card">
        <div class="product-img" style="background:linear-gradient(135deg,#fce4ec,#f8bbd0)">
          ${p.badge ? `<span class="product-badge">${p.badge}</span>` : ""}
          <span>${p.emoji}</span>
        </div>
        <div class="product-info">
          <h3>${p.name}</h3>
          <p class="type">${p.type.charAt(0).toUpperCase() + p.type.slice(1)} Silk</p>
          <div class="product-footer">
            <span class="price">₹${p.price.toLocaleString()}</span>
            <button class="add-to-cart" onclick="addToCart(${p.id})">Add to Cart</button>
          </div>
        </div>
      </div>`;
  }).join("");
}

// Kerala Slider
const keralaImages = ["KERALA SAREE 1.jpeg", "KERALA SAREE 2.jpeg", "KERALA SAREE 3.jpeg", "KERALA SAREE 4.jpeg"];
let currentSlide = 0;

function openSlider() {
  currentSlide = 0;
  updateSlider();
  document.getElementById("keralaSlider").classList.add("open");
  document.getElementById("overlay").classList.add("show");
}

function closeSlider() {
  document.getElementById("keralaSlider").classList.remove("open");
  document.getElementById("overlay").classList.remove("show");
}

function updateSlider() {
  document.getElementById("sliderImg").src = keralaImages[currentSlide];
  document.getElementById("slideCounter").textContent = (currentSlide + 1) + " / " + keralaImages.length;
  document.querySelectorAll(".slide-dot").forEach((d, i) => d.classList.toggle("active", i === currentSlide));
}

function nextSlide() {
  currentSlide = (currentSlide + 1) % keralaImages.length;
  updateSlider();
}

function prevSlide() {
  currentSlide = (currentSlide - 1 + keralaImages.length) % keralaImages.length;
  updateSlider();
}

function addToCart(id) {
  const product = products.find(p => p.id === id);
  const existing = cart.find(c => c.id === id);
  if (existing) existing.qty++;
  else cart.push({ ...product, qty: 1 });
  updateCartCount();
  renderCart();
  openCart();
}

function removeFromCart(id) {
  cart = cart.filter(c => c.id !== id);
  updateCartCount();
  renderCart();
}

function updateCartCount() {
  document.getElementById("cartCount").textContent = cart.reduce((s, c) => s + c.qty, 0);
}

function renderCart() {
  const itemsDiv = document.getElementById("cartItems");
  const footer = document.getElementById("cartFooter");
  if (!cart.length) {
    itemsDiv.innerHTML = '<div class="empty-cart"><i class="fas fa-shopping-bag" style="font-size:3rem;color:#ddd"></i><p style="margin-top:1rem">Your cart is empty</p></div>';
    footer.innerHTML = "";
    return;
  }
  itemsDiv.innerHTML = cart.map(c => `
    <div class="cart-item">
      <div class="cart-item-info">
        <h4>${c.emoji || "🦚"} ${c.name}</h4>
        <p>₹${c.price.toLocaleString()} × ${c.qty}</p>
      </div>
      <i class="fas fa-trash remove-item" onclick="removeFromCart(${c.id})"></i>
    </div>
  `).join("");
  const total = cart.reduce((s, c) => s + c.price * c.qty, 0);
  footer.innerHTML = `
    <div class="total">Total: <span>₹${total.toLocaleString()}</span></div>
    <button class="btn-primary" style="width:100%" onclick="checkout()">Checkout</button>
  `;
}

function openCart() {
  document.getElementById("cartModal").classList.add("open");
  document.getElementById("overlay").classList.add("show");
}

function closeCart() {
  document.getElementById("cartModal").classList.remove("open");
  document.getElementById("overlay").classList.remove("show");
}

function checkout() {
  closeCart();
  document.getElementById("addressModal").classList.add("open");
  document.getElementById("overlay").classList.add("show");
}

function openTxnModal() {
  document.getElementById("paymentModal").classList.remove("open");
  document.getElementById("txnModal").classList.add("open");
  document.getElementById("txnInput").value = "";
}

function submitTxn() {
  const txn = document.getElementById("txnInput").value.trim();
  if (!txn) { alert("Please enter your Transaction ID."); return; }
  alert("✅ Order confirmed!\nTransaction ID: " + txn + "\nThank you for shopping at Pattu Vibes! 🎉\nWe will verify and contact you shortly.");
  cart = [];
  updateCartCount();
  renderCart();
  document.getElementById("txnModal").classList.remove("open");
  document.getElementById("overlay").classList.remove("show");
}

function confirmPayment(method) {
  document.getElementById("paymentModal").classList.remove("open");
  document.getElementById("otpModal").classList.add("open");
  generateOtp();
}

let generatedOtp = "";

function generateOtp() {
  generatedOtp = Math.floor(1000 + Math.random() * 9000).toString();
  alert("Your OTP is: " + generatedOtp + "\n(In production, this will be sent via SMS)");
}

function resendOtp() { generateOtp(); }

function verifyOtp() {
  const boxes = document.querySelectorAll(".otp-box");
  const entered = Array.from(boxes).map(b => b.value).join("");
  if (entered.length < 4) { alert("Please enter the 4-digit OTP."); return; }
  if (entered === generatedOtp) {
    alert("✅ Order confirmed successfully!\nThank you for shopping at Pattu Vibes! 🎉\nWe will contact you shortly.");
    cart = [];
    updateCartCount();
    renderCart();
    boxes.forEach(b => b.value = "");
    document.getElementById("otpModal").classList.remove("open");
    document.getElementById("overlay").classList.remove("show");
  } else {
    alert("❌ Invalid OTP. Please try again.");
    boxes.forEach(b => b.value = "");
    boxes[0].focus();
  }
}

// Filter tabs
document.querySelectorAll(".tab").forEach(tab => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
    tab.classList.add("active");
    renderProducts(tab.dataset.filter);
  });
});

// Cart toggle
document.getElementById("cartIcon").addEventListener("click", openCart);
document.getElementById("closeCart").addEventListener("click", closeCart);
document.getElementById("overlay").addEventListener("click", () => {
  closeCart();
  closeSlider();
});

document.getElementById("closeAddress").addEventListener("click", () => {
  document.getElementById("addressModal").classList.remove("open");
  document.getElementById("overlay").classList.remove("show");
});

document.getElementById("addressForm").addEventListener("submit", (e) => {
  e.preventDefault();
  document.getElementById("addressModal").classList.remove("open");
  document.getElementById("paymentModal").classList.add("open");
});

document.getElementById("closePayment").addEventListener("click", () => {
  document.getElementById("paymentModal").classList.remove("open");
  document.getElementById("overlay").classList.remove("show");
});

document.getElementById("closeOtp").addEventListener("click", () => {
  document.getElementById("otpModal").classList.remove("open");
  document.getElementById("overlay").classList.remove("show");
});

document.getElementById("closeTxn").addEventListener("click", () => {
  document.getElementById("txnModal").classList.remove("open");
  document.getElementById("overlay").classList.remove("show");
});

// OTP auto-focus
document.addEventListener("input", e => {
  if (e.target.classList.contains("otp-box")) {
    const boxes = Array.from(document.querySelectorAll(".otp-box"));
    const idx = boxes.indexOf(e.target);
    if (e.target.value && idx < boxes.length - 1) boxes[idx + 1].focus();
  }
});

document.addEventListener("keydown", e => {
  if (e.target.classList.contains("otp-box") && e.key === "Backspace" && !e.target.value) {
    const boxes = Array.from(document.querySelectorAll(".otp-box"));
    const idx = boxes.indexOf(e.target);
    if (idx > 0) boxes[idx - 1].focus();
  }
});

// Mobile menu
document.getElementById("menuToggle").addEventListener("click", () => {
  document.getElementById("navLinks").classList.toggle("open");
});

// Dark mode toggle
const themeToggle = document.getElementById("themeToggle");
if (localStorage.getItem("dark") === "1") {
  document.body.classList.add("dark");
  themeToggle.classList.replace("fa-moon", "fa-sun");
}
themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  const isDark = document.body.classList.contains("dark");
  themeToggle.classList.replace(isDark ? "fa-moon" : "fa-sun", isDark ? "fa-sun" : "fa-moon");
  localStorage.setItem("dark", isDark ? "1" : "0");
});

// Init
renderProducts("all");
renderCart();

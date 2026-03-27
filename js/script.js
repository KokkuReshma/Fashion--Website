// ========== CART MANAGEMENT ==========

// Initialize cart from localStorage
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// Add to cart function
function addToCart(productName, price) {
    // Check if product already exists in cart
    const existingItem = cart.find(item => item.name === productName);
    
    if(existingItem) {
        existingItem.quantity = (existingItem.quantity || 1) + 1;
    } else {
        cart.push({
            name: productName,
            price: price,
            quantity: 1,
            id: Date.now()
        });
    }
    
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
    
    // Show notification
    showNotification(`✅ ${productName} added to cart!`);
}

// Update cart count in navbar
function updateCartCount() {
    const cartCount = document.getElementById("cartCount");
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    if(cartCount) {
        cartCount.innerText = cart.length;
    }
}

// Open cart with improved display
function openCart() {
    const cartBox = document.getElementById("cartBox");
    const cartItems = document.getElementById("cartItems");
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    
    if(!cartBox) return;
    
    let total = 0;
    let itemsHTML = "";
    
    if(cart.length === 0) {
        itemsHTML = "<li style='text-align: center; padding: 20px; color: #999;'>Your cart is empty 🛒</li>";
    } else {
        cart.forEach((item, index) => {
            const itemTotal = item.price * (item.quantity || 1);
            itemsHTML += `
                <li style="margin-bottom:15px; padding:15px; background:#f9f9f9; border-radius:8px; border-left:4px solid #ff3f6c;">
                    <strong>${item.name}</strong><br>
                    ₹${item.price} × <strong>${item.quantity || 1}</strong> = ₹<strong>${itemTotal}</strong>
                    <div style="margin-top: 10px; display: flex; gap: 5px; align-items: center;">
                        <button onclick="updateQuantity(${index}, 'decrease')" style="padding: 5px 10px; background: #ddd; border: none; border-radius: 4px; cursor: pointer; font-weight: bold;">−</button>
                        <span style="min-width: 30px; text-align: center;">Qty: ${item.quantity || 1}</span>
                        <button onclick="updateQuantity(${index}, 'increase')" style="padding: 5px 10px; background: #ddd; border: none; border-radius: 4px; cursor: pointer; font-weight: bold;">+</button>
                        <button onclick="removeFromCart(${index})" style="margin-left: auto; background: #d9534f; color: white; padding: 5px 10px; border: none; border-radius: 4px; font-size: 12px; cursor: pointer;">Remove</button>
                    </div>
                </li>
            `;
            total += itemTotal;
        });
    }
    
    cartItems.innerHTML = itemsHTML;
    
    const cartTotal = document.getElementById("cartTotal");
    if(cartTotal) {
        cartTotal.innerText = total;
    }
    
    cartBox.style.display = "block";
}

// Update quantity in cart
function updateQuantity(index, action) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    if(action === "increase") {
        cart[index].quantity = (cart[index].quantity || 1) + 1;
    } else if(action === "decrease" && (cart[index].quantity || 1) > 1) {
        cart[index].quantity = (cart[index].quantity || 1) - 1;
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    openCart();
    updateCartCount();
}

// Close cart
function closeCart() {
    const cartBox = document.getElementById("cartBox");
    if(cartBox) {
        cartBox.style.display = "none";
    }
}

// Remove from cart
function removeFromCart(index) {
    cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart.splice(index, 1);
    localStorage.setItem("cart", JSON.stringify(cart));
    openCart();
    updateCartCount();
    showNotification("✅ Item removed from cart");
}

// ========== NAVIGATION ==========

// Toggle mobile menu
function toggleMenu() {
    const navMenu = document.getElementById("navMenu");
    if(navMenu) {
        navMenu.classList.toggle("show");
    }
}

// Logout function
function logout() {
    localStorage.removeItem("userLoggedIn");
    localStorage.removeItem("userEmail");
    alert("✅ Logged out successfully!");
    window.location.href = window.location.pathname.includes("/pages/") ? "../index.html" : "index.html";
}

// ========== ADVANCED PRODUCT FILTERING, SORTING, RENDERING ==========
// Product data (auto-generated from assets/products)
const PRODUCTS = [
    { name: "Designer Saree", brand: "Reshma Designs", price: 4999, image: "assets/products/designer-saree1.jpg", category: "saree", rating: 4.2, badge: "Best Seller" },
    { name: "Designer Saree Red", brand: "Reshma Designs", price: 5299, image: "assets/products/designer-saree2.jpg", category: "saree", rating: 4.3, badge: "New" },
    { name: "Designer Saree Pink", brand: "Reshma Designs", price: 4899, image: "assets/products/disigner-saree3.jpg", category: "saree", rating: 4.1 },
    { name: "Lehanga Yellow", brand: "Reshma Designs", price: 7999, image: "assets/products/lehanga6.jpg", category: "lehanga", rating: 4.5, badge: "50% OFF" },
    { name: "Lehanga Blue", brand: "Reshma Designs", price: 8499, image: "assets/products/lehanga7.jpg", category: "lehanga", rating: 4.4 },
    { name: "Lehanga Green", brand: "Reshma Designs", price: 8999, image: "assets/products/lehanga8.jpg", category: "lehanga", rating: 4.6 },
    { name: "Lehanga Pink", brand: "Reshma Designs", price: 9299, image: "assets/products/lehanga9.jpg", category: "lehanga", rating: 4.2 },
    { name: "Lehanga Orange", brand: "Reshma Designs", price: 9999, image: "assets/products/lehanga10.jpg", category: "lehanga", rating: 4.7 },
    { name: "Lehanga Purple", brand: "Reshma Designs", price: 10499, image: "assets/products/lehanga11.jpg", category: "lehanga", rating: 4.8 },
    { name: "Party Wear Red", brand: "Reshma Designs", price: 2999, image: "assets/products/party-wear1.jpg", category: "party-wear", rating: 4.1, badge: "Trending" },
    { name: "Party Wear Blue", brand: "Reshma Designs", price: 3199, image: "assets/products/party-wear.jpg", category: "party-wear", rating: 4.0 },
    { name: "Western Wear", brand: "Reshma Designs", price: 3499, image: "assets/products/western-wear.jpg", category: "western-wear", rating: 4.6 },
    { name: "Western Wear Pink", brand: "Reshma Designs", price: 3399, image: "assets/products/westren-wear.jpg", category: "western-wear", rating: 4.5 },
    { name: "Kids Wear Yellow", brand: "Reshma Designs", price: 1499, image: "assets/products/kids-wear.jpg", category: "kids-wear", rating: 4.0 },
    { name: "Kids Wear Blue", brand: "Reshma Designs", price: 1599, image: "assets/products/kids-wear2.jpg", category: "kids-wear", rating: 4.1 },
    { name: "Kids Wear Green", brand: "Reshma Designs", price: 1699, image: "assets/products/kids-wear3.jpg", category: "kids-wear", rating: 4.2 },
    { name: "Kids Wear Pink", brand: "Reshma Designs", price: 1799, image: "assets/products/kids-wear4.jpg", category: "kids-wear", rating: 4.3 },
    { name: "Kids Wear Purple", brand: "Reshma Designs", price: 1899, image: "assets/products/kids-wear5.jpg", category: "kids-wear", rating: 4.4 },
    { name: "Gold Bacelet", brand: "Reshma Designs", price: 2499, image: "assets/products/gold-bacelet.jpg", category: "bacelet", rating: 4.7 },
    { name: "Bacelet Silver", brand: "Reshma Designs", price: 2299, image: "assets/products/bacelets.jpg", category: "bacelet", rating: 4.5 },
    { name: "Diomand Bacelet", brand: "Reshma Designs", price: 3499, image: "assets/products/diomand-bacelet.jpg", category: "bacelet", rating: 4.8, badge: "Premium" },
    { name: "Chain Gold", brand: "Reshma Designs", price: 1999, image: "assets/products/chains.jpg", category: "necklace", rating: 4.2 },
    { name: "Gold Necklace", brand: "Reshma Designs", price: 4999, image: "assets/products/gold-necklace.jpg", category: "necklace", rating: 4.9, badge: "Best Seller" },
    { name: "Jewellary Set Red", brand: "Reshma Designs", price: 3999, image: "assets/products/jewellery-set.jpg", category: "jewelry", rating: 4.5 },
    { name: "Jewellary Set Blue", brand: "Reshma Designs", price: 4199, image: "assets/products/jewellery-set1.jpg", category: "jewelry", rating: 4.6 },
    { name: "Jewellary Set Green", brand: "Reshma Designs", price: 4299, image: "assets/products/jewellery-set2.jpg", category: "jewelry", rating: 4.7 },
    { name: "Jewellary Set Pink", brand: "Reshma Designs", price: 4399, image: "assets/products/jewellary-set3.jpg", category: "jewelry", rating: 4.8 },
    { name: "Earrings Gold", brand: "Reshma Designs", price: 999, image: "assets/products/earrings.jpg", category: "earrings", rating: 4.3 },
    { name: "Earrings Pearl", brand: "Reshma Designs", price: 1099, image: "assets/products/earrings1.jpg", category: "earrings", rating: 4.4 },
    { name: "Ring Diamond", brand: "Reshma Designs", price: 799, image: "assets/products/ring.jpg", category: "accessories", rating: 4.2 },
    { name: "Formal Wear", brand: "Reshma Designs", price: 2599, image: "assets/products/formal.jpg", category: "formal", rating: 4.3 },
    { name: "Wedding Dress Red", brand: "Reshma Designs", price: 9999, image: "assets/products/wedding-dress.jpg", category: "wedding-dress", rating: 4.8, badge: "Best Seller" },
    { name: "Wedding Dress Blue", brand: "Reshma Designs", price: 10499, image: "assets/products/wedding-dress1.jpg", category: "wedding-dress", rating: 4.7 },
    { name: "Wedding Dress Green", brand: "Reshma Designs", price: 10999, image: "assets/products/wedding-dress2.jpg", category: "wedding-dress", rating: 4.6 },
    { name: "Wedding Dress Pink", brand: "Reshma Designs", price: 11499, image: "assets/products/wedding-dress5.jpg", category: "wedding-dress", rating: 4.5 },
    { name: "Indian Wedding Dress Gold", brand: "Reshma Designs", price: 11999, image: "assets/products/indian-wedding-dress3.jpg", category: "wedding-dress", rating: 4.7 },
    { name: "Indian Wedding Dress Pearl", brand: "Reshma Designs", price: 12499, image: "assets/products/indian-wedding-dress4.jpg", category: "wedding-dress", rating: 4.8 },
];

let filteredProducts = [...PRODUCTS];

function renderQuickFilterBar() {
    const bar = document.getElementById("quickFilterBar");
    if (!bar) return;
    const categories = [
        { label: "All", value: "all" },
        { label: "Saree", value: "saree" },
        { label: "Lehenga", value: "lehenga" },
        { label: "Party Wear", value: "party-wear" },
        { label: "Kids Wear", value: "kids-wear" },
        { label: "Jewelry", value: "jewelry" },
        { label: "Bracelet", value: "bracelet" },
        { label: "Necklace", value: "necklace" },
        { label: "Earrings", value: "earrings" },
        { label: "Accessories", value: "accessories" },
        { label: "Wedding Dress", value: "wedding-dress" },
        { label: "Western Wear", value: "western-wear" },
        { label: "Formal", value: "formal" }
    ];
    bar.innerHTML = categories.map(cat => `<span class="quick-filter-chip" data-value="${cat.value}">${cat.label}</span>`).join("");
    bar.querySelectorAll(".quick-filter-chip").forEach(chip => {
        chip.onclick = function() {
            document.getElementById("categoryFilter").value = chip.getAttribute("data-value");
            filterProducts();
            bar.querySelectorAll(".quick-filter-chip").forEach(c => c.classList.remove("active"));
            chip.classList.add("active");
        };
    });
}

function renderResultSortInfo(products) {
    const info = document.getElementById("resultSortInfo");
    if (!info) return;
    const sortType = document.getElementById("sortFilter")?.value || "default";
    let sortLabel = "Default";
    if (sortType === "price-low") sortLabel = "Price: Low to High";
    else if (sortType === "price-high") sortLabel = "Price: High to Low";
    else if (sortType === "name") sortLabel = "Name: A to Z";
    else if (sortType === "rating") sortLabel = "Rating";
    info.innerHTML = `<span>${products.length} results</span><span>Sorted by: <strong>${sortLabel}</strong></span>`;
}

function renderProducts(products) {
    const grid = document.getElementById("productGrid");
    const loading = document.getElementById("loading");
    const noProducts = document.getElementById("noProducts");
    if (!grid) return;
    grid.innerHTML = "";
    if (loading) loading.style.display = "block";
    if (noProducts) noProducts.style.display = "none";
    renderResultSortInfo(products);
    setTimeout(() => {
        if (loading) loading.style.display = "none";
        if (products.length === 0) {
            if (noProducts) noProducts.style.display = "block";
            return;
        }
        products.forEach(product => {
            const card = document.createElement("div");
            card.className = "card premium-card";
            card.setAttribute("data-category", product.category);
            card.setAttribute("data-price", product.price);
            card.setAttribute("data-rating", product.rating);
            // Product badge
            let badgeHTML = product.badge ? `<span class="product-badge">${product.badge}</span>` : "";
            // Quick add quantity
            let quickAddHTML = `<div class='quick-add'>
                <button class='quick-add-btn' onclick='event.stopPropagation(); updateCardQty(this, "-", "${product.name}")'>-</button>
                <span class='quick-add-qty' data-name='${product.name}'>1</span>
                <button class='quick-add-btn' onclick='event.stopPropagation(); updateCardQty(this, "+", "${product.name}")'>+</button>
                <button style='margin-left:8px;' onclick='event.stopPropagation(); addToCartWithQty("${product.name}", ${product.price}, "${product.image}")'>Add</button>
            </div>`;
            card.innerHTML = `
                ${badgeHTML}
                <button class="wishlist-btn" data-product="${product.name}" onclick="toggleWishlist('${product.name}', ${product.price}, '${product.image}', event)">🤍</button>
                <img src="${product.image}" alt="${product.name}" loading="lazy" onerror="this.onerror=null;this.src='../assets/products/default.jpg';">
                <div class="brand">${product.brand}</div>
                <h3>${product.name}</h3>
                <div class="rating">${displayRating(product.rating)}</div>
                <div class="price">₹${product.price.toLocaleString()}</div>
                ${quickAddHTML}
            `;
            card.onclick = () => viewProduct(product.name, product.price, product.image);
            grid.appendChild(card);
        });
        updateWishlistUI();
    }, 400); // Simulate loading
}

// Quick add quantity logic
function updateCardQty(btn, op, name) {
    const qtySpan = btn.parentElement.querySelector('.quick-add-qty');
    let qty = parseInt(qtySpan.innerText);
    if (op === "+") qty++;
    else if (op === "-" && qty > 1) qty--;
    qtySpan.innerText = qty;
}

function addToCartWithQty(name, price, image) {
    // Find the correct qty from the visible card
    const qtySpan = document.querySelector(`.quick-add-qty[data-name='${name}']`);
    let qty = qtySpan ? parseInt(qtySpan.innerText) : 1;
    for (let i = 0; i < qty; i++) {
        addToCart(name, price);
    }
    showNotification(`✅ ${name} x${qty} added to cart!`);
}

function filterProducts() {
    const category = document.getElementById("categoryFilter")?.value || "all";
    const price = parseInt(document.getElementById("priceFilter")?.value || 15000);
    let products = [...PRODUCTS];
    if (category !== "all") {
        products = products.filter(p => p.category === category);
    }
    products = products.filter(p => p.price <= price);
    filteredProducts = products;
    sortProducts();
}

function updatePriceLabel(val) {
    document.getElementById("priceLabel").innerText = `Up to ₹${parseInt(val).toLocaleString()}`;
    filterProducts();
}

function sortProducts() {
    const sortType = document.getElementById("sortFilter")?.value || "default";
    let products = [...filteredProducts];
    switch (sortType) {
        case "price-low":
            products.sort((a, b) => a.price - b.price);
            break;
        case "price-high":
            products.sort((a, b) => b.price - a.price);
            break;
        case "name":
            products.sort((a, b) => a.name.localeCompare(b.name));
            break;
        case "rating":
            products.sort((a, b) => b.rating - a.rating);
            break;
    }
    renderProducts(products);
}

function searchProducts() {
    const searchInput = document.getElementById("searchInput");
    if (!searchInput) return;
    const searchTerm = searchInput.value.toLowerCase().trim();
    let products = [...PRODUCTS];
    if (searchTerm) {
        products = products.filter(p =>
            p.name.toLowerCase().includes(searchTerm) ||
            p.brand.toLowerCase().includes(searchTerm) ||
            (p.category && p.category.toLowerCase().includes(searchTerm))
        );
    }
    filteredProducts = products;
    sortProducts();
}

// On page load for collection.html
document.addEventListener("DOMContentLoaded", function() {
    if (window.location.pathname.includes("collection.html")) {
        renderQuickFilterBar();
        renderProducts(PRODUCTS);
        document.getElementById("categoryFilter")?.addEventListener("change", function() {
            filterProducts();
            // Sync quick filter bar
            const val = this.value;
            document.querySelectorAll(".quick-filter-chip").forEach(chip => {
                chip.classList.toggle("active", chip.getAttribute("data-value") === val);
            });
        });
        document.getElementById("priceFilter")?.addEventListener("input", e => updatePriceLabel(e.target.value));
        document.getElementById("sortFilter")?.addEventListener("change", sortProducts);
        document.getElementById("searchInput")?.addEventListener("input", searchProducts);
        // Activate 'All' chip by default
        document.querySelector(".quick-filter-chip[data-value='all']")?.classList.add("active");
    }
});

// ========== SEARCH FUNCTIONALITY ==========

// Search products
function searchProducts() {
    const searchInput = document.getElementById("searchInput");
    if(!searchInput) return;
    
    const searchTerm = searchInput.value.toLowerCase();
    const cards = document.querySelectorAll(".card");
    
    cards.forEach(card => {
        const productName = card.querySelector("h3").innerText.toLowerCase();
        card.style.display = productName.includes(searchTerm) ? "block" : "none";
    });
}

// ========== PRODUCT DETAILS ==========

// View product details
function viewProduct(productName, price, imageUrl) {
    // Standardize image URL if it matches old patterns
    let standardizedImageUrl = imageUrl;
    if (imageUrl) {
        // Map old image names to new standardized names
        const imageMap = {
            // sarees
            'assets/products/Disigner saree 1.jfif': 'assets/products/designer-saree1.jpg',
            'assets/products/Disigner saree  1.jfif': 'assets/products/designer-saree1.jpg',
            'assets/products/Disigner saree 2.jfif': 'assets/products/designer-saree2.jpg',
            'assets/products/Disigner saree 3.jfif': 'assets/products/designer-saree3.jpg',
            'assets/products/Disigner saree  3.jfif': 'assets/products/designer-saree3.jpg',
            // lehenga
            'assets/products/lehanga 6.jfif': 'assets/products/lehenga6.jpg',
            'assets/products/lehanga  6.jfif': 'assets/products/lehenga6.jpg',
            'assets/products/lehanga 8.jfif': 'assets/products/lehenga8.jpg',
            // partywear
            'assets/products/Party wear 1.jfif': 'assets/products/partywear1.jpg',
            'assets/products/party wear.jfif': 'assets/products/partywear2.jpg',
            // wedding dress
            'assets/products/Wedding Dress 1.jfif': 'assets/products/wedding-dress1.jpg',
            'assets/products/Wedding Dress 2.jfif': 'assets/products/wedding-dress2.jpg',
            'assets/products/wedding Dress 5.jfif': 'assets/products/wedding-dress3.jpg',
            'assets/products/Indian Wedding Dress 3.jfif': 'assets/products/indian-wedding-dress1.jpg',
            'assets/products/Indian Weding Dress 4.jfif': 'assets/products/indian-wedding-dress2.jpg',
            'assets/products/Wedding dress.jfif': 'assets/products/wedding-dress4.jpg',
            // formal
            'assets/products/Formal.jfif': 'assets/products/formal.jpg',
            // kids
            'assets/products/Kids wear.jfif': 'assets/products/kids-wear1.jpg',
            'assets/products/kids wear 2.jfif': 'assets/products/kids-wear2.jpg',
            'assets/products/kids wear 3.jfif': 'assets/products/kids-wear3.jpg',
            'assets/products/kids wear 4.jfif': 'assets/products/kids-wear4.jpg',
            'assets/products/kids wear 5.jfif': 'assets/products/kids-wear5.jpg',
            // jewelry
            'assets/products/Bacelet 1.jfif': 'assets/products/gold-bracelet1.jpg',
            'assets/products/Earrings 1.jfif': 'assets/products/pearl-earrings1.jpg',
            // add more as needed
        };
        if (imageMap[imageUrl]) {
            standardizedImageUrl = imageMap[imageUrl];
        }
    }
    localStorage.setItem("selectedProduct", JSON.stringify({
        name: productName,
        price: price,
        image: standardizedImageUrl
    }));
    
    const isInPages = window.location.pathname.includes("/pages/");
    window.location.href = isInPages ? "product.html" : "pages/product.html";
}

// ========== LOGIN FUNCTIONALITY ==========

// Login user
function loginUser(event) {
    if(event) event.preventDefault();
    
    const email = document.getElementById("loginEmail")?.value;
    const password = document.getElementById("loginPassword")?.value;
    
    if(email && password) {
        localStorage.setItem("userLoggedIn", "true");
        localStorage.setItem("userEmail", email);
        alert("✅ Login successful! Welcome to Reshma Designs!");
        
        const isInPages = window.location.pathname.includes("/pages/");
        window.location.href = isInPages ? "../index.html" : "index.html";
    } else {
        alert("❌ Please enter valid credentials");
    }
}

// ========== NOTIFICATIONS ==========

// Show notification
function showNotification(message) {
    const notification = document.createElement("div");
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #4CAF50;
        color: white;
        padding: 15px 20px;
        border-radius: 6px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 1000;
        font-weight: 600;
    `;
    notification.innerText = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// ========== PAGE INITIALIZATION ==========

// Initialize page on load
document.addEventListener("DOMContentLoaded", function() {
    updateCartCount();
    loadProductDetails(); // Load product if on product page
    
    // Check if user is logged in
    const userLoggedIn = localStorage.getItem("userLoggedIn");
    if(userLoggedIn === "true") {
        const logoutBtn = document.querySelector("a[onclick='logout()']");
        if(logoutBtn) {
            logoutBtn.innerText = "Logout (" + localStorage.getItem("userEmail") + ")";
        }
    }
});

// ========== CONTACT FORM ==========

// Save contact form data
function saveData(event) {
    event.preventDefault();
    
    const form = event.target;
    const name = form.querySelector("input[placeholder='Your Name']")?.value;
    const email = form.querySelector("input[placeholder='Your Email']")?.value;
    const message = form.querySelector("textarea")?.value;
    
    if(name && email && message) {
        let messages = JSON.parse(localStorage.getItem("contactMessages")) || [];
        messages.push({
            name: name,
            email: email,
            message: message,
            date: new Date().toLocaleDateString()
        });
        
        localStorage.setItem("contactMessages", JSON.stringify(messages));
        
        // Show success message
        const successDiv = document.getElementById("successMessage");
        if(successDiv) {
            successDiv.innerText = "✅ Message sent successfully! We'll get back to you soon.";
            successDiv.style.display = "block";
        }
        
        form.reset();
        showNotification("✅ Thank you for contacting us!");
    } else {
        alert("❌ Please fill in all fields");
    }
}

// ========== CHECKOUT & ORDERS ==========

// Place order
function placeOrder(event) {
    if(event) event.preventDefault();
    
    const name = document.getElementById("fullName")?.value;
    const email = document.getElementById("email")?.value;
    const address = document.getElementById("address")?.value;
    const phone = document.getElementById("phone")?.value;
    
    if(name && email && address && phone) {
        let orders = JSON.parse(localStorage.getItem("orders")) || [];
        orders.push({
            name: name,
            email: email,
            address: address,
            phone: phone,
            cart: JSON.parse(localStorage.getItem("cart")) || [],
            date: new Date().toLocaleDateString(),
            time: new Date().toLocaleTimeString()
        });
        
        localStorage.setItem("orders", JSON.stringify(orders));
        localStorage.removeItem("cart");
        
        alert("✅ Order Placed Successfully! 🎉\nThank you for shopping with Reshma Designs!\n\nOrder Number: #" + Date.now());
        
        const isInPages = window.location.pathname.includes("/pages/");
        window.location.href = isInPages ? "../index.html" : "index.html";
    } else {
        alert("❌ Please fill in all fields");
    }
}

// ========== UTILITY FUNCTIONS ==========

// Check if user is logged in
function isUserLoggedIn() {
    return localStorage.getItem("userLoggedIn") === "true";
}

// Get user email
function getUserEmail() {
    return localStorage.getItem("userEmail") || "Guest";
}

// Clear all cart data
function clearCart() {
    localStorage.removeItem("cart");
    updateCartCount();
    showNotification("✅ Cart cleared");
}

// Add to cart from product details page
function addToCartFromPage() {
    const product = JSON.parse(localStorage.getItem("selectedProduct")) || {};
    if(product.name && product.price) {
        addToCart(product.name, product.price);
    } else {
        alert("❌ Product information not found");
    }
}

// Go back to collection
function goBack() {
    const isInPages = window.location.pathname.includes("/pages/");
    window.location.href = isInPages ? "collection.html" : "pages/collection.html";
}

// Load product details on product page
function loadProductDetails() {
    const product = JSON.parse(localStorage.getItem("selectedProduct")) || {};
    if(product.name && product.price && product.image) {
        const nameElem = document.getElementById("productName");
        if (nameElem) nameElem.innerText = product.name;
        const priceElem = document.getElementById("productPrice");
        if (priceElem) priceElem.innerText = "₹" + product.price;
        const imgElem = document.getElementById("productImage");
        if (imgElem) imgElem.src = product.image;
        document.title = product.name + " - Reshma Designs";
    }
}

// ========== LOADING ANIMATION ==========
function showLoading() {
    const overlay = document.createElement("div");
    overlay.className = "loading-overlay";
    overlay.innerHTML = '<div class="spinner"></div>';
    document.body.appendChild(overlay);
}

function hideLoading() {
    const overlay = document.querySelector(".loading-overlay");
    if(overlay) overlay.remove();
}

// Add loading animation on page load
window.addEventListener("load", function() {
    hideLoading();
    rotateOffers();
    setInterval(rotateOffers, 5000); // Rotate every 5 seconds
    setTimeout(() => {
        showNotification("Welcome to Reshma Designs! 👗");
    }, 500);
});

// ========== ROTATING OFFER BANNER ==========
let currentOfferIndex = 0;
const offers = [
    "🔥 Flat 50% OFF on Wedding Collection",
    "🎁 Buy 2 Get 1 Free on All Jewelry",
    "💝 Free Shipping on Orders Above ₹999",
    "✨ Flat 30% OFF on Party Wear",
    "👗 Limited Time: Premium Collection 40% OFF"
];

function rotateOffers() {
    const offerBanner = document.getElementById("offerBanner");
    if(offerBanner) {
        currentOfferIndex = (currentOfferIndex + 1) % offers.length;
        const offerText = offerBanner.querySelector("#offerText");
        if(offerText) {
            offerText.style.animation = "fadeOut 0.3s ease-out";
            setTimeout(() => {
                offerText.innerText = offers[currentOfferIndex];
                offerText.style.animation = "fadeIn 0.3s ease-in";
            }, 300);
        }
    }
}

// ========== WISHLIST SYSTEM ==========
const WISHLIST_KEY = "wishlist";

function toggleWishlist(productName, price, imageUrl, event) {
    event.stopPropagation();
    
    let wishlist = JSON.parse(localStorage.getItem(WISHLIST_KEY)) || [];
    const existingItem = wishlist.find(item => item.name === productName);
    
    if(existingItem) {
        wishlist = wishlist.filter(item => item.name !== productName);
        showNotification("❤️ Removed from Wishlist");
    } else {
        wishlist.push({ name: productName, price: price, image: imageUrl });
        showNotification("❤️ Added to Wishlist");
    }
    
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist));
    updateWishlistUI();
}

function updateWishlistUI() {
    const wishlist = JSON.parse(localStorage.getItem(WISHLIST_KEY)) || [];
    const wishlistBtns = document.querySelectorAll(".wishlist-btn");
    
    wishlistBtns.forEach(btn => {
        const productName = btn.getAttribute("data-product");
        const inWishlist = wishlist.some(item => item.name === productName);
        
        if(inWishlist) {
            btn.classList.add("active");
            btn.innerText = "❤️";
        } else {
            btn.classList.remove("active");
            btn.innerText = "🤍";
        }
    });
}

function viewWishlist() {
    window.location.href = "/pages/wishlist.html";
}

// ========== SORT & FILTER SYSTEM ==========
let allProducts = [];

function sortProducts(sortType) {
    const cards = document.querySelectorAll(".card");
    let productsArray = Array.from(cards).map(card => ({
        element: card,
        name: card.querySelector("h3")?.innerText,
        price: parseInt(card.querySelector(".price")?.innerText?.replace(/₹|,/g, "") || 0)
    }));
    
    switch(sortType) {
        case "price-low":
            productsArray.sort((a, b) => a.price - b.price);
            break;
        case "price-high":
            productsArray.sort((a, b) => b.price - a.price);
            break;
        case "name":
            productsArray.sort((a, b) => a.name.localeCompare(b.name));
            break;
    }
    
    const gallery = document.querySelector(".gallery");
    productsArray.forEach(item => gallery.appendChild(item.element));
}

// ========== IMPROVED SEARCH ==========
function searchProducts() {
    const searchInput = document.getElementById("searchInput");
    if(!searchInput) return;
    
    const searchTerm = searchInput.value.toLowerCase().trim();
    const cards = document.querySelectorAll(".card");
    let visibleCount = 0;
    
    cards.forEach(card => {
        const productName = card.querySelector("h3")?.innerText.toLowerCase() || "";
        const category = card.getAttribute("data-category") || "";
        
        if(productName.includes(searchTerm) || category.includes(searchTerm)) {
            card.style.display = "block";
            visibleCount++;
        } else {
            card.style.display = "none";
        }
    });
    
    // Show "No results" message
    let noResults = document.querySelector(".no-results");
    if(visibleCount === 0) {
        if(!noResults) {
            noResults = document.createElement("div");
            noResults.className = "no-results";
            noResults.innerText = "❌ No products found for '"+searchTerm+"'";
            document.querySelector(".gallery")?.appendChild(noResults);
        } else {
            noResults.style.display = "block";
        }
    } else if(noResults) {
        noResults.style.display = "none";
    }
}

// ========== RATING & REVIEWS ==========
function getProductRating(productName) {
    const ratings = {
        "Designer Saree": 4.2,
        "Lehenga": 4.5,
        "Wedding Dress": 4.8,
        "Formal Wear": 4.3,
        "Kids Wear": 4.0,
        "Gold Bracelet": 4.7,
        "Pearl Earrings": 4.4,
        "Party Wear": 4.1,
        "Western Wear": 4.6,
        "Gold Necklace": 4.9
    };
    
    return ratings[productName] || 4.0;
}

function displayRating(rating) {
    const fullStars = Math.floor(rating);
    const hasHalf = rating % 1 >= 0.5;
    let stars = "⭐".repeat(fullStars);
    if(hasHalf) stars += "☆";
    return `${stars} (${rating})`;
}

// ========== SIGNUP FUNCTION ==========
function signupUser(event) {
    if(event) event.preventDefault();
    
    const username = document.getElementById("signupUsername")?.value;
    const email = document.getElementById("signupEmail")?.value;
    const password = document.getElementById("signupPassword")?.value;
    const confirmPassword = document.getElementById("confirmPassword")?.value;
    
    if(!username || !email || !password || !confirmPassword) {
        alert("❌ Please fill all fields");
        return;
    }
    
    if(password !== confirmPassword) {
        alert("❌ Passwords do not match");
        return;
    }
    
    let users = JSON.parse(localStorage.getItem("users")) || [];
    if(users.find(u => u.email === email)) {
        alert("❌ User already exists with this email");
        return;
    }
    
    users.push({
        username: username,
        email: email,
        password: password,
        joinDate: new Date().toLocaleDateString()
    });
    
    localStorage.setItem("users", JSON.stringify(users));
    localStorage.setItem("userLoggedIn", "true");
    localStorage.setItem("userEmail", email);
    localStorage.setItem("userUsername", username);
    
    alert("✅ Signup successful! Welcome " + username);
    window.location.href = "../index.html";
}

// ========== PAYMENT OPTIONS ==========
function selectPayment(method) {
    document.querySelectorAll(".payment-option").forEach(opt => opt.classList.remove("active"));
    event.target.classList.add("active");
    localStorage.setItem("paymentMethod", method);
}

// ========== ORDER HISTORY ==========
function viewOrderHistory() {
    window.location.href = "/pages/order-history.html";
}

function displayOrderHistory() {
    const orders = JSON.parse(localStorage.getItem("orders")) || [];
    const orderList = document.getElementById("orderList");
    
    if(orders.length === 0) {
        orderList.innerHTML = "<p style='text-align:center; color:#999;'>No orders yet</p>";
        return;
    }
    
    orderList.innerHTML = orders.map((order, index) => {
        const orderStatus = order.status || "Confirmed";
        const statusIcons = {
            "Confirmed": "✅",
            "Processing": "⚙️",
            "Shipped": "📦",
            "Out for Delivery": "🚚",
            "Delivered": "🎉",
            "Cancelled": "❌"
        };
        const statusIcon = statusIcons[orderStatus] || "📲";
        
        return `
            <div style="background:#f9f9f9; padding:20px; margin:15px 0; border-radius:12px; border-left:5px solid ${order.status === 'Cancelled' ? '#d9534f' : '#ff3f6c'};">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                    <div>
                        <h4 style="margin:0;">Order #${order.orderId || (1000 + index)}</h4>
                        <p style="margin:5px 0; color:#666;"><strong>Date:</strong> ${order.date} ${order.time}</p>
                    </div>
                    <div style="text-align:right;">
                        <p style="font-size:24px; margin:0;">${statusIcon}</p>
                        <p style="margin:5px 0; font-weight:bold; color:${order.status === 'Cancelled' ? '#d9534f' : '#4CAF50'}">${orderStatus}</p>
                    </div>
                </div>
                
                <hr style="margin: 10px 0; border: none; border-top: 1px solid #ddd;">
                
                <p style="margin:8px 0;"><strong>👤 Name:</strong> ${order.name}</p>
                <p style="margin:8px 0;"><strong>📧 Email:</strong> ${order.email}</p>
                <p style="margin:8px 0;"><strong>📍 Address:</strong> ${order.address}</p>
                <p style="margin:8px 0;"><strong>💳 Payment:</strong> ${order.paymentMethod?.toUpperCase() || 'N/A'}</p>
                
                <h5 style="margin-top:15px; margin-bottom:10px; color:#ff3f6c;">📦 Order Items:</h5>
                <div style="background:white; padding:10px; border-radius:6px; margin-bottom:10px;">
                    ${order.cart.map(item => `
                        <div style="display:flex; align-items:center; gap:10px; padding:8px 0; border-bottom:1px solid #eee;">
                            <img src="${item.image ? item.image.replace('.jfif','.jpg') : '../assets/products/default.jpg'}" alt="${item.name}" style="width:50px; height:50px; object-fit:cover; border-radius:4px;">
                            <div style="flex:1;">
                                <p style="margin:0; font-weight:bold;">${item.name}</p>
                                <p style="margin:2px 0; font-size:12px; color:#666;">Size: ${item.size || 'N/A'} | Qty: ${item.quantity || 1}</p>
                            </div>
                            <p style="margin:0; font-weight:bold;">₹${item.price * (item.quantity || 1)}</p>
                        </div>
                    `).join("")}
                </div>
                
                <p style="margin:10px 0; font-size:18px; font-weight:bold; color:#ff3f6c;"><strong>Total:</strong> ₹${order.cart.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0)}</p>
                
                ${order.status !== 'Delivered' && order.status !== 'Cancelled' ? `
                    <div style="margin-top:15px; display:flex; gap:10px;">
                        <button onclick="cancelOrder(${index})" style="flex:1; padding:10px; background:#d9534f; color:white; border:none; border-radius:6px; cursor:pointer; font-weight:bold;">Cancel Order</button>
                        <button onclick="viewOrderTracking(${index})" style="flex:1; padding:10px; background:#4CAF50; color:white; border:none; border-radius:6px; cursor:pointer; font-weight:bold;">Track Order</button>
                    </div>
                ` : ''}
                
                ${order.status === 'Cancelled' ? `
                    <p style="color:#d9534f; margin-top:10px;"><strong>❌ Cancellation Reason:</strong> ${order.cancellationReason || 'User requested cancellation'}</p>
                ` : ''}
            </div>
        `;
    }).join("");
}

// Cancel order function
function cancelOrder(orderIndex) {
    const reason = prompt("Please provide a reason for cancellation:", "");
    if(!reason) {
        showNotification("❌ Cancellation reason is required");
        return;
    }
    
    let orders = JSON.parse(localStorage.getItem("orders")) || [];
    orders[orderIndex].status = "Cancelled";
    orders[orderIndex].cancellationReason = reason;
    orders[orderIndex].cancelledDate = new Date().toLocaleDateString();
    orders[orderIndex].cancelledTime = new Date().toLocaleTimeString();
    
    localStorage.setItem("orders", JSON.stringify(orders));
    
    // Send notification to admin (simulated)
    let adminNotifications = JSON.parse(localStorage.getItem("adminNotifications")) || [];
    adminNotifications.push({
        type: "ORDER_CANCELLED",
        orderId: orders[orderIndex].orderId || (1000 + orderIndex),
        customerName: orders[orderIndex].name,
        reason: reason,
        timestamp: new Date().toLocaleString()
    });
    localStorage.setItem("adminNotifications", JSON.stringify(adminNotifications));
    
    showNotification("✅ Order cancelled successfully");
    
    setTimeout(() => displayOrderHistory(), 500);
}

// View order tracking
function viewOrderTracking(orderIndex) {
    const orders = JSON.parse(localStorage.getItem("orders")) || [];
    const order = orders[orderIndex];
    
    alert(`📦 Order Tracking\n\nOrder #${order.orderId || (1000 + orderIndex)}\n\n${order.status}\n✓ Confirmed\n✓ Processing\n✓ Shipped\n⊙ Out for Delivery\n\nEstimated Delivery: 3-5 business days`);
}

// ========== IMPROVED CHECKOUT ==========
function validateCheckoutForm(event) {
    event.preventDefault();
    
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    if(cart.length === 0) {
        alert("❌ Your cart is empty");
        return;
    }
    
    const paymentMethod = localStorage.getItem("paymentMethod");
    if(!paymentMethod) {
        alert("❌ Please select a payment method");
        return;
    }
    
    document.getElementById("checkoutForm").style.display = "none";
    document.getElementById("orderSuccess").style.display = "block";
    
    showNotification("✅ Order Placed Successfully!");
    
    setTimeout(() => {
        window.location.href = "../pages/order-history.html";
    }, 2000);
}

// ========== UPDATE NAVBAR WITH USERNAME ==========
function updateNavbarUser() {
    const userEmail = localStorage.getItem("userEmail");
    const username = localStorage.getItem("userUsername");
    
    const userGreeting = document.getElementById("userGreeting");
    const loginLink = document.getElementById("loginLink");
    const signupLink = document.getElementById("signupLink");
    const logoutLink = document.getElementById("logoutLink");
    const profileLink = document.getElementById("profileLink");
    
    if(userEmail) {
        const displayName = username || userEmail.split("@")[0];
        if(userGreeting) {
            userGreeting.style.display = "block";
            userGreeting.innerHTML = `👋 Hello, <strong>${displayName}</strong>!`;
        }
        if(loginLink) loginLink.closest("li").style.display = "none";
        if(signupLink) signupLink.closest("li").style.display = "none";
        if(logoutLink) logoutLink.style.display = "block";
        if(profileLink) profileLink.style.display = "block";
    } else {
        if(userGreeting && userGreeting.parentElement) {
            userGreeting.style.display = "none";
        }
        if(loginLink) loginLink.closest("li").style.display = "block";
        if(signupLink) signupLink.closest("li").style.display = "block";
        if(logoutLink) logoutLink.style.display = "none";
        if(profileLink) profileLink.style.display = "none";
    }
}

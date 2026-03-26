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

// ========== PRODUCT FILTERING ==========

// Filter products by category
function filterProducts(category) {
    const cards = document.querySelectorAll(".card");
    
    cards.forEach(card => {
        if(category === "all") {
            card.style.display = "block";
        } else {
            const cardCategory = card.getAttribute("data-category");
            card.style.display = cardCategory === category ? "block" : "none";
        }
    });
}

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
    localStorage.setItem("selectedProduct", JSON.stringify({
        name: productName,
        price: price,
        image: imageUrl
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
        document.getElementById("productName").innerText = product.name;
        document.getElementById("productPrice").innerText = "₹" + product.price;
        document.getElementById("productImage").src = product.image;
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

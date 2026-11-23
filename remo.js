
// ======================================
// REMOS ONLINE SHOPPING WEBSITE
// ======================================

// PRODUCT DATABASE (SAMPLE PRODUCTS)

const products = [
    // FASHION
    {id:1, name:"Men Premium T-Shirt", category:"Fashion", price:499, image:"https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500", rating:4.5},
    {id:2, name:"Women Stylish Dress", category:"Fashion", price:999, image:"https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=500", rating:4.6},
    {id:3, name:"Running Sneakers", category:"Fashion", price:1499, image:"https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500", rating:4.8},
    {id:4, name:"Leather Handbag", category:"Fashion", price:1299, image:"https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=500", rating:4.4},
    {id:5, name:"Classic Wrist Watch", category:"Fashion", price:899, image:"https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=500", rating:4.3},

    // ELECTRONICS
    {id:6, name:"Smartphone", category:"Electronics", price:14999, image:"https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500", rating:4.7},
    {id:7, name:"Laptop", category:"Electronics", price:45999, image:"https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500", rating:4.8},
    {id:8, name:"Wireless Headphones", category:"Electronics", price:1999, image:"https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500", rating:4.5},
    {id:9, name:"Smart Watch", category:"Electronics", price:2499, image:"https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500", rating:4.4},
    {id:10, name:"Digital Camera", category:"Electronics", price:29999, image:"https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500", rating:4.6},

    // HOME & KITCHEN
    {id:11, name:"Modern Sofa", category:"Home", price:12999, image:"https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500", rating:4.5},
    {id:12, name:"Table Lamp", category:"Home", price:999, image:"https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500", rating:4.3},
    {id:13, name:"Kitchen Accessories", category:"Home", price:1999, image:"https://images.unsplash.com/photo-1556911220-bff31c812dba?w=500", rating:4.4},
    {id:14, name:"Modern Chair", category:"Home", price:3499, image:"https://images.unsplash.com/photo-1503602642458-232111445657?w=500", rating:4.5},
    {id:15, name:"Home Decoration", category:"Home", price:799, image:"https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=500", rating:4.2},

    // BEAUTY
    {id:16, name:"Skincare Kit", category:"Beauty", price:799, image:"https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=500", rating:4.5},
    {id:17, name:"Luxury Perfume", category:"Beauty", price:1299, image:"https://images.unsplash.com/photo-1541643600914-78b084683601?w=500", rating:4.6},
    {id:18, name:"Makeup Kit", category:"Beauty", price:1499, image:"https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=500", rating:4.4},
    {id:19, name:"Face Cream", category:"Beauty", price:399, image:"https://images.unsplash.com/photo-1556229010-6c3f2c9ca5f8?w=500", rating:4.3},
    {id:20, name:"Beauty Essentials", category:"Beauty", price:599, image:"https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=500", rating:4.5},

    // SPORTS
    {id:21, name:"Football", category:"Sports", price:699, image:"https://images.unsplash.com/photo-1614632537190-23e4146777db?w=500", rating:4.4},
    {id:22, name:"Gym Dumbbells", category:"Sports", price:999, image:"https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=500", rating:4.6},
    {id:23, name:"Sports Shoes", category:"Sports", price:1799, image:"https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=500", rating:4.5},
    {id:24, name:"Fitness Accessories", category:"Sports", price:499, image:"https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=500", rating:4.3},
    {id:25, name:"Sports Water Bottle", category:"Sports", price:299, image:"https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500", rating:4.2},

    // GROCERY
    {id:26, name:"Fresh Fruits", category:"Grocery", price:199, image:"https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=500", rating:4.7},
    {id:27, name:"Fresh Vegetables", category:"Grocery", price:149, image:"https://images.unsplash.com/photo-1540420773420-3366772f4999?w=500", rating:4.6},
    {id:28, name:"Healthy Nuts", category:"Grocery", price:399, image:"https://images.unsplash.com/photo-1508061253366-f7da158b6d46?w=500", rating:4.5},
    {id:29, name:"Breakfast Cereals", category:"Grocery", price:249, image:"https://images.unsplash.com/photo-1517093157656-b9eccef91cb1?w=500", rating:4.3},
    {id:30, name:"Organic Food Pack", category:"Grocery", price:599, image:"https://images.unsplash.com/photo-1542838132-92c53300491e?w=500", rating:4.5}
];

// ======================================
// CART DATA
// ======================================

let cart = [];

try {
    cart = JSON.parse(localStorage.getItem("remosCart")) || [];
    if (!Array.isArray(cart)) cart = [];
} catch (error) {
    cart = [];
}

let currentCategory = "All";

// ======================================
// DISPLAY PRODUCTS
// ======================================

function displayProducts(items) {

    const container = document.getElementById("productContainer");

    container.innerHTML = "";

    document.getElementById("productCount").textContent =
        `Showing ${items.length} products`;

    if (items.length === 0) {
        container.innerHTML = `
            <div class="empty-products">
                <h2>😔 No Products Found</h2>
                <p>Try searching for another product.</p>
            </div>
        `;
        return;
    }

    items.forEach(product => {

        container.innerHTML += `
            <div class="product-card">

                <div class="product-image">
                    <img
                        src="${product.image}"
                        alt="${product.name}"
                        loading="lazy"
                        onerror="this.src='https://placehold.co/400x300?text=REMOS'">

                    <span class="product-tag">SPECIAL</span>
                </div>

                <div class="product-info">

                    <p class="product-category">
                        ${product.category}
                    </p>

                    <h3>${product.name}</h3>

                    <div class="rating">
                        ⭐ ${product.rating} / 5
                    </div>

                    <div class="product-price">
                        ₹${product.price.toLocaleString("en-IN")}
                    </div>

                    <button class="add-btn"
                        onclick="addToCart(${product.id})">
                        🛒 Add To Cart
                    </button>

                </div>
            </div>
        `;
    });
}

// ======================================
// FILTER PRODUCTS
// ======================================

function filterCategory(category) {

    currentCategory = category;

    document.querySelectorAll(".category-btn").forEach(btn => {
        btn.classList.remove("active");
    });

    const buttons = document.querySelectorAll(".category-btn");

    buttons.forEach(btn => {
        if (
            category === "All" &&
            btn.textContent.trim() === "All"
        ) {
            btn.classList.add("active");
        }

        if (
            category !== "All" &&
            btn.textContent.toLowerCase().includes(category.toLowerCase())
        ) {
            btn.classList.add("active");
        }
    });

    const filtered = category === "All"
        ? products
        : products.filter(p => p.category === category);

    displayProducts(filtered);

}

// ======================================
// SEARCH PRODUCTS
// ======================================

function searchProducts() {

    const value = document.getElementById("searchInput")
        .value.trim().toLowerCase();

    let filtered = products;

    if (currentCategory !== "All") {
        filtered = filtered.filter(
            p => p.category === currentCategory
        );
    }

    filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(value) ||
        p.category.toLowerCase().includes(value)
    );

    displayProducts(filtered);
}

document.getElementById("searchInput")
    .addEventListener("input", searchProducts);

document.getElementById("searchBtn")
    .addEventListener("click", searchProducts);

// ======================================
// ADD TO CART
// ======================================

function addToCart(id) {

    const product = products.find(p => p.id === id);

    if (!product) return;

    const existing = cart.find(item => item.id === id);

    if (existing) {
        existing.quantity++;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1
        });
    }

    updateCart();

    showToast(product.name + " added to your cart!");

}

// ======================================
// UPDATE CART
// ======================================

function updateCart() {

    const cartItems = document.getElementById("cartItems");

    let total = 0;
    let count = 0;

    cartItems.innerHTML = "";

    cart.forEach(item => {

        total += item.price * item.quantity;
        count += item.quantity;

        cartItems.innerHTML += `
            <div class="cart-item">

                <img src="${item.image}" alt="${item.name}"
                     onerror="this.src='https://placehold.co/100?text=REMOS'">

                <div class="cart-item-info">

                    <h4>${item.name}</h4>

                    <p>₹${item.price.toLocaleString("en-IN")}</p>

                    <div class="quantity-controls">

                        <button onclick="changeQuantity(${item.id}, -1)">−</button>

                        <span>${item.quantity}</span>

                        <button onclick="changeQuantity(${item.id}, 1)">+</button>

                    </div>

                    <button class="remove-btn"
                        onclick="removeItem(${item.id})">
                        Remove
                    </button>

                </div>

            </div>
        `;
    });

    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div class="empty-products">
                <h2>🛍️</h2>
                <h3>Your Cart Is Empty!</h3>
                <p>Add some products to get started.</p>
            </div>
        `;
    }

    document.getElementById("cartTotal").textContent =
        total.toLocaleString("en-IN");

    document.getElementById("cartCount").textContent = count;

    localStorage.setItem("remosCart", JSON.stringify(cart));

}

// ======================================
// CHANGE QUANTITY
// ======================================

function changeQuantity(id, amount) {

    const item = cart.find(p => p.id === id);

    if (!item) return;

    item.quantity += amount;

    if (item.quantity <= 0) {
        removeItem(id);
    } else {
        updateCart();
    }

}

// ======================================
// REMOVE PRODUCT
// ======================================

function removeItem(id) {

    cart = cart.filter(item => item.id !== id);

    updateCart();

    showToast("Product removed from cart!");

}

// ======================================
// OPEN AND CLOSE CART
// ======================================

function toggleCart() {

    document.getElementById("cartPanel")
        .classList.toggle("active");

    document.getElementById("overlay")
        .classList.toggle("active");

    document.body.style.overflow =
        document.getElementById("cartPanel")
        .classList.contains("active") ? "hidden" : "";

}

// ======================================
// CHECKOUT
// ======================================

function checkout() {

    if (cart.length === 0) {
        showToast("Your shopping cart is empty!");
        return;
    }

    const total = cart.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    alert(
        "Thank you for shopping with REMOS!\n\n" +
        "Your demo order total is ₹" +
        total.toLocaleString("en-IN") +
        "\n\nReal payment is not connected yet."
    );

}

// ======================================
// ACCOUNT
// ======================================

function showAccount() {

    showToast("Account registration will be available soon!");

}

// ======================================
// NEWSLETTER
// ======================================

document.getElementById("newsletterForm")
    .addEventListener("submit", function(event) {

        event.preventDefault();

        showToast("Thank you for subscribing to REMOS!");

        this.reset();

    });

// ======================================
// SHOP NOW
// ======================================

function goToProducts() {

    document.getElementById("products")
        .scrollIntoView({ behavior: "smooth" });

}

// ======================================
// NOTIFICATION
// ======================================

let toastTimer;

function showToast(message) {

    const toast = document.getElementById("toast");

    toast.textContent = message;

    toast.classList.add("show");

    clearTimeout(toastTimer);

    toastTimer = setTimeout(() => {
        toast.classList.remove("show");
    }, 2500);

}

// ======================================
// INITIALIZE WEBSITE
// ======================================

displayProducts(products);

updateCart();

console.log("REMOS Website Successfully Loaded!");


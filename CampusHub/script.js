/* =========================================================
   CCTC CAMPUSHUB
   Enhanced campus information, shop, events, announcements,
   and group chat system using localStorage.
   ========================================================= */

const STORAGE_KEYS = {
    auth: "campusHubAuth",
    users: "campusHubUsers",
    canteen: "campusHubCanteen",
    registrar: "campusHubRegistrar",
    events: "campusHubEvents",
    announcements: "campusHubAnnouncements",
    chats: "campusHubChats",
    orders: "campusHubOrders",
    cart: "campusHubCart"
};

const ROLES = {
    STUDENT: "STUDENT",
    TEACHER: "TEACHER"
};

const DEMO_USERS = [
    {
        id: "user-student-1",
        name: "Student Kyth",
        email: "kyth@student.cctc.edu.ph",
        password: "campus123",
        role: ROLES.STUDENT
    },
    {
        id: "user-teacher-1",
        name: "Teacher Maria",
        email: "maria@teacher.cctc.edu.ph",
        password: "campus123",
        role: ROLES.TEACHER
    }
];

const schoolInfo = {
    name: "Consolatrix College of Toledo City",
    location: "Toledo City, Cebu, Philippines",
    tagline: "A campus information, announcements, and shop portal for students and teachers."
};

const state = {
    currentUser: null,
    users: [],
    canteen: [],
    registrar: [],
    events: [],
    announcements: [],
    chats: [],
    cart: [],
    orders: [],
    currentChatRoom: "GLOBAL",
    shopView: "overview"
};

function readStorage(key, fallback) {
    try {
        const raw = localStorage.getItem(key);
        return raw ? JSON.parse(raw) : fallback;
    } catch (error) {
        console.error(`Could not read ${key}:`, error);
        return fallback;
    }
}

function writeStorage(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
        console.error(`Could not save ${key}:`, error);
    }
}

function getDemoUsers() {
    return JSON.parse(JSON.stringify(DEMO_USERS));
}

function sampleCanteenProducts() {
    return [
        {
            id: "canteen-1",
            name: "Chicken Sandwich",
            description: "Toasted chicken sandwich served with fresh vegetables and sauce.",
            category: "Meals",
            price: 60,
            image: "🥪",
            available: true,
            seller: "CCTC Canteen"
        },
        {
            id: "canteen-2",
            name: "Iced Tea",
            description: "Fresh chilled iced tea to keep students refreshed during class breaks.",
            category: "Drinks",
            price: 25,
            image: "🧊",
            available: true,
            seller: "CCTC Canteen"
        },
        {
            id: "canteen-3",
            name: "Chicken Rice Meal",
            description: "Classic CCTC canteen meal with rice, chicken, and vegetables.",
            category: "Meals",
            price: 85,
            image: "🍱",
            available: false,
            seller: "CCTC Canteen"
        },
        {
            id: "canteen-4",
            name: "Fruit Shake",
            description: "Ready-to-drink fruit shake served cold for students and faculty.",
            category: "Drinks",
            price: 50,
            image: "🥤",
            available: true,
            seller: "CCTC Canteen"
        }
    ];
}

function sampleRegistrarProducts() {
    return [
        {
            id: "reg-1",
            name: "School Uniform",
            description: "Official CCTC school uniform for daily school use.",
            category: "Uniforms",
            price: 450,
            image: "👕",
            available: true,
            sizes: [
                { label: "Small", available: true },
                { label: "Medium", available: true },
                { label: "Large", available: false },
                { label: "XL", available: true }
            ]
        },
        {
            id: "reg-2",
            name: "School Shirt",
            description: "Official plain school shirt for student activities and events.",
            category: "Apparel",
            price: 250,
            image: "🎽",
            available: true,
            sizes: [
                { label: "Small", available: true },
                { label: "Medium", available: true },
                { label: "Large", available: true }
            ]
        },
        {
            id: "reg-3",
            name: "Notebook Set",
            description: "Student notebook set for classroom work and notes.",
            category: "School Supplies",
            price: 120,
            image: "📓",
            available: true,
            sizes: []
        }
    ];
}

function sampleEvents() {
    return [
        {
            id: "event-1",
            title: "CCTC Intramurals",
            description: "School-wide sports and student activities across the campus.",
            date: "2026-10-15",
            time: "08:00",
            location: "CCTC Campus",
            image: "🏅",
            createdBy: "Teacher Maria",
            createdAt: "2026-10-01T08:00:00.000Z",
            active: true
        },
        {
            id: "event-2",
            title: "General Assembly",
            description: "Official meeting and updates for students and faculty.",
            date: "2026-10-08",
            time: "09:00",
            location: "Main Hall",
            image: "🎓",
            createdBy: "Teacher Maria",
            createdAt: "2026-10-01T08:45:00.000Z",
            active: true
        },
        {
            id: "event-3",
            title: "Science Fair",
            description: "A campus event showcasing science projects and research work.",
            date: "2026-09-28",
            time: "10:00",
            location: "Science Building",
            image: "🔬",
            createdBy: "Teacher Maria",
            createdAt: "2026-09-20T10:00:00.000Z",
            active: false
        }
    ];
}

function sampleAnnouncements() {
    return [
        {
            id: "announcement-1",
            title: "Important School Notice",
            content: "Please be reminded of tomorrow's school schedule and arrival time before 7:30 AM.",
            datePosted: "2026-10-01",
            createdBy: "Teacher Maria",
            active: true
        },
        {
            id: "announcement-2",
            title: "Canteen Service Updates",
            content: "The canteen will continue serving students during break periods with limited menu items.",
            datePosted: "2026-10-01",
            createdBy: "Teacher Maria",
            active: true
        }
    ];
}

function sampleChats() {
    return [
        {
            id: "chat-1",
            senderId: "user-teacher-1",
            senderName: "Teacher Maria",
            senderRole: ROLES.TEACHER,
            chatType: "TEACHER_ANNOUNCEMENT",
            message: "Reminder: There will be a school activity tomorrow at 8:00 AM.",
            createdAt: "2026-10-01T07:30:00.000Z"
        },
        {
            id: "chat-2",
            senderId: "user-student-1",
            senderName: "Student Kyth",
            senderRole: ROLES.STUDENT,
            chatType: "GLOBAL",
            message: "Is the canteen open today?",
            createdAt: "2026-10-01T09:00:00.000Z"
        },
        {
            id: "chat-3",
            senderId: "user-teacher-1",
            senderName: "Teacher Maria",
            senderRole: ROLES.TEACHER,
            chatType: "GLOBAL",
            message: "Yes, it is open until 4:00 PM.",
            createdAt: "2026-10-01T09:05:00.000Z"
        }
    ];
}

function initializeStorage() {
    if (!readStorage(STORAGE_KEYS.users, null)) {
        writeStorage(STORAGE_KEYS.users, getDemoUsers());
    }

    if (!readStorage(STORAGE_KEYS.canteen, null)) {
        writeStorage(STORAGE_KEYS.canteen, sampleCanteenProducts());
    }

    if (!readStorage(STORAGE_KEYS.registrar, null)) {
        writeStorage(STORAGE_KEYS.registrar, sampleRegistrarProducts());
    }

    if (!readStorage(STORAGE_KEYS.events, null)) {
        writeStorage(STORAGE_KEYS.events, sampleEvents());
    }

    if (!readStorage(STORAGE_KEYS.announcements, null)) {
        writeStorage(STORAGE_KEYS.announcements, sampleAnnouncements());
    }

    if (!readStorage(STORAGE_KEYS.chats, null)) {
        writeStorage(STORAGE_KEYS.chats, sampleChats());
    }

    if (!readStorage(STORAGE_KEYS.orders, null)) {
        writeStorage(STORAGE_KEYS.orders, []);
    }

    if (!readStorage(STORAGE_KEYS.cart, null)) {
        writeStorage(STORAGE_KEYS.cart, []);
    }

    if (!readStorage(STORAGE_KEYS.auth, null)) {
        writeStorage(STORAGE_KEYS.auth, null);
    }
}

function loadState() {
    initializeStorage();
    state.users = readStorage(STORAGE_KEYS.users, []);
    state.canteen = readStorage(STORAGE_KEYS.canteen, []);
    state.registrar = readStorage(STORAGE_KEYS.registrar, []);
    state.events = readStorage(STORAGE_KEYS.events, []);
    state.announcements = readStorage(STORAGE_KEYS.announcements, []);
    state.chats = readStorage(STORAGE_KEYS.chats, []);
    state.orders = readStorage(STORAGE_KEYS.orders, []);
    state.cart = readStorage(STORAGE_KEYS.cart, []);
    state.currentUser = readStorage(STORAGE_KEYS.auth, null);
}

function saveState() {
    writeStorage(STORAGE_KEYS.users, state.users);
    writeStorage(STORAGE_KEYS.canteen, state.canteen);
    writeStorage(STORAGE_KEYS.registrar, state.registrar);
    writeStorage(STORAGE_KEYS.events, state.events);
    writeStorage(STORAGE_KEYS.announcements, state.announcements);
    writeStorage(STORAGE_KEYS.chats, state.chats);
    writeStorage(STORAGE_KEYS.orders, state.orders);
    writeStorage(STORAGE_KEYS.cart, state.cart);
    if (state.currentUser) {
        writeStorage(STORAGE_KEYS.auth, state.currentUser);
    } else {
        writeStorage(STORAGE_KEYS.auth, null);
    }
}

function getCartTotal() {
    return state.cart.reduce((sum, item) => sum + (Number(item.price) || 0) * (Number(item.quantity) || 1), 0);
}

function updateCartBadge() {
    const badge = document.getElementById("cartBadge");
    if (!badge) return;
    const totalItems = state.cart.reduce((sum, item) => sum + (Number(item.quantity) || 1), 0);
    badge.textContent = String(totalItems);
    badge.hidden = totalItems === 0;
}

function renderCartModal() {
    const itemsContainer = document.getElementById("cartItems");
    const totalElement = document.getElementById("cartTotal");
    const checkoutButton = document.getElementById("checkoutButton");
    if (!itemsContainer || !totalElement || !checkoutButton) return;

    if (!state.cart.length) {
        itemsContainer.innerHTML = '<div class="empty-box">Your cart is empty.</div>';
        totalElement.textContent = '₱0';
        checkoutButton.disabled = true;
        return;
    }

    itemsContainer.innerHTML = state.cart.map((item) => `
        <div class="cart-item">
            <div class="cart-item-main">
                <div class="cart-item-image">${item.image || '📦'}</div>
                <div class="cart-item-copy">
                    <strong>${item.name}</strong>
                    <span>${item.productType}</span>
                </div>
            </div>
            <div class="cart-item-meta">
                <span>₱${item.price} × ${item.quantity}</span>
                <button type="button" class="link-button small" data-cart-remove="${item.productId}" data-cart-type="${item.productType}">Remove</button>
            </div>
        </div>
    `).join("");

    totalElement.textContent = `₱${getCartTotal()}`;
    checkoutButton.disabled = false;
}

function openCartModal() {
    renderCartModal();
    const modal = document.getElementById("cartModal");
    if (modal) {
        modal.classList.remove("hidden");
    }
}

function addToCart(productType, productId) {
    const itemList = productType === "REGISTRAR" ? state.registrar : state.canteen;
    const product = itemList.find((entry) => entry.id === productId);

    if (!product) {
        showToast("This item is no longer available.");
        return;
    }

    if (!product.available) {
        showToast("This item is out of stock.");
        return;
    }

    const existingItem = state.cart.find((entry) => entry.productId === productId && entry.productType === productType);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        state.cart.push({
            id: `${productType.toLowerCase()}-${productId}`,
            productId,
            productType,
            name: product.name,
            image: product.image || "📦",
            price: Number(product.price) || 0,
            quantity: 1
        });
    }

    saveState();
    updateCartBadge();
    renderCartModal();
    showToast(`${product.name} added to cart.`);
}

function removeCartItem(productType, productId) {
    const itemIndex = state.cart.findIndex((entry) => entry.productId === productId && entry.productType === productType);
    if (itemIndex === -1) return;

    const item = state.cart[itemIndex];
    if (item.quantity > 1) {
        item.quantity -= 1;
    } else {
        state.cart.splice(itemIndex, 1);
    }

    saveState();
    updateCartBadge();
    renderCartModal();
    showToast("Item removed from cart.");
}

function checkoutCart() {
    if (!state.cart.length) {
        showToast("Your cart is empty.");
        return;
    }

    const total = getCartTotal();
    state.orders.unshift({
        id: `order-${Date.now()}`,
        items: state.cart.map((item) => ({ ...item })),
        total,
        payment: "Pay now",
        date: new Date().toISOString(),
        status: "pending",
        teacherNote: "",
        studentCleared: false,
        teacherRemoved: false
    });

    state.cart = [];
    saveState();
    updateCartBadge();
    renderCartModal();
    renderProfilePage();
    renderDashboardPage();
    closeModalById("cartModal");
    showToast("Payment complete. Order confirmed.");
}

function toggleOrderStatus(orderId) {
    const order = state.orders.find((entry) => entry.id === orderId);
    if (!order) return;

    const isApproved = order.status === "approved" || order.status === "done";
    order.status = isApproved ? "pending" : "approved";
    if (order.status === "approved" || order.status === "done") {
        order.studentCleared = false;
    }
    saveState();
    renderDashboardPage();
    renderProfilePage();
    showToast(order.status === "approved" || order.status === "done" ? "Order approved." : "Order moved back to pending.");
}

function saveOrderInstruction(orderId, noteText) {
    const order = state.orders.find((entry) => entry.id === orderId);
    if (!order) return;

    order.teacherNote = noteText.trim();
    saveState();
    renderDashboardPage();
    renderProfilePage();
    showToast("Instruction saved.");
}

function clearDoneOrderNotice(orderId) {
    const order = state.orders.find((entry) => entry.id === orderId);
    if (!order) return;

    order.studentCleared = true;
    saveState();
    renderProfilePage();
    renderDashboardPage();
    showToast("Done notice cleared.");
}

function removeOrder(orderId) {
    const order = state.orders.find((entry) => entry.id === orderId);
    if (!order) return;

    if (!state.currentUser || state.currentUser.role !== ROLES.TEACHER) {
        showToast("Only teachers can remove recent orders.");
        return;
    }

    order.teacherRemoved = true;
    saveState();
    renderDashboardPage();
    renderProfilePage();
    showToast("Order removed from the teacher inbox.");
}

function getUpcomingEvents() {
    const now = new Date();
    const active = state.events
        .filter((event) => event.active !== false)
        .filter((event) => {
            if (!event.date) return true;
            const eventDate = new Date(`${event.date}T${event.time || "00:00"}:00`);
            return eventDate >= now;
        })
        .sort((a, b) => new Date(`${a.date}T${a.time || "00:00"}:00`) - new Date(`${b.date}T${b.time || "00:00"}:00`));

    return active;
}

function getPreviousEvents() {
    const now = new Date();
    return state.events
        .filter((event) => event.active !== false)
        .filter((event) => {
            if (!event.date) return false;
            const eventDate = new Date(`${event.date}T${event.time || "00:00"}:00`);
            return eventDate < now;
        })
        .sort((a, b) => new Date(`${b.date}T${b.time || "00:00"}:00`) - new Date(`${a.date}T${a.time || "00:00"}:00`));
}

// Pinned concept removed: use regular lists for featured content

function formatDate(dateString) {
    if (!dateString) return "No date";
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

function formatDateTime(dateValue, timeValue) {
    const fullDate = dateValue ? new Date(`${dateValue}T${timeValue || "00:00"}:00`) : null;
    if (!fullDate || Number.isNaN(fullDate.getTime())) return "Date not set";
    return fullDate.toLocaleString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit"
    });
}

function showToast(message) {
    const toast = document.getElementById("toast");
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("visible");
    clearTimeout(showToast.timer);
    showToast.timer = setTimeout(() => toast.classList.remove("visible"), 2100);
}

function showPage(pageId) {
    document.querySelectorAll(".page").forEach((page) => page.classList.remove("active-page"));
    const page = document.getElementById(`page-${pageId}`);
    if (page) {
        page.classList.add("active-page");
    }

    document.querySelectorAll(".nav-link").forEach((navLink) => {
        navLink.classList.toggle("active", navLink.dataset.pageLink === pageId);
    });

    if (pageId === "profile") {
        renderProfilePage();
    }

    if (pageId === "chat") {
        renderChatPage();
    }

    if (pageId === "shop") {
        renderShopPage();
    }

    if (pageId === "events") {
        renderEventsPage();
    }

    if (pageId === "home") {
        renderHomePage();
    }

    if (pageId === "dashboard") {
        renderDashboardPage();
    }

    const mobileMenu = document.getElementById("mobileMenuButton");
    const navLinks = document.getElementById("navLinks");
    if (navLinks) navLinks.classList.remove("open");
    if (mobileMenu) mobileMenu.setAttribute("aria-expanded", "false");
    window.scrollTo({ top: 0, behavior: "smooth" });
}

function renderNav() {
    const nav = document.getElementById("navLinks");
    if (!nav) return;

    const studentLinks = [
        { id: "home", label: "🏠 Home" },
        { id: "shop", label: "🛍️ Shop" },
        { id: "events", label: "📅 Events" },
        { id: "chat", label: "💬 Chat" },
        { id: "profile", label: "👤 Profile" }
    ];

    const teacherLinks = [
        { id: "home", label: "🏠 Home" },
        { id: "dashboard", label: "📊 Dashboard" },
        { id: "shop", label: "🛍️ Shop" },
        { id: "events", label: "📅 Events" },
        { id: "chat", label: "💬 Chat" },
        { id: "profile", label: "👤 Profile" }
    ];

    const links = state.currentUser && state.currentUser.role === ROLES.TEACHER ? teacherLinks : studentLinks;
    nav.innerHTML = links.map((link) => `
        <button type="button" class="nav-link ${link.id === "home" ? "active" : ""}" data-page-link="${link.id}">${link.label}</button>
    `).join("");
}

function isTeacher() {
    return state.currentUser && state.currentUser.role === ROLES.TEACHER;
}

function canSendMessageForChat(chatType) {
    if (!state.currentUser) return false;
    if (chatType === "TEACHER_ANNOUNCEMENT") {
        return state.currentUser.role === ROLES.TEACHER;
    }
    return true;
}

function getMessagesForChat(chatType) {
    return state.chats.filter((item) => item.chatType === chatType).sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
}

function getProductCardMarkup(product, productType, isTeacherUser) {
    const statusText = product.available ? "In stock" : "Out of stock";
    const statusClass = product.available ? "status-available" : "status-unavailable";
    const imageMarkup = product.image && (product.image.startsWith("http") || product.image.startsWith("data:"))
        ? `<img src="${product.image}" alt="${product.name}" class="product-image">`
        : `<div class="product-image emoji">${product.image || "📦"}</div>`;

    const sizeMarkup = productType === "REGISTRAR" && product.sizes && product.sizes.length
        ? `<div class="size-list">${product.sizes.map((size) => `<span class="size-pill ${size.available ? "size-available" : "size-unavailable"}">${size.label}: ${size.available ? "Available" : "Unavailable"}</span>`).join("")}</div>`
        : "";

    const teacherActions = isTeacherUser ? `
        <div class="inline-actions">
            <button type="button" class="btn btn-small btn-secondary" data-edit-product="${product.id}" data-product-type="${productType}">Edit</button>
            <button type="button" class="btn btn-small btn-secondary" data-toggle-product="${product.id}" data-product-type="${productType}">${product.available ? "Mark Unavailable" : "Mark Available"}</button>
            <button type="button" class="btn btn-small btn-danger" data-delete-product="${product.id}" data-product-type="${productType}">Delete</button>
        </div>
    ` : `
        <div class="product-actions">
            <button type="button" class="btn btn-small btn-primary" data-add-cart="${product.id}" data-product-type="${productType}" ${product.available ? "" : "disabled"}>
                ${product.available ? "Add to cart" : "Out of stock"}
            </button>
        </div>
    `;

    return `
        <article class="product-card">
            ${imageMarkup}
            <div class="product-body">
                <div class="product-header-row">
                    <span class="product-tag">${product.category}</span>
                    <span class="status-badge ${statusClass}">${statusText}</span>
                </div>
                <h3>${product.name}</h3>
                <p>${product.description}</p>
                ${sizeMarkup}
                <div class="product-footer">
                    <span class="product-price">₱${product.price}</span>
                    ${teacherActions}
                </div>
            </div>
        </article>
    `;
}

function renderHomePage() {
    const currentUser = state.currentUser || { name: "Guest", role: ROLES.STUDENT };
    const userName = currentUser.name.split(" ")[0];
    const hour = new Date().getHours();
    const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
    const stats = [
        { label: "Active Projects", value: String(Math.max(8, state.events.length + state.announcements.length + 4)), detail: "+3 this week", tone: "cyan" },
        { label: "Today's Tasks", value: String(Math.max(12, state.orders.length * 3 + 8)), detail: "8 completed", tone: "violet" },
        { label: "Messages", value: String(state.chats.length), detail: "2 unread", tone: "sky" },
        { label: "Calendar", value: String(getUpcomingEvents().length), detail: "3 this month", tone: "blue" }
    ];

    const projectCards = [
        { title: "Cline Launch Plan", description: "Neon dashboard rollout and product polish for the new workspace.", status: "On track", tone: "good" },
        { title: "School Portal", description: "Track announcements, events, shop flow, and teacher updates in one view.", status: "Review", tone: "warn" },
        { title: "Canteen Sync", description: "Keep stock visibility and order intake aligned with the active shop roster.", status: "Ready", tone: "good" }
    ];

    const schedule = [
        { time: "08:30", title: "Campus briefing", type: "cyan" },
        { time: "11:00", title: "Faculty check-in", type: "violet" },
        { time: "14:15", title: "Canteen order review", type: "gold" },
        { time: "17:00", title: "Wrap-up sync", type: "mint" }
    ];

    const activity = [
        { text: "Teacher Maria updated the event board.", time: "12 min ago" },
        { text: "New order received from Student Kyth.", time: "32 min ago" },
        { text: "Canteen stock was refreshed for lunch service.", time: "1 hour ago" }
    ];

    const quickStats = [
        { label: "Task completion", percent: 82 },
        { label: "Project count", percent: 68 },
        { label: "Notes", percent: 74 },
        { label: "Focus hours", percent: 91 }
    ];

    const homePage = document.getElementById("page-home");
    if (!homePage) return;

    homePage.innerHTML = `
        <div class="dashboard-home">
            <aside class="dashboard-sidebar">
                <div class="brand-block">
                    <div class="brand-logo">C</div>
                    <div class="brand-copy">
                        <span class="brand-title">Cline</span>
                        <small>Control Center</small>
                    </div>
                </div>

                <nav class="sidebar-nav" aria-label="Workspace navigation">
                    <button type="button" class="nav-item active" data-page-link="home">Home</button>
                    <button type="button" class="nav-item" data-page-link="dashboard">Projects</button>
                    <button type="button" class="nav-item" data-page-link="events">Calendar</button>
                    <button type="button" class="nav-item" data-page-link="chat">Messages</button>
                    <button type="button" class="nav-item" data-page-link="profile">Settings</button>
                </nav>

                <div class="sidebar-card">
                    <span class="eyebrow-label">Focus mode</span>
                    <h3>Prototype build</h3>
                    <p>11:30 — 14:00</p>
                    <div class="mini-meter"><span style="width: 73%"></span></div>
                </div>
            </aside>

            <main class="workspace-main">
                <header class="dashboard-topbar">
                    <div>
                        <p class="topbar-kicker">${greeting}, ${userName}</p>
                        <h2>Command overview</h2>
                    </div>
                    <div class="topbar-status">
                        <span class="status-chip">⬢ ${state.currentUser && state.currentUser.role === ROLES.TEACHER ? "Teacher view" : "Student view"}</span>
                        <span class="weather-pill">⛅ Clear • 24°C</span>
                    </div>
                </header>

                <section class="hero-panel">
                    <div class="hero-copy">
                        <span class="hero-kicker">Cline / Systems</span>
                        <h1>Futuristic campus operations never sleep.</h1>
                    </div>
                    <div class="hero-glow"></div>
                </section>

                <section class="stats-grid">
                    ${stats.map((stat) => `
                        <article class="stat-card ${stat.tone}">
                            <div class="stat-label">${stat.label}</div>
                            <div class="stat-value">${stat.value}</div>
                            <div class="stat-detail">${stat.detail}</div>
                        </article>
                    `).join("")}
                </section>

                <section class="content-grid">
                    <div class="panel-card wide-panel">
                        <div class="panel-header">
                            <div>
                                <span class="eyebrow-label">Recent projects</span>
                                <h3>Active workspace</h3>
                            </div>
                            <button type="button" class="mini-link" data-page-link="dashboard">View all</button>
                        </div>

                        <div class="project-list">
                            ${projectCards.map((project) => `
                                <article class="project-card">
                                    <div class="project-bullet"></div>
                                    <div class="project-copy">
                                        <div class="project-title-row">
                                            <h4>${project.title}</h4>
                                            <span class="status-tag ${project.tone}">${project.status}</span>
                                        </div>
                                        <p>${project.description}</p>
                                    </div>
                                </article>
                            `).join("")}
                        </div>
                    </div>

                    <div class="panel-card">
                        <div class="panel-header">
                            <div>
                                <span class="eyebrow-label">Today</span>
                                <h3>Schedule</h3>
                            </div>
                        </div>

                        <div class="schedule-list">
                            ${schedule.map((item) => `
                                <div class="schedule-item">
                                    <span class="schedule-dot ${item.type}"></span>
                                    <div class="schedule-copy">
                                        <strong>${item.title}</strong>
                                        <small>${item.time}</small>
                                    </div>
                                </div>
                            `).join("")}
                        </div>
                    </div>
                </section>

                <section class="secondary-grid">
                    <div class="panel-card">
                        <div class="panel-header">
                            <div>
                                <span class="eyebrow-label">Quick access</span>
                                <h3>Launch</h3>
                            </div>
                        </div>

                        <div class="shortcut-row">
                            <button type="button" class="shortcut-card" data-page-link="dashboard">
                                <span>✦</span>
                                <strong>New Project</strong>
                            </button>
                            <button type="button" class="shortcut-card" data-page-link="chat">
                                <span>✎</span>
                                <strong>Notes</strong>
                            </button>
                            <button type="button" class="shortcut-card" data-page-link="profile">
                                <span>⚙</span>
                                <strong>Settings</strong>
                            </button>
                        </div>
                    </div>

                    <div class="panel-card">
                        <div class="panel-header">
                            <div>
                                <span class="eyebrow-label">Feed</span>
                                <h3>Recent activity</h3>
                            </div>
                        </div>

                        <div class="activity-list">
                            ${activity.map((item) => `
                                <div class="activity-item">
                                    <span class="activity-dot"></span>
                                    <div>
                                        <p>${item.text}</p>
                                        <small>${item.time}</small>
                                    </div>
                                </div>
                            `).join("")}
                        </div>
                    </div>
                </section>

                <section class="bottom-grid">
                    <div class="panel-card">
                        <div class="panel-header">
                            <div>
                                <span class="eyebrow-label">Overview</span>
                                <h3>Quick stats</h3>
                            </div>
                        </div>

                        <div class="progress-list">
                            ${quickStats.map((item) => `
                                <div class="progress-row">
                                    <div class="progress-meta">
                                        <span>${item.label}</span>
                                        <strong>${item.percent}%</strong>
                                    </div>
                                    <div class="progress-bar"><span style="width: ${item.percent}%"></span></div>
                                </div>
                            `).join("")}
                        </div>
                    </div>

                    <div class="panel-card quote-card">
                        <div class="panel-header">
                            <div>
                                <span class="eyebrow-label">Insight</span>
                                <h3>Daily signal</h3>
                            </div>
                        </div>
                        <blockquote>“Build the future with calm focus; the brightest systems are shaped by disciplined teams.”</blockquote>
                        <div class="cityscape" aria-hidden="true">
                            <span class="tower t1"></span>
                            <span class="tower t2"></span>
                            <span class="tower t3"></span>
                            <span class="tower t4"></span>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    `;

    const topbarName = document.getElementById("topbarUserName");
    const topbarRole = document.getElementById("topbarUserRole");
    if (topbarName) topbarName.textContent = userName;
    if (topbarRole) topbarRole.textContent = currentUser.role === ROLES.TEACHER ? "Teacher" : "Student";
}

function renderShopPage() {
    const selectedView = ["canteen", "registrar"].includes(state.shopView) ? state.shopView : "canteen";
    const canteenItems = state.canteen;
    const registrarItems = state.registrar;
    const canteenMarkup = canteenItems.length
        ? canteenItems.map((item) => getProductCardMarkup(item, "CANTEEN", isTeacher())).join("")
        : `<div class="empty-box">No canteen products are currently available.</div>`;

    const registrarMarkup = registrarItems.length
        ? registrarItems.map((item) => getProductCardMarkup(item, "REGISTRAR", isTeacher())).join("")
        : `<div class="empty-box">No registrar products are currently available.</div>`;

    const canteenSection = selectedView === "canteen" ? `
        <div class="section-block" id="shop-canteen">
            <div class="section-header-row">
                <h3>🍔 Canteen Shop</h3>
                ${isTeacher() ? `<button type="button" class="btn btn-secondary btn-small" data-add-product="CANTEEN">Add product</button>` : ""}
            </div>
            <div class="product-grid">${canteenMarkup}</div>
        </div>
    ` : "";

    const registrarSection = selectedView === "registrar" ? `
        <div class="section-block" id="shop-registrar">
            <div class="section-header-row">
                <h3>🏫 Registrar Shop</h3>
                ${isTeacher() ? `<button type="button" class="btn btn-secondary btn-small" data-add-product="REGISTRAR">Add product</button>` : ""}
            </div>
            <div class="product-grid">${registrarMarkup}</div>
        </div>
    ` : "";

    const shopPage = document.getElementById("page-shop");
    shopPage.innerHTML = `
        <div class="section-header-row">
            <h2>🛍️ CCTC Shop</h2>
            ${isTeacher() ? `<button type="button" class="btn btn-primary" data-add-product="CANTEEN">+ Add Canteen Product</button>` : ""}
        </div>

        <div class="shop-cta-grid compact">
            <button type="button" class="shop-cta ${selectedView === "canteen" ? "active" : "green"}" data-shop-view="canteen">🍔 Canteen Shop</button>
            <button type="button" class="shop-cta ${selectedView === "registrar" ? "active" : "gold"}" data-shop-view="registrar">🏫 Registrar Shop</button>
        </div>

        ${canteenSection}
        ${registrarSection}
    `;
}

function renderEventsPage() {
    const upcoming = getUpcomingEvents();
    const previous = getPreviousEvents();
    const teacherActions = isTeacher() ? `<button type="button" class="btn btn-primary" data-open-event-modal="add">+ Add Event</button>` : "";

    const upcomingMarkup = upcoming.length
        ? upcoming.map((event) => `
            <article class="event-card">
                ${event.image ? `<div class="event-image">${event.image}</div>` : ""}
                <div class="event-copy">
                    <div class="event-header-row">
                        <h3>${event.title}</h3>
                    </div>
                    <p>${event.description}</p>
                    <div class="meta-stack">
                        <span>Date: ${event.date}</span>
                        <span>Time: ${event.time}</span>
                        <span>Location: ${event.location}</span>
                    </div>
                    ${isTeacher() ? `
                        <div class="inline-actions compact">
                            <button type="button" class="btn btn-small btn-secondary" data-edit-event="${event.id}">Edit</button>
                            <button type="button" class="btn btn-small btn-danger" data-delete-event="${event.id}">Delete</button>
                        </div>
                    ` : ""}
                </div>
            </article>
        `).join("")
        : `<div class="empty-box">No upcoming events.</div>`;

    const previousMarkup = previous.length
        ? previous.map((event) => `
            <article class="event-card past-event">
                <div class="event-image">📅</div>
                <div class="event-copy">
                    <h3>${event.title}</h3>
                    <p>${event.description}</p>
                    <div class="meta-stack">
                        <span>${event.date}</span>
                        <span>${event.location}</span>
                    </div>
                </div>
            </article>
        `).join("")
        : `<div class="empty-box">No previous events available.</div>`;

    const eventsPage = document.getElementById("page-events");
    eventsPage.innerHTML = `
        <div class="section-header-row">
            <h2>📅 Events</h2>
            ${teacherActions}
        </div>
        <div class="section-block">
            <h3>Upcoming Events</h3>
            ${upcomingMarkup}
        </div>
        <div class="section-block">
            <h3>Previous Events</h3>
            ${previousMarkup}
        </div>
    `;
}

function deleteMessage(messageId) {
    if (!isTeacher()) return;
    state.chats = state.chats.filter((message) => message.id !== messageId);
    saveState();
    renderChatPage();
    showToast("Message deleted.");
}

function renderChatPage() {
    const roomButtons = [
        { type: "TEACHER_ANNOUNCEMENT", label: "📢 Teacher Announcements" },
        { type: "GLOBAL", label: "🌎 Global CCTC Chat" }
    ];

    const selectedRoom = state.currentChatRoom || "GLOBAL";
    const messages = getMessagesForChat(selectedRoom);
    const roomMarkup = roomButtons.map((room) => `
        <button type="button" class="chat-room-button ${selectedRoom === room.type ? "active" : ""}" data-chat-room="${room.type}">${room.label}</button>
    `).join("");

    const composerMarkup = canSendMessageForChat(selectedRoom)
        ? `
            <form id="chatComposer" class="chat-composer">
                <input id="chatInput" type="text" maxlength="500" placeholder="Write a message..." required>
                <button type="submit" class="btn btn-primary">Send</button>
            </form>
        `
        : `<div class="empty-box chat-empty">Students can view this chat but cannot send messages here.</div>`;

    const messageMarkup = messages.length
        ? messages.map((message) => `
            <article class="chat-message ${message.senderRole === ROLES.TEACHER ? "teacher-message" : "student-message"}">
                <div class="chat-meta">
                    <strong>${message.senderName}</strong>
                    <span>${message.senderRole === ROLES.TEACHER ? "Teacher" : "Student"}</span>
                    <time>${new Date(message.createdAt).toLocaleString([], { dateStyle: "short", timeStyle: "short" })}</time>
                    ${isTeacher() ? `<button type="button" class="link-button small" data-delete-message="${message.id}">Delete</button>` : ""}
                </div>
                <p>${message.message}</p>
            </article>
        `).join("")
        : `<div class="empty-box">No messages yet. Start the conversation.</div>`;

    const chatPage = document.getElementById("page-chat");
    chatPage.innerHTML = `
        <div class="section-header-row">
            <h2>💬 Chat</h2>
        </div>
        <div class="chat-layout">
            <aside class="chat-sidebar">
                <h3>School Groups</h3>
                ${roomMarkup}
            </aside>
            <section class="chat-panel">
                <div class="chat-header">
                    <h3>${selectedRoom === "TEACHER_ANNOUNCEMENT" ? "📢 Teacher Announcements" : "🌎 Global CCTC Chat"}</h3>
                </div>
                <div class="chat-list">${messageMarkup}</div>
                ${composerMarkup}
            </section>
        </div>
    `;

    const form = document.getElementById("chatComposer");
    if (form) {
        form.addEventListener("submit", (event) => {
            event.preventDefault();
            const input = document.getElementById("chatInput");
            const message = input.value.trim();
            if (!message) return;

            const newMessage = {
                id: `chat-${Date.now()}`,
                senderId: state.currentUser.id,
                senderName: state.currentUser.name,
                senderRole: state.currentUser.role,
                chatType: selectedRoom,
                message,
                createdAt: new Date().toISOString()
            };

            state.chats.push(newMessage);
            saveState();
            renderChatPage();
            showToast("Message sent.");
        });
    }
}

function renderDashboardPage() {
    const dashboardPage = document.getElementById("page-dashboard");
    const visibleTeacherOrders = state.orders.filter((order) => !order.teacherRemoved);
    const orderCards = visibleTeacherOrders.length
        ? visibleTeacherOrders.slice(0, 6).map((order) => {
            const isApproved = order.status === "approved" || order.status === "done";
            return `
                <article class="dashboard-order-card">
                    <div class="order-header-row">
                        <h4>Order ${order.id.replace("order-", "#")}</h4>
                        <span class="order-status-pill ${isApproved ? "done" : "pending"}">${isApproved ? "Approved" : "Pending"}</span>
                    </div>
                    <p class="order-items">${(order.items || []).map((item) => `${item.name} × ${item.quantity || 1}`).join(", ") || "School purchase"}</p>
                    <div class="order-meta-row">
                        <span>${formatDate(order.date)}</span>
                        <strong>₱${order.total || 0}</strong>
                    </div>
                    <div class="instruction-box">
                        <label>Teacher comment</label>
                        <textarea data-order-note-input="${order.id}" rows="2" placeholder="Add a pickup or preparation instruction...">${order.teacherNote || ""}</textarea>
                        <button type="button" class="btn btn-small btn-secondary" data-order-note-save="${order.id}">Save comment</button>
                    </div>
                    <div class="order-action-row">
                        <button type="button" class="btn btn-small ${isApproved ? "btn-secondary" : "btn-primary"}" data-order-status="${order.id}">
                            ${isApproved ? "Move back to pending" : "Approve order"}
                        </button>
                        <button type="button" class="btn btn-small btn-danger" data-remove-order="${order.id}">Remove</button>
                    </div>
                </article>
            `;
        }).join("")
        : `<div class="empty-box">No orders yet.</div>`;

    dashboardPage.innerHTML = `
        <div class="section-header-row">
            <h2>📊 Teacher Dashboard</h2>
        </div>

        <div class="dashboard-grid">
            <article class="dashboard-card">
                <h3>Events</h3>
                <ul>
                    <li>Add Event</li>
                    <li>Manage Events</li>
                </ul>
                <button type="button" class="btn btn-primary" data-open-event-modal="add">Add Event</button>
                <button type="button" class="btn btn-secondary" data-page-link="events">Manage Events</button>
            </article>

            <article class="dashboard-card">
                <h3>Announcements</h3>
                <ul>
                    <li>Add Announcement</li>
                    <li>Manage Announcements</li>
                </ul>
                <button type="button" class="btn btn-primary" data-open-announcement-modal="add">Add Announcement</button>
                <button type="button" class="btn btn-secondary" data-page-link="home">View Home</button>
            </article>

            <article class="dashboard-card">
                <h3>Canteen</h3>
                <ul>
                    <li>Add Product</li>
                    <li>Manage Products</li>
                    <li>Update Availability</li>
                </ul>
                <button type="button" class="btn btn-primary" data-add-product="CANTEEN">Add Product</button>
                <button type="button" class="btn btn-secondary" data-page-link="shop">Manage Shop</button>
            </article>

            <article class="dashboard-card">
                <h3>Registrar</h3>
                <ul>
                    <li>Add Product</li>
                    <li>Manage Products</li>
                    <li>Manage Sizes</li>
                </ul>
                <button type="button" class="btn btn-primary" data-add-product="REGISTRAR">Add Product</button>
                <button type="button" class="btn btn-secondary" data-page-link="shop">Manage Shop</button>
            </article>
        </div>

        <div class="section-block">
            <div class="section-header-row">
                <h3>📦 Order inbox</h3>
            </div>
            <div class="order-inbox-grid">${orderCards}</div>
        </div>
    `;
}

function renderProfilePage() {
    const profilePage = document.getElementById("page-profile");
    if (!state.currentUser) return;

    const visibleOrders = state.orders.filter((order) => !order.studentCleared).slice(0, 3);
    const profileOrders = visibleOrders.length
        ? visibleOrders.map((order) => {
            const isApproved = order.status === "approved" || order.status === "done";
            return `
                <div class="order-row ${isApproved ? "order-row-done" : ""}">
                    <div class="order-icon">🧾</div>
                    <div class="order-details">
                        <div class="order-title">${(order.items || []).map((item) => item.name).join(", ") || "School product"}</div>
                        <div class="order-meta">${formatDate(order.date)} &middot; ${order.payment || "Face-to-Face"}</div>
                        ${isApproved ? `<div class="order-status-text">✅ Approved by teacher</div>` : `<div class="order-status-text">⏳ Waiting for teacher approval</div>`}
                        ${order.teacherNote ? `<div class="order-note">Teacher comment: ${order.teacherNote}</div>` : ""}
                        ${isApproved ? `<button type="button" class="link-button small" data-order-clear="${order.id}">Clear notice</button>` : ""}
                    </div>
                    <div class="order-price">₱${order.total || 0}</div>
                </div>
            `;
        }).join("")
        : `<div class="empty-box">No recent orders yet.</div>`;

    profilePage.innerHTML = `
        <div class="section-header-row">
            <h2>👤 Profile</h2>
        </div>

        <div class="profile-card large">
            <div class="profile-avatar large-avatar">${state.currentUser.name.charAt(0).toUpperCase()}</div>
            <div class="profile-copy">
                <h3>${state.currentUser.name}</h3>
                <div class="profile-name-editor">
                    <input type="text" data-profile-name-input value="${state.currentUser.name}" maxlength="50" />
                    <button type="button" class="btn btn-small btn-secondary" data-profile-name-save>Save name</button>
                </div>
                <p>${state.currentUser.role === ROLES.TEACHER ? "Teacher" : "Student"}</p>
                <p>${state.currentUser.email}</p>
                <p>${schoolInfo.name}</p>
                <button type="button" class="btn btn-primary" id="logoutButton">Log out</button>
            </div>
        </div>

        <div class="section-block">
            <div class="section-header-row">
                <h3>Recent orders</h3>
            </div>
            ${profileOrders}
        </div>
    `;

    document.getElementById("logoutButton").addEventListener("click", logout);
}

function renderEverything() {
    renderNav();
    renderHomePage();
    renderShopPage();
    renderEventsPage();
    renderChatPage();
    renderDashboardPage();
    renderProfilePage();
    renderCartModal();
    updateCartBadge();
}

function openProductModal(productType, mode = "add", productId = null) {
    const modal = document.getElementById("productModal");
    const modalTitle = document.getElementById("productModalTitle");
    const productTypeInput = document.getElementById("productTypeInput");
    const modeInput = document.getElementById("productModeInput");
    const productIdInput = document.getElementById("productIdInput");
    const titleInput = document.getElementById("productNameInput");
    const imageInput = document.getElementById("productImageInput");
    const categoryInput = document.getElementById("productCategoryInput");
    const priceInput = document.getElementById("productPriceInput");
    const descInput = document.getElementById("productDescriptionInput");
    const availabilityInput = document.getElementById("productAvailabilityInput");
    const sizesFieldWrap = document.getElementById("sizesFieldWrap");
    const sizesInput = document.getElementById("productSizesInput");
    const submitButton = document.getElementById("productSubmitButton");

    const goods = productType === "REGISTRAR" ? state.registrar : state.canteen;
    const target = goods.find((item) => item.id === productId) || null;

    modeInput.value = mode;
    productTypeInput.value = productType;
    productIdInput.value = productId || "";

    if (mode === "edit" && target) {
        titleInput.value = target.name || "";
        imageInput.value = target.image || "";
        categoryInput.value = target.category || "";
        priceInput.value = target.price || 0;
        descInput.value = target.description || "";
        availabilityInput.value = target.available ? "available" : "unavailable";
        if (productType === "REGISTRAR") {
            const sizeText = (target.sizes || []).map((size) => `${size.label}: ${size.available ? "Available" : "Unavailable"}`).join("\n");
            sizesInput.value = sizeText;
            sizesFieldWrap.style.display = "block";
        } else {
            sizesInput.value = "";
            sizesFieldWrap.style.display = "none";
        }
        modalTitle.textContent = `Edit ${productType === "REGISTRAR" ? "Registrar" : "Canteen"} Product`;
        submitButton.textContent = "Update product";
    } else {
        modalTitle.textContent = `Add ${productType === "REGISTRAR" ? "Registrar" : "Canteen"} Product`;
        titleInput.value = "";
        imageInput.value = "";
        categoryInput.value = productType === "REGISTRAR" ? "Uniforms" : "Meals";
        priceInput.value = "";
        descInput.value = "";
        availabilityInput.value = "available";
        sizesInput.value = "";
        sizesFieldWrap.style.display = productType === "REGISTRAR" ? "block" : "none";
        submitButton.textContent = "Save product";
    }

    modal.classList.remove("hidden");
}

function closeModalById(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.add("hidden");
}

function handleProductSubmit(event) {
    event.preventDefault();
    const productType = document.getElementById("productTypeInput").value;
    const mode = document.getElementById("productModeInput").value;
    const productId = document.getElementById("productIdInput").value;
    const name = document.getElementById("productNameInput").value.trim();
    const image = document.getElementById("productImageInput").value.trim();
    const category = document.getElementById("productCategoryInput").value.trim();
    const price = Number(document.getElementById("productPriceInput").value) || 0;
    const description = document.getElementById("productDescriptionInput").value.trim();
    const available = document.getElementById("productAvailabilityInput").value === "available";
    const sizesValue = document.getElementById("productSizesInput").value.trim();

    const payload = {
        id: productId || `${(productType === "REGISTRAR" ? "reg" : "canteen")}-${Date.now()}`,
        name,
        image: image || (productType === "REGISTRAR" ? "📚" : "🍔"),
        category,
        price,
        description,
        available,
        seller: state.currentUser ? state.currentUser.name : "CCTC"
    };

    if (productType === "REGISTRAR") {
        payload.sizes = sizesValue
            ? sizesValue.split(/\n+/).filter(Boolean).map((line) => {
                const [label, value] = line.split(":").map((part) => part.trim());
                return {
                    label: label || "Size",
                    available: value ? value.toLowerCase() === "available" : true
                };
            })
            : [];
    }

    if (mode === "edit") {
        const targetList = productType === "REGISTRAR" ? state.registrar : state.canteen;
        const index = targetList.findIndex((item) => item.id === productId);
        if (index >= 0) {
            targetList[index] = { ...targetList[index], ...payload };
        }
    } else {
        if (productType === "REGISTRAR") {
            state.registrar.unshift(payload);
        } else {
            state.canteen.unshift(payload);
        }
    }

    saveState();
    renderEverything();
    closeModalById("productModal");
    showToast("Product saved.");
}

function openEventModal(mode = "add", eventId = null) {
    const modal = document.getElementById("eventModal");
    const form = document.getElementById("eventForm");
    const modeInput = document.getElementById("eventModeInput");
    const idInput = document.getElementById("eventIdInput");
    const titleInput = document.getElementById("eventTitleInput");
    const dateInput = document.getElementById("eventDateInput");
    const timeInput = document.getElementById("eventTimeInput");
    const locationInput = document.getElementById("eventLocationInput");
    const imageInput = document.getElementById("eventImageInput");
    const descriptionInput = document.getElementById("eventDescriptionInput");

    const target = state.events.find((event) => event.id === eventId) || null;
    modeInput.value = mode;
    idInput.value = eventId || "";

    if (mode === "edit" && target) {
        titleInput.value = target.title || "";
        dateInput.value = target.date || "";
        timeInput.value = target.time || "";
        locationInput.value = target.location || "";
        imageInput.value = target.image || "";
        descriptionInput.value = target.description || "";
        // no pinned option (feature removed)
        document.getElementById("eventModalTitle").textContent = "Edit Event";
        document.getElementById("eventSubmitButton").textContent = "Update event";
    } else {
        form.reset();
        document.getElementById("eventModalTitle").textContent = "Add Event";
        document.getElementById("eventSubmitButton").textContent = "Save event";
    }

    modal.classList.remove("hidden");
}

function handleEventSubmit(event) {
    event.preventDefault();
    const mode = document.getElementById("eventModeInput").value;
    const id = document.getElementById("eventIdInput").value;
    const payload = {
        id: id || `event-${Date.now()}`,
        title: document.getElementById("eventTitleInput").value.trim(),
        description: document.getElementById("eventDescriptionInput").value.trim(),
        date: document.getElementById("eventDateInput").value,
        time: document.getElementById("eventTimeInput").value,
        location: document.getElementById("eventLocationInput").value.trim(),
        image: document.getElementById("eventImageInput").value.trim() || "🎉",
        createdBy: state.currentUser ? state.currentUser.name : "Teacher",
        createdAt: new Date().toISOString(),
        active: true
    };

    if (mode === "edit") {
        const index = state.events.findIndex((event) => event.id === id);
        if (index >= 0) {
            state.events[index] = { ...state.events[index], ...payload };
        }
    } else {
        state.events.unshift(payload);
    }

    saveState();
    renderEverything();
    closeModalById("eventModal");
    showToast("Event saved.");
}

function openAnnouncementModal(mode = "add", id = null) {
    const modal = document.getElementById("announcementModal");
    const target = state.announcements.find((announcement) => announcement.id === id) || null;
    document.getElementById("announcementModeInput").value = mode;
    document.getElementById("announcementIdInput").value = id || "";

    if (mode === "edit" && target) {
        document.getElementById("announcementTitleInput").value = target.title || "";
        document.getElementById("announcementContentInput").value = target.content || "";
        // pinned option removed
        document.getElementById("announcementModalTitle").textContent = "Edit Announcement";
        document.getElementById("announcementSubmitButton").textContent = "Update announcement";
    } else {
        document.getElementById("announcementForm").reset();
        document.getElementById("announcementModalTitle").textContent = "Add Announcement";
        document.getElementById("announcementSubmitButton").textContent = "Save announcement";
    }

    modal.classList.remove("hidden");
}

function handleAnnouncementSubmit(event) {
    event.preventDefault();
    const mode = document.getElementById("announcementModeInput").value;
    const id = document.getElementById("announcementIdInput").value;
    const payload = {
        id: id || `announcement-${Date.now()}`,
        title: document.getElementById("announcementTitleInput").value.trim(),
        content: document.getElementById("announcementContentInput").value.trim(),
        datePosted: new Date().toISOString().slice(0, 10),
        createdBy: state.currentUser ? state.currentUser.name : "Teacher",
        active: true
    };

    if (mode === "edit") {
        const index = state.announcements.findIndex((announcement) => announcement.id === id);
        if (index >= 0) {
            state.announcements[index] = { ...state.announcements[index], ...payload };
        }
    } else {
        state.announcements.unshift(payload);
    }

    saveState();
    renderEverything();
    closeModalById("announcementModal");
    showToast("Announcement saved.");
}

function deleteProduct(productType, productId) {
    const targetList = productType === "REGISTRAR" ? state.registrar : state.canteen;
    const filtered = targetList.filter((item) => item.id !== productId);
    if (productType === "REGISTRAR") {
        state.registrar = filtered;
    } else {
        state.canteen = filtered;
    }
    saveState();
    renderEverything();
    showToast("Product deleted.");
}

function toggleProductAvailability(productType, productId) {
    const targetList = productType === "REGISTRAR" ? state.registrar : state.canteen;
    const item = targetList.find((entry) => entry.id === productId);
    if (!item) return;
    item.available = !item.available;
    saveState();
    renderEverything();
}

function deleteEvent(id) {
    state.events = state.events.filter((event) => event.id !== id);
    saveState();
    renderEverything();
    showToast("Event deleted.");
}

function deleteAnnouncement(id) {
    state.announcements = state.announcements.filter((announcement) => announcement.id !== id);
    saveState();
    renderEverything();
    showToast("Announcement deleted.");
}

function saveProfileName(newName) {
    if (!state.currentUser) return;

    const trimmedName = String(newName || "").trim();
    if (!trimmedName) {
        showToast("Please enter a name.");
        return;
    }

    const previousName = state.currentUser.name;
    state.currentUser.name = trimmedName;

    const userIndex = state.users.findIndex((user) => user.id === state.currentUser.id);
    if (userIndex !== -1) {
        state.users[userIndex].name = trimmedName;
    }

    state.chats.forEach((chat) => {
        if (chat.senderId === state.currentUser.id) {
            chat.senderName = trimmedName;
        }
    });

    state.events.forEach((event) => {
        if (event.createdBy === previousName) {
            event.createdBy = trimmedName;
        }
    });

    state.announcements.forEach((announcement) => {
        if (announcement.createdBy === previousName) {
            announcement.createdBy = trimmedName;
        }
    });

    saveState();
    renderEverything();
    showToast("Profile name updated.");
}

function logout() {
    state.currentUser = null;
    saveState();
    renderAuth();
}

function handleLogin(event) {
    event.preventDefault();
    const email = document.getElementById("emailInput").value.trim();
    const password = document.getElementById("passwordInput").value;
    const selectedRole = document.getElementById("roleInput").value;
    const user = state.users.find((item) => item.email.toLowerCase() === email.toLowerCase() && item.role === selectedRole);
    if (user && user.password === password) {
        state.currentUser = user;
        saveState();
        renderAuth();
        renderEverything();
        showPage("home");
        return;
    }

    const fallbackUser = state.users.find((item) => item.email.toLowerCase() === email.toLowerCase());
    if (fallbackUser && fallbackUser.password === password) {
        state.currentUser = fallbackUser;
        saveState();
        renderAuth();
        renderEverything();
        showPage("home");
        return;
    }

    const error = document.getElementById("loginError");
    error.textContent = "Invalid email, password, or role. Please try again.";
    error.classList.remove("hidden");
}

function quickLogin(role) {
    const user = state.users.find((item) => item.role === (role === "student" ? ROLES.STUDENT : ROLES.TEACHER));
    if (!user) return;
    document.getElementById("emailInput").value = user.email;
    document.getElementById("passwordInput").value = user.password;
    document.getElementById("roleInput").value = user.role;
    state.currentUser = user;
    saveState();
    renderAuth();
    renderEverything();
    showPage("home");
}

function renderAuth() {
    const authScreen = document.getElementById("authScreen");
    const mainApp = document.getElementById("mainApp");
    if (state.currentUser) {
        authScreen.classList.add("hidden");
        mainApp.classList.remove("hidden");
        renderNav();
        showPage("home");
    } else {
        mainApp.classList.add("hidden");
        authScreen.classList.remove("hidden");
    }
}

function bindStaticEvents() {
    document.getElementById("loginForm").addEventListener("submit", handleLogin);
    document.querySelectorAll("[data-demo]").forEach((button) => {
        button.addEventListener("click", () => quickLogin(button.dataset.demo));
    });

    document.getElementById("mobileMenuButton").addEventListener("click", () => {
        const menu = document.getElementById("navLinks");
        const open = menu.classList.toggle("open");
        document.getElementById("mobileMenuButton").setAttribute("aria-expanded", String(open));
    });

    const cartButton = document.getElementById("cartButton");
    cartButton.addEventListener("click", () => {
        openCartModal();
    });

    const themeToggle = document.getElementById("themeToggle");
    if (themeToggle) {
        themeToggle.addEventListener("click", () => {
            const current = localStorage.getItem("campusHubTheme") || getPreferredTheme();
            const next = current === "cyber" ? "light" : "cyber";
            applyTheme(next);
            localStorage.setItem("campusHubTheme", next);
        });
    }

    document.getElementById("productForm").addEventListener("submit", handleProductSubmit);
    document.getElementById("eventForm").addEventListener("submit", handleEventSubmit);
    document.getElementById("announcementForm").addEventListener("submit", handleAnnouncementSubmit);

    document.querySelectorAll("[data-close-modal]").forEach((button) => {
        button.addEventListener("click", () => closeModalById(button.dataset.closeModal));
    });

    document.addEventListener("click", (event) => {
        const navLink = event.target.closest("[data-page-link]");
        if (navLink) {
            const page = navLink.dataset.pageLink;
            if (page === "shop" && navLink.dataset.shopFocus) {
                showPage("shop");
                setTimeout(() => {
                    const section = navLink.dataset.shopFocus === "canteen" ? document.getElementById("shop-canteen") : document.getElementById("shop-registrar");
                    if (section) section.scrollIntoView({ behavior: "smooth", block: "start" });
                }, 50);
                return;
            }
            showPage(page);
            return;
        }

        const productAdd = event.target.closest("[data-add-product]");
        if (productAdd) {
            openProductModal(productAdd.dataset.addProduct, "add");
            return;
        }

        const addToCartButton = event.target.closest("[data-add-cart]");
        if (addToCartButton) {
            addToCart(addToCartButton.dataset.productType, addToCartButton.dataset.addCart);
            return;
        }

        const cartRemoveButton = event.target.closest("[data-cart-remove]");
        if (cartRemoveButton) {
            removeCartItem(cartRemoveButton.dataset.cartType, cartRemoveButton.dataset.cartRemove);
            return;
        }

        const checkoutButton = event.target.closest("[data-checkout-cart]");
        if (checkoutButton) {
            checkoutCart();
            return;
        }

        const shopViewButton = event.target.closest("[data-shop-view]");
        if (shopViewButton) {
            state.shopView = shopViewButton.dataset.shopView || "canteen";
            renderShopPage();
            return;
        }

        const productEdit = event.target.closest("[data-edit-product]");
        if (productEdit) {
            openProductModal(productEdit.dataset.productType, "edit", productEdit.dataset.editProduct);
            return;
        }

        const deleteProductButton = event.target.closest("[data-delete-product]");
        if (deleteProductButton) {
            deleteProduct(deleteProductButton.dataset.productType, deleteProductButton.dataset.deleteProduct);
            return;
        }

        const toggleAvail = event.target.closest("[data-toggle-product]");
        if (toggleAvail) {
            toggleProductAvailability(toggleAvail.dataset.productType, toggleAvail.dataset.toggleProduct);
            return;
        }

        const openEvent = event.target.closest("[data-open-event-modal]");
        if (openEvent) {
            openEventModal("add");
            return;
        }

        const editEvent = event.target.closest("[data-edit-event]");
        if (editEvent) {
            openEventModal("edit", editEvent.dataset.editEvent);
            return;
        }

        const deleteEventBtn = event.target.closest("[data-delete-event]");
        if (deleteEventBtn) {
            deleteEvent(deleteEventBtn.dataset.deleteEvent);
            return;
        }


        const openAnnouncement = event.target.closest("[data-open-announcement-modal]");
        if (openAnnouncement) {
            openAnnouncementModal("add");
            return;
        }

        const editAnnouncement = event.target.closest("[data-edit-announcement]");
        if (editAnnouncement) {
            openAnnouncementModal("edit", editAnnouncement.dataset.editAnnouncement);
            return;
        }

        const deleteAnnouncementBtn = event.target.closest("[data-delete-announcement]");
        if (deleteAnnouncementBtn) {
            deleteAnnouncement(deleteAnnouncementBtn.dataset.deleteAnnouncement);
            return;
        }


        const deleteMessageButton = event.target.closest("[data-delete-message]");
        if (deleteMessageButton) {
            deleteMessage(deleteMessageButton.dataset.deleteMessage);
            return;
        }

        const clearDoneNoticeButton = event.target.closest("[data-order-clear]");
        if (clearDoneNoticeButton) {
            clearDoneOrderNotice(clearDoneNoticeButton.dataset.orderClear);
            return;
        }

        const saveProfileNameButton = event.target.closest("[data-profile-name-save]");
        if (saveProfileNameButton) {
            const profileNameInput = document.querySelector("[data-profile-name-input]");
            saveProfileName(profileNameInput ? profileNameInput.value : "");
            return;
        }

        const orderNoteSaveButton = event.target.closest("[data-order-note-save]");
        if (orderNoteSaveButton) {
            const noteInput = document.querySelector(`[data-order-note-input="${orderNoteSaveButton.dataset.orderNoteSave}"]`);
            saveOrderInstruction(orderNoteSaveButton.dataset.orderNoteSave, noteInput ? noteInput.value : "");
            return;
        }

        const removeOrderButton = event.target.closest("[data-remove-order]");
        if (removeOrderButton) {
            removeOrder(removeOrderButton.dataset.removeOrder);
            return;
        }

        const orderStatusButton = event.target.closest("[data-order-status]");
        if (orderStatusButton) {
            toggleOrderStatus(orderStatusButton.dataset.orderStatus);
            return;
        }

        const chatRoom = event.target.closest("[data-chat-room]");
        if (chatRoom) {
            state.currentChatRoom = chatRoom.dataset.chatRoom;
            renderChatPage();
            return;
        }

        const scrollTarget = event.target.closest("[data-scroll-shop]");
        if (scrollTarget) {
            const targetId = scrollTarget.dataset.scrollShop === "canteen" ? "shop-canteen" : "shop-registrar";
            const node = document.getElementById(targetId);
            if (node) node.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    });

    window.addEventListener("storage", (event) => {
        if (event.key && event.key.startsWith("campusHub")) {
            loadState();
            renderEverything();
            if (state.currentUser) {
                showPage("home");
            }
        }
    });
}

function bindAppActions() {
    if (!state.currentUser) return;

    document.addEventListener("click", (event) => {
        const toggleProductButton = event.target.closest("[data-toggle-product]");
        if (toggleProductButton) {
            toggleProductAvailability(toggleProductButton.dataset.productType, toggleProductButton.dataset.toggleProduct);
        }

        const viewAnnouncementEdit = event.target.closest("[data-edit-announcement]");
        if (viewAnnouncementEdit) {
            openAnnouncementModal("edit", viewAnnouncementEdit.dataset.editAnnouncement);
        }
    });
}

function getPreferredTheme() {
    const saved = localStorage.getItem("campusHubTheme");
    if (saved === "light" || saved === "cyber") return saved;
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "cyber" : "light";
}

document.addEventListener("DOMContentLoaded", () => {
    loadState();
    bindStaticEvents();
    bindAppActions();
    const savedTheme = getPreferredTheme();
    applyTheme(savedTheme);
    renderAuth();
    if (state.currentUser) {
        renderEverything();
        showPage("home");
    }
});

function applyTheme(name) {
    document.documentElement.classList.remove("theme-cyber", "theme-light");
    const resolved = name === "cyber" ? "cyber" : "light";
    document.documentElement.classList.add(`theme-${resolved}`);
    const t = document.getElementById("themeToggle");
    if (t) t.textContent = resolved === "cyber" ? "🌙" : "☀️";
}

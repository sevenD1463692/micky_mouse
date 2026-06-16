// State
let currentCategory = 'all';
let currentRestaurant = null;
let searchQuery = '';
let currentSort = 'default';
let activeFilterTags = [];
let favorites = [];
let userAccount = localStorage.getItem('fcuEatsUser') || null;
let isAnonymousDefault = localStorage.getItem('fcuEatsAnonymous') === 'true';
let isLoading = false;
let currentPriceFilter = 'all';
let currentSortFilter = 'default';
let selectedBudgets = ['$', '$$', '$$$']; 
let userLocation = { lat: 24.179, lng: 120.648 };
let lastReviewTime = {};
let reviewCooldownActive = false;
let reviewCooldownTimer = null;
let captchaSolution = null;
let showFavoritesOnly = false;

// DOM Elements
const homeView = document.getElementById('homeView');
const detailView = document.getElementById('detailView');
const categoryList = document.getElementById('categoryList');
const restaurantGrid = document.getElementById('restaurantGrid');
const detailContent = document.getElementById('detailContent');
const searchInput = document.getElementById('searchInput');
const backBtn = document.getElementById('backBtn');
const themeToggle = document.getElementById('themeToggle');
const budgetFilterChips = document.getElementById('filterChips');

// Controls Elements
const fontDecrease = document.getElementById('fontDecrease');
const fontIncrease = document.getElementById('fontIncrease');
const userStatus = document.getElementById('userStatus');

// Modal Elements
const loginModal = document.getElementById('loginModal');
const loginModalBackdrop = document.getElementById('loginModalBackdrop');
const closeLoginBtn = document.getElementById('closeLoginBtn');
const loginForm = document.getElementById('loginForm');
const nidUsername = document.getElementById('nidUsername');
const nidPassword = document.getElementById('nidPassword');
const anonymousDefault = document.getElementById('anonymousDefault');

// Mobile Bottom Sheet & Nav Elements
const floatingFilterBtn = document.getElementById('floatingFilterBtn');
const bottomSheet = document.getElementById('bottomSheet');
const bottomSheetBackdrop = document.getElementById('bottomSheetBackdrop');
const closeBottomSheet = document.getElementById('closeBottomSheet');
const applyFiltersBtn = document.getElementById('applyFiltersBtn');
const navHome = document.getElementById('navHome');
const navFilterBtn = document.getElementById('navFilterBtn');
const navMyReviews = document.getElementById('navMyReviews');

const sheetPriceOptions = document.getElementById('sheetPriceOptions');
const sheetSortOptions = document.getElementById('sheetSortOptions');

// Initialize
function init() {
    registerServiceWorker();
    initFontSize();
    initUserStatus();
    loadReviewsFromStorage();
    loadFavoritesFromStorage();
    renderCategories();
    loadRestaurantsWithSkeleton(); // Performance Optimization
    setupEventListeners();
    initTheme();
    setupMobileNav();
}

function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('./sw.js')
                .then(reg => console.log('Service Worker registered scope:', reg.scope))
                .catch(err => console.log('Service Worker registration failed:', err));
        });
    }
}

// Storage Management
function updateRestaurantRating(restaurant) {
    if (!restaurant.reviews || restaurant.reviews.length === 0) {
        restaurant.rating = 0.0;
        return;
    }
    const sum = restaurant.reviews.reduce((acc, rev) => {
        const ratingVal = rev.overallRating !== undefined ? rev.overallRating : (rev.rating || 5);
        return acc + ratingVal;
    }, 0);
    restaurant.rating = parseFloat((sum / restaurant.reviews.length).toFixed(1));
}

function loadFavoritesFromStorage() {
    const stored = localStorage.getItem('fcuEatsFavorites');
    favorites = stored ? JSON.parse(stored) : [];
}

function saveFavoritesToStorage() {
    localStorage.setItem('fcuEatsFavorites', JSON.stringify(favorites));
}

function toggleFavorite(id, event) {
    if (event) event.stopPropagation();
    const index = favorites.indexOf(id);
    if (index === -1) {
        favorites.push(id);
    } else {
        favorites.splice(index, 1);
    }
    saveFavoritesToStorage();
    
    // Update UI if in detail view
    if (currentRestaurant && currentRestaurant.id === id) {
        const btn = document.getElementById('detailFavoriteBtn');
        if (btn) {
            const isFav = favorites.includes(id);
            btn.classList.toggle('active', isFav);
            btn.querySelector('i').className = isFav ? 'ph-fill ph-heart' : 'ph ph-heart';
        }
    }
    renderRestaurants();
}

function loadReviewsFromStorage() {
    const storedReviews = localStorage.getItem('fcuEatsReviews');
    const storedReports = localStorage.getItem('fcuEatsReports');
    const storedDeleted = localStorage.getItem('fcuEatsDeletedReviews');
    
    const parsedReviews = storedReviews ? JSON.parse(storedReviews) : {};
    const parsedReports = storedReports ? JSON.parse(storedReports) : {};
    const parsedDeleted = storedDeleted ? JSON.parse(storedDeleted) : [];

    mockData.restaurants.forEach(r => {
        // 1. Merge user reviews from storage, preventing duplicates
        if (parsedReviews[r.id]) {
            const userReviews = parsedReviews[r.id].filter(ur => !r.reviews.some(ex => ex.id === ur.id));
            r.reviews = [...userReviews, ...r.reviews];
        }

        // 2. Set report counts from storage
        r.reviews.forEach(rev => {
            if (parsedReports[rev.id] !== undefined) {
                rev.reports = parsedReports[rev.id];
            } else if (rev.reports === undefined) {
                rev.reports = 0;
            }
        });

        // 3. Filter out deleted reviews and those with > 10 reports
        r.reviews = r.reviews.filter(rev => !parsedDeleted.includes(rev.id) && rev.reports <= 10);
        
        // 4. Update count and rating dynamically
        r.reviewCount = r.reviews.length;
        updateRestaurantRating(r);
    });
}

function saveReviewToStorage(restaurantId, review) {
    let storedReviews = localStorage.getItem('fcuEatsReviews');
    let parsed = storedReviews ? JSON.parse(storedReviews) : {};
    if (!parsed[restaurantId]) {
        parsed[restaurantId] = [];
    }
    parsed[restaurantId].unshift(review);
    localStorage.setItem('fcuEatsReviews', JSON.stringify(parsed));
}

// Theme Management (Light -> Dark -> Outdoor Cycle)
function initTheme() {
    const savedTheme = localStorage.getItem('fcuEatsTheme');
    if (savedTheme) {
        document.body.setAttribute('data-theme', savedTheme);
        updateThemeIcon(savedTheme);
    } else {
        const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (isDark) {
            document.body.setAttribute('data-theme', 'dark');
            updateThemeIcon('dark');
        } else {
            updateThemeIcon('light');
        }
    }
}

function updateThemeIcon(theme) {
    if (theme === 'dark') {
        themeToggle.innerHTML = '<i class="ph ph-moon"></i>';
    } else if (theme === 'outdoor') {
        themeToggle.innerHTML = '<i class="ph ph-glasses"></i>';
    } else {
        themeToggle.innerHTML = '<i class="ph ph-sun"></i>';
    }
}

themeToggle.addEventListener('click', () => {
    const currentTheme = document.body.getAttribute('data-theme');
    let nextTheme = 'light';
    
    if (currentTheme === 'dark') {
        nextTheme = 'outdoor';
    } else if (currentTheme === 'outdoor') {
        nextTheme = 'light';
    } else {
        nextTheme = 'dark';
    }
    
    if (nextTheme === 'light') {
        document.body.removeAttribute('data-theme');
    } else {
        document.body.setAttribute('data-theme', nextTheme);
    }
    
    localStorage.setItem('fcuEatsTheme', nextTheme);
    updateThemeIcon(nextTheme);
});

// Event Listeners with Debounce for search
function debounce(func, delay) {
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), delay);
    };
}

function setupEventListeners() {
    searchInput.addEventListener('input', debounce((e) => {
        searchQuery = e.target.value.toLowerCase();
        loadRestaurantsWithSkeleton();
    }, 250));

    backBtn.addEventListener('click', () => {
        showHomeView();
    });

    const sortSelect = document.getElementById('sortSelect');
    if (sortSelect) {
        sortSelect.addEventListener('change', (e) => {
            currentSort = e.target.value;
            renderRestaurants();
        });
    }

    const favToggle = document.getElementById('favoritesToggle');
    if (favToggle) {
        favToggle.addEventListener('click', () => {
            showFavoritesOnly = !showFavoritesOnly;
            favToggle.classList.toggle('active', showFavoritesOnly);
            favToggle.querySelector('i').className = showFavoritesOnly ? 'ph-fill ph-heart' : 'ph ph-heart';
            renderRestaurants();
        });
    }

    const filterChips = document.querySelectorAll('.filter-chip-btn');
    filterChips.forEach(btn => {
        btn.addEventListener('click', () => {
            const tag = btn.dataset.tag;
            if (activeFilterTags.includes(tag)) {
                activeFilterTags = activeFilterTags.filter(t => t !== tag);
                btn.classList.remove('active');
            } else {
                activeFilterTags.push(tag);
                btn.classList.add('active');
            }
            renderRestaurants();
        });
    });
}

// Rendering
function renderCategories() {
    categoryList.innerHTML = mockData.categories.map(cat => `
        <div class="category-chip ${currentCategory === cat.id ? 'active' : ''}" data-id="${cat.id}">
            <i class="ph ${cat.icon}"></i>
            <span>${cat.name}</span>
        </div>
    `).join('');

    // Add click events
    document.querySelectorAll('.category-chip').forEach(chip => {
        chip.addEventListener('click', (e) => {
            currentCategory = e.currentTarget.dataset.id;
            renderCategories(); // Re-render to update active state
            loadRestaurantsWithSkeleton();
        });
    });
}

function loadRestaurantsWithSkeleton() {
    isLoading = true;
    
    // Render skeleton cards (Performance representation)
    const skeletonCount = 4;
    restaurantGrid.innerHTML = Array(skeletonCount).fill(0).map(() => `
        <div class="skeleton-card">
            <div class="skeleton-image"></div>
            <div class="skeleton-text title"></div>
            <div class="skeleton-text subtitle"></div>
            <div class="skeleton-text tags"></div>
        </div>
    `).join('');

    // Simulate network delay (300ms) to display skeleton loader (Performance demo)
    setTimeout(() => {
        isLoading = false;
        renderRestaurants();
    }, 300);
}

function renderRestaurants() {
    if (isLoading) return;
    
    let filtered = [...mockData.restaurants];

    // Filter by category
    if (currentCategory !== 'all') {
        filtered = filtered.filter(r => r.category === currentCategory);
    }

    // Filter by search
    if (searchQuery) {
        const trimmedQuery = searchQuery.trim().toLowerCase();
        if (trimmedQuery) {
            filtered = filtered.filter(r => r.name.toLowerCase().includes(trimmedQuery) || r.tags.some(tag => tag.toLowerCase().includes(trimmedQuery)));
        }
    }

    // Filter by quick filter tags
    if (activeFilterTags.length > 0) {
        filtered = filtered.filter(r => activeFilterTags.every(tag => r.tags.includes(tag)));
    }

    // Filter by Bottom Sheet Price
    if (currentPriceFilter !== 'all') {
        filtered = filtered.filter(r => r.price === currentPriceFilter);
    }

    // Filter by Favorites
    if (showFavoritesOnly) {
        filtered = filtered.filter(r => favorites.includes(r.id));
    }

    // Sort Logic
    const sortType = (currentSort !== 'default') ? currentSort : currentSortFilter;
    if (sortType !== 'default') {
        if (sortType === 'rating-desc' || sortType === 'rating') {
            filtered.sort((a, b) => b.rating - a.rating);
        } else if (sortType === 'reviews-desc' || sortType === 'reviews') {
            filtered.sort((a, b) => b.reviewCount - a.reviewCount);
        } else if (sortType === 'price-asc') {
            filtered.sort((a, b) => a.price.length - b.price.length);
        } else if (sortType === 'price-desc') {
            filtered.sort((a, b) => b.price.length - a.price.length);
        }
    }

    if (filtered.length === 0) {
        restaurantGrid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 3rem; color: var(--text-muted);">
                <i class="ph ph-mask-sad" style="font-size: 3rem; margin-bottom: 1rem;"></i>
                <p>${showFavoritesOnly ? '您尚未收藏任何餐廳。' : '找不到符合的美食，換個篩選條件試試看吧！'}</p>
                ${showFavoritesOnly ? `<button class="submit-btn" style="margin-top: 1rem;" onclick="disableFavoritesFilter()">探索熱門美食</button>` : ''}
            </div>
        `;
        return;
    }

    restaurantGrid.innerHTML = filtered.map(r => {
        const isOpen = isRestaurantOpen(r.hours);
        const isFav = favorites.includes(r.id);
        const distance = calculateDistance(userLocation.lat, userLocation.lng, r.coordinates?.lat || 24.179, r.coordinates?.lng || 120.648);
        
        return `
            <div class="restaurant-card" onclick="showDetailView(${r.id})">
                <div class="status-badge ${isOpen ? 'open' : 'closed'}" data-restaurant-id="${r.id}">
                    <span class="status-dot"></span>
                    <span class="status-text">${isOpen ? '營業中' : '已打烊'}</span>
                </div>
                <button class="card-fav-btn ${isFav ? 'active' : ''}" onclick="toggleFavorite(${r.id}, event)">
                    <i class="${isFav ? 'ph-fill ph-heart' : 'ph ph-heart'}"></i>
                </button>
                <img src="${r.image}" alt="${r.name}" class="card-image" loading="lazy">
                <div class="card-content">
                    <div class="card-header">
                        <h3 class="card-title">${r.name}</h3>
                        <div class="card-rating">
                            <i class="ph-fill ph-star"></i>
                            <span>${r.rating}</span>
                            <span class="review-count">(${r.reviewCount})</span>
                        </div>
                    </div>
                    <div class="card-info">
                        <span>${r.price}</span> • <span>${getCategoryName(r.category)}</span> • <span>約 ${formatDistance(distance)}</span>
                    </div>
                    <div class="card-tags">
                        ${r.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

window.disableFavoritesFilter = function() {
    showFavoritesOnly = false;
    const favToggle = document.getElementById('favoritesToggle');
    if (favToggle) {
        favToggle.classList.remove('active');
        favToggle.querySelector('i').className = 'ph ph-heart';
    }
    renderRestaurants();
};

window.clearAllFilters = function() {
    currentCategory = 'all';
    searchQuery = '';
    currentSort = 'default';
    activeFilterTags = [];

    // Reset UI inputs
    const searchInput = document.getElementById('searchInput');
    if (searchInput) searchInput.value = '';

    const sortSelect = document.getElementById('sortSelect');
    if (sortSelect) sortSelect.value = 'default';

    const filterChips = document.querySelectorAll('.filter-chip-btn');
    filterChips.forEach(btn => btn.classList.remove('active'));

    renderCategories();
    renderRestaurants();
};

function getCategoryName(id) {
    const cat = mockData.categories.find(c => c.id === id);
    return cat ? cat.name : '';
}

function isRestaurantOpen(hoursStr) {
    if (!hoursStr) return false;
    const match = hoursStr.match(/(\d{1,2}):(\d{2})\s*-\s*(\d{1,2}):(\d{2})/);
    if (!match) return false;
    
    const [_, startH, startM, endH, endM] = match;
    const startMinutes = parseInt(startH, 10) * 60 + parseInt(startM, 10);
    const endMinutes = parseInt(endH, 10) * 60 + parseInt(endM, 10);
    
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    
    if (startMinutes <= endMinutes) {
        return currentMinutes >= startMinutes && currentMinutes <= endMinutes;
    } else {
        // Over midnight
        return currentMinutes >= startMinutes || currentMinutes <= endMinutes;
    }
}

function updateLiveStatuses() {
    // 1. Update elements in home grid
    const homeGridBadges = document.querySelectorAll('.restaurant-grid .status-badge');
    homeGridBadges.forEach(badge => {
        const id = parseInt(badge.dataset.restaurantId, 10);
        const rest = mockData.restaurants.find(r => r.id === id);
        if (rest) {
            const isOpen = isRestaurantOpen(rest.hours);
            const statusTextEl = badge.querySelector('.status-text');
            
            if (isOpen) {
                if (!badge.classList.contains('open')) {
                    badge.classList.remove('closed');
                    badge.classList.add('open');
                }
                if (statusTextEl && statusTextEl.textContent !== '營業中') {
                    statusTextEl.textContent = '營業中';
                }
            } else {
                if (!badge.classList.contains('closed')) {
                    badge.classList.remove('open');
                    badge.classList.add('closed');
                }
                if (statusTextEl && statusTextEl.textContent !== '已打烊') {
                    statusTextEl.textContent = '已打烊';
                }
            }
        }
    });

    // 2. Update element in detail view
    const detailBadge = document.getElementById('detailStatusBadge');
    if (detailBadge && currentRestaurant) {
        const isOpen = isRestaurantOpen(currentRestaurant.hours);
        const statusTextEl = detailBadge.querySelector('.status-text');
        
        if (isOpen) {
            if (!detailBadge.classList.contains('open')) {
                detailBadge.classList.remove('closed');
                detailBadge.classList.add('open');
            }
            if (statusTextEl && statusTextEl.textContent !== '營業中') {
                statusTextEl.textContent = '營業中';
            }
        } else {
            if (!detailBadge.classList.contains('closed')) {
                detailBadge.classList.remove('open');
                detailBadge.classList.add('closed');
            }
            if (statusTextEl && statusTextEl.textContent !== '已打烊') {
                statusTextEl.textContent = '已打烊';
            }
        }
    }
}


// Views Navigation
function showHomeView() {
    detailView.classList.add('hidden');
    homeView.classList.remove('hidden');
    currentRestaurant = null;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Reset mobile bottom nav active tab
    setActiveNav(navHome);
}

function showDetailView(id) {
    currentRestaurant = mockData.restaurants.find(r => r.id === id);
    if (!currentRestaurant) return;

    renderDetailContent();
    homeView.classList.add('hidden');
    detailView.classList.remove('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function renderDetailContent() {
    const r = currentRestaurant;
    const isOpen = isRestaurantOpen(r.hours);
    const isFav = favorites.includes(r.id);
    const distance = calculateDistance(userLocation.lat, userLocation.lng, r.coordinates?.lat || 24.179, r.coordinates?.lng || 120.648);
    
    detailContent.innerHTML = `
        <div class="detail-header">
            <img src="${r.image}" alt="${r.name}">
            <div class="detail-overlay">
                <div class="detail-title-row">
                    <h2 class="detail-title">${r.name}</h2>
                    <button id="detailFavoriteBtn" class="detail-favorite-btn ${isFav ? 'active' : ''}" onclick="toggleFavorite(${r.id}, event)">
                        <i class="${isFav ? 'ph-fill ph-heart' : 'ph ph-heart'}"></i>
                    </button>
                </div>
                <div class="detail-meta">
                    <span class="detail-status-pill ${isOpen ? 'open' : 'closed'}" id="detailStatusBadge">
                        <span class="status-dot"></span>
                        <span class="status-text">${isOpen ? '營業中' : '已打烊'}</span>
                    </span>
                    <span><i class="ph-fill ph-star"></i> ${r.rating} (${r.reviewCount} 則評價)</span>
                    <span>${r.price}</span>
                    <span>${getCategoryName(r.category)}</span>
                </div>
            </div>
        </div>

        <div class="detail-layout">
            <div class="detail-main">
                <div class="detail-section">
                    <h3><i class="ph ph-info"></i> 店家資訊</h3>
                    <p style="margin-bottom: 1.5rem; color: var(--text-muted);">${r.description}</p>
                    <ul class="info-list">
                        <li>
                            <i class="ph ph-map-pin"></i>
                            <div class="info-content">
                                <strong>地址與距離</strong>
                                <p>${r.address} <span style="color: var(--primary); font-weight: 600; margin-left: 0.5rem;">(距離目前位置約 ${formatDistance(distance)})</span></p>
                            </div>
                        </li>
                        <li>
                            <i class="ph ph-clock"></i>
                            <div class="info-content">
                                <strong>營業時間</strong>
                                <p>${r.hours}</p>
                            </div>
                        </li>
                        <li>
                            <i class="ph ph-tag"></i>
                            <div class="info-content">
                                <strong>標籤</strong>
                                <div class="card-tags" style="margin-top: 0.5rem; margin-bottom: 0;">
                                    ${r.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>

                <div class="detail-section">
                    <h3><i class="ph ph-pencil-simple"></i> 新增評價</h3>
                    ${userAccount ? `
                        <form class="review-form" id="reviewForm" onsubmit="submitReview(event)">
                            <div class="rating-overall-group">
                                <span>整體推薦度</span>
                                <div class="stars-selector overall-stars" data-type="overall">
                                    ${[1,2,3,4,5].map(i => `<i class="ph-fill ph-star" data-value="${i}"></i>`).join('')}
                                </div>
                            </div>
                            <div class="rating-input-group">
                                <div class="rating-input">
                                    <span>價格划算度</span>
                                    <div class="stars-selector" data-type="price">
                                        ${[1,2,3,4,5].map(i => `<i class="ph-fill ph-star" data-value="${i}"></i>`).join('')}
                                    </div>
                                </div>
                                <div class="rating-input">
                                    <span>份量滿意度</span>
                                    <div class="stars-selector" data-type="portion">
                                        ${[1,2,3,4,5].map(i => `<i class="ph-fill ph-star" data-value="${i}"></i>`).join('')}
                                    </div>
                                </div>
                                <div class="rating-input">
                                    <span>等待時間(短至長)</span>
                                    <div class="stars-selector" data-type="waitTime">
                                        ${[1,2,3,4,5].map(i => `<i class="ph-fill ph-star" data-value="${i}"></i>`).join('')}
                                    </div>
                                </div>
                                <div class="rating-input">
                                    <span>適合久坐</span>
                                    <div class="stars-selector" data-type="sitability">
                                        ${[1,2,3,4,5].map(i => `<i class="ph-fill ph-star" data-value="${i}"></i>`).join('')}
                                    </div>
                                </div>
                            </div>
                            <div class="form-group">
                                <label>留言內容</label>
                                <textarea id="reviewComment" placeholder="分享您的真實體驗（至少 5 字，限 200 字）..." required></textarea>
                            </div>
                            
                            <div class="form-group captcha-group">
                                <label>安全驗證 (防止機器人洗版)</label>
                                <div class="captcha-box">
                                    <span id="captchaQuestion">載入中...</span>
                                    <input type="number" id="captchaAnswer" placeholder="輸入答案" required>
                                    <button type="button" id="refreshCaptcha" class="icon-btn" style="padding: 0.25rem;">
                                        <i class="ph ph-arrows-counter-clockwise"></i>
                                    </button>
                                </div>
                            </div>

                            <div class="form-group checkbox-group" style="margin-top: 0.5rem; margin-bottom: 0;">
                                <label class="checkbox-label" style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer;">
                                    <input type="checkbox" id="reviewAnonymous" ${isAnonymousDefault ? 'checked' : ''} style="width: auto; min-height: auto;">
                                    <span style="font-size: 0.9rem; color: var(--text-muted);">使用匿名身份發表 (顯示為：逢甲匿名同學)</span>
                                </label>
                            </div>

                            <button type="submit" class="submit-btn" ${reviewCooldownActive ? 'disabled' : ''}>
                                <i class="ph ph-paper-plane-right"></i> 送出評價
                            </button>
                        </form>
                    ` : `
                        <div style="text-align: center; padding: 2rem; background: var(--bg-color); border-radius: var(--radius-md); border: 1px dashed var(--border-color);">
                            <i class="ph ph-lock" style="font-size: 2.5rem; color: var(--text-muted); margin-bottom: 1rem;"></i>
                            <p style="margin-bottom: 1.5rem; color: var(--text-muted);">為維護評價真實性，本系統限制逢甲大學學生發表評價。</p>
                            <button class="submit-btn" style="margin: 0 auto;" onclick="openLoginModal()">
                                <i class="ph ph-sign-in"></i> 登入 NID 發表評價
                            </button>
                        </div>
                    `}
                </div>
            </div>

            <div class="detail-sidebar">
                <div class="detail-section">
                    <h3><i class="ph ph-chats"></i> 使用者評價</h3>
                    
                    <div class="review-stats">
                        <div class="stat-item">
                            <span class="stat-label">綜合評分</span>
                            <span class="stat-value"><i class="ph-fill ph-star"></i> ${r.rating}</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">總評價數</span>
                            <span class="stat-value" style="color: var(--text-main); font-size: 1.25rem;">${r.reviewCount} 則</span>
                        </div>
                    </div>

                    <div class="review-list" id="reviewList">
                        ${renderReviews(r.reviews)}
                    </div>
                </div>
            </div>
        </div>
    `;

    setupReviewForm();
}

function renderReviews(reviews) {
    if (!reviews || reviews.length === 0) {
        return `<p style="color: var(--text-muted); text-align: center; padding: 1rem;">目前還沒有評價，成為第一個評價的人吧！</p>`;
    }

    return reviews.map(rev => `
        <div class="review-card">
            <div class="review-header">
                <div class="reviewer-info">
                    <div class="avatar">${rev.user.charAt(0)}</div>
                    <div>
                        <div class="reviewer-name">
                            ${rev.user}
                            <span class="review-overall-badge">
                                <i class="ph-fill ph-star"></i> ${(rev.overallRating || 5).toFixed(1)}
                            </span>
                        </div>
                        <div class="review-date">${rev.date}</div>
                    </div>
                </div>
                <button class="report-btn" onclick="reportReview(${currentRestaurant.id}, ${rev.id})" title="檢舉此評論">
                    <i class="ph ph-flag"></i> 檢舉 <span class="report-count">${rev.reports || 0}</span>
                </button>
            </div>
            <div class="review-ratings">
                <div class="rating-pill">💰 價格 <i class="ph-fill ph-star"></i> ${rev.ratings.price}</div>
                <div class="rating-pill">🍱 份量 <i class="ph-fill ph-star"></i> ${rev.ratings.portion}</div>
                <div class="rating-pill">⏳ 等待 <i class="ph-fill ph-star"></i> ${rev.ratings.waitTime}</div>
                <div class="rating-pill">🪑 久坐 <i class="ph-fill ph-star"></i> ${rev.ratings.sitability}</div>
            </div>
            <div class="review-text">${rev.comment}</div>
        </div>
    `).join('');
}

// Review Form Logic
let currentFormRatings = {
    overall: 0,
    price: 0,
    portion: 0,
    waitTime: 0,
    sitability: 0
};

function setupReviewForm() {
    currentFormRatings = { overall: 0, price: 0, portion: 0, waitTime: 0, sitability: 0 };
    const selectors = document.querySelectorAll('.stars-selector');
    
    selectors.forEach(selector => {
        const type = selectors[0] ? selector.dataset.type : null; // Ensure safely referenced
        if (!type) return;
        const stars = selector.querySelectorAll('i');
        
        stars.forEach(star => {
            star.addEventListener('click', (e) => {
                const value = parseInt(e.target.dataset.value);
                currentFormRatings[type] = value;
                
                // Update UI
                stars.forEach(s => {
                    if (parseInt(s.dataset.value) <= value) {
                        s.classList.add('active');
                        s.style.color = 'var(--star-color)';
                    } else {
                        s.classList.remove('active');
                        s.style.color = 'var(--star-empty)';
                    }
                });
            });
        });
    });

    // Captcha Init
    generateCaptcha();
    const refreshBtn = document.getElementById('refreshCaptcha');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', generateCaptcha);
    }
}

function generateCaptcha() {
    const num1 = Math.floor(Math.random() * 9) + 1;
    const num2 = Math.floor(Math.random() * 9) + 1;
    const ops = ['+', '-'];
    const op = ops[Math.floor(Math.random() * ops.length)];
    
    let question = '';
    if (op === '+') {
        question = `${num1} + ${num2} = ?`;
        captchaSolution = num1 + num2;
    } else {
        if (num1 >= num2) {
            question = `${num1} - ${num2} = ?`;
            captchaSolution = num1 - num2;
        } else {
            question = `${num2} - ${num1} = ?`;
            captchaSolution = num2 - num1;
        }
    }
    
    const captchaQ = document.getElementById('captchaQuestion');
    if (captchaQ) {
        captchaQ.innerText = question;
    }
}

window.submitReview = function(e) {
    e.preventDefault();
    
    if (!userAccount) {
        openLoginModal();
        return;
    }
    
    if (reviewCooldownActive) {
        alert('提交速度過快，請稍候再試！');
        return;
    }
    
    const now = Date.now();
    const rateLimitKey = `${userAccount}_${currentRestaurant.id}`;
    if (lastReviewTime[rateLimitKey] && (now - lastReviewTime[rateLimitKey] < 60000)) {
        const remainingSeconds = Math.ceil((60000 - (now - lastReviewTime[rateLimitKey])) / 1000);
        alert(`為了維持評價真實性與防止洗版，同一店家您每分鐘只能發表一次評價。請在 ${remainingSeconds} 秒後再試！`);
        return;
    }
    
    const captchaInput = document.getElementById('captchaAnswer');
    if (!captchaInput || parseInt(captchaInput.value) !== captchaSolution) {
        alert('安全驗證碼輸入錯誤，請重新計算！');
        generateCaptcha();
        if (captchaInput) captchaInput.value = '';
        return;
    }
    
    const comment = document.getElementById('reviewComment').value.trim();
    if (comment.length < 5) {
        alert('留言內容過短，請至少輸入 5 個字！');
        return;
    }
    if (comment.length > 200) {
        alert('留言內容過長，字數限制在 200 字以內！');
        return;
    }
    
    if (Object.values(currentFormRatings).some(val => val === 0)) {
        alert('請完成所有星級評分！');
        return;
    }
    
    const escapedComment = escapeHTML(comment);
    const isAnonymous = document.getElementById('reviewAnonymous') ? document.getElementById('reviewAnonymous').checked : isAnonymousDefault;
    const displayName = isAnonymous ? '逢甲匿名同學' : maskUserId(userAccount);
    
    const newReview = {
        id: Date.now(),
        user: displayName,
        date: new Date().toISOString().split('T')[0],
        ratings: { ...currentFormRatings },
        overallRating: currentFormRatings.overall,
        comment: comment,
        reports: 0
    };
    
    currentRestaurant.reviews.unshift(newReview);
    currentRestaurant.reviewCount = currentRestaurant.reviews.length;
    updateRestaurantRating(currentRestaurant);
    
    saveReviewToStorage(currentRestaurant.id, newReview);
    lastReviewTime[rateLimitKey] = now;
    
    triggerReviewCooldown();
    
    renderDetailContent();
    renderRestaurants();
};

function triggerReviewCooldown() {
    reviewCooldownActive = true;
    let countdown = 10;
    const submitBtn = document.querySelector('.submit-btn');
    
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `<i class="ph ph-hourglass"></i> 安全冷卻中 (${countdown}s)`;
        
        reviewCooldownTimer = setInterval(() => {
            countdown--;
            if (countdown <= 0) {
                clearInterval(reviewCooldownTimer);
                reviewCooldownActive = false;
                submitBtn.disabled = false;
                submitBtn.innerHTML = `<i class="ph ph-paper-plane-right"></i> 送出評價`;
            } else {
                submitBtn.innerHTML = `<i class="ph ph-hourglass"></i> 安全冷卻中 (${countdown}s)`;
            }
        }, 1000);
    }
}

function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, 
        tag => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            "'": '&#39;',
            '"': '&quot;'
        }[tag] || tag)
    );
}

// FontSize Management
const FONT_CLASSES = ['font-scale-small', 'font-scale-medium', 'font-scale-large', 'font-scale-xlarge'];
let currentFontIndex = parseInt(localStorage.getItem('fcuEatsFontIndex')) || 1;

function initFontSize() {
    updateFontSizeUI();
}

function updateFontSizeUI() {
    document.body.classList.remove(...FONT_CLASSES);
    document.body.classList.add(FONT_CLASSES[currentFontIndex]);
    localStorage.setItem('fcuEatsFontIndex', currentFontIndex);
}

fontDecrease.addEventListener('click', () => {
    if (currentFontIndex > 0) {
        currentFontIndex--;
        updateFontSizeUI();
    }
});

window.reportReview = function(restaurantId, reviewId) {
    const restaurant = mockData.restaurants.find(r => r.id === restaurantId);
    if (!restaurant) return;
    const review = restaurant.reviews.find(rev => rev.id === reviewId);
    if (!review) return;

    review.reports = (review.reports || 0) + 1;
    
    // Save to storage
    let storedReports = localStorage.getItem('fcuEatsReports');
    let parsedReports = storedReports ? JSON.parse(storedReports) : {};
    parsedReports[reviewId] = review.reports;
    localStorage.setItem('fcuEatsReports', JSON.stringify(parsedReports));
    
    if (review.reports > 10) {
        alert('此評論因收到超過 10 次檢舉，已被系統自動移除！');
        restaurant.reviews = restaurant.reviews.filter(rev => rev.id !== reviewId);
        restaurant.reviewCount = restaurant.reviews.length;
        updateRestaurantRating(restaurant);
        
        // Save deleted state
        let storedDeleted = localStorage.getItem('fcuEatsDeletedReviews');
        let parsedDeleted = storedDeleted ? JSON.parse(storedDeleted) : [];
        parsedDeleted.push(reviewId);
        localStorage.setItem('fcuEatsDeletedReviews', JSON.stringify(parsedDeleted));
        
        renderDetailContent();
        renderRestaurants();
    } else {
        alert(`已送出檢舉！目前累計檢舉次數：${review.reports}/11`);
        renderDetailContent();
    }
};

function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

function formatDistance(dist) {
    if (dist < 1) return Math.round(dist * 1000) + 'm';
    return dist.toFixed(1) + 'km';
}

fontIncrease.addEventListener('click', () => {
    if (currentFontIndex < FONT_CLASSES.length - 1) {
        currentFontIndex++;
        updateFontSizeUI();
    }
});

// NID User Status
function initUserStatus() {
    if (userAccount) {
        const maskedUser = maskUserId(userAccount);
        userStatus.innerHTML = `
            <div class="user-badge" title="學號: ${userAccount}">
                <i class="ph-fill ph-user-circle-gears"></i>
                <span>${maskedUser}</span>
                <span class="logout-link" onclick="handleLogout()">登出</span>
            </div>
        `;
    } else {
        userStatus.innerHTML = `
            <button id="loginBtn" class="login-btn" onclick="openLoginModal()"><i class="ph ph-sign-in"></i> NID 登入</button>
        `;
    }
}

function maskUserId(userId) {
    if (!userId || userId.length < 5) return '逢甲人';
    return userId.substring(0, 3) + '***' + userId.substring(userId.length - 2);
}

window.openLoginModal = function() {
    loginModal.classList.remove('hidden');
    anonymousDefault.checked = isAnonymousDefault;
};

window.closeLoginModal = function() {
    loginModal.classList.add('hidden');
    loginForm.reset();
};

window.handleLogout = function() {
    if (confirm('確定要登出嗎？')) {
        userAccount = null;
        localStorage.removeItem('fcuEatsUser');
        initUserStatus();
        if (currentRestaurant) {
            renderDetailContent();
        }
    }
};

loginModalBackdrop.addEventListener('click', closeLoginModal);
closeLoginBtn.addEventListener('click', closeLoginModal);

loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = nidUsername.value.trim().toUpperCase();
    const password = nidPassword.value;
    
    const nidPattern = /^[dD][0-9]{7}$/;
    if (!nidPattern.test(username)) {
        alert('請輸入正確的逢甲學號格式 (例如 D1234567)');
        return;
    }
    
    if (password.length < 4) {
        alert('密碼長度不足！');
        return;
    }
    
    userAccount = username;
    isAnonymousDefault = anonymousDefault.checked;
    localStorage.setItem('fcuEatsUser', username);
    localStorage.setItem('fcuEatsAnonymous', isAnonymousDefault);
    
    initUserStatus();
    closeLoginModal();
    
    if (currentRestaurant) {
        renderDetailContent();
    }
    
    alert(`NID 登入成功！歡迎，逢甲同學 (${maskUserId(username)})`);
});

// Mobile Bottom Sheet & Bottom Nav Logic
window.openBottomSheet = function() {
    bottomSheet.classList.remove('hidden');
    updateFilterPillsUI();
};

window.closeBottomSheet = function() {
    bottomSheet.classList.add('hidden');
};

bottomSheetBackdrop.addEventListener('click', closeBottomSheet);
closeBottomSheet.addEventListener('click', closeBottomSheet);
floatingFilterBtn.addEventListener('click', openBottomSheet);

function setupMobileNav() {
    navHome.addEventListener('click', () => {
        setActiveNav(navHome);
        showHomeView();
    });
    
    navFilterBtn.addEventListener('click', () => {
        setActiveNav(navFilterBtn);
        openBottomSheet();
    });
    
    navMyReviews.addEventListener('click', () => {
        setActiveNav(navMyReviews);
        if (userAccount) {
            alert(`目前登入帳號為：${userAccount}\n\n您可以使用此帳號發表真實美食評價。`);
        } else {
            openLoginModal();
        }
    });
    
    setupBottomSheetPills();
}

function setActiveNav(activeBtn) {
    document.querySelectorAll('.bottom-nav-item').forEach(item => {
        item.classList.remove('active');
    });
    activeBtn.classList.add('active');
}

function setupBottomSheetPills() {
    const pricePills = sheetPriceOptions.querySelectorAll('.filter-pill');
    pricePills.forEach(pill => {
        pill.addEventListener('click', () => {
            pricePills.forEach(p => p.classList.remove('active'));
            pill.classList.add('active');
            currentPriceFilter = pill.dataset.price;
        });
    });
    
    const sortPills = sheetSortOptions.querySelectorAll('.filter-pill');
    sortPills.forEach(pill => {
        pill.addEventListener('click', () => {
            sortPills.forEach(p => p.classList.remove('active'));
            pill.classList.add('active');
            currentSortFilter = pill.dataset.sort;
        });
    });
}

function updateFilterPillsUI() {
    const pricePills = sheetPriceOptions.querySelectorAll('.filter-pill');
    pricePills.forEach(p => {
        if (p.dataset.price === currentPriceFilter) {
            p.classList.add('active');
        } else {
            p.classList.remove('active');
        }
    });
    
    const sortPills = sheetSortOptions.querySelectorAll('.filter-pill');
    sortPills.forEach(p => {
        if (p.dataset.sort === currentSortFilter) {
            p.classList.add('active');
        } else {
            p.classList.remove('active');
        }
    });
}

applyFiltersBtn.addEventListener('click', () => {
    closeBottomSheet();
    loadRestaurantsWithSkeleton();
});

// Boot
init();

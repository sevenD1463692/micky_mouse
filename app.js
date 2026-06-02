// State
let currentCategory = 'all';
let currentRestaurant = null;
let searchQuery = '';
let currentSort = 'default';
let activeFilterTags = [];

// DOM Elements
const homeView = document.getElementById('homeView');
const detailView = document.getElementById('detailView');
const categoryList = document.getElementById('categoryList');
const restaurantGrid = document.getElementById('restaurantGrid');
const detailContent = document.getElementById('detailContent');
const searchInput = document.getElementById('searchInput');
const backBtn = document.getElementById('backBtn');
const themeToggle = document.getElementById('themeToggle');

// Initialize
function init() {
    loadReviewsFromStorage();
    renderCategories();
    renderRestaurants();
    setupEventListeners();
    initTheme();
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

function saveReportsToStorage(restaurantId, reviewId, reports) {
    const storedReports = localStorage.getItem('fcuEatsReports');
    const parsedReports = storedReports ? JSON.parse(storedReports) : {};
    parsedReports[reviewId] = reports;
    localStorage.setItem('fcuEatsReports', JSON.stringify(parsedReports));
    
    // Update inside stored user reviews if present
    const storedReviews = localStorage.getItem('fcuEatsReviews');
    if (storedReviews) {
        const parsedReviews = JSON.parse(storedReviews);
        if (parsedReviews[restaurantId]) {
            const rev = parsedReviews[restaurantId].find(r => r.id === reviewId);
            if (rev) {
                rev.reports = reports;
                localStorage.setItem('fcuEatsReviews', JSON.stringify(parsedReviews));
            }
        }
    }
}

function deleteReviewFromStorage(restaurantId, reviewId) {
    // 1. Add to deleted reviews list
    const storedDeleted = localStorage.getItem('fcuEatsDeletedReviews');
    const parsedDeleted = storedDeleted ? JSON.parse(storedDeleted) : [];
    if (!parsedDeleted.includes(reviewId)) {
        parsedDeleted.push(reviewId);
        localStorage.setItem('fcuEatsDeletedReviews', JSON.stringify(parsedDeleted));
    }
    
    // 2. Remove from user reviews storage if it was a user review
    const storedReviews = localStorage.getItem('fcuEatsReviews');
    if (storedReviews) {
        const parsedReviews = JSON.parse(storedReviews);
        if (parsedReviews[restaurantId]) {
            parsedReviews[restaurantId] = parsedReviews[restaurantId].filter(r => r.id !== reviewId);
            localStorage.setItem('fcuEatsReviews', JSON.stringify(parsedReviews));
        }
    }
}

function getUserDailyReportCount() {
    const today = new Date().toISOString().split('T')[0];
    const stored = localStorage.getItem('fcuEatsUserDailyReports');
    if (!stored) return { date: today, count: 0 };
    
    try {
        const parsed = JSON.parse(stored);
        if (parsed.date !== today) {
            return { date: today, count: 0 };
        }
        return parsed;
    } catch (e) {
        return { date: today, count: 0 };
    }
}

function incrementUserDailyReportCount() {
    const today = new Date().toISOString().split('T')[0];
    const dailyInfo = getUserDailyReportCount();
    dailyInfo.count += 1;
    dailyInfo.date = today;
    localStorage.setItem('fcuEatsUserDailyReports', JSON.stringify(dailyInfo));
}

// Theme Management
function initTheme() {
    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (isDark) {
        document.body.setAttribute('data-theme', 'dark');
        themeToggle.innerHTML = '<i class="ph ph-sun"></i>';
    }
}

themeToggle.addEventListener('click', () => {
    const isDark = document.body.getAttribute('data-theme') === 'dark';
    if (isDark) {
        document.body.removeAttribute('data-theme');
        themeToggle.innerHTML = '<i class="ph ph-moon"></i>';
    } else {
        document.body.setAttribute('data-theme', 'dark');
        themeToggle.innerHTML = '<i class="ph ph-sun"></i>';
    }
});

// Event Listeners
function setupEventListeners() {
    searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value.toLowerCase();
        renderRestaurants();
    });

    backBtn.addEventListener('click', () => {
        showHomeView();
    });

    // Sort listener
    const sortSelect = document.getElementById('sortSelect');
    if (sortSelect) {
        sortSelect.addEventListener('change', (e) => {
            currentSort = e.target.value;
            renderRestaurants();
        });
    }

    // Filter chips listener
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
            renderRestaurants();
        });
    });
}

function renderRestaurants() {
    let filtered = mockData.restaurants;

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

    // Sort
    if (currentSort !== 'default') {
        filtered = [...filtered]; // clone to avoid sorting in-place on core mockData
        if (currentSort === 'rating-desc') {
            filtered.sort((a, b) => b.rating - a.rating);
        } else if (currentSort === 'reviews-desc') {
            filtered.sort((a, b) => b.reviewCount - a.reviewCount);
        } else if (currentSort === 'price-asc') {
            filtered.sort((a, b) => a.price.length - b.price.length);
        } else if (currentSort === 'price-desc') {
            filtered.sort((a, b) => b.price.length - a.price.length);
        }
    }

    if (filtered.length === 0) {
        restaurantGrid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 3rem 1.5rem; color: var(--text-muted); background: var(--surface-color); border-radius: var(--radius-lg); border: 1px solid var(--border-color); animation: fadeIn 0.4s ease-out forwards;">
                <i class="ph ph-mask-sad" style="font-size: 3.5rem; color: var(--primary); margin-bottom: 1rem;"></i>
                <p style="font-size: 1.1rem; font-weight: 500; color: var(--text-main); margin-bottom: 0.5rem;">找不到符合的美食</p>
                <p style="font-size: 0.9rem; margin-bottom: 1.5rem;">試著換個關鍵字或調整篩選條件吧！</p>
                <button onclick="clearAllFilters()" class="clear-filters-btn">
                    <i class="ph ph-arrow-counter-clockwise"></i> 清除所有篩選
                </button>
            </div>
        `;
        return;
    }

    restaurantGrid.innerHTML = filtered.map(r => `
        <div class="restaurant-card" onclick="showDetailView(${r.id})">
            <img src="${r.image}" alt="${r.name}" class="card-image">
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
                    <span>${r.price}</span> • <span>${getCategoryName(r.category)}</span>
                </div>
                <div class="card-tags">
                    ${r.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>
            </div>
        </div>
    `).join('');
}

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

// Views Navigation
function showHomeView() {
    detailView.classList.add('hidden');
    homeView.classList.remove('hidden');
    currentRestaurant = null;
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
    
    detailContent.innerHTML = `
        <div class="detail-header">
            <img src="${r.image}" alt="${r.name}">
            <div class="detail-overlay">
                <h2 class="detail-title">${r.name}</h2>
                <div class="detail-meta">
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
                                <strong>地址</strong>
                                <p>${r.address}</p>
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
                            <textarea id="reviewComment" placeholder="分享您的用餐體驗...（必填）" required></textarea>
                        </div>
                        <button type="submit" class="submit-btn">
                            <i class="ph ph-paper-plane-right"></i> 送出評價
                        </button>
                    </form>
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
        const type = selector.dataset.type;
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
}

window.submitReview = function(e) {
    e.preventDefault();
    
    const comment = document.getElementById('reviewComment').value;
    
    // Validate
    if (Object.values(currentFormRatings).some(val => val === 0)) {
        alert('請完成所有星級評分！');
        return;
    }

    const newReview = {
        id: Date.now(),
        user: '逢甲在地人(測試)',
        date: new Date().toISOString().split('T')[0],
        ratings: { ...currentFormRatings },
        overallRating: currentFormRatings.overall,
        comment: comment,
        reports: 0
    };

    // Add to mock data
    currentRestaurant.reviews.unshift(newReview);
    currentRestaurant.reviewCount = currentRestaurant.reviews.length;
    updateRestaurantRating(currentRestaurant);
    
    // Save to localStorage
    saveReviewToStorage(currentRestaurant.id, newReview);
    
    // Re-render
    renderDetailContent();
    renderRestaurants(); // update count and rating on home screen
    
    // Reset form
    document.getElementById('reviewForm').reset();
    setupReviewForm(); // Reset stars UI
};

window.reportReview = function(restaurantId, reviewId) {
    const restaurant = mockData.restaurants.find(r => r.id === restaurantId);
    if (!restaurant) return;
    
    const review = restaurant.reviews.find(rev => rev.id === reviewId);
    if (!review) return;

    // ── 每日檢舉上限：單日最多 5 次 ──
    const dailyInfo = getUserDailyReportCount();
    if (dailyInfo.count >= 5) {
        alert('您今日的檢舉次數已達上限（每人每日最多 5 次），請明日再試！');
        return;
    }
    
    if (confirm('您確定要檢舉這則評論嗎？')) {
        // 扣除使用者今日剩餘檢舉配額
        incrementUserDailyReportCount();
        const remaining = 4 - dailyInfo.count; // dailyInfo.count is before increment

        review.reports = (review.reports || 0) + 1;
        
        // Save to storage
        saveReportsToStorage(restaurantId, reviewId, review.reports);
        
        if (review.reports > 10) {
            alert('此評論因收到超過 10 次檢舉，已被系統自動移除！');
            // Remove review from memory
            restaurant.reviews = restaurant.reviews.filter(rev => rev.id !== reviewId);
            restaurant.reviewCount = restaurant.reviews.length;
            updateRestaurantRating(restaurant);
            
            // Delete review from storage completely
            deleteReviewFromStorage(restaurantId, reviewId);
            
            // Re-render
            renderDetailContent();
            renderRestaurants(); // update count and rating on home screen
        } else {
            alert(`已送出檢舉！目前累計檢舉次數：${review.reports}/11\n您今日剩餘可檢舉次數：${remaining} 次`);
            renderDetailContent();
        }
    }
};

// Boot
init();

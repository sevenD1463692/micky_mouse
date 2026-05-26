// State
let currentCategory = 'all';
let currentRestaurant = null;
let searchQuery = '';
let sortBy = 'recommended';

const MOCK_LOCATIONS = {
    'fcu-gate': { lat: 24.178657, lng: 120.646548, name: '逢甲大學正門 (模擬)' },
    'fcu-ie': { lat: 24.179515, lng: 120.648210, name: '逢甲大學資電館 (模擬)' },
    'night-market': { lat: 24.179836, lng: 120.645511, name: '逢甲夜市入口 (模擬)' },
    'mcdonalds': { lat: 24.176465, lng: 120.645398, name: '逢甲麥當勞 (模擬)' }
};

let userLocation = {
    ...MOCK_LOCATIONS['fcu-gate'],
    isGPS: false
};

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
function loadReviewsFromStorage() {
    const storedReviews = localStorage.getItem('fcuEatsReviews');
    if (storedReviews) {
        const parsed = JSON.parse(storedReviews);
        mockData.restaurants.forEach(r => {
            if (parsed[r.id]) {
                // Prepend stored reviews
                r.reviews = [...parsed[r.id], ...r.reviews];
                r.reviewCount = r.reviews.length;
            }
        });
    }
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

// Distance and Location Utilities
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371e3; // meters
    const phi1 = lat1 * Math.PI / 180;
    const phi2 = lat2 * Math.PI / 180;
    const deltaPhi = (lat2 - lat1) * Math.PI / 180;
    const deltaLambda = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
              Math.cos(phi1) * Math.cos(phi2) *
              Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // in meters
}

function formatDistance(meters) {
    if (isNaN(meters) || meters === Infinity) return '計算中';
    if (meters < 1000) {
        return `${Math.round(meters)}m`;
    } else {
        return `${(meters / 1000).toFixed(1)}km`;
    }
}

function requestGPSLocation() {
    const btn = document.getElementById('getLocationBtn');
    const locationNameEl = document.getElementById('currentLocationName');
    
    if (!navigator.geolocation) {
        alert('您的瀏覽器不支援 GPS 定位！');
        return;
    }
    
    btn.disabled = true;
    const originalText = btn.innerHTML;
    btn.innerHTML = '<i class="ph ph-circle-notch animate-spin" style="animation: spin 1s linear infinite;"></i> 定位中...';
    
    navigator.geolocation.getCurrentPosition(
        (position) => {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            
            userLocation = {
                lat: lat,
                lng: lng,
                name: `GPS 定位 (${lat.toFixed(4)}, ${lng.toFixed(4)})`,
                isGPS: true
            };
            
            locationNameEl.textContent = userLocation.name;
            
            // Add and select GPS option in select list
            const selectEl = document.getElementById('mockLocationSelect');
            let gpsOpt = document.getElementById('gpsSelectOption');
            if (!gpsOpt) {
                gpsOpt = document.createElement('option');
                gpsOpt.id = 'gpsSelectOption';
                gpsOpt.value = 'gps';
                gpsOpt.textContent = '📍 真實 GPS 定位';
                selectEl.appendChild(gpsOpt);
            }
            selectEl.value = 'gps';
            
            renderRestaurants();
            if (currentRestaurant) {
                // If detail is active, update distance
                const distText = document.getElementById('detailDistanceText');
                if (distText) {
                    const dist = calculateDistance(userLocation.lat, userLocation.lng, currentRestaurant.coordinates.lat, currentRestaurant.coordinates.lng);
                    distText.textContent = `(距離目前位置 ${formatDistance(dist)})`;
                }
            }
            
            btn.disabled = false;
            btn.innerHTML = originalText;
        },
        (error) => {
            console.error(error);
            let errorMsg = '定位失敗，請確認是否已授權定位權限！';
            if (error.code === error.PERMISSION_DENIED) {
                errorMsg = '您拒絕了定位授權，將繼續使用模擬位置。';
            }
            alert(errorMsg);
            
            btn.disabled = false;
            btn.innerHTML = originalText;
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
    );
}

// Event Listeners
function setupEventListeners() {
    searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value.toLowerCase();
        renderRestaurants();
    });

    backBtn.addEventListener('click', () => {
        showHomeView();
    });

    // Location select change listener
    const mockSelect = document.getElementById('mockLocationSelect');
    if (mockSelect) {
        mockSelect.addEventListener('change', (e) => {
            const val = e.target.value;
            if (MOCK_LOCATIONS[val]) {
                userLocation = {
                    ...MOCK_LOCATIONS[val],
                    isGPS: false
                };
                document.getElementById('currentLocationName').textContent = userLocation.name;
                
                const gpsOpt = document.getElementById('gpsSelectOption');
                if (gpsOpt) {
                    gpsOpt.remove();
                }
                
                renderRestaurants();
                if (currentRestaurant) {
                    const distText = document.getElementById('detailDistanceText');
                    if (distText) {
                        const dist = calculateDistance(userLocation.lat, userLocation.lng, currentRestaurant.coordinates.lat, currentRestaurant.coordinates.lng);
                        distText.textContent = `(距離目前位置 ${formatDistance(dist)})`;
                    }
                }
            }
        });
    }

    // GPS button click listener
    const gpsBtn = document.getElementById('getLocationBtn');
    if (gpsBtn) {
        gpsBtn.addEventListener('click', requestGPSLocation);
    }

    // Sort tabs click listener
    const sortTabs = document.querySelectorAll('.sort-tab');
    sortTabs.forEach(tab => {
        tab.addEventListener('click', (e) => {
            sortTabs.forEach(t => t.classList.remove('active'));
            const currentTab = e.currentTarget;
            currentTab.classList.add('active');
            sortBy = currentTab.dataset.sort;
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
    // Make a shallow copy of the restaurants array to avoid modifying mockData source sorting directly
    let filtered = [...mockData.restaurants];

    // Filter by category
    if (currentCategory !== 'all') {
        filtered = filtered.filter(r => r.category === currentCategory);
    }

    // Filter by search
    if (searchQuery) {
        filtered = filtered.filter(r => r.name.toLowerCase().includes(searchQuery) || r.tags.some(tag => tag.toLowerCase().includes(searchQuery)));
    }

    // Calculate distance to each restaurant
    filtered.forEach(r => {
        if (r.coordinates) {
            r.distance = calculateDistance(userLocation.lat, userLocation.lng, r.coordinates.lat, r.coordinates.lng);
        } else {
            r.distance = Infinity;
        }
    });

    // Sort by selected criteria
    if (sortBy === 'distance') {
        filtered.sort((a, b) => a.distance - b.distance);
    } else {
        // Sort by rating (descending) as recommendation default
        filtered.sort((a, b) => b.rating - a.rating);
    }

    if (filtered.length === 0) {
        restaurantGrid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 3rem; color: var(--text-muted);">
                <i class="ph ph-mask-sad" style="font-size: 3rem; margin-bottom: 1rem;"></i>
                <p>找不到符合的美食，換個關鍵字試試看吧！</p>
            </div>
        `;
        return;
    }

    restaurantGrid.innerHTML = filtered.map(r => `
        <div class="restaurant-card" onclick="showDetailView(${r.id})">
            <div class="card-image-wrapper">
                <img src="${r.image}" alt="${r.name}" class="card-image">
                <div class="distance-badge">
                    <i class="ph ph-map-pin"></i>
                    <span>${formatDistance(r.distance)}</span>
                </div>
            </div>
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
                                <strong>地址與距離</strong>
                                <p>${r.address} <span id="detailDistanceText" style="color: var(--primary); font-weight: 600; margin-left: 0.5rem;">(距離目前位置 ${formatDistance(calculateDistance(userLocation.lat, userLocation.lng, r.coordinates.lat, r.coordinates.lng))})</span></p>
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
                        <div class="reviewer-name">${rev.user}</div>
                        <div class="review-date">${rev.date}</div>
                    </div>
                </div>
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
    price: 0,
    portion: 0,
    waitTime: 0,
    sitability: 0
};

function setupReviewForm() {
    currentFormRatings = { price: 0, portion: 0, waitTime: 0, sitability: 0 };
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
        comment: comment
    };

    // Add to mock data
    currentRestaurant.reviews.unshift(newReview);
    currentRestaurant.reviewCount += 1;
    
    // Save to localStorage
    saveReviewToStorage(currentRestaurant.id, newReview);
    
    // Re-render
    renderDetailContent();
    renderRestaurants(); // update count on home screen
    
    // Reset form
    document.getElementById('reviewForm').reset();
    setupReviewForm(); // Reset stars UI
};

// Boot
init();

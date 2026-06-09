// State
let currentCategory = 'all';
let currentRestaurant = null;
let searchQuery = '';
let showOpenOnly = false;

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
    loadFavoritesFromStorage();
    renderCategories();
    renderRestaurants();
    setupEventListeners();
    initTheme();
    
    // Initial sync and start background timer for live status updates
    updateLiveStatuses();
    setInterval(updateLiveStatuses, 30000);
}

// Storage Management
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
        
        // 4. Update count
        r.reviewCount = r.reviews.length;
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

function loadFavoritesFromStorage() {
    const stored = localStorage.getItem('fcuEatsFavorites');
    favorites = stored ? JSON.parse(stored) : [];
    updateFavoritesBadge();
}

function saveFavoritesToStorage() {
    localStorage.setItem('fcuEatsFavorites', JSON.stringify(favorites));
    updateFavoritesBadge();
}

function updateFavoritesBadge() {
    const badge = document.getElementById('favoritesBadge');
    if (badge) {
        badge.textContent = favorites.length;
        if (favorites.length > 0) {
            badge.classList.remove('hidden');
        } else {
            badge.classList.add('hidden');
        }
    }
}

function showToast(message, actionText, actionCallback) {
    let toast = document.getElementById('appToast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'appToast';
        toast.className = 'toast-container';
        document.body.appendChild(toast);
    }
    
    toast.innerHTML = `
        <i class="ph-fill ph-heart toast-icon"></i>
        <span style="flex-grow: 1;">${message}</span>
        ${actionText ? `<button class="toast-action" id="toastActionBtn">${actionText}</button>` : ''}
    `;
    
    toast.classList.remove('show');
    
    if (actionText && actionCallback) {
        setTimeout(() => {
            const btn = document.getElementById('toastActionBtn');
            if (btn) {
                btn.onclick = (e) => {
                    e.stopPropagation();
                    actionCallback();
                    toast.classList.remove('show');
                };
            }
        }, 0);
    }
    
    toast.offsetHeight; // force reflow
    toast.classList.add('show');
    
    if (window.toastTimeout) {
        clearTimeout(window.toastTimeout);
    }
    window.toastTimeout = setTimeout(() => {
        toast.classList.remove('show');
    }, 3500);
}

window.disableFavoritesFilter = function() {
    if (showFavoritesOnly) {
        const favToggle = document.getElementById('favoritesToggle');
        if (favToggle) {
            favToggle.click();
        }
    }
    const section = document.querySelector('.restaurant-list-section');
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
};

window.toggleFavorite = function(id, event) {
    if (event) {
        event.stopPropagation();
    }
    
    const restaurant = mockData.restaurants.find(r => r.id === id);
    const rName = restaurant ? restaurant.name : '';
    
    const index = favorites.indexOf(id);
    let added = false;
    if (index > -1) {
        favorites.splice(index, 1);
    } else {
        favorites.push(id);
        added = true;
    }
    saveFavoritesToStorage();
    
    // Re-render restaurant grid to update card hearts
    renderRestaurants();
    
    // Update detail view heart if open
    if (currentRestaurant && currentRestaurant.id === id) {
        const favBtn = document.getElementById('detailFavoriteBtn');
        if (favBtn) {
            const isFav = favorites.includes(id);
            if (isFav) {
                favBtn.classList.add('active');
                favBtn.querySelector('i').className = 'ph-fill ph-heart';
            } else {
                favBtn.classList.remove('active');
                favBtn.querySelector('i').className = 'ph ph-heart';
            }
        }
    }
    
    // Show premium toast
    if (added) {
        showToast(
            `已將「${rName}」加入我的收藏！`, 
            showFavoritesOnly ? null : '查看收藏', 
            () => {
                const favToggle = document.getElementById('favoritesToggle');
                if (favToggle && !showFavoritesOnly) {
                    favToggle.click();
                }
            }
        );
    } else {
        showToast(`已將「${rName}」移出收藏。`);
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

    const favToggle = document.getElementById('favoritesToggle');
    if (favToggle) {
        favToggle.addEventListener('click', () => {
            showFavoritesOnly = !showFavoritesOnly;
            if (showFavoritesOnly) {
                favToggle.classList.add('active');
                favToggle.querySelector('i').className = 'ph-fill ph-heart';
            } else {
                favToggle.classList.remove('active');
                favToggle.querySelector('i').className = 'ph ph-heart';
            }
            renderRestaurants();
        });
    }

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

    // Filter by favorites if enabled
    if (showFavoritesOnly) {
        filtered = filtered.filter(r => favorites.includes(r.id));
    }

    // Filter by category
    if (currentCategory !== 'all') {
        filtered = filtered.filter(r => r.category === currentCategory);
    }

    // Filter by search
    if (searchQuery) {
        filtered = filtered.filter(r => r.name.toLowerCase().includes(searchQuery) || r.tags.some(tag => tag.toLowerCase().includes(searchQuery)));
    }

    // Filter by open only
    if (showOpenOnly) {
        filtered = filtered.filter(r => isRestaurantOpen(r.hours));
    }

    if (filtered.length === 0) {
        if (showFavoritesOnly) {
            restaurantGrid.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">
                        <i class="ph ph-heart"></i>
                    </div>
                    <h3>尚未收藏任何餐廳</h3>
                    <p style="margin-bottom: 1.5rem;">點擊美食卡片上的愛心，或是進入詳情頁將喜愛的店家加入您的口袋名單吧！</p>
                    <button class="submit-btn" style="padding: 0.6rem 1.5rem; font-size: 0.9rem;" onclick="disableFavoritesFilter()">
                        <i class="ph ph-sparkles"></i> 探索熱門美食
                    </button>
                </div>
            `;
        } else {
            restaurantGrid.innerHTML = `
                <div style="grid-column: 1/-1; text-align: center; padding: 3rem; color: var(--text-muted);">
                    <i class="ph ph-mask-sad" style="font-size: 3rem; margin-bottom: 1rem;"></i>
                    <p>找不到符合的美食，換個關鍵字試試看吧！</p>
                </div>
            `;
        }
        return;
    }

    restaurantGrid.innerHTML = filtered.map(r => {
        const isOpen = isRestaurantOpen(r.hours);
        return `
            <div class="restaurant-card" onclick="showDetailView(${r.id})">
                <div class="status-badge ${isOpen ? 'open' : 'closed'}" data-restaurant-id="${r.id}">
                    <span class="status-dot"></span>
                    <span class="status-text">${isOpen ? '營業中' : '已打烊'}</span>
                </div>
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
        `;
    }).join('');
}

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
    
    detailContent.innerHTML = `
        <div class="detail-header">
            <img src="${r.image}" alt="${r.name}">
            <div class="detail-overlay">
                <div class="detail-title-row">
                    <h2 class="detail-title">${r.name}</h2>
                    <button id="detailFavoriteBtn" class="detail-favorite-btn ${isFav ? 'active' : ''}" onclick="toggleFavorite(${r.id}, event)" title="${isFav ? '取消收藏' : '加入收藏'}" aria-label="${isFav ? '取消收藏' : '加入收藏'}">
                        <i class="${favIconClass}"></i>
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
        comment: comment,
        reports: 0
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
            
            // Delete review from storage completely
            deleteReviewFromStorage(restaurantId, reviewId);
            
            // Re-render
            renderDetailContent();
            renderRestaurants(); // update count on home screen
        } else {
            alert(`已送出檢舉！目前累計檢舉次數：${review.reports}/11\n您今日剩餘可檢舉次數：${remaining} 次`);
            renderDetailContent();
        }
    }
};

// Boot
init();

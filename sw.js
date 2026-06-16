const CACHE_NAME = 'fcu-eats-v1';
const ASSETS = [
    './',
    './index.html',
    './style.css',
    './app.js',
    './mockData.js',
    'https://unpkg.com/@phosphor-icons/web'
];

// Install Event
self.addEventListener('install', (e) => {
    e.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ASSETS);
        }).then(() => self.skipWaiting())
    );
});

// Activate Event
self.addEventListener('activate', (e) => {
    e.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys.map((key) => {
                    if (key !== CACHE_NAME) {
                        return caches.delete(key);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

// Fetch Event
self.addEventListener('fetch', (e) => {
    const url = e.request.url;
    
    // For external assets like Unsplash images and Phosphor icons, use Cache First
    if (url.includes('images.unsplash.com') || url.includes('unpkg.com')) {
        e.respondWith(
            caches.match(e.request).then((cachedResponse) => {
                if (cachedResponse) {
                    return cachedResponse;
                }
                return fetch(e.request).then((networkResponse) => {
                    return caches.open(CACHE_NAME).then((cache) => {
                        cache.put(e.request, networkResponse.clone());
                        return networkResponse;
                    });
                });
            }).catch(() => {
                return caches.match(e.request);
            })
        );
    } else {
        // Network First, fallback to cache for local app assets (to ensure updates load when online)
        e.respondWith(
            fetch(e.request).then((networkResponse) => {
                if (e.request.method === 'GET' && networkResponse.status === 200) {
                    const responseClone = networkResponse.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(e.request, responseClone);
                    });
                }
                return networkResponse;
            }).catch(() => {
                return caches.match(e.request);
            })
        );
    }
});

// public/sw.js
const CACHE_NAME = 'movies-app-v1';
const urlsToCache = ['/', '/offline'];

self.addEventListener('install', (event) => {
event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache)),
);
});

self.addEventListener('activate', (event) => {
event.waitUntil(
    caches.keys().then((keys) =>
    Promise.all(
        keys
        .filter((key) => key !== CACHE_NAME)
        .map((key) => caches.delete(key)),
    ),
    ),
);
});

self.addEventListener('fetch', (event) => {
event.respondWith(
    caches.match(event.request).then((response) => {
    if (response) return response;

    return fetch(event.request).catch(() => {
        if (event.request.destination === 'document') {
        return caches.match('/offline');
        }
    });
    }),
);
});
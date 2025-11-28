const CACHE_NAME = 'soft99-v1';

self.addEventListener('install', (event) => {
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(clients.claim());
});

self.addEventListener('fetch', (event) => {
    // Basic pass-through for now to avoid issues with Next.js dynamic content
    // In a real PWA we would implement proper caching strategies
    return;
});

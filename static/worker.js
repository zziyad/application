const files = [
  '/',
  '/assets/index-24bedef0.js',
  '/assets/index-cfe5d99d.css',
  '/favicon.ico',
  '/image001.jpg',
  '/robots.txt',
];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open('upsell').then((cache) => cache.addAll(files)));
});

self.addEventListener('fetch', async ({ request }) => {
  const cache = await caches.open('upsell');
  const cached = await cache.match(request);
  if (cached) return cached;
  const response = await fetch(request);
  if (response.status < 400) cache.put(request, response.clone());
  return response;
});

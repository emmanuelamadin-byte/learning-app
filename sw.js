const CACHE_NAME = "learn-tracker-v1";
const OFFLINE_URL = "/offline.html"; // FIXED: Removed /public

const CORE_ASSETS = [
  "/",
  "/index.html",
  "/app-config.js",
  "/src/main.js",
  "/src/app.js",
  "/src/lib/config.js",
  "/src/lib/html.js",
  "/src/lib/utils.js",
  "/src/lib/metrics.js",
  "/src/lib/mock-data.js",
  "/src/lib/data-client.js",
  "/src/components.js",
  "/src/views/dashboard-view.js",
  "/src/views/community-view.js",
  "/src/views/leaderboard-view.js",
  "/src/views/profile-view.js",
  "/src/views/admin-view.js",
  "/src/styles/app.css",
  "/manifest.webmanifest", // FIXED: Removed /public
  "/offline.html",           // FIXED: Removed /public
  "/icons/icon-192.png",     // FIXED: Removed /public
  "/icons/icon-512.png",     // FIXED: Removed /public
  "https://esm.sh/react@18.3.1",
  "https://esm.sh/react-dom@18.3.1/client",
  "https://esm.sh/htm@3.1.1",
  "https://esm.sh/@supabase/supabase-js@2.49.8",
  "https://cdn.tailwindcss.com?plugins=forms,typography"
];

// ... (The rest of your event listeners below remain the same)
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) =>
      Promise.allSettled(CORE_ASSETS.map((asset) => cache.add(asset))),
    ),
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key)),
      ),
    ),
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          return response;
        })
        .catch(async () => {
          const cached = await caches.match(request);
          return cached || caches.match(OFFLINE_URL);
        }),
    );
    return;
  }

  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;
      return fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          return response;
        })
        .catch(() => caches.match(OFFLINE_URL));
    }),
  );
});

// Code from pwabuilder.com and Microsoft Copilot
// This is your "Offline copy of pages" service worker

const CACHE = "pwabuilder-offline";

// Import the Workbox library
importScripts('https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js');

// Listen for messages from the app
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    // Skip waiting and activate the new service worker
    self.skipWaiting();
  }
});

// Register a periodic sync for new content every 2 days
navigator.serviceWorker.ready.then(async (registration) => {
  try {
    await registration.periodicSync.register('content-sync', {
      minInterval: 2 * 24 * 60 * 60 * 1000, // 2 days in milliseconds
    });
    console.log("Periodic background sync registered.");
  } catch (err) {
    console.error(err.name, err.message);
  }
});

// Respond to periodic background sync events
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'content-sync') {
    event.waitUntil(syncContent()); // Implement your content synchronization logic here
  }
});

// Register a route for all URLs (you can customize this further)
workbox.routing.registerRoute(
  new RegExp('.*'), // Match any URL
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: CACHE
  })
);

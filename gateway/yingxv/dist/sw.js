self.addEventListener('install', function (e) {
  console.log('install');
  e.waitUntil(self.skipWaiting()); // Activate worker immediately
});

self.addEventListener('fetch', function (e) {
  console.log('[Service Worker] Fetched resource ');
});

self.addEventListener('activate', function (event) {
  console.log('active');
  event.waitUntil(self.clients.claim()); // Become available to all pages
});

self.onnotificationclick = function (event) {
  event.notification.close();

  // This looks to see if the current is already open and
  // focuses if it is
  event.waitUntil(
    clients
      .matchAll({
        type: 'window',
      })
      .then(function (clientList) {
        clientList?.[0]?.focus?.();
      }),
  );
};

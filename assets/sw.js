/* Ticket a ticket — service worker
   Permite que Chrome para Android ofrezca «Instalar app» de verdad
   (display standalone) y que la app abra aunque falle la conexión.
   Solo cachea los ficheros propios de la app: nunca intercepta las
   llamadas a Google (Drive, Gemini), que siempre van directas a la red. */
var CACHE = "ticket-a-ticket-pwa-v60";
var CORE = [
  "./index.html",
  "./assets/manifest.webmanifest",
  "./assets/logo.png",
  "./assets/pwa-icon-192.png",
  "./assets/pwa-icon-512.png",
  "./assets/pwa-icon-512-maskable.png"
];

self.addEventListener("install", function (event) {
  event.waitUntil(
    caches.open(CACHE).then(function (cache) {
      /* Cada fichero por separado: si uno falla, la instalación del
         service worker no se rompe. */
      return Promise.all(CORE.map(function (url) {
        return cache.add(url).catch(function () { return null; });
      }));
    }).then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener("activate", function (event) {
  event.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.map(function (k) {
        return k === CACHE ? null : caches.delete(k);
      }));
    }).then(function () { return self.clients.claim(); })
  );
});

self.addEventListener("fetch", function (event) {
  var req = event.request;
  if (req.method !== "GET") return;
  var url;
  try { url = new URL(req.url); } catch (e) { return; }
  /* Solo origen propio: Google, fuentes y demás van directos a la red. */
  if (url.origin !== self.location.origin) return;

  if (req.mode === "navigate") {
    /* Navegación: red primero (la versión nueva manda), caché si no hay red. */
    event.respondWith(
      fetch(req).then(function (res) {
        var copy = res.clone();
        caches.open(CACHE).then(function (c) { c.put("./index.html", copy); });
        return res;
      }).catch(function () {
        return caches.match("./index.html", { ignoreSearch: true });
      })
    );
    return;
  }

  /* Resto de ficheros propios: caché primero y red detrás para refrescar. */
  event.respondWith(
    caches.match(req).then(function (hit) {
      var network = fetch(req).then(function (res) {
        if (res && res.status === 200) {
          var copy = res.clone();
          caches.open(CACHE).then(function (c) { c.put(req, copy); });
        }
        return res;
      }).catch(function () { return hit; });
      return hit || network;
    })
  );
});

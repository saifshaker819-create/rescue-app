// ══════════════════════════════════════════════════════════════
// RESCUE — firebase-messaging-sw.js
// Service Worker for FCM Push Notifications
// Optimized for Android WebView (Kodular / AppBuilder)
// ══════════════════════════════════════════════════════════════

importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js');

// ── Firebase Config ──────────────────────────────────────────
firebase.initializeApp({
  apiKey:            "AIzaSyCtaxVFLF3bveIgrwfXtsL2-onljl_woQo",
  authDomain:        "rescuse.firebaseapp.com",
  databaseURL:       "https://rescuse-default-rtdb.firebaseio.com",
  projectId:         "rescuse",
  storageBucket:     "rescuse.firebasestorage.app",
  messagingSenderId: "846090206196",
  appId:             "1:846090206196:web:82af027a7aef247ba717a1",
  measurementId:     "G-1D6507TVFK"
});

const messaging = firebase.messaging();

// ── State ────────────────────────────────────────────────────
let _username = null;
let _friends  = {};

// ── Listen for messages from main page ──────────────────────
self.addEventListener('message', e => {
  if (!e.data) return;
  if (e.data.type === 'SET_USER') {
    _username = e.data.username;
    _friends  = e.data.friends || {};
  }
  if (e.data.type === 'UPDATE_FRIENDS') {
    _friends = e.data.friends || {};
  }
});

// ── Notification Icon (inline SVG as data URI) ───────────────
const ICON = 'data:image/svg+xml,' + encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">' +
  '<rect width="100" height="100" rx="18" fill="%23060008"/>' +
  '<circle cx="50" cy="50" r="42" fill="none" stroke="%23ff2244" stroke-width="5"/>' +
  '<text x="50" y="65" text-anchor="middle" font-size="46">🚨</text>' +
  '</svg>'
);

// ── Background message handler ───────────────────────────────
messaging.onBackgroundMessage(payload => {
  const d = payload.data || {};
  const n = payload.notification || {};

  const title = n.title || d.title || (d.type === 'sos' ? '🚨 نداء طوارئ!' : '💬 رسالة جديدة');
  const body  = n.body  || d.body  || d.message || 'اضغط للاستجابة';

  const opts = {
    body,
    icon:              ICON,
    badge:             ICON,
    tag:               d.type + '-' + (d.alertId || Date.now()),
    renotify:          true,
    requireInteraction: d.type === 'sos',   // تبقى الإشعار حتى تضغط عليه
    silent:            false,
    vibrate:           d.type === 'sos'
      ? [500, 200, 500, 200, 500, 200, 500, 200, 1000]
      : [200, 100, 200],
    data: {
      type:     d.type     || 'general',
      alertId:  d.alertId  || '',
      from:     d.from     || '',
      fromName: d.fromName || '',
      lat:      d.lat      || '',
      lng:      d.lng      || '',
      message:  d.message  || body,
      url:      self.registration.scope
    },
    // أزرار الإجراء — تظهر في Android على الإشعار مباشرة
    actions: d.type === 'sos' ? [
      { action: 'respond', title: '✅ استجابة فورية' },
      { action: 'map',     title: '📍 فتح الموقع'    }
    ] : [
      { action: 'open', title: '💬 فتح المحادثة' }
    ]
  };

  return self.registration.showNotification(title, opts);
});

// ── Notification click handler ───────────────────────────────
self.addEventListener('notificationclick', e => {
  e.notification.close();
  const d   = e.notification.data || {};
  const url = d.url || self.registration.scope;

  if (e.action === 'map' && d.lat && d.lng) {
    // فتح خرائط جوجل مباشرة
    e.waitUntil(
      clients.openWindow('https://maps.google.com/?q=' + d.lat + ',' + d.lng)
    );
    return;
  }

  // فتح / تركيز نافذة التطبيق
  e.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
      // أرسل رسالة للنافذة المفتوحة
      for (const c of list) {
        c.postMessage({ type: 'NOTIF_CLICK', data: d });
        return c.focus();
      }
      // لا توجد نافذة مفتوحة — افتح جديدة
      return clients.openWindow(url).then(w => {
        if (w) {
          // انتظر قليلاً ثم أرسل
          setTimeout(() => w.postMessage({ type: 'NOTIF_CLICK', data: d }), 1200);
        }
      });
    })
  );
});

// ── Install & Activate: تفعيل فوري بدون انتظار ───────────────
self.addEventListener('install',  () => self.skipWaiting());
self.addEventListener('activate', e  => e.waitUntil(self.clients.claim()));

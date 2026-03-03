// ══════════════════════════════════════════════════════════════
// RESCUE — Netlify Function: Send FCM Push Notifications
// هذا الملف يرسل إشعارات حقيقية لأجهزة المستخدمين
// حتى عند إغلاق التطبيق بالكامل
// ══════════════════════════════════════════════════════════════

const admin = require('firebase-admin');

// تهيئة Firebase Admin مرة واحدة فقط
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId:   process.env.FIREBASE_PROJECT_ID   || "rescuse",
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey:  (process.env.FIREBASE_PRIVATE_KEY || "").replace(/\\n/g, '\n')
    })
  });
}

exports.handler = async (event) => {
  // CORS
  const headers = {
    'Access-Control-Allow-Origin':  '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'POST only' }) };
  }

  try {
    const { tokens, title, bodyText, data } = JSON.parse(event.body);

    if (!tokens || !tokens.length) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'No tokens', sent: 0, total: 0 }) };
    }

    let sent = 0, failed = 0;

    for (const token of tokens) {
      try {
        await admin.messaging().send({
          token,
          notification: {
            title: title || '🚨 RESCUE',
            body:  bodyText || 'اضغط للفتح'
          },
          data: { ...(data || {}), click_action: 'OPEN_APP', timestamp: String(Date.now()) },

          // Android — أولوية عالية = يوقظ الجهاز
          android: {
            priority: 'high',
            ttl: 86400000,
            notification: {
              channelId: 'rescue_emergency',
              priority:  'max',
              sound:     'default',
              tag:       data?.type === 'sos' ? 'rescue-sos' : 'rescue-msg',
              vibrateTimingsMillis: data?.type === 'sos'
                ? [0, 500, 200, 500, 200, 500, 200, 1000]
                : [0, 200, 100, 200],
              sticky:     data?.type === 'sos',
              visibility: 'public'
            }
          },

          // Web (PWA)
          webpush: {
            headers: { Urgency: 'high', TTL: '86400' },
            notification: {
              requireInteraction: data?.type === 'sos',
              renotify: true,
              tag: data?.type === 'sos' ? 'rescue-sos' : 'rescue-msg',
              actions: data?.type === 'sos'
                ? [{ action: 'respond', title: '✅ استجابة' }, { action: 'map', title: '📍 الموقع' }]
                : [{ action: 'open', title: '💬 فتح' }]
            }
          },

          // iOS
          apns: {
            headers: { 'apns-priority': '10' },
            payload: {
              aps: {
                alert: { title: title || '🚨 RESCUE', body: bodyText || '' },
                sound: 'default',
                badge: 1,
                'content-available': 1,
                'interruption-level': data?.type === 'sos' ? 'critical' : 'active'
              }
            }
          }
        });
        sent++;
      } catch (e) {
        failed++;
      }
    }

    return { statusCode: 200, headers, body: JSON.stringify({ sent, failed, total: tokens.length }) };
  } catch (e) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: e.message }) };
  }
};

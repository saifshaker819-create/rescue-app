const config = {
  "type": "service_account",
  "project_id": "rescuse",
  "private_key_id": "2a5742d37eb9555c4b2f6e7a5d0cccb3c3577475",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQC1AckBht8O7XM6\nDCVzEv06DPgPQeQUjpYdcpk8jHClwu/rUlGRJUl3a0E5h1IgPpoD8vdmckbaURkK\nDPLcN32kX2zu2PpZA3wkBIv4PjrmRH8nsuvmhOlee3w0UZ/F3yH5sYtWPyPcwwmb\nClLHtujjh+zoJSWhPHYlh9PaJRnGgdDde7Uik9DwAMUK2TP8MGiUzD2gSmaovJjA\nJkVJ+LEQtZKU4WoHubvaUg0/WK5QWE00EEb2Pr83fda+Q9OlA4JkYVWy4kLIZ/DU\n0Sf1N/rZet5pSOfnt5g7Sghz6kgYVeuW6Eg+gIrPBwG6w2HYJkJgKa2eaDcShbAb\nTRUeRRJHAgMBAAECggEAFjIwWGgWDUoP4bPgmcJf3BEAEDrnwZ+Uh+roIJUmMSV8\n7zHqf65/Wk4EMw5Fg1+52jceoGjuCFJ+jA13cIq7dP8gqA9ib6zuOap3EYtsBJWs\ntA0MQXnV9jiVTAMgYQ7SJ0De0cYvWyBtmp4C9auX1mLyKat4eFOmN0b3Mx5ukTlg\nIDyCwll+jR5WB8S8a3wRXG9Rec8OhTOS9rOMj2O4msYuvi+2TlV9DDrXYAYKqM2K\nqUfRsNgKnMjUDBglzwQV9kT6Lry/D1XvIvDnG/xa9kcTWEBVnBzVS8WSjY10Fs9A\nUEd/NioA+0vmWp8F+3CA+cZ4TmgEQhpXmCY2TdrMOQKBgQDlr8lJEtzYK53eZPPe\nTz3MqAD6iIRSrb2T8JH5KRmJt5vIJat8JxxVo8Aun2/jq4luPcrgPURIGLdqCYqW\n24AYRgMRBTVF56Mmgvl2TqQEwnFC8DE0lfAOmpUjShmKoOBL6RRmYdrhSYWGueUW\n6W9PRl922O2SgvAilewv6TGHjwKBgQDJvlQl/E6ijIRP0BhDp5zIF2TWFQiAHmph\nMk/6CngKVB9NExah2tLnJ2UD0buRa/0oK2/ph08/dbFDN7xQhBLTLg7/3ZJM0I4M\niJl22bzZMY4qpjmVEzwQm8oNYDkTVqNpMM3cri4jjBJVs279PXnKlrGahzmK5exN\nflAcAtqtyQKBgC7BiwsaEOTcdCWajV466UypApH9ilo+TfI4ra535F/5hXfH21HJ\nsGXqkKus/xzshWxwncTqE+VNSsEGMjUld7z5O5SSZ9bUIY0salXgClmBr4a92HZo\n81Y1t5hYdDyZJS+uwd1ZnDHyQoE7hFwWpvcPT02lOS9zAik4Nb1HDjMXAoGAb4+p\nluvkTC0qSbyIfnkk0N1m7J/q+HZZW3BoG5xIb2W/fW6t2Ela0WrOiIMllzBBaUJD\n+77QiwY5RTOAFoJCqrdQohtT+NhnhPTQ8JFNxkmKFXmgZBij4YdU/3qTdWc2rEfJ\nv1wutYeS6AN2v+GMBQS6J/rZTj8BIoVUJXlKlkkCgYAwoTKhfm5GTWNXkrsmpzW+\nKZYTBTC5q15CPNCnaVidCLx6huKw8bkumawXvyru10WMsJntlffIwmWdkD8UQScy\n96f74xeT6V0LbkGzbwrReLIi5yQu3wzY3F7U1FR94ioL1gaKxtKLZs6KtzSa/7vt\nHUs2Lv272XfIy0ZTVb+bbA==\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-fbsvc@rescuse.iam.gserviceaccount.com",
  "client_id": "103953049859432242134",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40rescuse.iam.gserviceaccount.com",
  "universe_domain": "googleapis.com"
};

const admin = require('firebase-admin');
if (!admin.apps.length) {
  admin.initializeApp({ credential: admin.credential.cert(config) });
}

const ONESIGNAL_APP_ID = '6425d118-0be6-408f-8269-91e6fba8ddbc';
const ONESIGNAL_API_KEY = 'os_v2_app_mqs5cgal4zai7atjshtpxkg5xto6ohebvspekqfwqk5c6ze2ujiu4eor7poegbhxiynzzdds5c3lfcwm74hzypesn5ojw73papvvxea';

exports.handler = async (event) => {
  const headers = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'Content-Type', 'Access-Control-Allow-Methods': 'POST, OPTIONS' };
  if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers, body: '' };
  if (event.httpMethod !== 'POST') return { statusCode: 405, headers, body: JSON.stringify({ error: 'POST only' }) };
  try {
    const { tokens, title, bodyText, data } = JSON.parse(event.body);
    let fcmSent = 0, fcmFailed = 0, onesignalOk = false;

    const osResp = await fetch('https://api.onesignal.com/notifications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Key ' + ONESIGNAL_API_KEY },
      body: JSON.stringify({
        app_id: ONESIGNAL_APP_ID,
        included_segments: ['Subscribed Users'],
        headings: { en: title },
        contents: { en: bodyText },
        data: data || {},
        priority: 10
      })
    });
    const osResult = await osResp.json();
    onesignalOk = !!osResult.id;

    if (tokens && tokens.length) {
      for (const token of tokens) {
        try {
          await admin.messaging().send({ token, notification: { title, body: bodyText }, data: data || {}, android: { priority: 'high' }, webpush: { headers: { Urgency: 'high' }, notification: { title, body: bodyText, requireInteraction: true } } });
          fcmSent++;
        } catch (e) { fcmFailed++; }
      }
    }

    return { statusCode: 200, headers, body: JSON.stringify({ fcmSent, fcmFailed, onesignalOk, total: (tokens||[]).length }) };
  } catch (e) { return { statusCode: 500, headers, body: JSON.stringify({ error: e.message }) }; }
};

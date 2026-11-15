/* ==========================================================================
   store.js  —  User <-> Admin ချိတ်ဆက်မှု (Mock Backend)

   ဒီဖိုင်က "server" အစား localStorage ကို database အလိုင်းသုံးထားတယ်။
   user.html / admin.html ဘယ်မှာမဆို ဒီဖိုင်တင်ထားရင် data တစ်ခုတည်းကို
   share လုပ်မယ် (user က signup လုပ်လိုက်တာ admin list ထဲ ချက်ချင်းပေါ်မယ်,
   admin က balance ပြင်လိုက်တာ user ပြန်ဝင်ကြည့်ရင် အသစ်ပေါ်မယ်).

   ⚠️ အရေးကြီးချက်: localStorage က "ဒီ browser တစ်ခုတည်းအတွင်းသာ" သိမ်းတာဖြစ်လို့
   admin ကို တခြား device/ဖုန်းကနေ ကြည့်ချင်ရင် ဒါပဲလုံလောက်မှာ မဟုတ်ပါဘူး။
   တကယ့် production အတွက်ဆိုရင် ဒီ function တွေအားလုံးကို server API
   (fetch/axios) ခေါ်တာနဲ့ အစားထိုးဖို့ လိုပါမယ် — အောက်က TODO တွေမှာ ညွှန်ပြထားတယ်။
   ========================================================================== */

const DB_KEY = 'lt_db_v1';
const SESSION_KEY = 'lt_session_v1'; // { role:'user'|'admin', id }

function _load() {
  try { return JSON.parse(localStorage.getItem(DB_KEY)) || _seed(); }
  catch { return _seed(); }
}
function _save(db) { localStorage.setItem(DB_KEY, JSON.stringify(db)); }
function _id(prefix) { return prefix + '-' + Math.random().toString(36).slice(2, 8).toUpperCase(); }

function _seed() {
  const db = {
    users: {
      'U-DEMO01': {
        id: 'U-DEMO01', name: 'Aung Kyaw', email: 'aungkyaw@example.com', password: '123456',
        status: 'active', balance: 0, points: 0, createdAt: Date.now() - 86400000 * 40
      }
    },
    bookings: {
      'LT-20481': { id: 'LT-20481', userId: 'U-DEMO01', hotel: 'Sule Shangri-La Yangon', place: 'Yangon, Myanmar',
        img: 'images/hotel-1.jpg', inDate: 'Jun 15', outDate: 'Jun 18', nights: 3, guests: '2 Adults', total: 360, status: 'ok', createdAt: Date.now() - 86400000 * 5 },
      'LT-20533': { id: 'LT-20533', userId: 'U-DEMO01', hotel: 'Mandarin Oriental Bangkok', place: 'Bangkok, Thailand',
        img: 'images/hotel-2.jpg', g: 'linear-gradient(135deg,#d9a35a,#3a2a6a)', inDate: 'Jul 02', outDate: 'Jul 05', nights: 3, guests: '2 Adults', total: 630, status: 'wait', createdAt: Date.now() - 86400000 * 2 }
    },
    messages: {
      'U-DEMO01': [
        { from: 'admin', text: 'Welcome to LuxuryTrip! Let us know if you need anything.', at: Date.now() - 86400000 }
      ]
    },
    admin: { username: 'admin', password: 'admin123' }
  };
  _save(db);
  return db;
}

/* ---------------- Session ---------------- */
function getSession() { try { return JSON.parse(localStorage.getItem(SESSION_KEY)); } catch { return null; } }
function setSession(s) { localStorage.setItem(SESSION_KEY, JSON.stringify(s)); }
function clearSession() { localStorage.removeItem(SESSION_KEY); }

/* ---------------- Auth (user) ----------------
   TODO (real backend): ဒီ signup/login function ၂ခုကို
   fetch('/api/signup', {method:'POST', body: JSON.stringify({name,email,password})})
   / fetch('/api/login', ...) နဲ့ အစားထိုးပါ။ password ကိုလည်း server ဘက်မှာ
   hash (bcrypt) လုပ်ရမယ်, ဒီနေရာမှာတော့ သင်ခန်းစာအတွက်ရိုးရိုး plain text ပါ။ */
function signup({ name, email, password }) {
  const db = _load();
  const exists = Object.values(db.users).some(u => u.email.toLowerCase() === email.toLowerCase());
  if (exists) return { ok: false, error: 'This email is already registered.' };
  const id = _id('U');
  db.users[id] = { id, name, email, password, status: 'active', balance: 0, points: 0, createdAt: Date.now() };
  db.messages[id] = [];
  _save(db);
  setSession({ role: 'user', id });
  return { ok: true, id };
}
function login({ email, password }) {
  const db = _load();
  const user = Object.values(db.users).find(u => u.email.toLowerCase() === email.toLowerCase());
  if (!user || user.password !== password) return { ok: false, error: 'Incorrect email or password.' };
  if (user.status === 'suspended') return { ok: false, error: 'This account has been suspended. Please contact support.' };
  setSession({ role: 'user', id: user.id });
  return { ok: true, id: user.id };
}
function logout() { clearSession(); }
function currentUser() {
  const s = getSession();
  if (!s || s.role !== 'user') return null;
  const db = _load();
  return db.users[s.id] || null;
}

/* ---------------- Auth (admin) ----------------
   TODO (real backend): admin login ကိုလည်း server session/JWT နဲ့ အစားထိုးပါ။ */
function adminLogin({ username, password }) {
  const db = _load();
  if (username === db.admin.username && password === db.admin.password) {
    setSession({ role: 'admin', id: 'ADMIN' });
    return { ok: true };
  }
  return { ok: false, error: 'Incorrect admin username or password.' };
}
function isAdmin() { const s = getSession(); return !!s && s.role === 'admin'; }

/* ---------------- Users (admin-controlled) ----------------
   admin ဘက်ကနေ user ရဲ့ balance / points / status ကို ဒီနေရာကနေ ပြင်တယ်။
   TODO (real backend): PATCH /api/users/:id */
function listUsers() { return Object.values(_load().users).sort((a, b) => b.createdAt - a.createdAt); }
function getUser(id) { return _load().users[id] || null; }
function updateUser(id, patch) {
  const db = _load();
  if (!db.users[id]) return { ok: false };
  Object.assign(db.users[id], patch);
  _save(db);
  return { ok: true, user: db.users[id] };
}

/* ---------------- Bookings ----------------
   user ဘက်ကနေ booking လုပ်တာ "server ကို စာပို့တာ" ဖြစ်ပြီး admin list ထဲ ချက်ချင်းပေါ်တယ်။
   admin ဘက်ကနေ confirm / cancel / edit total,nights လုပ်လို့ရတယ်။
   TODO (real backend): POST /api/bookings, PATCH /api/bookings/:id */
function createBooking(data) {
  const db = _load();
  const id = _id('LT-2');
  db.bookings[id] = { id, status: 'wait', createdAt: Date.now(), ...data };
  _save(db);
  return { ok: true, id };
}
function listBookings() { return Object.values(_load().bookings).sort((a, b) => b.createdAt - a.createdAt); }
function listBookingsForUser(userId) { return listBookings().filter(b => b.userId === userId); }
function updateBooking(id, patch) {
  const db = _load();
  if (!db.bookings[id]) return { ok: false };
  Object.assign(db.bookings[id], patch);
  _save(db);
  return { ok: true };
}

/* ---------------- Messages (Admin ↔ User chat) ----------------
   TODO (real backend): WebSocket သို့မဟုတ် polling API (GET/POST /api/messages/:userId) */
function listMessages(userId) { return _load().messages[userId] || []; }
function sendMessage(userId, from, text) {
  const db = _load();
  if (!db.messages[userId]) db.messages[userId] = [];
  db.messages[userId].push({ from, text, at: Date.now() });
  _save(db);
}
function listConversations() {
  const db = _load();
  return Object.keys(db.messages).map(uid => {
    const u = db.users[uid];
    const thread = db.messages[uid];
    return { userId: uid, name: u ? u.name : 'Unknown', last: thread[thread.length - 1] || null, count: thread.length };
  }).filter(c => c.name !== 'Unknown');
}

window.LT = {
  signup, login, logout, currentUser, adminLogin, isAdmin,
  listUsers, getUser, updateUser,
  createBooking, listBookings, listBookingsForUser, updateBooking,
  listMessages, sendMessage, listConversations
};

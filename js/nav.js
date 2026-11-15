/* nav.js : အောက်ခြေ menu ကို စာမျက်နှာအားလုံးမှာ ဒီနေရာတစ်ခုတည်းကနေ ထည့်ပေးတယ်။
   Menu ပြင်ချင်ရင် ဒီ ITEMS ကိုပဲ ပြင်ပါ။ <body data-page="..."> နဲ့ active ကိုသိတယ်။ */
const ITEMS = [
  ['home',     'index.html',    'Home',    '<path d="M3 11l9-8 9 8v10h-6v-6H9v6H3z"/>'],
  ['packages', 'packages.html', 'Package', '<path d="M21 8l-9-5-9 5v8l9 5 9-5zM3 8l9 5 9-5M12 13v8"/>'],
  ['bookings', 'bookings.html', 'Booking', '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4M9 15l2 2 4-4"/>'],
  ['history',  'history.html',  'History', '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>'],
  ['account',  'account.html',  'Account', '<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7"/>']
];
const current = document.body.dataset.page;
const nav = document.createElement('nav');
nav.className = 'nav';
nav.innerHTML = ITEMS.map(([key, href, label, icon]) =>
  `<a href="${href}" class="${key === current ? 'on' : ''}"><svg viewBox="0 0 24 24">${icon}</svg>${label}</a>`
).join('');
document.querySelector('.app').appendChild(nav);


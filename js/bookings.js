/* bookings.js
   Booking data က အောက်က BOOKINGS array ထဲက လာတယ်။ အခု နမူနာ data ပါ၊ နောက်ပိုင်း API ကနေ ယူရန်။
   Nights / Total Spent / Points တွေကို confirmed booking တွေကနေ အလိုအလျောက် တွက်တယ်။
   BOOKINGS = [] ဆိုရင် အားလုံး 0 ကနေ စမယ်။ */
const GOAL_NIGHTS = 40;
const BOOKINGS = [
  { id: 'LT-20481', hotel: 'Sule Shangri-La Yangon', place: 'Yangon, Myanmar', img: 'images/hotel-1.jpg', inDate: 'Jun 15', outDate: 'Jun 18', nights: 3, guests: '2 Adults', total: 360, status: 'ok' },
  { id: 'LT-20533', hotel: 'Mandarin Oriental Bangkok', place: 'Bangkok, Thailand', img: 'images/hotel-2.jpg', g: 'linear-gradient(135deg,#d9a35a,#3a2a6a)', inDate: 'Jul 02', outDate: 'Jul 05', nights: 3, guests: '2 Adults', total: 630, status: 'wait' }
];
const LABEL = { ok: 'Confirmed', wait: 'Pending', off: 'Cancelled' };
const $ = id => document.getElementById(id);
const money = n => '$' + n.toLocaleString('en-US');

function render() {
  $('list').innerHTML = BOOKINGS.map(b => `
    <article class="card bk ${b.status === 'off' ? 'off' : ''}" data-status="${b.status}" data-id="${b.id}">
      <div class="top"><div class="pic" style="--img:url(${b.img});${b.g ? '--g:' + b.g : ''}"></div>
        <div class="info"><h3>${b.hotel}</h3><p>📍 ${b.place}</p><span class="badge ${b.status}">${LABEL[b.status]}</span></div></div>
      <div class="dates">
        <div><small>Check In</small><b>${b.inDate}</b></div><div><small>Check Out</small><b>${b.outDate}</b></div>
        <div><small>Guests</small><b>${b.guests}</b></div><div><small>Total</small><b>${money(b.total)}</b></div>
      </div>
      <div class="foot"><span class="id">#${b.id}</span>
        <div class="acts"><a class="btn-line" href="hotel.html">View</a><button class="btn-line danger cancel">Cancel</button></div></div>
    </article>`).join('');
  summary();
  applyFilter();
}

function summary() {
  const ok = BOOKINGS.filter(b => b.status === 'ok');
  const nights = ok.reduce((s, b) => s + b.nights, 0);
  const spent = ok.reduce((s, b) => s + b.total, 0);
  $('nights-txt').textContent = `(${nights}/${GOAL_NIGHTS})`;
  $('fill').style.width = Math.min(nights / GOAL_NIGHTS, 1) * 100 + '%';
  $('spent').textContent = money(spent);
  $('points').textContent = spent.toLocaleString('en-US');
  const left = Math.max(GOAL_NIGHTS - nights, 0);
  $('hint').textContent = left ? `${left} more nights to reach the next member tier.` : 'You have reached the next member tier!';
}

function applyFilter() {
  const status = document.querySelector('.chip.on').dataset.status;
  let shown = 0;
  document.querySelectorAll('.bk').forEach(c => {
    const ok = status === 'all' || c.dataset.status === status;
    c.style.display = ok ? '' : 'none';
    shown += ok;
  });
  $('empty').style.display = shown ? 'none' : 'block';
}

document.querySelectorAll('.chip').forEach(chip => chip.addEventListener('click', () => {
  document.querySelectorAll('.chip').forEach(c => c.classList.remove('on'));
  chip.classList.add('on');
  applyFilter();
}));

$('list').addEventListener('click', e => {
  if (!e.target.classList.contains('cancel')) return;
  if (!confirm('Cancel this booking?')) return;
  const b = BOOKINGS.find(x => x.id === e.target.closest('.bk').dataset.id);
  b.status = 'off';
  // TODO: server ဆီ cancel request ပို့ရန်
  render();
});

render();

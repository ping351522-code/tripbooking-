/* ===== hotel.js : Hotel detail စာမျက်နှာ လုပ်ဆောင်ချက်များ ===== */
const NIGHTS = Number(document.body.dataset.nights || 3);

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];

/* နောက်သို့ပြန်သွားမယ် */
$('#btn-back').addEventListener('click', () => {
  history.length > 1 ? history.back() : (location.href = 'index.html');
});

/* Favorite */
$('#btn-fav').addEventListener('click', e => {
  const on = e.currentTarget.classList.toggle('on');
  e.currentTarget.textContent = on ? '♥' : '♡';
});

/* Gallery dots */
const slides = $('#slides');
const dots = $$('#dots i');
slides.addEventListener('scroll', () => {
  const i = Math.round(slides.scrollLeft / slides.clientWidth);
  dots.forEach((d, n) => d.classList.toggle('on', n === i));
});

/* Read more */
$('#btn-more').addEventListener('click', e => {
  const open = $('#desc').classList.toggle('clamp') === false;
  e.currentTarget.textContent = open ? 'Show less' : 'Read more';
});

/* Room ရွေး + စုစုပေါင်းတွက် */
let price = 120;
const total = $('#total');
const fmt = n => '$' + n.toLocaleString('en-US');
function update() {
  total.textContent = fmt(price * NIGHTS);
  $('#nights-label').textContent = `${NIGHTS} nights`;
}
$$('.room').forEach(btn => {
  btn.addEventListener('click', () => {
    $$('.room').forEach(r => r.classList.remove('on'));
    btn.classList.add('on');
    price = Number(btn.dataset.price);
    update();
  });
});
update();

/* Book Now */
$('#btn-book').addEventListener('click', () => {
  const room = $('.room.on h3').textContent;
  // TODO: booking စာမျက်နှာ / API ချိတ်ဖို့နေရာ
  alert(`${room} – ${NIGHTS} nights – ${total.textContent}`);
});


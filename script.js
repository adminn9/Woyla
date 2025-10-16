
const ADMIN_DANA = '089509382153';
const ADMIN_WA = '6289509382153';

const products = [
  { id: 1, name: 'Alight Motion Premium', price: 10000, desc: 'Privat 1 tahun' },
  { id: 2, name: 'Spotify Premium', price: 25000, desc: '30 Hari family plan' },
  { id: 3, name: 'Canva Pro', price: 15000, desc: '30 Hari' },
  { id: 4, name: 'Capcut Pro', price: 15000, desc: '30 Hari' },
  { id: 5, name: 'Bstation', price: 30000, desc: '30 Hari Privat' },
  { id: 6, name: 'ChatGPT Privat', price: 70000, desc: '30 Hari' },
  { id: 7, name: 'Viu', price: 15000, desc: '1 tahun' },
  { id: 8, name: 'Viu', price: 5000, desc: '30 Hari' },
  { id: 9, name: 'Viu Prem', price: 25000, desc: '1 Tahun' },
  { id: 10, name: 'Zoom Meeting Pro', price: 5000, desc: '7 Hari' },
  { id: 11, name: 'Zoom Meeting Pro', price: 8000, desc: '14 Hari' },
  { id: 12, name: 'Bot WhatsApp', price: 15000, desc: '30 Hari' },
  { id: 13, name: 'Jasa Pembuatan Web', price: 10000, desc: 'Tergantung kesulitan, Mulai Dari' }
];

let cart = [];

function renderProducts() {
  const list = document.getElementById('product-list');
  list.innerHTML = products.map(p => `
    <div class="product">
      <h3>${p.name}</h3>
      <p>${p.desc}</p>
      <strong>Rp ${p.price.toLocaleString()}</strong>
      <button onclick="addToCart(${p.id})">Tambah</button>
    </div>
  `).join('');
}

function addToCart(id) {
  const item = products.find(p => p.id === id);
  const existing = cart.find(i => i.id === id);
  if (existing) existing.qty++;
  else cart.push({ ...item, qty: 1 });
  updateCart();
}

function removeFromCart(id) {
  const index = cart.findIndex(i => i.id === id);
  if (index !== -1) {
    if (cart[index].qty > 1) {
      cart[index].qty--;  // Kurangi quantity jika lebih dari 1
    } else {
      cart.splice(index, 1);  // Hapus item jika quantity == 1
    }
    updateCart();  // Perbarui tampilan keranjang
  }
}

function updateCart() {
  const list = document.getElementById('cart-items');
  const total = document.getElementById('total-price');
  let totalPrice = 0;

  list.innerHTML = cart.map(i => {
    totalPrice += i.price * i.qty;
    return `<li>${i.name} x ${i.qty} <button onclick="removeFromCart(${i.id})">Hapus</button></li>`;
  }).join('');

  total.textContent = `Rp ${totalPrice.toLocaleString()}`;
}

document.getElementById('checkout-btn').addEventListener('click', () => {
  const phone = document.getElementById('whatsapp-number').value;
  if (!phone || cart.length === 0) return alert('Lengkapi data terlebih dahulu!');

  const totalAmount = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  const qrData = `DANA:${ADMIN_DANA}\nJumlah:${totalAmount}\nBatas 30 menit`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(qrData)}&size=200x200`;

  document.getElementById('qr-code').src = qrUrl;
  document.getElementById('qr-modal').classList.remove('hidden');

  startCountdown(30 * 60, document.getElementById('countdown'));
});

function startCountdown(duration, display) {
  let timer = duration;
  const interval = setInterval(() => {
    const m = Math.floor(timer / 60);
    const s = timer % 60;
    display.textContent = `Kadaluarsa dalam: ${m}:${s < 10 ? '0' + s : s}`;
    if (--timer < 0) {
      clearInterval(interval);
      display.textContent = 'QR kadaluarsa';
      document.getElementById('qr-modal').classList.add('hidden');
    }
  }, 1000);
}

document.getElementById('confirm-btn').addEventListener('click', () => {
  const phone = document.getElementById('whatsapp-number').value;
  const totalAmount = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  const items = cart.map(i => `${i.name} x ${i.qty}`).join(', ');
  const msg = `Pembayaran berhasil!!%0A
                • Dari: ${phone}%0A
                • Produk: ${items}%0A
                • Total: Rp ${totalAmount.toLocaleString()}%0A
                • Status: Dibayar`;

  window.open(`https://wa.me/${ADMIN_WA}?text=${msg}`, '_blank');
  document.getElementById('qr-modal').classList.add('hidden');
  cart = [];
  updateCart();
});

window.onload = renderProducts;

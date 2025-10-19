const API_URL = '/api/products';
fetch(API_URL)
  .then(res => res.json())
  .then(products => {
    const container = document.getElementById('products');
    products.forEach(p => {
      const div = document.createElement('div');
      div.className = 'product';
      div.innerHTML = `<h3>${p.name}</h3><p>${p.description}</p><p><strong>${p.price} UGX</strong></p>
      <button onclick="order('${p.id}')">Subscribe</button>`;
      container.appendChild(div);
    });
  });

function order(id) {
  const name = prompt('Enter your full name:');
  const email = prompt('Enter your email:');
  const phone = prompt('Enter your phone number:');
  if (!name || !email || !phone) return alert('All fields required!');
  fetch('/api/orders', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({productId: id, name, email, phone})
  }).then(r => r.json()).then(d => {
    alert(d.message);
  });
}

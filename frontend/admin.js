let token = '';
function login() {
  fetch('/api/admin/login', {
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify({username:document.getElementById('user').value,password:document.getElementById('pass').value})
  }).then(r=>r.json()).then(d=>{
    if(d.token){token=d.token;document.getElementById('login').style.display='none';document.getElementById('panel').style.display='block';loadProducts();}
    else alert('Invalid login');
  });
}
function loadProducts(){
  fetch('/api/products',{headers:{'Authorization':'Bearer '+token}})
  .then(r=>r.json()).then(products=>{
    const div=document.getElementById('product-list');div.innerHTML='';
    products.forEach(p=>{
      div.innerHTML+=`<div>${p.name} - ${p.price} UGX <button onclick="del(${p.id})">Delete</button></div>`;
    });
  });
}
function addProduct(){
  const name=document.getElementById('pname').value,desc=document.getElementById('pdesc').value,price=document.getElementById('pprice').value;
  fetch('/api/products',{method:'POST',headers:{'Content-Type':'application/json','Authorization':'Bearer '+token},body:JSON.stringify({name,description:desc,price})}).then(r=>r.json()).then(d=>{alert('Added');loadProducts();});
}
function del(id){
  fetch('/api/products/'+id,{method:'DELETE',headers:{'Authorization':'Bearer '+token}}).then(()=>loadProducts());
}

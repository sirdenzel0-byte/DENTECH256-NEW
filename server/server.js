const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const cors = require('cors');
const sgMail = require('@sendgrid/mail');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('frontend'));

const db = new sqlite3.Database('dentech.db');
db.serialize(()=>{
  db.run('CREATE TABLE IF NOT EXISTS products(id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, description TEXT, price INTEGER)');
  db.run('CREATE TABLE IF NOT EXISTS orders(id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, email TEXT, phone TEXT, productId INTEGER, paid INTEGER DEFAULT 0)');
});

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

app.post('/api/admin/login',(req,res)=>{
  const {username,password}=req.body;
  if(username==='admin'&&password==='Dentech256@2025'){
    const token=jwt.sign({user:'admin'},process.env.JWT_SECRET||'secret',{expiresIn:'2h'});
    res.json({token});
  }else res.status(401).json({error:'Invalid credentials'});
});

function verifyToken(req,res,next){
  const header=req.headers['authorization'];
  if(!header)return res.status(403).json({error:'No token'});
  const token=header.split(' ')[1];
  jwt.verify(token,process.env.JWT_SECRET||'secret',(err,decoded)=>{
    if(err)return res.status(401).json({error:'Invalid token'});
    req.user=decoded;next();
  });
}

app.get('/api/products',(req,res)=>{
  db.all('SELECT * FROM products',(err,rows)=>res.json(rows));
});

app.post('/api/products',verifyToken,(req,res)=>{
  const {name,description,price}=req.body;
  db.run('INSERT INTO products(name,description,price) VALUES(?,?,?)',[name,description,price],function(err){
    if(err)return res.status(500).json({error:err.message});
    res.json({id:this.lastID});
  });
});

app.delete('/api/products/:id',verifyToken,(req,res)=>{
  db.run('DELETE FROM products WHERE id=?',[req.params.id],err=>{
    if(err)return res.status(500).json({error:err.message});
    res.json({success:true});
  });
});

app.post('/api/orders',(req,res)=>{
  const {name,email,phone,productId}=req.body;
  db.run('INSERT INTO orders(name,email,phone,productId) VALUES(?,?,?,?)',[name,email,phone,productId],function(err){
    if(err)return res.status(500).json({error:err.message});
    const msg={
      to:email,
      from:process.env.EMAIL_FROM,
      subject:'Dentech 256 Order Confirmation',
      text:`Hello ${name}, your order for subscription ID ${productId} has been received. Please send payment to the provided Dentech 256 number and wait for confirmation.`,
    };
    sgMail.send(msg).catch(console.error);
    res.json({message:'Order placed successfully! Check your email for payment instructions.'});
  });
});

const PORT=process.env.PORT||4242;
app.listen(PORT,()=>console.log('Dentech 256 running on port '+PORT));

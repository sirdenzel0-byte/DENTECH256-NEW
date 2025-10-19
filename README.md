# Dentech 256 - IPTV Subscription Shop

## Setup Instructions
1. Extract files
2. Inside `server` folder:
   ```bash
   npm install express sqlite3 jsonwebtoken body-parser cors dotenv @sendgrid/mail
   npm start
   ```
3. Visit [http://localhost:4242](http://localhost:4242)

### Environment Variables (.env)
```
SENDGRID_API_KEY=your_sendgrid_key
EMAIL_FROM=your_verified_sender@example.com
JWT_SECRET=your_secret_key
PORT=4242
```

### Admin Login
- Username: admin
- Password: Dentech256@2025

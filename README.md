# 🏦 Banking System — Backend API

A production-ready RESTful API for a modern Banking System built 
with the MERN stack. Designed with security, scalability, and 
clean architecture in mind.

## ⚙️ Tech Stack

- **Runtime** — Node.js
- **Framework** — Express.js
- **Database** — MongoDB + Mongoose
- **Authentication** — JWT (JSON Web Tokens)
- **Encryption** — bcryptjs
- **Environment** — dotenv

## 🔐 Features

- User Registration & Login with JWT Authentication
- Role-Based Access Control (Admin / User)
- Account Creation & Management
- Deposit, Withdrawal & Fund Transfer
- Transaction History & Statement
- Secure Password Hashing
- Protected Routes with Middleware
- Error Handling & Input Validation

## 📁 Project Structure

\`\`\`
Backend/
├── controllers/     # Business logic
├── models/          # Mongoose schemas
├── routes/          # API endpoints
├── middleware/       # Auth & role guards
├── config/          # DB connection
└── server.js        # Entry point
\`\`\`

## 🚀 Getting Started

\`\`\`bash
# Clone the repo
git clone https://github.com/harshitpaliwal04/Backend-of-banking-system.git

# Install dependencies
cd Backend
npm install

# Create .env file
cp .env.example .env

# Start server
npm run dev
\`\`\`

## 🌍 Environment Variables

\`\`\`env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
\`\`\`

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register new user |
| POST | /api/auth/login | Login & get token |
| GET | /api/account | Get account details |
| POST | /api/account/deposit | Deposit funds |
| POST | /api/account/withdraw | Withdraw funds |
| POST | /api/account/transfer | Transfer funds |
| GET | /api/transactions | Get transaction history |

## 🔒 Security

- JWT token expiry
- Password hashing with bcryptjs
- Role-based route protection
- Input validation on all endpoints

## 📄 License

MIT License — feel free to use and modify.

---
Made with ❤️ by Harshit

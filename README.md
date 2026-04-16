<<<<<<< HEAD
# 💰 Expense Tracker AI

A modern full-stack Expense Tracker application that helps users manage daily expenses, budgets, group spending, and gain insights using an AI-powered chatbot.

---

## 🚀 Features

### 🔐 Authentication

* User registration and login system
* Secure authentication using tokens
* Protected routes for authorized users

---

### 💸 Transactions Management

* Add new transactions (income/expense)
* Categorize transactions
* View and manage transaction history
* Real-time updates

---

### 📊 Analytics Dashboard

* Visual representation of expenses
* Track spending patterns
* Category-based analysis

---

### 🎯 Budget Management

* Set and manage budgets
* Track spending against budget limits
* Helps in financial planning

---

### 👥 Group Expense Feature

* Create groups
* Add members to groups
* Split expenses among members
* Track balances within groups

---

### 🤖 AI Chatbot (FinBot)

* Ask financial questions
* Get smart suggestions
* Improve spending habits

---

### ⚙️ Settings

* Manage user preferences
* Customize app experience

---

## 🛠️ Tech Stack

### Frontend

* React.js
* React Router DOM
* Context API (Auth, Transactions, Budget, Groups)
* CSS Modules

### Backend

* FastAPI (Python)

---

## 📁 Project Structure

```id="8j3q2v"
src/
│
├── components/
│   ├── BottomNav.jsx
│   └── ProtectedRoute.jsx
│
├── context/
│   ├── AuthContext.jsx
│   ├── TxContext.jsx
│   ├── BudgetContext.jsx
│   └── GroupContext.jsx
│
├── pages/
│   ├── HomePage.jsx
│   ├── TransactionsPage.jsx
│   ├── AddTransactionPage.jsx
│   ├── CategoriesPage.jsx
│   ├── AnalyticsPage.jsx
│   ├── BudgetPage.jsx
│   ├── GroupsPage.jsx
│   ├── ChatbotPage.jsx
│   ├── SettingsPage.jsx
│   ├── LandingPage.jsx
│   ├── LoginPage.jsx
│   └── RegisterPage.jsx
│
├── App.jsx
├── main.jsx
├── index.css
└── constants.js
```

---

## ⚙️ Installation & Setup

### 1️⃣ Clone Repository

```id="3y9gkl"
git clone https://github.com/singhjesika/Expense-Tracker-AI.git
cd Expense-Tracker-AI
```

---

### 2️⃣ Install Dependencies

```id="7f5x0m"
npm install
```

---

### 3️⃣ Run Frontend

```id="b7kp7s"
npm run dev
```

---

### 4️⃣ Run Backend (if using FastAPI)

```id="8bz6pv"
pip install -r requirements.txt
uvicorn app.main:app --reload
```

---

## 🌐 Usage

* Open: http://localhost:5173
* Register/Login
* Add and track expenses
* Manage budgets
* Create groups and split expenses
* Use AI chatbot for financial help

---


---

## 🔮 Future Improvements

* Mobile responsive improvements
* Export reports (PDF/Excel)
* Advanced AI insights
* Notifications for budget limits

---













=======

# Expense Tracker AI Project

## Overview
Expense Tracker AI is a full-stack web application designed to help users manage and track their daily expenses efficiently. It provides a simple and interactive interface to add, view, and analyze expenses, helping users maintain better financial discipline. The application also includes AI-based insights to understand spending patterns.

---

## Features
- ✅ User authentication (Login & Register)
- ✅ Add, edit, and delete expenses
- ✅ Categorize expenses (Food, Travel, Shopping, etc.)
- ✅ Dashboard with expense summary
- ✅ Monthly and category-based analytics
- ✅ AI-based spending insights (via Groq API)
- ✅ Group expense management
- ✅ Budget tracking and alerts
- ✅ Transaction history tracking
- ✅ Responsive UI for mobile and desktop
- ✅ Dark/Light theme support

---

## Tech Stack
- **Frontend:** React 18, Vite, JavaScript, HTML, CSS Modules, Recharts
- **State Management:** React Hooks / Context API
- **Backend:** Node.js / Express 5
- **Database:** MongoDB
- **Authentication:** JWT (JSON Web Tokens)
- **AI Integration:** Groq API
- **Security:** Bcrypt for password hashing, CORS

---

## Project Structure
```
├── frontend/
│   ├── src/
│   │   ├── components/       # React components
│   │   ├── context/          # Context API providers
│   │   ├── pages/            # Page components
│   │   ├── App.jsx           # Main app
│   │   └── main.jsx          # Entry point
│   ├── package.json
│   └── vite.config.js
├── backend/
│   ├── server.js             # Express server
│   ├── package.json
│   └── .env                  # Environment variables
├── .env                      # Frontend env variables
└── README.md
```

---

## Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- MongoDB (local or cloud)

---

## Installation & Setup

### Step 1: Clone & Navigate
```bash
cd Expense-tracker-AI-project
```

### Step 2: Setup Backend

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory:
```
MONGO_URI=mongodb://127.0.0.1:27017/expenseDB
JWT_SECRET=your-super-secret-key-change-in-production
PORT=5000
```

**Note:** Make sure MongoDB is running locally or update `MONGO_URI` with your MongoDB Atlas connection string.

Start the backend server:
```bash
npm run dev
```

The backend will run on `http://localhost:5000`

### Step 3: Setup Frontend

```bash
cd ..
npm install
```

Create a `.env` file in the root directory:
```
VITE_API_URL=http://localhost:5000
VITE_GROQ_KEY=your-groq-api-key-here
```

To get a Groq API key:
1. Visit [Groq Console](https://console.groq.com)
2. Create an account
3. Generate an API key
4. Add it to your `.env` file

Start the frontend development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

---

## Running the Application

### Terminal 1 - Backend Server
```bash
cd backend
npm run dev
```

### Terminal 2 - Frontend Dev Server
```bash
npm run dev
```

Open your browser and navigate to `http://localhost:5173`

---

## API Endpoints

### Authentication
- `POST /register` - Register new user
- `POST /login` - Login user
- `GET /profile` - Get user profile (protected)

### Expenses
- `GET /expenses` - Get all expenses (protected)
- `POST /expenses` - Add new expense (protected)
- `PUT /expenses/:id` - Update expense (protected)
- `DELETE /expenses/:id` - Delete expense (protected)

### Budgets
- `GET /budgets` - Get all budgets (protected)
- `POST /budgets` - Create/update budget (protected)
- `DELETE /budgets/:id` - Delete budget (protected)

### Groups
- `GET /groups` - Get all groups (protected)
- `POST /groups` - Create group (protected)
- `GET /groups/:id` - Get group details (protected)
- `POST /groups/:id/expenses` - Add group expense (protected)
- `DELETE /groups/:id/expenses/:expenseId` - Remove group expense (protected)
- `DELETE /groups/:id` - Delete group (protected)

---

## Usage

### 1. **Register/Login**
   - Create a new account or login with existing credentials
   - JWT token is automatically stored in localStorage

### 2. **Add Transactions**
   - Navigate to "Add Transaction" page
   - Fill in amount, category, description, and date
   - Categorize as Income or Expense

### 3. **View Dashboard**
   - See total balance, income, and expenses
   - View recent transactions
   - Check category-wise spending

### 4. **Analytics**
   - View monthly trends (income vs expenses)
   - Category-wise expense breakdown
   - Pie charts and bar charts

### 5. **Budget Management**
   - Set budget limits for categories
   - Get alerts when reaching 80% and 100% of budget
   - Audio and desktop notifications

### 6. **Group Expenses**
   - Create expense groups with friends
   - Split expenses equally or customly
   - Calculate who owes whom
   - Settle debts easily

### 7. **AI Chatbot**
   - Ask financial advice based on your spending patterns
   - Get personalized investment suggestions
   - Receive spending insights and recommendations

---

## Building for Production

### Frontend
```bash
npm run build
```

### Backend
No special build needed. Just ensure all dependencies are installed.

---

## Troubleshooting

### Backend not connecting
- Ensure MongoDB is running: `mongod`
- Check `MONGO_URI` in `.env`
- Verify PORT 5000 is not in use

### Frontend API errors
- Check that backend is running on `http://localhost:5000`
- Verify `VITE_API_URL` in `.env`
- Check browser console for detailed errors

### Groq API errors
- Verify `VITE_GROQ_KEY` is set correctly
- Check Groq API key validity at [console.groq.com](https://console.groq.com)
- Ensure you have API credits available

### Database issues
- For MongoDB locally: Install from [mongodb.com](https://www.mongodb.com/try/download/community)
- For MongoDB Atlas: Create cluster at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)

---

## Environment Variables Reference

### Backend (.env)
| Variable | Description | Default |
|----------|-------------|---------|
| `MONGO_URI` | MongoDB connection string | `mongodb://127.0.0.1:27017/expenseDB` |
| `JWT_SECRET` | Secret key for JWT signing | `change-this-secret` |
| `PORT` | Server port | `5000` |

### Frontend (.env)
| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_API_URL` | Backend API URL | Yes |
| `VITE_GROQ_KEY` | Groq API key for chatbot | Yes |

---

## Security Notes
- ⚠️ **Never commit `.env` files** - They're in `.gitignore`
- 🔒 Change `JWT_SECRET` in production
- 🔐 Use strong passwords (minimum 6 characters)
- 🌐 Enable CORS only for trusted domains in production

---

## Future Enhancements
- [ ] Email notifications for budget alerts
- [ ] Data export to CSV/PDF
- [ ] Mobile app (React Native)
- [ ] Multi-currency support
- [ ] Cloud backup
- [ ] Advanced analytics & reports
- [ ] OAuth integration (Google, GitHub)

---

## Support & Issues
For issues, bugs, or feature requests, please create an issue on GitHub.

---

## License
ISC License
>>>>>>> yuvraj/main

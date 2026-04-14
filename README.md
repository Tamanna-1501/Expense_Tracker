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














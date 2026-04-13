# PaiseTrack — Expense Tracker

A complete personal finance tracker built with React + Vite + React Router. Features authentication, full CRUD for transactions, category breakdown, charts, and settings — all persisted in `localStorage`.

---

## Pages

| Route | Page | Auth |
|-------|------|------|
| `/login` | Login | Public |
| `/register` | Register | Public |
| `/home` | Dashboard | Protected |
| `/transactions` | Full transaction list | Protected |
| `/add` | Add income/expense | Protected |
| `/categories` | Spending breakdown | Protected |
| `/settings` | Profile & logout | Protected |

---

## Quick Start

```bash
# 1. Unzip and enter
unzip expense-tracker-complete.zip && cd expense-app

# 2. Install
npm install

# 3. Run dev server
npm run dev
```

Open **http://localhost:5173**

---

## Demo Account

> **Email:** rahul@example.com  
> **Password:** demo1234

Or click "Try demo account" on the login page.

---

## Project Structure

```
src/
├── context/
│   ├── AuthContext.jsx       # Login, register, logout (localStorage)
│   └── TxContext.jsx         # Transaction state + derived data
├── components/
│   ├── BottomNav.jsx         # App navigation bar
│   └── ProtectedRoute.jsx    # Auth guard
├── pages/
│   ├── LoginPage.jsx
│   ├── RegisterPage.jsx
│   ├── AuthPage.module.css
│   ├── HomePage.jsx          # Dashboard
│   ├── HomePage.module.css
│   ├── TransactionsPage.jsx  # Filterable list + delete
│   ├── TransactionsPage.module.css
│   ├── AddTransactionPage.jsx
│   ├── AddTransactionPage.module.css
│   ├── CategoriesPage.jsx    # Donut chart + breakdown
│   ├── CategoriesPage.module.css
│   ├── SettingsPage.jsx      # Profile, preferences, logout
│   └── SettingsPage.module.css
├── constants.js              # Categories, icons, formatters, seed data
├── index.css                 # Global tokens + animations
├── App.jsx                   # Router + providers
└── main.jsx
```

---

## Features

- **Auth** — Register, login, logout with localStorage persistence. Each user has their own transaction data.
- **Dashboard** — Balance hero, stats, monthly bar chart, recent transactions, top categories
- **Transactions** — Full list grouped by date, search, type filter, delete with confirmation
- **Add Transaction** — Big amount input, category picker with icons, note field
- **Categories** — SVG donut chart + sorted breakdown with percentages
- **Settings** — Profile info, preferences, data management, sign out
- **Dark mode ready** — CSS variables used throughout (add `prefers-color-scheme: dark` overrides to `index.css`)

---

## Tech Stack

- React 18
- React Router v6
- Vite 5
- CSS Modules
- localStorage (no backend required)

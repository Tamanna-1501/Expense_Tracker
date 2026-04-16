require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const app = express()
const PORT = process.env.PORT || 5000
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/expenseDB'
const JWT_SECRET = process.env.JWT_SECRET || 'change-this-secret'

app.use(express.json())
app.use(cors())

// ================= DATABASE CONNECT =================
mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB Connected '))
  .catch((err) => console.error('MongoDB connection error:', err))

// ================= USER SCHEMA =================
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
})

const User = mongoose.model('User', userSchema)

// ================= EXPENSE SCHEMA =================
const expenseSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  amount: { type: Number, required: true },
  category: { type: String, required: true },
  description: { type: String, default: '' },
  date: { type: Date, required: true },
  type: { type: String, enum: ['income', 'expense'], required: true },
  createdAt: { type: Date, default: Date.now }
})

const Expense = mongoose.model('Expense', expenseSchema)

// ================= BUDGET SCHEMA =================
const budgetSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  category: { type: String, required: true },
  limit: { type: Number, required: true },
  month: { type: String, required: true }, // YYYY-MM
  createdAt: { type: Date, default: Date.now }
})

const Budget = mongoose.model('Budget', budgetSchema)

// ================= GROUP SCHEMA =================
const groupSchema = new mongoose.Schema({
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  emoji: { type: String, default: '👥' },
  members: [{ type: String }], // member names
  expenses: [{ 
    id: String,
    desc: String,
    amount: Number,
    paidBy: String,
    splitAmong: [String],
    cat: String,
    date: String
  }],
  createdAt: { type: Date, default: Date.now }
})

const Group = mongoose.model('Group', groupSchema)

// ================= AUTH HELPERS =================
function createToken(user) {
  return jwt.sign({ id: user._id.toString(), name: user.name, email: user.email }, JWT_SECRET, {
    expiresIn: '7d'
  })
}

async function hashPassword(password) {
  return bcrypt.hash(password, 10)
}

async function comparePassword(password, hash) {
  return bcrypt.compare(password, hash)
}

function authenticate(req, res, next) {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Missing or invalid authorization header.' })
  }

  const token = authHeader.slice(7)
  try {
    req.user = jwt.verify(token, JWT_SECRET)
    next()
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token.' })
  }
}

// ================= ROUTES =================
app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'Expense Tracker backend is running ' })
})

app.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required.' })
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters.' })
    }

    const normalizedEmail = email.toLowerCase().trim()
    const existingUser = await User.findOne({ email: normalizedEmail })
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered.' })
    }

    const passwordHash = await hashPassword(password)
    const user = new User({ name, email: normalizedEmail, passwordHash })
    await user.save()

    const token = createToken(user)
    res.status(201).json({ message: 'User registered ', user: { id: user._id, name: user.name, email: user.email }, token })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error registering user.' })
  }
})

app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' })
    }

    const normalizedEmail = email.toLowerCase().trim()
    const user = await User.findOne({ email: normalizedEmail })
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials.' })
    }

    const validPassword = await comparePassword(password, user.passwordHash)
    if (!validPassword) {
      return res.status(400).json({ message: 'Invalid credentials.' })
    }

    const token = createToken(user)
    res.json({ message: 'Login success ', user: { id: user._id, name: user.name, email: user.email }, token })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error logging in.' })
  }
})

app.get('/profile', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('name email createdAt')
    if (!user) return res.status(404).json({ message: 'User not found.' })
    res.json({ user })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Failed to load profile.' })
  }
})

// ================= EXPENSE ROUTES =================
app.post('/expenses', authenticate, async (req, res) => {
  try {
    const { title, amount, category, description, date, type } = req.body
    if (!title || amount == null || !category || !type) {
      return res.status(400).json({ message: 'Title, amount, category, and type are required.' })
    }

    if (!['income', 'expense'].includes(type)) {
      return res.status(400).json({ message: 'Type must be income or expense.' })
    }

    const expense = new Expense({
      userId: req.user.id,
      title,
      amount,
      category,
      description: description || '',
      date: date ? new Date(date) : new Date(),
      type
    })

    await expense.save()
    res.status(201).json({ message: 'Expense added ✅', expense })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error adding expense.' })
  }
})

app.get('/expenses', authenticate, async (req, res) => {
  try {
    const expenses = await Expense.find({ userId: req.user.id }).sort({ date: -1, createdAt: -1 })
    res.json({ expenses })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error loading expenses.' })
  }
})

app.put('/expenses/:id', authenticate, async (req, res) => {
  try {
    const { title, amount, category, description, date } = req.body
    const update = {
      ...(title !== undefined && { title }),
      ...(amount !== undefined && { amount }),
      ...(category !== undefined && { category }),
      ...(description !== undefined && { description }),
      ...(date !== undefined && { date: new Date(date) })
    }

    const expense = await Expense.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      update,
      { new: true }
    )

    if (!expense) {
      return res.status(404).json({ message: 'Expense not found.' })
    }

    res.json({ message: 'Expense updated ', expense })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error updating expense.' })
  }
})

app.delete('/expenses/:id', authenticate, async (req, res) => {
  try {
    const expense = await Expense.findOneAndDelete({ _id: req.params.id, userId: req.user.id })
    if (!expense) {
      return res.status(404).json({ message: 'Expense not found.' })
    }

    res.json({ message: 'Expense deleted ' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error deleting expense.' })
  }
})

// ================= BUDGET ROUTES =================
app.post('/budgets', authenticate, async (req, res) => {
  try {
    const { category, limit, month } = req.body
    if (!category || limit == null || !month) {
      return res.status(400).json({ message: 'Category, limit, and month are required.' })
    }

    const existing = await Budget.findOne({ userId: req.user.id, category, month })
    if (existing) {
      existing.limit = limit
      await existing.save()
      return res.json({ message: 'Budget updated', budget: existing })
    }

    const budget = new Budget({ userId: req.user.id, category, limit, month })
    await budget.save()
    res.status(201).json({ message: 'Budget created', budget })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error managing budget.' })
  }
})

app.get('/budgets', authenticate, async (req, res) => {
  try {
    const budgets = await Budget.find({ userId: req.user.id })
    res.json({ budgets })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error loading budgets.' })
  }
})

app.delete('/budgets/:id', authenticate, async (req, res) => {
  try {
    const budget = await Budget.findOneAndDelete({ _id: req.params.id, userId: req.user.id })
    if (!budget) {
      return res.status(404).json({ message: 'Budget not found.' })
    }
    res.json({ message: 'Budget deleted' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error deleting budget.' })
  }
})

// ================= GROUP ROUTES =================
app.post('/groups', authenticate, async (req, res) => {
  try {
    const { name, emoji, members } = req.body
    if (!name || !members || !Array.isArray(members)) {
      return res.status(400).json({ message: 'Name and members array are required.' })
    }

    const group = new Group({
      createdBy: req.user.id,
      name,
      emoji: emoji || '👥',
      members,
      expenses: []
    })

    await group.save()
    res.status(201).json({ message: 'Group created', group })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error creating group.' })
  }
})

app.get('/groups', authenticate, async (req, res) => {
  try {
    const groups = await Group.find({ createdBy: req.user.id })
    res.json({ groups })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error loading groups.' })
  }
})

app.get('/groups/:id', authenticate, async (req, res) => {
  try {
    const group = await Group.findOne({ _id: req.params.id, createdBy: req.user.id })
    if (!group) {
      return res.status(404).json({ message: 'Group not found.' })
    }
    res.json({ group })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error loading group.' })
  }
})

app.post('/groups/:id/expenses', authenticate, async (req, res) => {
  try {
    const { desc, amount, paidBy, splitAmong, cat, date } = req.body
    if (!desc || amount == null || !paidBy || !splitAmong) {
      return res.status(400).json({ message: 'All fields are required.' })
    }

    const group = await Group.findOne({ _id: req.params.id, createdBy: req.user.id })
    if (!group) {
      return res.status(404).json({ message: 'Group not found.' })
    }

    const expense = {
      id: Date.now().toString(),
      desc,
      amount,
      paidBy,
      splitAmong,
      cat: cat || 'General',
      date: date || new Date().toISOString().slice(0, 10)
    }

    group.expenses.push(expense)
    await group.save()
    res.status(201).json({ message: 'Expense added to group', expense })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error adding expense to group.' })
  }
})

app.delete('/groups/:groupId/expenses/:expenseId', authenticate, async (req, res) => {
  try {
    const group = await Group.findOne({ _id: req.params.groupId, createdBy: req.user.id })
    if (!group) {
      return res.status(404).json({ message: 'Group not found.' })
    }

    group.expenses = group.expenses.filter(e => e.id !== req.params.expenseId)
    await group.save()
    res.json({ message: 'Expense removed from group' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error removing expense from group.' })
  }
})

app.delete('/groups/:id', authenticate, async (req, res) => {
  try {
    const group = await Group.findOneAndDelete({ _id: req.params.id, createdBy: req.user.id })
    if (!group) {
      return res.status(404).json({ message: 'Group not found.' })
    }
    res.json({ message: 'Group deleted' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error deleting group.' })
  }
})

app.listen(PORT, () => {
  console.log('Server running on port', PORT)
})

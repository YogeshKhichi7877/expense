import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import setupCronJobs from './cron/weeklyReport.js';
import User from './models/User.js';
import Budget from './models/Budget.js';
import Expense from './models/Expense.js';
import { sendWeeklyReport } from './utils/emailService.js';
import { format ,subDays } from 'date-fns';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5020;
const JWT_SECRET = process.env.JWT_SECRET || 'yogesh7877';
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/expense-tracker';

const allowedOrigins = [
  'https://expensetracker-sigma-ecru.vercel.app', // Your Vercel production URL
  'http://localhost:5173',                       // Your local Vite/React dev port
  'http://localhost:3000',                        // Alternative local port
  'https://expensetracker-lygm.onrender.com'
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(cookieParser());

// Connect to MongoDB
mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB successfully');
    console.log(`📍 Database: ${MONGODB_URI}`);
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });
  // Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!', 
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});


// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down gracefully...');
  await mongoose.connection.close();
  console.log('📦 MongoDB connection closed');
  process.exit(0);
});



setupCronJobs();

// Auth middleware
const authenticateToken = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    
    if (!token) {
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Verify user still exists
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({ message: 'Invalid token. User not found.' });
    }

    req.user = decoded;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(400).json({ message: 'Invalid token.' });
  }
};


//test route 
// 🚀 MANUAL TRIGGER: Run the Weekly Report logic NOW for all users
app.get('/api/test-db-email', async (req, res) => {
  try {
    // 1. Fetch the first user from MongoDB
    const user = await User.findOne(); 

    if (!user) {
      return res.status(404).send('❌ No users found in database to send email to.');
    }

    console.log(`found user: ${user.email}`);

    // 2. Send email to THAT user's real address
    await sendWeeklyReport(
      user.email,             // <--- Real email from DB
      user.name,              // <--- Real name from DB
      [{ item_name: '🍕 DB Test Pizza', category: 'Test', price: 50 }], 
      50, 
      'Test Start', 'Test End'
    );
    
    res.send(`✅ Email sent to database user: ${user.email}`);
  } catch (error) {
    console.error(error);
    res.status(500).send('❌ Error: ' + error.message);
  }
});

// Auth Routes

// Register
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user
    const user = new User({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword
    });

    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Set cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    console.log(`✅ New user registered: ${user.email}`);

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Email already exists' });
    }
    res.status(500).json({ message: 'Error registering user', error: error.message });
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Find user
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Set cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    console.log(`✅ User logged in: ${user.email}`);

    res.json({
      message: 'Login successful',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Error logging in', error: error.message });
  }
});

// Logout
app.post('/api/auth/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Logged out successfully' });
});

// Get current user
app.get('/api/auth/me', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Error fetching user', error: error.message });
  }
});

app.get('/api/budgets', authenticateToken, async (req, res) => { // 👈 Fixed Path
  try {
    const budgets = await Budget.find({ user: req.user.userId }); // 👈 Fixed req.user.userId
    res.json(budgets);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/budgets', authenticateToken, async (req, res) => { // 👈 Fixed Path
  const { category, limit } = req.body;
  try {
    const budget = await Budget.findOneAndUpdate(
      { user: req.user.userId, category },
      { limit },
      { new: true, upsert: true } // Create if not exists
    );
    res.json(budget);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// GET all expenses for authenticated user
app.get('/api/expenses', authenticateToken, async (req, res) => {
  try {
    // ✅ FIX: Query by 'user', not 'userId'
    const expenses = await Expense.find({ user: req.user.userId })
      .sort({ date: -1 });
      
    console.log(`Fetched ${expenses.length} expenses for user: ${req.user.email}`);
    res.json(expenses);
  } catch (error) {
    console.error('Get expenses error:', error);
    res.status(500).json({ message: 'Error fetching expenses', error: error.message });
  }
});

// GET expenses by date range for authenticated user
app.get('/api/expenses/range', authenticateToken, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    if (!startDate || !endDate) {
      return res.status(400).json({ message: 'Start date and end date are required' });
    }

    const expenses = await Expense.find({
      user: req.user.userId,
      date: {
        $gte: startDate,
        $lte: endDate
      }
    }).sort({ createdAt: -1 });

    res.json(expenses);
  } catch (error) {
    console.error('Get expenses by range error:', error);
    res.status(500).json({ message: 'Error fetching expenses by date range', error: error.message });
  }
});

// // GET single expense by ID for authenticated user
// app.get('/api/expenses/:id', authenticateToken, async (req, res) => {
//   try {
//     if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
//       return res.status(400).json({ message: 'Invalid expense ID' });
//     }

//     const expense = await Expense.findOne({ 
//       _id: req.params.id, 
//       userId: req.user.userId 
//     });
    
//     if (!expense) {
//       return res.status(404).json({ message: 'Expense not found' });
//     }
    
//     res.json(expense);
//   } catch (error) {
//     console.error('Get expense error:', error);
//     res.status(500).json({ message: 'Error fetching expense', error: error.message });
//   }
// });


// GET single expense by ID
app.get('/api/expenses/:id', authenticateToken, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid expense ID' });
    }

    const expense = await Expense.findOne({ 
      _id: req.params.id, 
      user: req.user.userId  // ✅ FIX: Changed 'userId' to 'user'
    });
    
    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }
    
    res.json(expense);
  } catch (error) {
    console.error('Get expense error:', error);
    res.status(500).json({ message: 'Error fetching expense', error: error.message });
  }
});


// // POST create new expense for authenticated user
// app.post('/api/expenses', authenticateToken, async (req, res) => {
//   try {
//     const { item_name, category, price, date } = req.body;

//     // Validation
//     if (!item_name || !category || !price || !date) {
//       return res.status(400).json({ 
//         message: 'All fields are required: item_name, category, price, date' 
//       });
//     }

//     if (price < 0) {
//       return res.status(400).json({ message: 'Price cannot be negative' });
//     }

//     // Check if date is not in future
//     const expenseDate = new Date(date);
//     const today = new Date();
//     today.setHours(23, 59, 59, 999); // End of today

//     if (expenseDate > today) {
//       return res.status(400).json({ message: 'Cannot add expenses for future dates' });
//     }

//     const expense = new Expense({
//       userId: req.user.userId,
//       item_name: item_name.trim(),
//       category,
//       price: parseFloat(price),
//       date
//     });

//     await expense.save();

//     console.log(`💰 New expense added: ₹${price} for ${item_name} by ${req.user.email}`);
//     res.status(201).json(expense);
//   } catch (error) {
//     console.error('Create expense error:', error);
//     if (error.name === 'ValidationError') {
//       const messages = Object.values(error.errors).map(err => err.message);
//       return res.status(400).json({ message: messages.join(', ') });
//     }
//     res.status(400).json({ message: 'Error creating expense', error: error.message });
//   }
// });


// server.js

app.post('/api/expenses', authenticateToken, async (req, res) => {
  try {
    const { item_name, category, price, date } = req.body;

    // Validation
    if (!item_name || !category || !price || !date) {
      return res.status(400).json({ 
        message: 'All fields are required: item_name, category, price, date' 
      });
    }

    if (price < 0) {
      return res.status(400).json({ message: 'Price cannot be negative' });
    }

    const expenseDate = new Date(date);
    const today = new Date();
    today.setHours(23, 59, 59, 999); 

    if (expenseDate > today) {
      return res.status(400).json({ message: 'Cannot add expenses for future dates' });
    }

    const expense = new Expense({
      // ❌ OLD: userId: req.user.userId,
      // ✅ NEW: use 'user' to match your Schema
      user: req.user.userId, 
      item_name: item_name.trim(),
      category,
      price: parseFloat(price),
      date
    });

    await expense.save();

    console.log(`💰 New expense added: ₹${price} for ${item_name} by ${req.user.email}`);
    res.status(201).json(expense);
  } catch (error) {
    console.error('Create expense error:', error);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    res.status(400).json({ message: 'Error creating expense', error: error.message });
  }
});


// PUT update expense for authenticated user
app.put('/api/expenses/:id', authenticateToken, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid expense ID' });
    }

    const { item_name, category, price, date } = req.body;

    // Validation
    if (price && price < 0) {
      return res.status(400).json({ message: 'Price cannot be negative' });
    }

    // Check if date is not in future (if date is being updated)
    if (date) {
      const expenseDate = new Date(date);
      const today = new Date();
      today.setHours(23, 59, 59, 999);

      if (expenseDate > today) {
        return res.status(400).json({ message: 'Cannot set expense date to future' });
      }
    }

    const updateData = {};
    if (item_name) updateData.item_name = item_name.trim();
    if (category) updateData.category = category;
    if (price) updateData.price = parseFloat(price);
    if (date) updateData.date = date;

    const expense = await Expense.findOneAndUpdate(
      { _id: req.params.id, user: req.user.userId },
      updateData,
      { new: true, runValidators: true }
    );

    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    console.log(`✏️ Expense updated: ${expense.item_name} by ${req.user.email}`);
    res.json(expense);
  } catch (error) {
    console.error('Update expense error:', error);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    res.status(400).json({ message: 'Error updating expense', error: error.message });
  }
});

// DELETE expense for authenticated user
app.delete('/api/expenses/:id', authenticateToken, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid expense ID' });
    }

    const expense = await Expense.findOneAndDelete({ 
      _id: req.params.id, 
      user : req.user.userId 
    });
    
    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }
    
    console.log(`🗑️ Expense deleted: ${expense.item_name} by ${req.user.email}`);
    res.json({ message: 'Expense deleted successfully' });
  } catch (error) {
    console.error('Delete expense error:', error);
    res.status(500).json({ message: 'Error deleting expense', error: error.message });
  }
});

// GET expense statistics for authenticated user
app.get('/api/expenses/stats/summary', authenticateToken, async (req, res) => {
  try {
    const today = new Date();
    const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);
    
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59);

    const thirtyDaysAgo = new Date(today.getTime() - (30 * 24 * 60 * 60 * 1000));

    // Format dates for string comparison
    const todayStr = startOfToday.toISOString().split('T')[0];
    const monthStartStr = startOfMonth.toISOString().split('T')[0];
    const monthEndStr = endOfMonth.toISOString().split('T')[0];
    const thirtyDaysAgoStr = thirtyDaysAgo.toISOString().split('T')[0];
    const todayEndStr = today.toISOString().split('T')[0];

    // Today's expenses
    const todayExpenses = await Expense.find({
      user: req.user.userId,
      date: todayStr
    });

    // Monthly expenses
    const monthlyExpenses = await Expense.find({
      user: req.user.userId,
      date: {
        $gte: monthStartStr,
        $lte: monthEndStr
      }
    });

    // Last 30 days expenses
    const last30DaysExpenses = await Expense.find({
      user: req.user.userId,
      date: {
        $gte: thirtyDaysAgoStr,
        $lte: todayEndStr
      }
    });

    // Total expenses
    const totalExpenses = await Expense.find({ userId: req.user.userId });

    // Category breakdown for current month using aggregation
    const categoryBreakdown = await Expense.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(req.user.userId),
          date: {
            $gte: monthStartStr,
            $lte: monthEndStr
          }
        }
      },
      {
        $group: {
          _id: '$category',
          total: { $sum: '$price' },
          count: { $sum: 1 }
        }
      },
      { $sort: { total: -1 } }
    ]);

    const stats = {
      today: {
        total: todayExpenses.reduce((sum, exp) => sum + exp.price, 0),
        count: todayExpenses.length
      },
      monthly: {
        total: monthlyExpenses.reduce((sum, exp) => sum + exp.price, 0),
        count: monthlyExpenses.length
      },
      dailyAverage: last30DaysExpenses.reduce((sum, exp) => sum + exp.price, 0) / 30,
      total: {
        total: totalExpenses.reduce((sum, exp) => sum + exp.price, 0),
        count: totalExpenses.length
      },
      categoryBreakdown
    };

    res.json(stats);
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ message: 'Error fetching statistics', error: error.message });
  }
});

// Health check endpoint
app.get('/api/health', async (req, res) => {
  try {
    // Check database connection
    const dbState = mongoose.connection.readyState;
    const dbStatus = dbState === 1 ? 'Connected' : 'Disconnected';
    
    // Get basic stats
    const userCount = await User.countDocuments();
    const expenseCount = await Expense.countDocuments();

    res.json({ 
      status: 'OK', 
      message: 'Expense Tracker API is running with MongoDB',
      timestamp: new Date().toISOString(),
      database: {
        status: dbStatus,
        uri: MONGODB_URI.replace(/\/\/.*@/, '//***:***@'), // Hide credentials
      },
      stats: {
        totalUsers: userCount,
        totalExpenses: expenseCount
      }
    });
  } catch (error) {
    console.error('Health check error:', error);
    res.status(500).json({ 
      status: 'ERROR', 
      message: 'Database connection failed',
      error: error.message 
    });
  }
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});



// Start server
app.listen(PORT, () => {
  console.log('\n🚀 Server is running successfully!');
  console.log(`📍 Port: ${PORT}`);
  console.log(`🌐 API URL: http://localhost:${PORT}/api`);
  console.log(`🏥 Health check: http://localhost:${PORT}/api/health`);
  console.log(`💾 Database: MongoDB`);
  console.log(`🔐 Authentication: JWT with HTTP-only cookies`);
  console.log('\n📊 Features enabled:');
  console.log('  ✅ User registration and login');
  console.log('  ✅ Password hashing with bcrypt');
  console.log('  ✅ JWT authentication');
  console.log('  ✅ User-specific expense management');
  console.log('  ✅ Complete CRUD operations');
  console.log('  ✅ Statistics and analytics');
  console.log('  ✅ Data validation and error handling');
  console.log('\n🎯 Ready to accept requests!');
});
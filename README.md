# Expense Tracker Pro - MongoDB Edition

A complete full-stack expense tracking application with React frontend, Node.js backend, and MongoDB database with user authentication.

## Features

- 🔐 **User Authentication** - Secure signup/login with JWT tokens
- 👤 **User Management** - Individual user accounts with isolated data
- 📅 **Interactive Calendar** - Add expenses by clicking on dates
- 📊 **Real-time Statistics** - Daily, monthly, and total expense tracking
- 🎯 **Category Management** - Organize expenses by categories
- 📈 **Visual Charts** - Category breakdown with percentages
- 🔄 **CRUD Operations** - Create, read, update, delete expenses
- 💾 **MongoDB Database** - Secure and scalable data storage
- 🍪 **Session Management** - HTTP-only cookies for security
- 📱 **Responsive Design** - Works on all devices
- 🌙 **Dark/Light Mode** - Theme toggle with persistence

## Tech Stack

### Frontend
- React 18 with TypeScript
- Tailwind CSS for styling
- Lucide React for icons
- Date-fns for date handling
- Vite for development
- Context API for state management

### Backend
- Node.js with Express
- MongoDB with Mongoose
- JWT authentication
- bcrypt for password hashing
- CORS enabled
- RESTful API design

## Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local installation or MongoDB Atlas) - **REQUIRED**

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   The `.env` file is already created with default values:
   ```env
   MONGODB_URI=mongodb://localhost:27017/expense-tracker
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-2024
   PORT=5000
   VITE_API_URL=http://localhost:5000/api
   NODE_ENV=development
   ```

3. **Start MongoDB (REQUIRED):**
   - **Local MongoDB:** Make sure MongoDB is running on your system
   - **MongoDB Atlas:** Use your Atlas connection string in MONGODB_URI

4. **Start the backend server (MongoDB required):**
   ```bash
   npm run dev:mongodb
   ```
   Or for development with auto-restart:
   ```bash
   npm run server:mongodb
   ```

5. **Start the frontend (in a new terminal):**
   ```bash
   npm run dev
   ```

6. **Open your browser:**
   Navigate to `http://localhost:5173`
   - First time: You'll see the signup page
   - Create an account or login with existing credentials
   - Start tracking your expenses!

## MongoDB Setup Instructions

**⚠️ IMPORTANT: MongoDB is required for this application to work!**
### Option 1: Local MongoDB Installation

#### Windows:
1. Download MongoDB Community Server from [mongodb.com](https://www.mongodb.com/try/download/community)
2. Run the installer and follow the setup wizard
3. MongoDB will start automatically as a Windows service
4. Default connection: `mongodb://localhost:27017`

#### macOS:
```bash
# Using Homebrew
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb/brew/mongodb-community
```

#### Linux (Ubuntu/Debian):
```bash
# Import MongoDB public key
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -

# Add MongoDB repository
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list

# Install MongoDB
sudo apt-get update
sudo apt-get install -y mongodb-org

# Start MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod
```

### Option 2: MongoDB Atlas (Cloud)

1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free account
3. Create a new cluster
4. Get your connection string
5. Replace `MONGODB_URI` in `.env` with your Atlas connection string:
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/expense-tracker?retryWrites=true&w=majority
   ```

### Verify MongoDB Connection

Test your MongoDB connection:
```bash
# Check if MongoDB is running locally
mongosh

# Or test the API health endpoint
curl http://localhost:5000/api/health
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user info
### Expenses
- `GET /api/expenses` - Get all expenses
- `GET /api/expenses/:id` - Get single expense
- `POST /api/expenses` - Create new expense
- `PUT /api/expenses/:id` - Update expense
- `DELETE /api/expenses/:id` - Delete expense
- `GET /api/expenses/range?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD` - Get expenses by date range

### Statistics
- `GET /api/expenses/stats/summary` - Get expense statistics (user-specific)

### Health Check
- `GET /api/health` - API health status

## Database Schemas

### User Schema
```javascript
{
  name: String (required, min: 2 chars),
  email: String (required, unique, valid email),
  password: String (required, min: 6 chars, hashed),
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

### Expense Schema
```javascript
{
  userId: ObjectId (required, ref: User),
  item_name: String (required, max: 100 chars),
  category: String (required, enum),
  price: Number (required, min: 0, max: 1000000),
  date: String (required, YYYY-MM-DD format),
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

## Database Schema

```javascript
{
  userId: ObjectId (required),
  item_name: String (required),
  category: String (required, enum),
  price: Number (required, min: 0),
  date: Date (required),
  createdAt: Date (default: now),
  updatedAt: Date (default: now)
}
```

## Available Categories
- Food & Drinks
- Transport
- Entertainment
- Study Materials
- Health & Medical
- Shopping
- Bills & Utilities
- Other

## Development Scripts

```bash
npm run dev          # Start frontend development server
npm run server:mongodb # Start backend server with MongoDB
npm run dev:mongodb  # Start backend with nodemon (auto-restart)
npm run build        # Build for production
npm run preview      # Preview production build
```

## Project Structure

```
├── src/
│   ├── components/     # React components
│   ├── contexts/       # React context providers
│   ├── pages/          # Page components
│   ├── services/       # API service layer
│   └── main.tsx        # App entry point
├── .env               # Environment variables (created automatically)
├── server.js           # Express server
└── package.json       # Dependencies and scripts
```

## Security Features

- **Password Hashing** - bcrypt with salt rounds
- **JWT Tokens** - Secure authentication tokens
- **HTTP-only Cookies** - Prevents XSS attacks
- **Input Validation** - Server-side validation for all inputs
- **User Isolation** - Each user can only access their own data
- **Environment Variables** - Sensitive data stored securely

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error:**
   - Ensure MongoDB is running
   - Check connection string in `.env`
   - Verify network connectivity for Atlas

2. **Port Already in Use:**
   - Change PORT in `.env` file
   - Kill existing processes: `lsof -ti:5000 | xargs kill -9`

3. **CORS Issues:**
   - Ensure frontend and backend URLs match
   - Check VITE_API_URL in `.env`

4. **Dependencies Issues:**
   - Delete `node_modules` and `package-lock.json`
   - Run `npm install` again

5. **Authentication Issues:**
   - Clear browser cookies
   - Check JWT_SECRET in `.env`
   - Verify user exists in database
### MongoDB Troubleshooting

1. **Check MongoDB Status:**
   ```bash
   # Windows
   net start MongoDB
   
   # macOS/Linux
   brew services list | grep mongodb
   sudo systemctl status mongod
   ```

2. **Reset Database:**
   ```bash
   mongosh
   use expense-tracker
   db.dropDatabase()
   ```

3. **View Database Contents:**
   ```bash
   mongosh
   use expense-tracker
   db.users.find()
   db.expenses.find()
   ```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - feel free to use this project for learning and development!
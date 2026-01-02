import mongoose from 'mongoose' ;

// Expense Schema
const expenseSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: [true, 'User ID is required'],
    index: true
  },
  item_name: { 
    type: String, 
    required: [true, 'Item name is required'],
    trim: true,
    maxlength: [30, 'Item name cannot exceed 30 characters']
  },
  category: { 
    type: String, 
    required: [true, 'Category is required'],
   enum: [
      '🍔Food & Drinks',
      '🚗Transport',
      '🎉Entertainment',
      '📚Study Materials',
      '💊Health & Medical',
      '🛍️Shopping',
      '💡Bills & Utilities',
      '📝Other'
    ]
  },
  price: { 
    type: Number, 
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative'],
    validate: {
      validator: function(v) {
        return v >= 0 && v <= 1000000; // Max 10 lakh rupees
      },
      message: 'Price must be between 0 and 10,00,000'
    }
  },
  date: { 
    type: String, 
    required: [true, 'Date is required'],
    validate: {
      validator: function(v) {
        return /^\d{4}-\d{2}-\d{2}$/.test(v);
      },
      message: 'Date must be in YYYY-MM-DD format'
    }
  }
}, { 
  timestamps: true 
});

// Create compound indexes for better query performance
expenseSchema.index({ userId: 1, date: -1 });
expenseSchema.index({ userId: 1, category: 1 });
expenseSchema.index({ userId: 1, createdAt: -1 });

const Expense = mongoose.model('Expense', expenseSchema);

export default Expense;
import mongoose from 'mongoose';

const budgetSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  category: { 
    type: String, 
    required: true,
    // ✅ Match the Expense categories here too
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
  limit: { type: Number, required: true },    
}, { timestamps: true });

budgetSchema.index({ user: 1, category: 1 }, { unique: true });

const Budget = mongoose.model('Budget', budgetSchema);

export default Budget;
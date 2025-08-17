import React from 'react';
import { Clock, Trash2, Edit } from 'lucide-react';
import { format } from 'date-fns';
import { Expense } from '../contexts/ExpenseContext';
import { useExpenses } from '../contexts/ExpenseContext';

interface RecentExpensesProps {
  expenses: Expense[];
  onEditExpense: (expense: Expense) => void;
}

const RecentExpenses: React.FC<RecentExpensesProps> = ({ expenses, onEditExpense }) => {
  const { actions, state } = useExpenses();

  // Sorted, most recent first
  const recentExpenses = expenses
    .sort((a, b) => new Date(b.createdAt || b.date).getTime() - new Date(a.createdAt || a.date).getTime())
    .slice(0, 5); // still only 5? If you want all, remove this .slice!

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      await actions.deleteExpense(id);
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Food & Drinks': 'bg-green-100 text-green-800',
      'Transport': 'bg-blue-100 text-blue-800',
      'Entertainment': 'bg-purple-100 text-purple-800',
      'Study Materials': 'bg-orange-100 text-orange-800',
      'Health & Medical': 'bg-red-100 text-red-800',
      'Shopping': 'bg-pink-100 text-pink-800',
      'Bills & Utilities': 'bg-yellow-100 text-yellow-800',
      'Other': 'bg-gray-100 text-gray-800'
    };
    return colors[category] || colors['Other'];
  };

  return (
    <div className="bg-background rounded-2xl shadow-lg border border-border p-6 ">
      <div className="flex items-center gap-2 mb-6">
        <Clock className="w-5 h-5 text-muted-foreground" />
        <h3 className="text-lg font-semibold text-foreground">Recent Expenses</h3>
      </div>

      {recentExpenses.length === 0 ? (
        <div className="text-center py-8">
          <Clock className="w-12 h-12 text-muted mx-auto mb-3" />
          <p className="text-muted-foreground">No expenses yet</p>
        </div>
      ) : (
        // Container for scrolling: adjust max-h as needed
        <div className="space-y-4 max-h-80 overflow-y-auto pr-1">
          {recentExpenses.map((expense) => (
            <div
              key={expense.id}
              className="flex items-center justify-between p-3 bg-muted rounded-lg hover:bg-accent transition-colors"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-medium text-foreground text-sm">
                    {expense.item_name}
                  </h4>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(expense.category)}`}>
                    {expense.category}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  {format(new Date(expense.date), 'MMM d, yyyy')}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-foreground">
                  ₹{expense.price.toFixed(2)}
                </span>
                <button
                  onClick={() => onEditExpense(expense)}
                  disabled={state.loading}
                  className="p-1 text-muted-foreground hover:text-blue-500 transition-colors disabled:opacity-50"
                  title="Edit expense"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(expense._id || expense.id || '')}
                  disabled={state.loading}
                  className="p-1 text-muted-foreground hover:text-red-500 transition-colors disabled:opacity-50"
                  title="Delete expense"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecentExpenses;

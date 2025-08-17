import React from 'react';
import { PieChart, BarChart3 } from 'lucide-react';
import { Expense } from '../contexts/ExpenseContext';
import { format, startOfMonth, endOfMonth } from 'date-fns';

interface ExpenseChartProps {
  expenses: Expense[];
}

const ExpenseChart: React.FC<ExpenseChartProps> = ({ expenses }) => {
  const currentMonth = new Date();
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);

  // Filter expenses for current month
  const monthlyExpenses = expenses.filter(expense => {
    const expenseDate = new Date(expense.date);
    return expenseDate >= monthStart && expenseDate <= monthEnd;
  });

  // Group expenses by category
  const categoryTotals = monthlyExpenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.price;
    return acc;
  }, {} as Record<string, number>);

  const categories = Object.entries(categoryTotals)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5); // Top 5 categories

  const total = Object.values(categoryTotals).reduce((sum, amount) => sum + amount, 0);

  const colors = [
    'bg-blue-500',
    'bg-green-500',
    'bg-purple-500',
    'bg-orange-500',
    'bg-red-500'
  ];

  return (
    <div className="bg-background rounded-2xl shadow-lg border border-border p-6">
      <div className="flex items-center gap-2 mb-6">
        <PieChart className="w-5 h-5 text-muted-foreground" />
        <h3 className="text-lg font-semibold text-foreground">
          {format(currentMonth, 'MMMM')} Breakdown
        </h3>
      </div>

      {categories.length === 0 ? (
        <div className="text-center py-8">
          <BarChart3 className="w-12 h-12 text-muted mx-auto mb-3" />
          <p className="text-muted-foreground">No expenses this month</p>
        </div>
      ) : (
        <div className="space-y-4">
          {categories.map(([category, amount], index) => {
            const percentage = total > 0 ? (amount / total) * 100 : 0;
            return (
              <div key={category} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-foreground">{category}</span>
                  <span className="text-sm font-semibold text-foreground">
                    ₹{amount.toFixed(2)}
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${colors[index % colors.length]}`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <div className="text-xs text-muted-foreground text-right">
                  {percentage.toFixed(1)}%
                </div>
              </div>
            );
          })}
          
          <div className="pt-4 border-t border-border">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-foreground">Total</span>
              <span className="font-bold text-lg text-foreground">
                ₹{total.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpenseChart;
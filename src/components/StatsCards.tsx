import React from 'react';
import { TrendingUp, Calendar, IndianRupee , Target } from 'lucide-react';
import { Expense } from '../contexts/ExpenseContext';
import { format, startOfMonth, endOfMonth, startOfDay, endOfDay, subDays } from 'date-fns';

interface StatsCardsProps {
  expenses: Expense[];
}

const StatsCards: React.FC<StatsCardsProps> = ({ expenses }) => {
  const today = new Date();
  const currentMonth = new Date();
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);

  // Calculate today's expenses
  const todayExpenses = expenses.filter(expense => {
    const expenseDate = new Date(expense.date);
    return expenseDate >= startOfDay(today) && expenseDate <= endOfDay(today);
  });
  const todayTotal = todayExpenses.reduce((sum, expense) => sum + expense.price, 0);

  // Calculate monthly expenses
  const monthlyExpenses = expenses.filter(expense => {
    const expenseDate = new Date(expense.date);
    return expenseDate >= monthStart && expenseDate <= monthEnd;
  });
  const monthlyTotal = monthlyExpenses.reduce((sum, expense) => sum + expense.price, 0);

  // Calculate total expenses
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.price, 0);

  // Calculate daily average (last 30 days)
  const thirtyDaysAgo = subDays(today, 30);
  const last30DaysExpenses = expenses.filter(expense => {
    const expenseDate = new Date(expense.date);
    return expenseDate >= thirtyDaysAgo && expenseDate <= today;
  });
  const last30DaysTotal = last30DaysExpenses.reduce((sum, expense) => sum + expense.price, 0);
  const dailyAverage = last30DaysTotal / 30;

  const stats = [
    {
      title: "Today's Spending",
      value: `₹${todayTotal.toFixed(2)}`,
      icon: IndianRupee ,
      color: "from-green-500 to-emerald-600",
      bgColor: "bg-green-50",
      textColor: "text-green-700"
    },
    {
      title: "Monthly Total",
      value: `₹${monthlyTotal.toFixed(2)}`,
      icon: Calendar,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      textColor: "text-blue-700"
    },
    {
      title: "Daily Average",
      value: `₹${dailyAverage.toFixed(2)}`,
      icon: TrendingUp,
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
      textColor: "text-purple-700"
    },
    {
      title: "Total Spent",
      value: `₹${totalExpenses.toFixed(2)}`,
      icon: Target,
      color: "from-orange-500 to-red-600",
      bgColor: "bg-orange-50",
      textColor: "text-orange-700"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div
            key={index}
            className="bg-background rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-border"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">{stat.title}</p>
                <p className={`text-2xl font-bold ${stat.textColor}`}>{stat.value}</p>
              </div>
              <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                <Icon className={`w-6 h-6 ${stat.textColor}`} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StatsCards;
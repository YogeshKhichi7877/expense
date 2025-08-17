import React from 'react';
import { PieChart as PieChartIcon } from 'lucide-react';
import { Expense } from '../contexts/ExpenseContext';
import { format, startOfMonth, endOfMonth } from 'date-fns';

interface PieChartProps {
  expenses: Expense[];
}

const PieChart: React.FC<PieChartProps> = ({ expenses }) => {
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

  const categories = Object.entries(categoryTotals).sort(([, a], [, b]) => b - a);

  const total = Object.values(categoryTotals).reduce((sum, amount) => sum + amount, 0);

  // Tailwind theme-aware palette
  const colors = [
    'bg-blue-500 dark:bg-blue-400 fill-blue-500 dark:fill-blue-400',      // blue
    'bg-emerald-500 dark:bg-emerald-400 fill-emerald-500 dark:fill-emerald-400', // green
    'bg-violet-500 dark:bg-violet-400 fill-violet-500 dark:fill-violet-400', // purple
    'bg-orange-500 dark:bg-orange-400 fill-orange-500 dark:fill-orange-400', // orange
    'bg-red-500 dark:bg-red-400 fill-red-500 dark:fill-red-400',         // red
    'bg-pink-500 dark:bg-pink-400 fill-pink-500 dark:fill-pink-400',       // pink
    'bg-gray-500 dark:bg-gray-400 fill-gray-500 dark:fill-gray-400',       // gray
    'bg-cyan-500 dark:bg-cyan-400 fill-cyan-500 dark:fill-cyan-400',       // teal
  ];

  // Calculate angles for pie chart
  let currentAngle = 0;
  const segments = categories.map(([category, amount], index) => {
    const percentage = total > 0 ? (amount / total) * 100 : 0;
    const angle = (percentage / 100) * 360;
    const startAngle = currentAngle;
    const endAngle = currentAngle + angle;
    currentAngle += angle;

    // Calculate path for SVG arc
    const centerX = 100;
    const centerY = 100;
    const radius = 80;

    const startAngleRad = (startAngle * Math.PI) / 180;
    const endAngleRad = (endAngle * Math.PI) / 180;

    const x1 = centerX + radius * Math.cos(startAngleRad);
    const y1 = centerY + radius * Math.sin(startAngleRad);
    const x2 = centerX + radius * Math.cos(endAngleRad);
    const y2 = centerY + radius * Math.sin(endAngleRad);

    const largeArcFlag = angle > 180 ? 1 : 0;

    const pathData = [
      `M ${centerX} ${centerY}`,
      `L ${x1} ${y1}`,
      `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
      'Z'
    ].join(' ');

    return {
      category,
      amount,
      percentage,
      color: colors[index % colors.length],
      fill: colors[index % colors.length].split(' ').find(c => c.startsWith('fill-')) || '',
      pathData
    };
  });

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-lg border border-zinc-100 dark:border-zinc-800 p-4 md:p-6 w-full max-w-3xl ">
      <div className="flex items-center gap-2 mb-4 md:mb-6">
        <PieChartIcon className="w-5 h-5 text-zinc-600 dark:text-zinc-200" />
        <h3 className="text-lg md:text-xl font-semibold text-zinc-900 dark:text-zinc-100">
          Category Distribution - {format(currentMonth, 'MMMM')}
        </h3>
      </div>
      {categories.length === 0 ? (
        <div className="text-center py-8">
          <PieChartIcon className="w-12 h-12 text-zinc-300 dark:text-zinc-700 mx-auto mb-3" />
          <p className="text-zinc-500 dark:text-zinc-400">No expenses this month</p>
        </div>
      ) : (
        <div className="flex flex-col md:flex-row items-center gap-6 w-full">
          {/* Pie Chart SVG */}
          <div className="flex-shrink-0 flex items-center justify-center w-full md:w-auto">
            <svg
              width="200"
              height="200"
              viewBox="0 0 200 200"
              className="transform -rotate-90 transition-all duration-300"
            >
              {segments.map((segment, index) => (
                <path
                  key={segment.category}
                  d={segment.pathData}
                  className={`${segment.fill} transition-opacity cursor-pointer hover:opacity-80 focus:opacity-80`}
                  stroke="white"
                  strokeWidth="2"
                  tabIndex={0}
                />
              ))}
            </svg>
          </div>
          {/* Legend and Details */}
          <div className="flex-1 space-y-3 w-full">
            {segments.map((segment, index) => (
              <div key={segment.category} className="flex items-center justify-between w-full">
                <div className="flex items-center gap-3 min-w-0">
                  <span
                    className={`w-4 h-4 rounded-full block shrink-0 ${colors[index % colors.length].split(' ').find(c => c.startsWith('bg-'))}`}
                    style={{
                      border: '1.5px solid #e5e7eb', // Optional: light border for swatch
                    }}
                  />
                  <span className="text-sm font-medium text-zinc-700 dark:text-zinc-200 truncate max-w-[8rem] md:max-w-xs">
                    {segment.category}
                  </span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                    ₹{segment.amount.toFixed(2)}
                  </div>
                  <div className="text-xs text-zinc-500 dark:text-zinc-400">
                    {segment.percentage.toFixed(1)}%
                  </div>
                </div>
              </div>
            ))}
            <div className="pt-3 border-t border-zinc-100 dark:border-zinc-700">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-zinc-900 dark:text-zinc-100">Total</span>
                <span className="font-bold text-lg text-zinc-900 dark:text-zinc-100">
                  ₹{total.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PieChart;

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, isAfter, startOfDay } from 'date-fns';
import { Expense } from '../contexts/ExpenseContext';

interface ExpenseCalendarProps {
  expenses: Expense[];
  onDateSelect: (date: Date) => void;
}

const ExpenseCalendar: React.FC<ExpenseCalendarProps> = ({ expenses, onDateSelect }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getExpensesForDate = (date: Date) => {
    return expenses.filter(expense => isSameDay(new Date(expense.date), date));
  };

  const getTotalForDate = (date: Date) => {
    const dayExpenses = getExpensesForDate(date);
    return dayExpenses.reduce((sum, expense) => sum + expense.price, 0);
  };

  const previousMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));

  return (
    <div className="bg-background rounded-2xl shadow-lg border border-border overflow-hidden">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-foreground">Expense Calendar</h2>
          <div className="flex items-center space-x-4">
            <button
              onClick={previousMonth}
              className="p-2 hover:bg-accent rounded-lg transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-muted-foreground" />
            </button>
            <h3 className="text-lg font-semibold text-foreground min-w-[140px] text-center">
              {format(currentMonth, 'MMMM yyyy')}
            </h3>
            <button
              onClick={nextMonth}
              className="p-2 hover:bg-accent rounded-lg transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-7 gap-2 mb-4">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-center text-sm font-medium text-muted-foreground py-2">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-2">
          {days.map(day => {
            const dayExpenses = getExpensesForDate(day);
            const total = getTotalForDate(day);
            const isToday = isSameDay(day, new Date());
            const isFutureDate = isAfter(startOfDay(day), startOfDay(new Date()));
            const hasExpenses = dayExpenses.length > 0;

            return (
              <div
                key={day.toISOString()}
                className={`
                  relative min-h-[80px] p-2 rounded-lg border-2 transition-all duration-200
                  ${isToday 
                    ? 'border-blue-500 bg-blue-50' 
                    : isFutureDate
                      ? 'border-border bg-muted cursor-not-allowed opacity-50'
                    : hasExpenses 
                      ? 'border-green-200 bg-green-50 hover:border-green-300 cursor-pointer dark:bg-green-900/20 dark:border-green-800' 
                      : 'border-border hover:border-accent-foreground hover:bg-accent cursor-pointer'
                  }
                `}
                onClick={() => !isFutureDate && onDateSelect(day)}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-sm font-medium ${
                    isToday ? 'text-blue-700' : 
                    isFutureDate ? 'text-muted-foreground' :
                    isSameMonth(day, currentMonth) ? 'text-foreground' : 'text-muted-foreground'
                  }`}>
                    {format(day, 'd')}
                  </span>
                  {!isFutureDate && (
                    <Plus className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  )}
                </div>
                
                {hasExpenses && (
                  <div className="mt-1">
                    <div className="text-xs font-semibold text-green-700">
                      ₹{total.toFixed(0)}
                    </div>
                    <div className="text-xs text-green-600">
                      {dayExpenses.length} item{dayExpenses.length !== 1 ? 's' : ''}
                    </div>
                  </div>
                )}
                
                {isFutureDate && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xs text-muted-foreground font-medium">Future</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ExpenseCalendar;
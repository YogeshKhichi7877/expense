

import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import StatsCards from '../components/StatsCards';
import ExpenseCalendar from '../components/ExpenseCalendar';
import ExpenseModal from '../components/ExpenseModal';
import ExpenseChart from '../components/ExpenseChart';
import RecentExpenses from '../components/RecentExpenses';
import PieChart from '../components/PieChart';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { useExpenses, Expense } from '../contexts/ExpenseContext';
import BudgetCards from '../components/BudgetCards'; // ✅ Fixed typo here
import Footer from '../components/Footer';

const Dashboard: React.FC = () => {
  const { state, actions } = useExpenses();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

  useEffect(() => {
    actions.loadExpenses();
  }, []);

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setEditingExpense(null);
    setIsModalOpen(true);
  };

  const handleEditExpense = (expense: Expense) => {
    setEditingExpense(expense);
    setSelectedDate(new Date(expense.date));
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingExpense(null);
  };

  if (state.loading && state.expenses.length === 0) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-background to-purple-50 dark:from-gray-900 dark:via-background dark:to-gray-800">
      <Header onAddExpense={() => {
        setEditingExpense(null);
        setSelectedDate(new Date());
        setIsModalOpen(true);
      }} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {state.error && <ErrorMessage message={state.error} />}
        
        {/* Top Stats */}
        <StatsCards expenses={state.expenses} />
        
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Calendar Section */}
          <div className="xl:col-span-2">
            <ExpenseCalendar
              expenses={state.expenses}
              onDateSelect={handleDateSelect}
            />
          </div>

          {/* Sidebar: Charts & Recent */}
          <div className="space-y-8"> {/* Increased spacing for better look */}
            <ExpenseChart expenses={state.expenses} />
            <RecentExpenses 
              expenses={state.expenses} 
              onEditExpense={handleEditExpense}
            />
          </div>
        </div>

        {/* Bottom Section: Budgets & Pie Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <BudgetCards /> {/* ✅ Placed Budget Cards here */}
          </div>
          <div>
            <PieChart expenses={state.expenses} />
          </div>
        </div>
        
      </main>
       
      <ExpenseModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        selectedDate={selectedDate}
        editingExpense={editingExpense}
        loading={state.loading}
      />
      <Footer />
    </div>
  );
};

export default Dashboard;
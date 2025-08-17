import React from 'react';
import { Wallet, Plus, Sun, Moon, LogOut, User } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
// import { useAuth } from '../contexts/AuthContext';
import { useAuth } from '../contexts/AuthContext';

interface HeaderProps {
  onAddExpense: () => void;
}

const Header: React.FC<HeaderProps> = ({ onAddExpense }) => {
  const { theme, toggleTheme } = useTheme();
  const { state, logout } = useAuth();

  const handleLogout = async () => {
    if (window.confirm('Are you sure you want to logout?')) {
      await logout();
    }
  };

  return (
    <header className="bg-background/80 backdrop-blur-sm border-b border-border shadow-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg">
              <Wallet className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                ExpenseTracker Pro
              </h1>
              <p className="text-sm text-muted-foreground">Smart expense management made simple</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {/* User Info */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-2 bg-secondary rounded-lg">
              <User className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium text-foreground">
                {state.user?.name}
              </span>
            </div>

            <button
              onClick={toggleTheme}
              className="p-3 rounded-xl bg-secondary hover:bg-accent transition-colors duration-200 shadow-sm"
              title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            >
              {theme === 'light' ? (
                <Moon className="w-5 h-5 text-foreground" />
              ) : (
                <Sun className="w-5 h-5 text-foreground" />
              )}
            </button>

            <button
              onClick={onAddExpense}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 hover:from-blue-700 hover:to-purple-700"
            >
              <Plus className="w-5 h-5" />
              Add Expense
            </button>

            <button
              onClick={handleLogout}
              className="p-3 rounded-xl bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/30 transition-colors duration-200 shadow-sm text-red-600 dark:text-red-400"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
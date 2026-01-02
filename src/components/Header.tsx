// import React from 'react';
// import { Wallet, Plus, Sun, Moon, LogOut, User } from 'lucide-react';
// import { useTheme } from '../contexts/ThemeContext';
// // import { useAuth } from '../contexts/AuthContext';
// import { useAuth } from '../contexts/AuthContext';

// interface HeaderProps {
//   onAddExpense: () => void;
// }

// const Header: React.FC<HeaderProps> = ({ onAddExpense }) => {
//   const { theme, toggleTheme } = useTheme();
//   const { state, logout } = useAuth();

//   const handleLogout = async () => {
//     if (window.confirm('Are you sure you want to logout?')) {
//       await logout();
//     }
//   };

//   return (
//     <header className="bg-background/80 backdrop-blur-sm border-b border-border shadow-sm sticky top-0 z-40">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
//         <div className="flex items-center justify-between">
//           <div className="flex items-center space-x-3">
//             <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg">
//               <Wallet className="w-7 h-7 text-white" />
//             </div>
//             <div>
//               <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
//                 ExpenseTracker Pro
//               </h1>
//               <p className="text-sm text-muted-foreground">Smart expense management made simple</p>
//             </div>
//           </div>
//           <div className="flex items-center gap-3">
//             {/* User Info */}
//             <div className="hidden sm:flex items-center gap-2 px-3 py-2 bg-secondary rounded-lg">
//               <User className="w-4 h-4 text-muted-foreground" />
//               <span className="text-sm font-medium text-foreground">
//                 {state.user?.name}
//               </span>
//             </div>

//             <button
//               onClick={toggleTheme}
//               className="p-3 rounded-xl bg-secondary hover:bg-accent transition-colors duration-200 shadow-sm"
//               title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
//             >
//               {theme === 'light' ? (
//                 <Moon className="w-5 h-5 text-foreground" />
//               ) : (
//                 <Sun className="w-5 h-5 text-foreground" />
//               )}
//             </button>

//             <button
//               onClick={onAddExpense}
//               className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 hover:from-blue-700 hover:to-purple-700"
//             >
//               <Plus className="w-5 h-5" />
//               Add Expense
//             </button>

//             <button
//               onClick={handleLogout}
//               className="p-3 rounded-xl bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/30 transition-colors duration-200 shadow-sm text-red-600 dark:text-red-400"
//               title="Logout"
//             >
//               <LogOut className="w-5 h-5" />
//             </button>
//           </div>
//         </div>
//       </div>
//     </header>
//   );
// };

// export default Header;


























// import React from 'react';
// import { Wallet, Plus, Sun, Moon, LogOut, User } from 'lucide-react';
// import { useTheme } from '../contexts/ThemeContext';
// import { useAuth } from '../contexts/AuthContext';
// // 1. Import your custom toast functions
// import { showSuccess, showError } from '../components/customToast';

// interface HeaderProps {
//   onAddExpense: () => void;
// }

// const Header: React.FC<HeaderProps> = ({ onAddExpense }) => {
//   const { theme, toggleTheme } = useTheme();
//   const { state, logout } = useAuth();

//   const handleLogout = async () => {
//     // Keep the confirmation dialog to prevent accidental clicks
//     if (window.confirm('Are you sure you want to logout?')) {
//       try {
//         await logout();
        
//         // 2. Show Success Toast
//         showSuccess('Logged out successfully. See you soon! 👋');
        
//       } catch (error) {
//         console.error("Logout failed", error);
        
//         // 3. Show Error Toast if something goes wrong
//         showError('Failed to logout. Please try again.');
//       }
//     }
//   };

//   return (
//     <header className="bg-background/80 backdrop-blur-sm border-b border-border shadow-sm sticky top-0 z-40">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
//         <div className="flex items-center justify-between">
//           <div className="flex items-center space-x-3">
//             <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg">
//               <Wallet className="w-7 h-7 text-white" />
//             </div>
//             <div>
//               <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
//                 ExpenseTracker
//               </h1>
//               <p className="text-sm text-muted-foreground">Smart expense management made simple</p>
//             </div>
//           </div>
//           <div className="flex items-center gap-3">
//             {/* User Info */}
//             <div className="hidden sm:flex items-center gap-2 px-3 py-2 bg-secondary rounded-lg">
//               <User className="w-4 h-4 text-muted-foreground" />
//               <span className="text-sm font-medium text-foreground">
//                 {state.user?.name}
//               </span>
//             </div>

//             <button
//               onClick={toggleTheme}
//               className="p-3 rounded-xl bg-secondary hover:bg-accent transition-colors duration-200 shadow-sm"
//               title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
//             >
//               {theme === 'light' ? (
//                 <Moon className="w-5 h-5 text-foreground" />
//               ) : (
//                 <Sun className="w-5 h-5 text-foreground" />
//               )}
//             </button>

//             <button
//               onClick={onAddExpense}
//               className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 hover:from-blue-700 hover:to-purple-700"
//             >
//               <Plus className="w-5 h-5" />
//               Add Expense
//             </button>

//             <button
//               onClick={handleLogout}
//               className="p-3 rounded-xl bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/30 transition-colors duration-200 shadow-sm text-red-600 dark:text-red-400"
//               title="Logout"
//             >
//               <LogOut className="w-5 h-5" />
//             </button>
//           </div>
//         </div>
//       </div>
//     </header>
//   );
// };

// export default Header;









import React from 'react';
import { Plus, Sun, Moon, LogOut, User } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { showSuccess, showError } from '../components/customToast';

// 1. Import your new logo (ensure the path matches where you saved image_d2fe49.jpg)
import fullLogo from '/expense.png'; 

interface HeaderProps {
  onAddExpense: () => void;
}

const Header: React.FC<HeaderProps> = ({ onAddExpense }) => {
  const { theme, toggleTheme } = useTheme();
  const { state, logout } = useAuth();

  const handleLogout = async () => {
    if (window.confirm('Are you sure you want to logout?')) {
      try {
        await logout();
        showSuccess('Logged out successfully. See you soon! 👋');
      } catch (error) {
        console.error("Logout failed", error);
        showError('Failed to logout. Please try again.');
      }
    }
  };

  return (
    <header className="bg-background/80 backdrop-blur-sm border-b border-border shadow-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between">
          
          {/* Brand Section */}
          <div className="flex flex-col">
            <img 
              src={fullLogo} 
              alt="Expense Tracker" 
              className="h-12 w-auto object-contain" // Set height and let width adjust automatically
            />
            <p className="text-[10px] sm:text-xs text-muted-foreground ml-1 mt-[-4px]">
              Smart expense management made simple
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* User Info - Desktop only */}
            <div className="hidden md:flex items-center gap-2 px-3 py-2 bg-secondary rounded-lg">
              <User className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium text-foreground">
                {state.user?.name}
              </span>
            </div>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl bg-secondary hover:bg-accent transition-colors shadow-sm"
              title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            >
              {theme === 'light' ? (
                <Moon className="w-5 h-5 text-foreground" />
              ) : (
                <Sun className="w-5 h-5 text-foreground" />
              )}
            </button>

            {/* Add Expense Button */}
            <button
              onClick={onAddExpense}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 sm:px-6 py-2.5 rounded-xl font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              <Plus className="w-5 h-5" />
              <span className="hidden sm:inline">Add Expense</span>
            </button>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="p-2.5 rounded-xl bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/30 transition-colors shadow-sm text-red-600 dark:text-red-400"
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
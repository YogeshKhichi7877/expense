// import React, { useEffect, useState } from 'react';
// import { apiService, Budget, Expense } from '../services/api';
// import { useExpenses } from '../contexts/ExpenseContext';

// // The categories must match your Backend Model exactly
// const CATEGORIES = [
//   '🍔Food & Drinks',
//   '🚗Transport',
//   '🎉Entertainment',
//   '📚Study Materials',
//   '💊Health & Medical',
//   '🛍️Shopping',
//   '💡Bills & Utilities',
//   '📝Other'
// ];

// const BudgetCards: React.FC = () => {
//   const { state } = useExpenses(); // Get current expenses to calculate spending
//   const [budgets, setBudgets] = useState<Budget[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [showForm, setShowForm] = useState(false);
  
//   // Form State
//   const [selectedCategory, setSelectedCategory] = useState(CATEGORIES[0]);
//   const [amount, setAmount] = useState('');
//   const [submitting, setSubmitting] = useState(false);

//   // 1. Fetch Budgets on Load
//   const fetchBudgets = async () => {
//     try {
//       const data = await apiService.getBudgets();
//       setBudgets(data);
//     } catch (error) {
//       console.error("Failed to load budgets", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchBudgets();
//   }, []);

//   // 2. Calculate Progress (Spent vs Limit)
//   const getProgress = (category: string, limit: number) => {
//     // Filter expenses for this category that happened in the current month
//     const now = new Date();
//     const currentMonth = now.getMonth();
//     const currentYear = now.getFullYear();

//     const spent = state.expenses
//       .filter(e => {
//         const d = new Date(e.date);
//         return e.category === category && d.getMonth() === currentMonth && d.getFullYear() === currentYear;
//       })
//       .reduce((sum, e) => sum + e.price, 0);

//     const percent = Math.min((spent / limit) * 100, 100);
//     return { spent, percent };
//   };

//   // 3. Handle Form Submit
//   const handleSetBudget = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!amount) return;
    
//     setSubmitting(true);
//     try {
//       await apiService.setBudget(selectedCategory, parseFloat(amount));
//       await fetchBudgets(); // Refresh list
//       setShowForm(false);   // Close form
//       setAmount('');        // Reset input
//     } catch (error) {
//       console.error("Failed to set budget", error);
//       alert("Failed to save budget. Please try again.");
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   if (loading) return <div className="p-4 bg-white dark:bg-gray-800 rounded-2xl shadow-sm animate-pulse h-40"></div>;

//   return (
//     <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
      
//       {/* Header with Add Button */}
//       <div className="flex justify-between items-center mb-6">
//         <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Monthly Budgets</h3>
//         <button 
//           onClick={() => setShowForm(!showForm)}
//           className="p-2 text-sm bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors font-medium flex items-center gap-1"
//         >
//           {showForm ? 'Cancel' : '+ Set Budget'}
//         </button>
//       </div>

//       {/* Add Budget Form */}
//       {showForm && (
//         <form onSubmit={handleSetBudget} className="mb-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-200 dark:border-gray-600">
//           <div className="grid grid-cols-1 gap-3">
//             <div>
//               <label className="block text-xs font-medium text-gray-500 mb-1">Category</label>
//               <select 
//                 value={selectedCategory}
//                 onChange={(e) => setSelectedCategory(e.target.value)}
//                 className="w-full p-2 text-sm rounded-lg border border-gray-300 dark:bg-gray-800 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
//               >
//                 {CATEGORIES.map(cat => (
//                   <option key={cat} value={cat}>{cat}</option>
//                 ))}
//               </select>
//             </div>
//             <div>
//               <label className="block text-xs font-medium text-gray-500 mb-1">Limit Amount (₹)</label>
//               <input 
//                 type="number" 
//                 value={amount}
//                 onChange={(e) => setAmount(e.target.value)}
//                 placeholder="e.g. 5000"
//                 className="w-full p-2 text-sm rounded-lg border border-gray-300 dark:bg-gray-800 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
//                 required
//               />
//             </div>
//             <button 
//               type="submit" 
//               disabled={submitting}
//               className="w-full mt-2 py-2 px-4 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-all"
//             >
//               {submitting ? 'Saving...' : 'Save Budget'}
//             </button>
//           </div>
//         </form>
//       )}

//       {/* Budget List */}
//       <div className="space-y-4">
//         {budgets.length === 0 && !showForm ? (
//           <p className="text-sm text-gray-500 text-center py-4">No budgets set yet.</p>
//         ) : (
//           budgets.map((budget) => {
//             const { spent, percent } = getProgress(budget.category, budget.limit);
//             const isOver = spent > budget.limit;
            
//             return (
//               <div key={budget._id} className="group">
//                 <div className="flex justify-between items-end mb-1">
//                   <div>
//                     <span className="text-sm font-medium text-gray-700 dark:text-gray-200">{budget.category}</span>
//                     <div className="text-xs text-gray-500 mt-0.5">
//                       ₹{spent.toLocaleString()} spent of <span className="font-semibold text-gray-700 dark:text-gray-300">₹{budget.limit.toLocaleString()}</span>
//                     </div>
//                   </div>
//                   <span className={`text-xs font-bold ${isOver ? 'text-red-500' : 'text-gray-500'}`}>
//                     {Math.round(percent)}%
//                   </span>
//                 </div>
                
//                 {/* Progress Bar */}
//                 <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
//                   <div 
//                     className={`h-full rounded-full transition-all duration-500 ${
//                       isOver ? 'bg-red-500' : 
//                       percent > 80 ? 'bg-yellow-500' : 'bg-blue-500'
//                     }`}
//                     style={{ width: `${percent}%` }}
//                   />
//                 </div>
//               </div>
//             );
//           })
//         )}
//       </div>
//     </div>
//   );
// };

// export default BudgetCards;














import React, { useEffect, useState } from 'react';
import { apiService, Budget } from '../services/api';
import { useExpenses } from '../contexts/ExpenseContext';
// 1. Import your custom toast functions
import { showSuccess, showError } from '../components/customToast'; 

// The categories must match your Backend Model exactly
const CATEGORIES = [
  '🍔Food & Drinks',
  '🚗Transport',
  '🎉Entertainment',
  '📚Study Materials',
  '💊Health & Medical',
  '🛍️Shopping',
  '💡Bills & Utilities',
  '📝Other'
];

const BudgetCards: React.FC = () => {
  const { state } = useExpenses(); // Get current expenses to calculate spending
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  
  // Form State
  const [selectedCategory, setSelectedCategory] = useState(CATEGORIES[0]);
  const [amount, setAmount] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // 1. Fetch Budgets on Load
  const fetchBudgets = async () => {
    try {
      const data = await apiService.getBudgets();
      setBudgets(data);
    } catch (error) {
      console.error("Failed to load budgets", error);
      // Optional: showError("Could not load budgets");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBudgets();
  }, []);

  // 2. Calculate Progress (Spent vs Limit)
  const getProgress = (category: string, limit: number) => {
    // Filter expenses for this category that happened in the current month
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const spent = state.expenses
      .filter(e => {
        const d = new Date(e.date);
        return e.category === category && d.getMonth() === currentMonth && d.getFullYear() === currentYear;
      })
      .reduce((sum, e) => sum + e.price, 0);

    const percent = Math.min((spent / limit) * 100, 100);
    return { spent, percent };
  };

  // 3. Handle Form Submit
  const handleSetBudget = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount) return;
    
    setSubmitting(true);
    try {
      await apiService.setBudget(selectedCategory, parseFloat(amount));
      
      // ✅ Success Toast
      showSuccess('Budget saved successfully!');
      
      await fetchBudgets(); // Refresh list
      setShowForm(false);   // Close form
      setAmount('');        // Reset input
    } catch (error) {
      console.error("Failed to set budget", error);
      
      // ✅ Error Toast
      showError("Failed to save budget. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="p-4 bg-white dark:bg-gray-800 rounded-2xl shadow-sm animate-pulse h-40"></div>;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
      
      {/* Header with Add Button */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Monthly Budgets</h3>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="p-2 text-sm bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors font-medium flex items-center gap-1"
        >
          {showForm ? 'Cancel' : '+ Set Budget'}
        </button>
      </div>

      {/* Add Budget Form */}
      {showForm && (
        <form onSubmit={handleSetBudget} className="mb-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-200 dark:border-gray-600">
          <div className="grid grid-cols-1 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Category</label>
              <select 
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full p-2 text-sm rounded-lg border border-gray-300 dark:bg-gray-800 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
              >
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Limit Amount (₹)</label>
              <input 
                type="number" 
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="e.g. 5000"
                className="w-full p-2 text-sm rounded-lg border border-gray-300 dark:bg-gray-800 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
            </div>
            <button 
              type="submit" 
              disabled={submitting}
              className="w-full mt-2 py-2 px-4 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-all"
            >
              {submitting ? 'Saving...' : 'Save Budget'}
            </button>
          </div>
        </form>
      )}

      {/* Budget List */}
      <div className="space-y-4">
        {budgets.length === 0 && !showForm ? (
          <p className="text-sm text-gray-500 text-center py-4">No budgets set yet.</p>
        ) : (
          budgets.map((budget) => {
            const { spent, percent } = getProgress(budget.category, budget.limit);
            const isOver = spent > budget.limit;
            
            return (
              <div key={budget._id} className="group">
                <div className="flex justify-between items-end mb-1">
                  <div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-200">{budget.category}</span>
                    <div className="text-xs text-gray-500 mt-0.5">
                      ₹{spent.toLocaleString()} spent of <span className="font-semibold text-gray-700 dark:text-gray-300">₹{budget.limit.toLocaleString()}</span>
                    </div>
                  </div>
                  <span className={`text-xs font-bold ${isOver ? 'text-red-500' : 'text-gray-500'}`}>
                    {Math.round(percent)}%
                  </span>
                </div>
                
                {/* Progress Bar */}
                <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${
                      isOver ? 'bg-red-500' : 
                      percent > 80 ? 'bg-yellow-500' : 'bg-blue-500'
                    }`}
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default BudgetCards;
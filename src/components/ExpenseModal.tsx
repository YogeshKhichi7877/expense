// import React, { useState, useEffect } from 'react';
// import { X, Tag, Calendar, FileText, Edit } from 'lucide-react';
// import { format, isAfter, startOfDay } from 'date-fns';
// import { useExpenses, Expense } from '../contexts/ExpenseContext';
// import {toast } from 'react-hot-toast'

// interface ExpenseModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   selectedDate: Date;
//   editingExpense?: Expense | null;
//   loading?: boolean;
// }

// const categories = [
//   '🍔Food & Drinks',
//   '🚗Transport',
//   '🎉Entertainment',
//   '📚Study Materials',
//   '💊Health & Medical',
//   '🛍️Shopping',
//   '💡Bills & Utilities',
//   '📝Other'
// ];

// const ExpenseModal: React.FC<ExpenseModalProps> = ({ 
//   isOpen, 
//   onClose, 
//   selectedDate, 
//   editingExpense = null,
//   loading = false 
// }) => {
//   const { actions } = useExpenses();
//   const [formData, setFormData] = useState({
//     item_name: '',
//     category: '🍔Food & Drinks',
//     price: '',
//     date: format(selectedDate, 'yyyy-MM-dd')
//   });
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   // Update form when editing expense or selected date changes
//   useEffect(() => {
//     if (isOpen) {
//       if (editingExpense) {
//         setFormData({
//           item_name: editingExpense.item_name,
//           category: editingExpense.category,
//           price: editingExpense.price.toString(),
//           date: format(new Date(editingExpense.date), 'yyyy-MM-dd')
//         });
//       } else {
//         setFormData({
//           item_name: '',
//           category: 'Food & Drinks',
//           price: '',
//           date: format(selectedDate, 'yyyy-MM-dd')
//         });
//       }
//     }
//   }, [selectedDate, isOpen, editingExpense]);

//   const isFutureDate = isAfter(startOfDay(selectedDate), startOfDay(new Date()));

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
    
//     if (!formData.item_name || !formData.price) {
//       return;
//     }

//     if (isFutureDate) {
//       toast('Cannot add expenses for future dates!');
//       return;
//     }

//     setIsSubmitting(true);

//     try {
//       if (editingExpense) {
//         await actions.updateExpense(editingExpense._id || editingExpense.id || '', {
//           item_name: formData.item_name,
//           category: formData.category,
//           price: parseFloat(formData.price),
//           date: formData.date
//         });
//       } else {
//         await actions.addExpense({
//           item_name: formData.item_name,
//           category: formData.category,
//           price: parseFloat(formData.price),
//           date: formData.date
//         });
//       }

//       // Reset form
//       setFormData({
//         item_name: '',
//         category: 'Food & Drinks',
//         price: '',
//         date: format(selectedDate, 'yyyy-MM-dd')
//       });
      
//       onClose();
//     } catch (error) {
//       console.error('Error adding expense:', error);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleSubmitOld = (e: React.FormEvent) => {
//     e.preventDefault();
    
//     if (!formData.item_name || !formData.price) {
//       return;
//     }

//     const expense = {
//       id: Date.now().toString(),
//       item_name: formData.item_name,
//       category: formData.category,
//       price: parseFloat(formData.price),
//       date: formData.date,
//       createdAt: new Date()
//     };

//     //dispatch({ type: 'ADD_EXPENSE', payload: expense });
    
//     // Reset form
//     setFormData({
//       item_name: '',
//       category: 'Food & Drinks',
//       price: '',
//       date: format(selectedDate, 'yyyy-MM-dd')
//     });
    
//     onClose();
//   };

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//     setFormData(prev => ({
//       ...prev,
//       [e.target.name]: e.target.value
//     }));
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
//       <div className="bg-background rounded-2xl shadow-2xl w-full max-w-md border border-border">
//         <div className="flex items-center justify-between p-6 border-b border-border">
//           <div className="flex items-center gap-2">
//             {editingExpense ? (
//               <Edit className="w-5 h-5 text-primary" />
//             ) : (
//               <FileText className="w-5 h-5 text-primary" />
//             )}
//             <h2 className="text-xl font-bold text-foreground">
//               {isFutureDate 
//                 ? 'Cannot Add Future Expense' 
//                 : editingExpense 
//                   ? 'Update Expense' 
//                   : 'Add New Expense'
//               }
//             </h2>
//           </div>
//           <button
//             onClick={onClose}
//             className="p-2 hover:bg-accent rounded-lg transition-colors"
//           >
//             <X className="w-5 h-5 text-muted-foreground" />
//           </button>
//         </div>

//         {isFutureDate && (
//           <div className="p-6 border-b border-border">
//             <div className="bg-red-50 border border-red-200 rounded-lg p-4">
//               <p className="text-red-700 text-sm">
//                 You cannot add expenses for future dates. Please select today's date or a past date.
//               </p>
//             </div>
//           </div>
//         )}

//         <form onSubmit={handleSubmit} className="p-6 space-y-6">
//           <div>
//             <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
//               <FileText className="w-4 h-4" />
//               Item Name
//             </label>
//             <input
//               type="text"
//               name="item_name"
//               value={formData.item_name}
//               onChange={handleChange}
//               placeholder="Enter item name"
//               disabled={isFutureDate}
//               className="w-full px-4 py-3 border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent transition-all bg-background text-foreground"
//               required
//             />
//           </div>

//           <div>
//             <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
//               <Tag className="w-4 h-4" />
//               Category
//             </label>
//             <select
//               name="category"
//               value={formData.category}
//               onChange={handleChange}
//               disabled={isFutureDate}
//               className="w-full px-4 py-3 border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent transition-all bg-background text-foreground"
//             >
//               {categories.map(category => (
//                 <option key={category} value={category}>
//                   {category}
//                 </option>
//               ))}
//             </select>
//           </div>

//           <div>
//             <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
//               <span className="w-4 h-4 text-center font-bold">₹</span>
//               Amount
//             </label>
//             <input
//               type="number"
//               name="price"
//               value={formData.price}
//               onChange={handleChange}
//               placeholder="0.00"
//               step="1"
//               min="0"
//               disabled={isFutureDate}
//               className="w-full px-4 py-3 border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent transition-all bg-background text-foreground"
//               required
//             />
//           </div>

//           <div>
//             <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
//               <Calendar className="w-4 h-4" />
//               Date
//             </label>
//             <input
//               type="date"
//               name="date"
//               value={formData.date}
//               onChange={handleChange}
//               max={format(new Date(), 'yyyy-MM-dd')}
//               disabled={isFutureDate}
//               className="w-full px-4 py-3 border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent transition-all bg-background text-foreground"
//               required
//             />
//           </div>

//           <div className="flex gap-3 pt-4">
//             <button
//               type="button"
//               onClick={onClose}
//               className="flex-1 px-4 py-3 border border-input text-foreground rounded-lg hover:bg-accent transition-colors font-medium"
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               disabled={isSubmitting || loading || isFutureDate}
//               className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               {isFutureDate ? 'Future Date' : isSubmitting ? (editingExpense ? 'Updating...' : 'Adding...') : (editingExpense ? 'Update Expense' : 'Add Expense')}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default ExpenseModal;
















// import React, { useState, useEffect } from 'react';
// import { X, Tag, Calendar, FileText, Edit } from 'lucide-react';
// import { format, isAfter, startOfDay } from 'date-fns';
// import { useExpenses, Expense } from '../contexts/ExpenseContext';
// import { toast } from 'react-hot-toast';

// interface ExpenseModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   selectedDate: Date;
//   editingExpense?: Expense | null;
//   loading?: boolean;
// }

// // ✅ Correct Categories (Must match Backend Enum exactly)
// const categories = [
//   '🍔Food & Drinks',
//   '🚗Transport',
//   '🎉Entertainment',
//   '📚Study Materials',
//   '💊Health & Medical',
//   '🛍️Shopping',
//   '💡Bills & Utilities',
//   '📝Other'
// ];

// const ExpenseModal: React.FC<ExpenseModalProps> = ({ 
//   isOpen, 
//   onClose, 
//   selectedDate, 
//   editingExpense = null,
//   loading = false 
// }) => {
//   const { actions } = useExpenses();
//   const [formData, setFormData] = useState({
//     item_name: '',
//     category: categories[0], // ✅ FIXED: Use the first category (with emoji)
//     price: '',
//     date: format(selectedDate, 'yyyy-MM-dd')
//   });
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   // Update form when editing expense or selected date changes
//   useEffect(() => {
//     if (isOpen) {
//       if (editingExpense) {
//         setFormData({
//           item_name: editingExpense.item_name,
//           category: editingExpense.category,
//           price: editingExpense.price.toString(),
//           date: format(new Date(editingExpense.date), 'yyyy-MM-dd')
//         });
//       } else {
//         setFormData({
//           item_name: '',
//           category: categories[0], // ✅ FIXED: Default to '🍔Food & Drinks'
//           price: '',
//           date: format(selectedDate, 'yyyy-MM-dd')
//         });
//       }
//     }
//   }, [selectedDate, isOpen, editingExpense]);

//   const isFutureDate = isAfter(startOfDay(selectedDate), startOfDay(new Date()));

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
    
//     if (!formData.item_name || !formData.price) {
//       return;
//     }

//     if (isFutureDate) {
//       toast.error('Cannot add expenses for future dates!');
//       return;
//     }

//     setIsSubmitting(true);

//     try {
//       if (editingExpense) {
//         await actions.updateExpense(editingExpense._id || editingExpense.id || '', {
//           item_name: formData.item_name,
//           category: formData.category,
//           price: parseFloat(formData.price),
//           date: formData.date
//         });
//         toast.success('Expense updated successfully!');
//       } else {
//         await actions.addExpense({
//           item_name: formData.item_name,
//           category: formData.category,
//           price: parseFloat(formData.price),
//           date: formData.date
//         });
//         toast.success('Expense added successfully!');
//       }

//       // Reset form
//       setFormData({
//         item_name: '',
//         category: categories[0], // ✅ FIXED: Reset to valid category
//         price: '',
//         date: format(selectedDate, 'yyyy-MM-dd')
//       });
      
//       onClose();
//     } catch (error) {
//       console.error('Error adding expense:', error);
//       toast.error('Failed to save expense');
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//     setFormData(prev => ({
//       ...prev,
//       [e.target.name]: e.target.value
//     }));
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
//       <div className="bg-background rounded-2xl shadow-2xl w-full max-w-md border border-border">
//         <div className="flex items-center justify-between p-6 border-b border-border">
//           <div className="flex items-center gap-2">
//             {editingExpense ? (
//               <Edit className="w-5 h-5 text-primary" />
//             ) : (
//               <FileText className="w-5 h-5 text-primary" />
//             )}
//             <h2 className="text-xl font-bold text-foreground">
//               {isFutureDate 
//                 ? 'Cannot Add Future Expense' 
//                 : editingExpense 
//                   ? 'Update Expense' 
//                   : 'Add New Expense'
//               }
//             </h2>
//           </div>
//           <button
//             onClick={onClose}
//             className="p-2 hover:bg-accent rounded-lg transition-colors"
//           >
//             <X className="w-5 h-5 text-muted-foreground" />
//           </button>
//         </div>

//         {isFutureDate && (
//           <div className="p-6 border-b border-border">
//             <div className="bg-red-50 border border-red-200 rounded-lg p-4">
//               <p className="text-red-700 text-sm">
//                 You cannot add expenses for future dates. Please select today's date or a past date.
//               </p>
//             </div>
//           </div>
//         )}

//         <form onSubmit={handleSubmit} className="p-6 space-y-6">
//           <div>
//             <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
//               <FileText className="w-4 h-4" />
//               Item Name
//             </label>
//             <input
//               type="text"
//               name="item_name"
//               value={formData.item_name}
//               onChange={handleChange}
//               placeholder="Enter item name"
//               disabled={isFutureDate}
//               className="w-full px-4 py-3 border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent transition-all bg-background text-foreground"
//               required
//             />
//           </div>

//           <div>
//             <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
//               <Tag className="w-4 h-4" />
//               Category
//             </label>
//             <select
//               name="category"
//               value={formData.category}
//               onChange={handleChange}
//               disabled={isFutureDate}
//               className="w-full px-4 py-3 border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent transition-all bg-background text-foreground"
//             >
//               {categories.map(category => (
//                 <option key={category} value={category}>
//                   {category}
//                 </option>
//               ))}
//             </select>
//           </div>

//           <div>
//             <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
//               <span className="w-4 h-4 text-center font-bold">₹</span>
//               Amount
//             </label>
//             <input
//               type="number"
//               name="price"
//               value={formData.price}
//               onChange={handleChange}
//               placeholder="0.00"
//               step="1"
//               min="0"
//               disabled={isFutureDate}
//               className="w-full px-4 py-3 border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent transition-all bg-background text-foreground"
//               required
//             />
//           </div>

//           <div>
//             <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
//               <Calendar className="w-4 h-4" />
//               Date
//             </label>
//             <input
//               type="date"
//               name="date"
//               value={formData.date}
//               onChange={handleChange}
//               max={format(new Date(), 'yyyy-MM-dd')}
//               disabled={isFutureDate}
//               className="w-full px-4 py-3 border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent transition-all bg-background text-foreground"
//               required
//             />
//           </div>

//           <div className="flex gap-3 pt-4">
//             <button
//               type="button"
//               onClick={onClose}
//               className="flex-1 px-4 py-3 border border-input text-foreground rounded-lg hover:bg-accent transition-colors font-medium"
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               disabled={isSubmitting || loading || isFutureDate}
//               className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               {isFutureDate ? 'Future Date' : isSubmitting ? (editingExpense ? 'Updating...' : 'Adding...') : (editingExpense ? 'Update Expense' : 'Add Expense')}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default ExpenseModal;























// import React, { useState, useEffect } from 'react';
// import { X, Tag, Calendar, FileText, Edit } from 'lucide-react';
// import { format, isAfter, startOfDay } from 'date-fns';
// import { useExpenses, Expense } from '../contexts/ExpenseContext';
// import { toast } from 'react-hot-toast';
// import { showSuccess, showError } from '../components/customToast'; // Update path as needed


// interface ExpenseModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   selectedDate: Date;
//   editingExpense?: Expense | null;
//   loading?: boolean;
// }

// const categories = [
//   '🍔Food & Drinks',
//   '🚗Transport',
//   '🎉Entertainment',
//   '📚Study Materials',
//   '💊Health & Medical',
//   '🛍️Shopping',
//   '💡Bills & Utilities',
//   '📝Other'
// ];

// const ExpenseModal: React.FC<ExpenseModalProps> = ({ 
//   isOpen, 
//   onClose, 
//   selectedDate, 
//   editingExpense = null,
//   loading = false 
// }) => {
//   const { actions } = useExpenses();
  
//   const [formData, setFormData] = useState({
//     item_name: '',
//     category: categories[0],
//     price: '',
//     date: format(selectedDate, 'yyyy-MM-dd')
//   });

//   const [isSubmitting, setIsSubmitting] = useState(false);

//   // ✅ FIX: Reset EVERYTHING (including isSubmitting) when modal opens
//   useEffect(() => {
//     if (isOpen) {
//       // 1. Force unlock the button immediately
//       setIsSubmitting(false);

//       // 2. Reset or Populate form data
//       if (editingExpense) {
//         setFormData({
//           item_name: editingExpense.item_name,
//           category: editingExpense.category,
//           price: editingExpense.price.toString(),
//           date: format(new Date(editingExpense.date), 'yyyy-MM-dd')
//         });
//       } else {
//         setFormData({
//           item_name: '',
//           category: categories[0],
//           price: '',
//           date: format(selectedDate, 'yyyy-MM-dd')
//         });
//       }
//     }
//   }, [isOpen, editingExpense, selectedDate]); 


//   const isFutureDate = isAfter(startOfDay(selectedDate), startOfDay(new Date()));

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
    
//     if (!formData.item_name || !formData.price) {
//       toast.error('Please fill in all fields');
//       return;
//     }

//     if (isFutureDate) {
//       toast.error('Cannot add expenses for future dates!');
//       return;
//     }

//     // Lock the button
//     setIsSubmitting(true);

//     try {
//       if (editingExpense) {
//         await actions.updateExpense(editingExpense._id || editingExpense.id || '', {
//           item_name: formData.item_name,
//           category: formData.category,
//           price: parseFloat(formData.price),
//           date: formData.date
//         });
//         toast.success('Expense updated successfully!');
//       } else {
//         await actions.addExpense({
//           item_name: formData.item_name,
//           category: formData.category,
//           price: parseFloat(formData.price),
//           date: formData.date
//         });
//         toast.success('Expense added successfully!');
//       }
      
//       onClose(); // Close modal on success
      
//     } catch (error) {
//       console.error('Error adding expense:', error);
//       toast.error('Failed to save expense');
//       setIsSubmitting(false); // Only unlock manually if there was an error
//     } 
//     // removed 'finally' block because the useEffect handles the reset on next open
//   };

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//     setFormData(prev => ({
//       ...prev,
//       [e.target.name]: e.target.value
//     }));
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
//       <div className="bg-background rounded-2xl shadow-2xl w-full max-w-md border border-border">
//         <div className="flex items-center justify-between p-6 border-b border-border">
//           <div className="flex items-center gap-2">
//             {editingExpense ? (
//               <Edit className="w-5 h-5 text-primary" />
//             ) : (
//               <FileText className="w-5 h-5 text-primary" />
//             )}
//             <h2 className="text-xl font-bold text-foreground">
//               {isFutureDate 
//                 ? 'Cannot Add Future Expense' 
//                 : editingExpense 
//                   ? 'Update Expense' 
//                   : 'Add New Expense'
//               }
//             </h2>
//           </div>
//           <button
//             onClick={onClose}
//             className="p-2 hover:bg-accent rounded-lg transition-colors"
//           >
//             <X className="w-5 h-5 text-muted-foreground" />
//           </button>
//         </div>

//         {isFutureDate && (
//           <div className="p-6 border-b border-border">
//             <div className="bg-red-50 border border-red-200 rounded-lg p-4">
//               <p className="text-red-700 text-sm">
//                 You cannot add expenses for future dates. Please select today's date or a past date.
//               </p>
//             </div>
//           </div>
//         )}

//         <form onSubmit={handleSubmit} className="p-6 space-y-6">
//           <div>
//             <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
//               <FileText className="w-4 h-4" />
//               Item Name
//             </label>
//             <input
//               type="text"
//               name="item_name"
//               value={formData.item_name}
//               onChange={handleChange}
//               placeholder="Enter item name"
//               disabled={isFutureDate || isSubmitting}
//               className="w-full px-4 py-3 border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent transition-all bg-background text-foreground"
//               required
//             />
//           </div>

//           <div>
//             <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
//               <Tag className="w-4 h-4" />
//               Category
//             </label>
//             <select
//               name="category"
//               value={formData.category}
//               onChange={handleChange}
//               disabled={isFutureDate || isSubmitting}
//               className="w-full px-4 py-3 border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent transition-all bg-background text-foreground"
//             >
//               {categories.map(category => (
//                 <option key={category} value={category}>
//                   {category}
//                 </option>
//               ))}
//             </select>
//           </div>

//           <div>
//             <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
//               <span className="w-4 h-4 text-center font-bold">₹</span>
//               Amount
//             </label>
//             <input
//               type="number"
//               name="price"
//               value={formData.price}
//               onChange={handleChange}
//               placeholder="0.00"
//               step="1"
//               min="0"
//               disabled={isFutureDate || isSubmitting}
//               className="w-full px-4 py-3 border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent transition-all bg-background text-foreground"
//               required
//             />
//           </div>

//           <div>
//             <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
//               <Calendar className="w-4 h-4" />
//               Date
//             </label>
//             <input
//               type="date"
//               name="date"
//               value={formData.date}
//               onChange={handleChange}
//               max={format(new Date(), 'yyyy-MM-dd')}
//               disabled={isFutureDate || isSubmitting}
//               className="w-full px-4 py-3 border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent transition-all bg-background text-foreground"
//               required
//             />
//           </div>

//           <div className="flex gap-3 pt-4">
//             <button
//               type="button"
//               onClick={onClose}
//               className="flex-1 px-4 py-3 border border-input text-foreground rounded-lg hover:bg-accent transition-colors font-medium"
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               disabled={isSubmitting || loading || isFutureDate}
//               className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
//             >
//               {isSubmitting ? (
//                  <>Adding...</> 
//               ) : (
//                  editingExpense ? 'Update Expense' : 'Add Expense'
//               )}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default ExpenseModal;




















import React, { useState, useEffect } from 'react';
import { X, Tag, Calendar, FileText, Edit } from 'lucide-react';
import { format, isAfter, startOfDay } from 'date-fns';
import { useExpenses, Expense } from '../contexts/ExpenseContext';
// Import your custom toast functions
import { showSuccess, showError } from '../components/customToast'; 

interface ExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: Date;
  editingExpense?: Expense | null;
  loading?: boolean;
}

const categories = [
  '🍔Food & Drinks',
  '🚗Transport',
  '🎉Entertainment',
  '📚Study Materials',
  '💊Health & Medical',
  '🛍️Shopping',
  '💡Bills & Utilities',
  '📝Other'
];

const ExpenseModal: React.FC<ExpenseModalProps> = ({ 
  isOpen, 
  onClose, 
  selectedDate, 
  editingExpense = null,
  loading = false 
}) => {
  const { actions } = useExpenses();
  
  const [formData, setFormData] = useState({
    item_name: '',
    category: categories[0],
    price: '',
    date: format(selectedDate, 'yyyy-MM-dd')
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setIsSubmitting(false);

      if (editingExpense) {
        setFormData({
          item_name: editingExpense.item_name,
          category: editingExpense.category,
          price: editingExpense.price.toString(),
          date: format(new Date(editingExpense.date), 'yyyy-MM-dd')
        });
      } else {
        setFormData({
          item_name: '',
          category: categories[0],
          price: '',
          date: format(selectedDate, 'yyyy-MM-dd')
        });
      }
    }
  }, [isOpen, editingExpense, selectedDate]); 


  const isFutureDate = isAfter(startOfDay(selectedDate), startOfDay(new Date()));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // --- VALIDATION (Handled by Modal) ---
    if (!formData.item_name || !formData.price) {
      showError('Please fill in all fields'); // Custom Error Toast
      return;
    }

    if (isFutureDate) {
      showError('Cannot add expenses for future dates!'); // Custom Error Toast
      return;
    }

    setIsSubmitting(true);

    try {
      if (editingExpense) {
        await actions.updateExpense(editingExpense._id || editingExpense.id || '', {
          item_name: formData.item_name,
          category: formData.category,
          price: parseFloat(formData.price),
          date: formData.date
        });
        // showSuccess('Expense updated!'); <--- REMOVED: Context handles this now
      } else {
        await actions.addExpense({
          item_name: formData.item_name,
          category: formData.category,
          price: parseFloat(formData.price),
          date: formData.date
        });
        // showSuccess('Expense added!'); <--- REMOVED: Context handles this now
      }
      
      onClose(); 
      
    } catch (error) {
      console.error('Error adding expense:', error);
      // showError('Failed to save expense'); <--- REMOVED: Context handles this now
      setIsSubmitting(false); 
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-background rounded-2xl shadow-2xl w-full max-w-md border border-border">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center gap-2">
            {editingExpense ? (
              <Edit className="w-5 h-5 text-primary" />
            ) : (
              <FileText className="w-5 h-5 text-primary" />
            )}
            <h2 className="text-xl font-bold text-foreground">
              {isFutureDate 
                ? 'Cannot Add Future Expense' 
                : editingExpense 
                  ? 'Update Expense' 
                  : 'Add New Expense'
              }
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-accent rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        {isFutureDate && (
          <div className="p-6 border-b border-border">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-700 text-sm">
                You cannot add expenses for future dates. Please select today's date or a past date.
              </p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
              <FileText className="w-4 h-4" />
              Item Name
            </label>
            <input
              type="text"
              name="item_name"
              value={formData.item_name}
              onChange={handleChange}
              placeholder="Enter item name"
              disabled={isFutureDate || isSubmitting}
              className="w-full px-4 py-3 border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent transition-all bg-background text-foreground"
              required
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
              <Tag className="w-4 h-4" />
              Category
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              disabled={isFutureDate || isSubmitting}
              className="w-full px-4 py-3 border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent transition-all bg-background text-foreground"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
              <span className="w-4 h-4 text-center font-bold">₹</span>
              Amount
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="0.00"
              step="1"
              min="0"
              disabled={isFutureDate || isSubmitting}
              className="w-full px-4 py-3 border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent transition-all bg-background text-foreground"
              required
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
              <Calendar className="w-4 h-4" />
              Date
            </label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              max={format(new Date(), 'yyyy-MM-dd')}
              disabled={isFutureDate || isSubmitting}
              className="w-full px-4 py-3 border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent transition-all bg-background text-foreground"
              required
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-input text-foreground rounded-lg hover:bg-accent transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || loading || isFutureDate}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                 <>Adding...</> 
              ) : (
                 editingExpense ? 'Update Expense' : 'Add Expense'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ExpenseModal;
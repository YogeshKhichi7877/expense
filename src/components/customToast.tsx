// src/utils/customToast.tsx
import React from 'react';
import toast, { Toast } from 'react-hot-toast';
import { CheckCircle2, XCircle, AlertTriangle, X } from 'lucide-react';

// --- Styles for the custom container ---
const toastBaseStyle = "flex items-center w-full max-w-sm w-full bg-white shadow-2xl rounded-xl pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden p-4 gap-4 animate-enter";

// 1. SUCCESS TOAST
export const showSuccess = (message: string) => {
  toast.custom((t) => (
    <div
      className={`${
        t.visible ? 'animate-enter' : 'animate-leave'
      } ${toastBaseStyle} border-l-4 border-green-500`}
    >
      <div className="flex-shrink-0">
        <CheckCircle2 className="h-6 w-6 text-green-500" />
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-900">Success</p>
        <p className="mt-1 text-sm text-gray-500">{message}</p>
      </div>
      <button onClick={() => toast.dismiss(t.id)} className="text-gray-400 hover:text-gray-600">
        <X className="w-4 h-4" />
      </button>
    </div>
  ));
};

// 2. ERROR TOAST
export const showError = (message: string) => {
  toast.custom((t) => (
    <div
      className={`${
        t.visible ? 'animate-enter' : 'animate-leave'
      } ${toastBaseStyle} border-l-4 border-red-500`}
    >
      <div className="flex-shrink-0">
        <XCircle className="h-6 w-6 text-red-500" />
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-900">Error</p>
        <p className="mt-1 text-sm text-gray-500">{message}</p>
      </div>
      <button onClick={() => toast.dismiss(t.id)} className="text-gray-400 hover:text-gray-600">
        <X className="w-4 h-4" />
      </button>
    </div>
  ));
};

// 3. CONFIRMATION TOAST (Interactive)
export const showConfirm = (
  message: string, 
  onConfirm: () => void, 
  confirmText = "Yes, delete", 
  cancelText = "Cancel"
) => {
  toast.custom((t) => (
    <div
      className={`${
        t.visible ? 'animate-enter' : 'animate-leave'
      } ${toastBaseStyle} border-l-4 border-amber-500 flex-col items-start`}
    >
      <div className="flex items-start gap-3 w-full">
        <AlertTriangle className="h-6 w-6 text-amber-500 flex-shrink-0" />
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-900">Confirmation</p>
          <p className="mt-1 text-sm text-gray-500">{message}</p>
        </div>
      </div>
      
      <div className="flex gap-3 w-full justify-end mt-2">
        <button
          onClick={() => toast.dismiss(t.id)}
          className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
        >
          {cancelText}
        </button>
        <button
          onClick={() => {
            onConfirm();
            toast.dismiss(t.id);
          }}
          className="px-3 py-1.5 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors shadow-sm"
        >
          {confirmText}
        </button>
      </div>
    </div>
  ), { duration: 5000 }); // Stay open a bit longer for decisions
};
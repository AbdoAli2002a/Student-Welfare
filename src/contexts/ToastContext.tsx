import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import { CheckCircle, AlertTriangle, X, Bell } from 'lucide-react';

export type ToastType = 'success' | 'info' | 'warning' | 'error';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 5000);
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  // Simulate receiving updates for the demo
  useEffect(() => {
    const timers = [
      setTimeout(() => {
        showToast('تم تحديث حالة طلب التكافل الخاص بك إلى: قيد المراجعة', 'info');
      }, 5000),
      setTimeout(() => {
        showToast('تذكير: اقترب موعد "الندوة الثقافية الكبرى" غداً!', 'warning');
      }, 15000),
      setTimeout(() => {
        showToast('تم قبول طلب مشاركتك في معرض الفنون التشكيلية بنجاح!', 'success');
      }, 30000)
    ];
    return () => timers.forEach(clearTimeout);
  }, [showToast]);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-24 right-6 sm:bottom-6 sm:right-auto sm:left-6 z-[100] flex flex-col gap-2 max-w-sm w-[calc(100vw-3rem)] sm:w-full" dir="rtl">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`flex items-start gap-3 p-4 rounded-xl shadow-xl border transition-all duration-300 ease-in-out transform translate-y-0 opacity-100 ${
              toast.type === 'success' ? 'bg-green-50 border-green-200 text-green-800' :
              toast.type === 'warning' ? 'bg-yellow-50 border-yellow-200 text-yellow-800' :
              toast.type === 'error' ? 'bg-red-50 border-red-200 text-red-800' :
              'bg-blue-50 border-blue-200 text-blue-800'
            }`}
          >
            <div className="shrink-0 mt-0.5">
              {toast.type === 'success' && <CheckCircle className="w-5 h-5 text-green-600" />}
              {toast.type === 'warning' && <AlertTriangle className="w-5 h-5 text-yellow-600" />}
              {toast.type === 'error' && <AlertTriangle className="w-5 h-5 text-red-600" />}
              {toast.type === 'info' && <Bell className="w-5 h-5 text-blue-600" />}
            </div>
            <p className="text-sm font-semibold flex-grow leading-relaxed">{toast.message}</p>
            <button
              onClick={() => removeToast(toast.id)}
              className="shrink-0 text-slate-400 hover:text-slate-600 transition-colors p-1 -m-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

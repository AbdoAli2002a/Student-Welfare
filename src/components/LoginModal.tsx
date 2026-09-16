import React, { useState } from 'react';
import { User, Lock, LogIn, X, AlertCircle } from 'lucide-react';


export default function LoginModal({ 
  isOpen, 
  onClose, 
  onLogin 
}: { 
  isOpen: boolean; 
  onClose: () => void;
  onLogin: (username: string) => void;
}) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!username || !password) {
      setError('يرجى إدخال اسم المستخدم وكلمة المرور');
      return;
    }

    setIsLoading(true);
    
    // Local mock login
    setTimeout(() => {
      setIsLoading(false);
      if (password.length >= 6) {
        onLogin(username);
        setUsername('');
        setPassword('');
      } else {
        setError('كلمة المرور غير صحيحة');
      }
    }, 1000);
  };

  return (
    <>
      <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 transition-opacity" onClick={onClose}></div>
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden z-50" dir="rtl">
        <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100 bg-slate-50">
          <h3 className="font-bold text-slate-800 flex items-center gap-2">
            <LogIn className="w-5 h-5 text-blue-600" />
            تسجيل دخول الطالب
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-md hover:bg-slate-200">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm rounded-lg flex items-center gap-2 font-bold border border-red-100">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">اسم المستخدم</label>
              <div className="relative">
                <input 
                  type="text" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg pr-10 pl-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" 
                  placeholder="مثال: ahmed.m"
                  dir="ltr"
                />
                <User className="w-5 h-5 text-slate-400 absolute right-3 top-2.5" />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">كلمة المرور</label>
              <div className="relative">
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg pr-10 pl-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" 
                  placeholder="••••••••"
                  dir="ltr"
                />
                <Lock className="w-5 h-5 text-slate-400 absolute right-3 top-2.5" />
              </div>
            </div>
            
            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl shadow-md transition-colors flex items-center justify-center gap-2 mt-6 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  تسجيل الدخول
                </>
              )}
            </button>
          </form>
          
          <div className="mt-6 text-center text-sm text-slate-500">
            إذا لم يكن لديك حساب، يرجى مراجعة إدارة رعاية الشباب.
          </div>
        </div>
      </div>
    </>
  );
}

import React, { useState, useEffect } from 'react';
import { Menu, X, Globe } from 'lucide-react';
import NotificationsDropdown from './NotificationsDropdown';
import LoginModal from './LoginModal';
import AccessibilityMenu from './AccessibilityMenu';
import { useLanguage } from '../contexts/LanguageContext';


export default function Navbar({ setCurrentView, currentView }: { setCurrentView?: (view: 'home' | 'admin' | 'profile' | 'notifications' | 'guide' | 'map') => void, currentView?: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>('');


  const { language, toggleLanguage, t } = useLanguage();

  const navLinks = [
    { name: t('nav.home'), href: '#', onClick: () => setCurrentView?.('home'), active: currentView === 'home' },
    { name: t('nav.map'), href: '#', onClick: () => setCurrentView?.('map'), active: currentView === 'map' },
    { name: t('nav.activities'), href: '#activities', onClick: () => setCurrentView?.('home'), active: false },
    { name: t('nav.solidarity'), href: '#solidarity', onClick: () => setCurrentView?.('home'), active: false },
    { name: t('nav.trips'), href: '#trips', onClick: () => setCurrentView?.('home'), active: false },
    { name: t('nav.elections'), href: '#elections', onClick: () => setCurrentView?.('home'), active: false },
    { name: t('nav.forum'), href: '#forum', onClick: () => setCurrentView?.('home'), active: false },
  ];

  const handleLogin = (username: string) => {
    setLoggedInUser(username);
    setUserName(username);
    setIsLoginModalOpen(false);
    setCurrentView?.('profile');
  };

  const handleLogout = async () => {
    setLoggedInUser(null);
    setUserName('');
    setCurrentView?.('home');
  };

  return (
    <>
      <nav className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-8 shadow-sm flex-shrink-0 sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 flex items-center justify-center bg-white rounded-full shadow-sm overflow-hidden border border-slate-100 p-0.5">
            <img src="/logo2.png" alt="شعار الكلية" className="w-full h-full object-contain rounded-full" />
          </div>
          <div>
            <h1 className="text-blue-900 font-bold text-lg leading-tight">{t('college.name')}</h1>
            <p className="text-slate-500 text-xs font-medium">{t('college.office')}</p>
          </div>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          <ul className="flex gap-6 text-slate-700 font-medium text-sm">
            {navLinks.map((link) => (
              <li
                key={link.name}
                className={`${link.active ? 'text-blue-700 border-b-2 border-blue-700 pb-1' : 'hover:text-blue-600 cursor-pointer transition-colors'} `}
              >
                <a href={link.href} onClick={link.onClick}>{link.name}</a>
              </li>
            ))}
          </ul>
          <div className="flex items-center gap-4">
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1 text-slate-600 hover:text-blue-600 transition-colors font-semibold text-sm"
              aria-label="Toggle language"
            >
              <Globe className="w-4 h-4" />
              <span>{language === 'ar' ? 'English' : 'العربية'}</span>
            </button>
            <AccessibilityMenu />
            {loggedInUser && <NotificationsDropdown setCurrentView={setCurrentView} />}
            {loggedInUser ? (
              <button 
                onClick={() => currentView === 'profile' ? setCurrentView?.('home') : setCurrentView?.('profile')}
                className="bg-slate-100 text-slate-700 px-4 py-2 rounded-md text-sm font-bold shadow-sm hover:bg-slate-200 transition-colors flex items-center gap-2"
              >
                <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs">
                  {loggedInUser.charAt(0).toUpperCase()}
                </div>
                {t('nav.welcome')} {loggedInUser}
              </button>
            ) : (
              <button 
                onClick={() => setIsLoginModalOpen(true)}
                className="bg-blue-900 text-white px-5 py-2 rounded-md text-sm font-bold shadow-md hover:bg-blue-800 transition-colors"
              >
                {t('nav.login')}
              </button>
            )}
            {loggedInUser && (
              <button 
                onClick={handleLogout}
                className="text-slate-500 hover:text-red-600 text-sm font-semibold transition-colors"
              >
                {t('nav.logout')}
              </button>
            )}
          </div>
        </div>

        {/* Mobile menu button */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            onClick={toggleLanguage}
            className="inline-flex items-center justify-center p-2 rounded-md text-slate-400 hover:text-blue-600 focus:outline-none"
            aria-label="Toggle language"
          >
            <Globe className="block h-5 w-5" />
          </button>
          <AccessibilityMenu />
          {loggedInUser && <NotificationsDropdown setCurrentView={setCurrentView} />}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="inline-flex items-center justify-center p-2 rounded-md text-slate-400 hover:text-slate-500 hover:bg-slate-100 focus:outline-none"
          >
            <span className="sr-only">فتح القائمة</span>
            {isOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="absolute top-16 right-0 left-0 bg-white border-b border-slate-200 shadow-md md:hidden z-50">
            <ul className="flex flex-col text-slate-700 font-medium text-sm p-4 gap-4">
              {navLinks.map((link) => (
                <li
                  key={link.name}
                  className={`${link.active ? 'text-blue-700 font-bold' : 'hover:text-blue-600'}`}
                >
                  <a href={link.href} onClick={(e) => { setIsOpen(false); link.onClick(); }} className="block w-full">{link.name}</a>
                </li>
              ))}
              <li>
                {loggedInUser ? (
                  <>
                    <button 
                      onClick={() => { setIsOpen(false); setCurrentView?.('profile'); }}
                      className="w-full bg-slate-100 text-slate-700 px-5 py-2 rounded-md text-sm font-bold shadow-sm hover:bg-slate-200 transition-colors mt-2 flex items-center justify-center gap-2"
                    >
                      <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs">
                        {loggedInUser.charAt(0).toUpperCase()}
                      </div>
                      {t('nav.profile')} ({loggedInUser})
                    </button>
                    <button 
                      onClick={() => { setIsOpen(false); handleLogout(); }}
                      className="w-full text-red-600 px-5 py-2 rounded-md text-sm font-bold shadow-sm hover:bg-red-50 transition-colors mt-2"
                    >
                      {t('nav.logout')}
                    </button>
                  </>
                ) : (
                  <button 
                    onClick={() => { setIsOpen(false); setIsLoginModalOpen(true); }}
                    className="w-full bg-blue-900 text-white px-5 py-2 rounded-md text-sm font-bold shadow-md hover:bg-blue-800 transition-colors mt-2"
                  >
                    {t('nav.login')}
                  </button>
                )}
              </li>
            </ul>
          </div>
        )}
      </nav>

      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)} 
        onLogin={handleLogin}
      />
    </>
  );
}

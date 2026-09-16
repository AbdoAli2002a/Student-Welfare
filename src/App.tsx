/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import SmartSearch from './components/SmartSearch';
import ServicesGrid from './components/ServicesGrid';
import ActivitiesList from './components/ActivitiesList';
import SolidarityForm from './components/SolidarityForm';
import TripsSection from './components/TripsSection';
import ElectionsSection from './components/ElectionsSection';
import Footer from './components/Footer';
import AdminDashboard from './components/AdminDashboard';
import AdminLoginModal from './components/AdminLoginModal';
import StudentProfile from './components/StudentProfile';
import ActivityGuide from './components/ActivityGuide';
import NotificationCenter from './components/NotificationCenter';
import FeedbackModal from './components/FeedbackModal';
import VirtualAssistant from './components/VirtualAssistant';
import StudentForum from './components/StudentForum';
import StudentPoll from './components/StudentPoll';
import SosButton from './components/SosButton';
import ContactUsButton from './components/ContactUsButton';
import AccessibilityToolbar from './components/AccessibilityToolbar';
import CampusMap from './components/CampusMap';
import { ToastProvider } from './contexts/ToastContext';
import PushNotificationManager from './components/PushNotificationManager';

import { LanguageProvider } from './contexts/LanguageContext';

export default function App() {
  const [currentView, setCurrentView] = useState<'home' | 'admin' | 'profile' | 'notifications' | 'guide' | 'map'>('home');
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);

  return (
    <LanguageProvider>
    <ToastProvider>
      <PushNotificationManager />
      <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      <div className="no-print"><Navbar setCurrentView={setCurrentView} currentView={currentView} /></div>
      
      {/* Toggle View for Demo Purposes */}
      <div className="bg-slate-800 text-white text-sm py-2 px-4 flex flex-col sm:flex-row justify-between items-center z-40 relative gap-2 no-print">
        <span>وضع العرض الحالي: <span className="font-bold text-blue-300">{currentView === 'admin' ? 'لوحة تحكم الإدارة' : currentView === 'profile' ? 'الملف الشخصي للطالب' : currentView === 'notifications' ? 'مركز الإشعارات' : currentView === 'guide' ? 'دليل الأنشطة' : 'بوابة الطالب'}</span></span>
        <div className="flex gap-2">
          <button 
            onClick={() => {
              if (currentView === 'admin') {
                setCurrentView('home');
              } else {
                setIsAdminLoginOpen(true);
              }
            }}
            className="bg-blue-600 hover:bg-blue-700 px-4 py-1 rounded text-white font-semibold transition-colors text-xs sm:text-sm"
          >
            {currentView === 'admin' ? 'العودة لبوابة الطالب' : 'دخول الإدارة'}
          </button>
        </div>
      </div>

      <main className="flex-grow flex flex-col">
        {currentView === 'admin' ? (
          <AdminDashboard />
        ) : currentView === 'profile' ? (
          <StudentProfile />
        ) : currentView === 'notifications' ? (
          <NotificationCenter onBack={() => setCurrentView('home')} />
        ) : currentView === 'guide' ? (
          <ActivityGuide onBack={() => setCurrentView('home')} />
        ) : currentView === 'map' ? (
          <CampusMap />
        ) : (
          <>
            <Hero />
            <SmartSearch />
            <ServicesGrid />
            <ActivitiesList setCurrentView={setCurrentView} />
            <StudentPoll />
            
            {/* Social Solidarity Section */}
            <div id="solidarity" className="bg-blue-50 py-16 sm:py-24">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-10">
                  <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl mb-4">التكافل الاجتماعي</h2>
                  <p className="text-base text-slate-600 max-w-2xl mx-auto">
                    نحن هنا لدعمك. يقدم صندوق التكافل الاجتماعي مساعدات للطلاب للمساهمة في المصروفات الدراسية وتوفير الكتب والمذكرات الجامعية.
                  </p>
                </div>
                <SolidarityForm />
              </div>
            </div>
            
            <TripsSection />
            <ElectionsSection />
            <StudentForum />
          </>
        )}
      </main>
      
      <div className="no-print"><Footer /></div>
      <FeedbackModal />
      <AccessibilityToolbar />
      <VirtualAssistant />
      <ContactUsButton />
      <SosButton />
      <AdminLoginModal 
        isOpen={isAdminLoginOpen} 
        onClose={() => setIsAdminLoginOpen(false)} 
        onSuccess={() => {
          setIsAdminLoginOpen(false);
          setCurrentView('admin');
        }} 
      />
    </div>
    </ToastProvider>
    </LanguageProvider>
  );
}


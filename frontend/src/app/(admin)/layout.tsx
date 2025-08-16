'use client'

import React from 'react';
import Header from './_components/header';
import Sidebar from './_components/sidebar';
import { ToastContainer } from 'react-toastify';
import { getAuthToken } from '@/utils/auth';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface LayoutProps {
  children: React.ReactNode;
}

function Layout({ children }: LayoutProps) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = getAuthToken();
    if (!token) {
      router.push('/');
    } else {
      setIsAuthenticated(true);
    }
  }, [router]);

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Header at the top */}
      <Header />
      
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar on the left */}
        <Sidebar />
        
        {/* Main content area */}
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
          {children}
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
        </main>
      </div>
    </div>
  );
}

export default Layout;
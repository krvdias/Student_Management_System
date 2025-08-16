'use client'

import React, { useState } from "react";
import { logo, Bell, User } from "@/resource/icons/index";
import Image from "next/image";
import { adminLogout } from "@/service/adminRoutes";
import { getUserId, setAuthToken, setRefreshToken, setUserId, setUserName } from "@/utils/auth";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { LogoutData } from "@/constants/types";

function Header() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    const id = getUserId(); // Assuming user ID is stored in localStorage
    if (!id) {
      toast.error('User ID not found. Please log in again.');
      return;
    }

    try {
      const logoutData: LogoutData = { id };

      const response = await adminLogout(logoutData);
      if (response.data.success) {
        // Clear tokens and redirect to login
        setAuthToken('');
        setRefreshToken('');
        setUserId('');
        setUserName('');
        router.push('/');
        toast.success('Successfully logged out');
      }
    } catch (error) {
      console.error('Logout failed:', error);
      toast.error('Logout failed. Please try again.');
    }
    
    setDropdownOpen(false);
  }

  return (
    <header className="bg-white shadow-sm border-b-6 border-yellow-400">
      <div className="flex items-center justify-between px-10 ">
        
        {/* Left: Logo */}
        <div className="flex items-center">
          <Image src={logo} alt="Logo" width={50} height={50} className="h-20 w-20" />
        </div>

        {/* Center: Title */}
        <h1 className="text-6xl font-semibold text-blue-900 uppercase">
          Admin Dashboard
        </h1>

        {/* Right: Icons */}
        <div className="flex items-center space-x-6 relative">
          {/* Bell Icon */}
          <button className="text-blue-900 hover:text-blue-700" title="notification" type="button">
            <Image src={Bell} alt="Notifications" width={40} height={40} className="h-8 w-8" />
          </button>

          {/* Profile Icon + Dropdown */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="text-blue-900 hover:text-blue-700"
              title="Profile"
              type="button"
            >
              <Image src={User} alt="Profile" width={40} height={40} className="h-8 w-8" />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded shadow-lg">
                <button
                  onClick={() => handleLogout()}
                  className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                  type="button"
                  title="Logout"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;

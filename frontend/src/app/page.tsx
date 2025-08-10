'use client'

import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { logo } from '@/resource/logo';
import { main } from '@/resource/image';
import { adminLogin } from '@/service/adminRoutes';
import { setAuthToken, setRefreshToken } from '@/utils/auth';
import { toast } from 'react-toastify';

export default function Login() {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmit, setIsSubmit] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmit(true);
    try {
      const response = await adminLogin(formData);

      if (response.data && response.data.accessToken) {
        setAuthToken(response.data.accessToken);
        setRefreshToken(response.data.RefreshToken);
        toast.success('Successfully Login');
        setIsSubmit(false);
      } else {
        toast.error('Invalid credentials. Please try again.');
        setIsSubmit(false);
      }
    } catch (error) {
      console.log('Somthing wrong', error);
      setIsSubmit(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative">
      {/* Background Image with overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src={main}
          alt="School Background"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/30"></div>
      </div>

      {/* Login Form Container */}
      <div className="w-full max-w-md bg-white p-8 rounded-3xl shadow-md z-10 mx-4">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <Image
            src={logo}
            alt="School logo"
            width={90}
            height={90}
            className="object-contain"
          />
        </div>

        {/* Login Title */}
        <h1 className="text-6xl font-bold text-gray-800 mb-6 text-center">Login</h1>

        {/* Login Form */}
        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Username Field */}
          <div>
            <label htmlFor="username" className="block text-sm font-bold text-gray-700 mb-1">
              User Name:
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              className="block w-full px-4 py-1 border-b-2 border-black focus:ring-0 focus:border-b-blue-500 focus:outline-none"
              required
            />
          </div>

          {/* Password Field */}
          <div>
            <label htmlFor="password" className="block text-sm font-bold text-gray-700 mb-1">
              Password:
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="block w-full px-4 py-1 border-b-2 border-black focus:ring-0 focus:border-b-blue-500 focus:outline-none"
                required
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-400" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400" />
                )}
              </button>
            </div>
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="rememberMe"
                name="rememberMe"
                type="checkbox"
                onChange={handleInputChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-700">
                Remember Me
              </label>
            </div>
            <Link 
              href="#" 
              className="text-sm text-blue-600 hover:text-blue-500"
            >
              Forget Password
            </Link>
          </div>

          {/* Sign In Button */}
          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            disabled={isSubmit}
          >
            {isSubmit ? 'Signing ...' : 'Sign In'}
          </button>

          {/* Sign Up Link */}
          <div className="text-center pt-2">
            <p className="text-xs text-gray-600">
              Don`t you have an account{' '}
              <Link 
                href="/Register" 
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Sign Up
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
'use client'

import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { logo } from '@/resource/logo';
import { main } from '@/resource/image';
import { adminRegister } from '@/service/adminRoutes';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';

type FormData = {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
};

type FormErrors = {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
};

type ShowPasswordState = {
  password: boolean;
  confirmPassword: boolean;
};

export default function Register() {
  const [formData, setFormData] = useState<FormData>({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const router = useRouter();
  const [showPassword, setShowPassword] = useState<ShowPasswordState>({
    password: false,
    confirmPassword: false
  });
  
  const [errors, setErrors] = useState<FormErrors>({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [isSubmit, setIsSubmit] = useState(false);
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Type assertion for name since we know it matches our form fields
    const fieldName = name as keyof FormData;
    
    setFormData(prev => ({
        ...prev,
        [fieldName]: value
    }));
    
    // Clear error when user types
    if (errors[fieldName as keyof FormErrors]) {
        setErrors(prev => ({
        ...prev,
        [fieldName]: ''
        }));
    }
    };

  const validateForm = () => {
    const newErrors = {
      username: '',
      email: '',
      password: '',
      confirmPassword: ''
    };
    let isValid = true;

    // Username validation
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
      isValid = false;
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
      isValid = false;
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
      isValid = false;
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
      isValid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
      isValid = false;
    }

    // Confirm Password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
      isValid = false;
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmit(true);
    if (validateForm()) {
        try {
            const response = await adminRegister(formData);

            if (response.data) {
                toast.success('Successfully Register');
                router.push('/');
                setIsSubmit(false);
            } else {
                toast.error('Can`t Register Please try again');
                setIsSubmit(false);
            }
        } catch (error) {
            console.log('Somthing Wrong', error);
            setIsSubmit(false);
        }
    }
  };

  const togglePasswordVisibility = (field: keyof ShowPasswordState) => {
    setShowPassword(prev => ({
        ...prev,
        [field]: !prev[field]
    }));
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

      {/* Registration Form Container */}
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

        {/* Registration Title */}
        <h1 className="text-6xl font-bold text-gray-800 mb-6 text-center">Register</h1>

        {/* Registration Form */}
        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Username Field */}
          <div>
            <label htmlFor="username" className="block text-sm font-bold text-gray-700 mb-1">
              Username:
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              className={`block w-full px-4 py-1 border-b-2 ${errors.username ? 'border-red-500' : 'border-black'} focus:ring-0 focus:border-b-blue-500 focus:outline-none`}
              required
            />
            {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username}</p>}
          </div>

          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-sm font-bold text-gray-700 mb-1">
              Email:
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={`block w-full px-4 py-1 border-b-2 ${errors.email ? 'border-red-500' : 'border-black'} focus:ring-0 focus:border-b-blue-500 focus:outline-none`}
              required
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>

          {/* Password Field */}
          <div>
            <label htmlFor="password" className="block text-sm font-bold text-gray-700 mb-1">
              Password:
            </label>
            <div className="relative">
              <input
                type={showPassword.password ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className={`block w-full px-4 py-1 border-b-2 ${errors.password ? 'border-red-500' : 'border-black'} focus:ring-0 focus:border-b-blue-500 focus:outline-none`}
                required
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => togglePasswordVisibility('password')}
              >
                {showPassword.password ? (
                  <EyeOff className="h-5 w-5 text-gray-400" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400" />
                )}
              </button>
            </div>
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
          </div>

          {/* Confirm Password Field */}
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-bold text-gray-700 mb-1">
              Confirm Password:
            </label>
            <div className="relative">
              <input
                type={showPassword.confirmPassword ? "text" : "password"}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className={`block w-full px-4 py-1 border-b-2 ${errors.confirmPassword ? 'border-red-500' : 'border-black'} focus:ring-0 focus:border-b-blue-500 focus:outline-none`}
                required
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => togglePasswordVisibility('confirmPassword')}
              >
                {showPassword.confirmPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-400" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400" />
                )}
              </button>
            </div>
            {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
          </div>

          {/* Register Button */}
          <button
            type="submit"
            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mt-6"
            disabled={isSubmit}
          >
            {isSubmit ? 'Registering ...' : 'Sign Up'}
          </button>

          {/* Login Link */}
          <div className="text-center pt-2">
            <p className="text-xs text-gray-600">
              Already have an account?{' '}
              <Link 
                href="/" 
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Sign In
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
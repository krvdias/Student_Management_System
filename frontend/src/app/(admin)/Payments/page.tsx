'use client'

import React, { useState } from 'react'
import PaymentComponent from '../_components/PaymentComponent';
import FeesComponent from '../_components/FeesComponent';
import { FaSearch } from 'react-icons/fa';

function Page() {
  const [selectedButton, setSelectedButton] = useState('btn1');
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className='max-w-7xl mx-auto p-6'>
      <div className='flex justify-between items-center gap-4 mb-6'>
          <div className='flex w-auto mb-2'>
            <button className={`px-3 sm:px-8 py-1.5 text-xs sm:text-sm rounded-l-xl transition-colors duration-200 shadow-sm font-semibold ${
                    selectedButton === "btn1" ? "bg-[#1346DD] text-white" : "bg-white text-black"
                }`}
                onClick={() => setSelectedButton("btn1")}
            >
                Payment
            </button>
            <button className={`px-3 sm:px-12 py-1.5 text-xs sm:text-sm rounded-r-xl transition-colors duration-200 shadow-sm font-semibold ${
                    selectedButton === "btn2" ? "bg-[#1346DD] text-white" : "bg-white text-black"
                }`}
                onClick={() => setSelectedButton("btn2")}
            >
                Fees
            </button>
          </div>

          <div className={`relative flex-grow max-w-xs ${selectedButton === "btn1" ? "" : "hidden"}`}>
            <FaSearch className='absolute left-3 top-2.5 text-black' />
            <input
              type='text'
              placeholder='Search ...'
              className='w-full pl-10 pr-3 py-1.5 border-3 border-yellow-400 rounded-xl focus:outline-none focus:ring-0 text-sm shadow-lg'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
      </div>

      {/* Conditionally render components based on selected button */}
      {selectedButton === 'btn1' && <PaymentComponent searchTerm={searchTerm} />}
      {selectedButton === 'btn2' && <FeesComponent />}
    </div>
  )
}

export default Page;
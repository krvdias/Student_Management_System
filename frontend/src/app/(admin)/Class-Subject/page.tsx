'use client'

import React, { useState } from 'react'
import ClassesComponent from '../_components/ClassesComponent';
import SubjectComponent from '../_components/SubjectComponent';

function Page() {
  const [selectedButton, setSelectedButton] = useState('btn1');

  return (
    <div className='max-w-7xl mx-auto p-6'>
      <div className='flex w-auto mb-2'>
        <button className={`px-3 sm:px-8 py-1.5 text-xs sm:text-sm rounded-l-xl transition-colors duration-200 shadow-sm font-semibold ${
                selectedButton === "btn1" ? "bg-[#1346DD] text-white" : "bg-white text-black"
            }`}
            onClick={() => setSelectedButton("btn1")}
        >
            Classes
        </button>
        <button className={`px-3 sm:px-8 py-1.5 text-xs sm:text-sm rounded-r-xl transition-colors duration-200 shadow-sm font-semibold ${
                selectedButton === "btn2" ? "bg-[#1346DD] text-white" : "bg-white text-black"
            }`}
            onClick={() => setSelectedButton("btn2")}
        >
            Subjects
        </button>
      </div>

      {/* Conditionally render components based on selected button */}
      {selectedButton === 'btn1' && <ClassesComponent />}
      {selectedButton === 'btn2' && <SubjectComponent />}
    </div>
  )
}

export default Page
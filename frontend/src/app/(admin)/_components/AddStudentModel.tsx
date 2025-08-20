/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import React, { useState, useEffect } from 'react'
import { ClassData, StudentData } from '@/constants/types'
import { getClasses } from '@/service/adminRoutes'

interface AddStudentModalProps {
  isOpen: boolean
  isSubmitting: boolean
  onClose: () => void
  onSubmit: (e: React.FormEvent) => Promise<void>
  formData: StudentData
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void
  isAddMode: boolean
}

const AddStudentModal: React.FC<AddStudentModalProps> = ({
  isOpen,
  isSubmitting,
  onClose,
  onSubmit,
  formData,
  handleInputChange,
  isAddMode
}) => {
  const [classes, setClasses] = useState<ClassData[]>([]);

  const fetchClasses = async () => {
    try {
      const response = await getClasses();
      if (response.data.success) {
        setClasses(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching classes:', error);
    }
  };

  useEffect(() => {
    if (isOpen) {  // Only fetch classes when modal is open
      fetchClasses();
    }
  }, [isOpen]);

  if (!isOpen) return null

  const title = isAddMode ? 'Add Student' : 'Edit Student';

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-3xl shadow-lg w-full max-w-3xl max-h-[100vh] overflow-y-auto">
        <div className='flex justify-between items-center mb-2'>
          <h2 className="text-2xl font-semibold">{title}</h2>
          <button 
            onClick={onClose}
            className="text-black hover:text-gray-700 text-3xl font-light focus:outline-none"
            aria-label="Close"
          >
            &times;
          </button>
        </div>
        
        <form onSubmit={onSubmit}>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
            {/* Left Column */}
            <div className="space-y-1">
              <div>
                <label className="block text-md font-medium">
                  Student Reg No*
                </label>
                <p className="text-xs text-gray-500">Add register number</p>
                <input
                  type="text"
                  name="registerNo"
                  value={formData.registerNo || ''}
                  onChange={handleInputChange}
                  className="w-full px-3 py-1 text-sm border-3 border-yellow-400 rounded-lg focus:ring-0 focus:border-yellow-500 focus:outline-none"
                  placeholder="Register No"
                  required
                />
              </div>

              <div>
                <label className="block text-md font-medium">
                  First Name*
                </label>
                <p className="text-xs text-gray-500">Add first name</p>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName || ''}
                  onChange={handleInputChange}
                  className="w-full px-3 py-1 text-sm border-3 border-yellow-400 rounded-lg focus:ring-0 focus:border-yellow-500 focus:outline-none"
                  placeholder="First Name"
                  required
                />
              </div>

              <div>
                <label className="block text-md font-medium">
                  Last Name*
                </label>
                <p className="text-xs text-gray-500">Add last name</p>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName || ''}
                  onChange={handleInputChange}
                  className="w-full px-3 py-1 text-sm border-3 border-yellow-400 rounded-lg focus:ring-0 focus:border-yellow-500 focus:outline-none"
                  placeholder="Last Name"
                  required
                />
              </div>

              <div>
                <label className="block text-md font-medium">
                  Date of Birth*
                </label>
                <p className="text-xs text-gray-500">Add Birthday</p>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth || ''}
                  onChange={handleInputChange}
                  className="w-full px-3 py-1 text-sm border-3 border-yellow-400 rounded-lg focus:ring-0 focus:border-yellow-500 focus:outline-none"
                  aria-label="dateOfBirth"
                  required
                />
              </div>

              <div>
                <label className="block text-md font-medium">
                  Mobile*
                </label>
                <p className="text-xs text-gray-500">Guardian`s mobile number</p>
                <input
                  type="tel"
                  name="mobile"
                  value={formData.mobile || ''}
                  onChange={handleInputChange}
                  className="w-full px-3 py-1 text-sm border-3 border-yellow-400 rounded-lg focus:ring-0 focus:border-yellow-500 focus:outline-none"
                  placeholder="07XXXXXXXX"
                  pattern="[0-9]{10}"
                  required
                />
              </div>

              <div>
                <label className="block text-md font-medium">
                  Leave Date
                </label>
                <p className="text-xs text-gray-500">Leave date from the school</p>
                <input
                  type="date"
                  name="leaveDate"
                  value={formData.leaveDate || ''}
                  onChange={handleInputChange}
                  className="w-full px-3 py-1 text-sm border-3 border-yellow-400 rounded-lg focus:ring-0 focus:border-yellow-500 focus:outline-none"
                  aria-label="leaveDate"
                />
              </div>

              <div>
                <label className="block text-md font-medium">
                  Gender*
                </label>
                <select
                  name="gender"
                  value={formData.gender || ''}
                  onChange={handleInputChange}
                  className="w-full px-3 py-1 text-sm border-3 border-yellow-400 rounded-lg focus:ring-0 focus:border-yellow-500 focus:outline-none"
                  aria-label='gender'
                  required
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-1">
              <div>
                <label className="block text-md font-medium">
                  Address*
                </label>
                <p className="text-xs text-gray-500">Student resident address</p>
                <input
                  type="text"
                  name="address"
                  value={formData.address || ''}
                  onChange={handleInputChange}
                  className="w-full px-3 py-1 text-sm border-3 border-yellow-400 rounded-lg focus:ring-0 focus:border-yellow-500 focus:outline-none"
                  placeholder="Address"
                  required
                />
              </div>

              <div>
                <label className="block text-md font-medium">
                  Religion*
                </label>
                <p className="text-xs text-gray-500">Student religion</p>
                <input
                  type="text"
                  name="religion"
                  value={formData.religion || ''}
                  onChange={handleInputChange}
                  className="w-full px-3 py-1 text-sm border-3 border-yellow-400 rounded-lg focus:ring-0 focus:border-yellow-500 focus:outline-none"
                  placeholder="Religion"
                  required
                />
              </div>

              <div>
                <label className="block text-md font-medium">
                  Gardian*
                </label>
                <p className="text-xs text-gray-500">Students Father, Mother or Other</p>
                <input
                  type="text"
                  name="gardian"
                  value={formData.gardian || ''}
                  onChange={handleInputChange}
                  className="w-full px-3 py-1 text-sm border-3 border-yellow-400 rounded-lg focus:ring-0 focus:border-yellow-500 focus:outline-none"
                  aria-label="gardian"
                  required
                />
              </div>

              <div>
                  <label className="block text-md font-medium">
                    Addmission Date*
                  </label>
                  <p className="text-xs text-gray-500">School joined date</p>
                  <input
                    type="date"
                    name="addmissionDate"
                    value={formData.addmissionDate || ''}
                    onChange={handleInputChange}
                    className="w-full px-3 py-1 text-sm border-3 border-yellow-400 rounded-lg focus:ring-0 focus:border-yellow-500 focus:outline-none"
                    aria-label='Addmission Date'
                    placeholder='mm/dd/yyyy'
                    required
                  />
                </div>

              <div>
                <label className="block text-md font-medium">
                  3rd or Upper*
                </label>
                <p className="text-xs text-gray-500">Student is first child for this school from his family</p>
                <select
                  name="thiredOrUpper"
                  value={formData.thiredOrUpper.toString()}
                  onChange={handleInputChange}
                  className="w-full px-3 py-1 text-sm border-3 border-yellow-400 rounded-lg focus:ring-0 focus:border-yellow-500 focus:outline-none"
                  aria-label='gender'
                >
                  <option value="">Select</option>
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
              </div>

              <div>
                <label className="block text-md font-medium">
                  Teachers Child*
                </label>
                <p className="text-xs text-gray-500">Students father or mother is a teacher of this school</p>
                <select
                  name="teacherChild"
                  value={formData.teacherChild.toString()}
                  onChange={handleInputChange}
                  className="w-full px-3 py-1 text-sm border-3 border-yellow-400 rounded-lg focus:ring-0 focus:border-yellow-500 focus:outline-none"
                  aria-label='teacherChild'
                >
                  <option value="">Select</option>
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
              </div>

              <div>
                <label className="block text-md font-medium mb-1">
                  Class*
                </label>
                <select
                  name="classes"
                  value={formData.classes || ''}
                  onChange={handleInputChange}
                  className="w-full px-3 py-1 text-sm border-3 border-yellow-400 rounded-lg focus:ring-0 focus:border-yellow-500 focus:outline-none"
                  aria-label='classes'
                  required
                >
                  <option value="">Select Class</option>
                  {classes.map((cls) => (
                    <option key={cls.id} value={cls.id}>
                        {cls.name}
                    </option>
                 ))}
                </select>
              </div>
            </div>
          </div>
          
          <div className="flex mt-3 gap-4">
            <button
              type="button"
              onClick={onClose}
              className="w-full py-1.5 text-sm font-medium bg-yellow-400 rounded-lg hover:bg-yellow-500 shadow-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-full py-1.5 text-sm font-medium bg-[#1346DD] text-white rounded-lg hover:bg-blue-800 shadow-lg transition-colors"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : 'Save Student'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddStudentModal
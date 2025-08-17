/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import React, { useState, useEffect } from 'react'
import { FaSearch, FaEllipsisH } from 'react-icons/fa'
import { addStudent, searchStudents } from '@/service/adminRoutes'
import { Student } from '@/constants/types'
import { toast } from 'react-toastify'
import AddStudentModal from '../_components/AddStudentModel'
import { useRouter } from 'next/navigation'

function Page() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isAddMode, setIsAddMode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    address: "",
    gardian: "",
    gender: "",
    religion: "",
    mobile: "",
    thiredOrUpper: false,
    teacherChild: false,
    registerNo: "",
    addmissionDate: "",
    leaveDate: "",
    classes: null
  });
  const itemsPerPage = 8;
  const router = useRouter();

  const fetchStudents = async (term: string = '') => {
    try {
      setLoading(true)
      const response = await searchStudents({ searchTerm: term })
      if (response.data.success) {
        setStudents(response.data.data)
        setTotalPages(Math.ceil(response.data.data.length / itemsPerPage))
        setCurrentPage(1) // Reset to first page when search changes
      }
    } catch (error) {
      console.error('Error fetching students:', error)
    } finally {
      setLoading(false)
    }
  };

  // Initial fetch and real-time search with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchStudents(searchTerm)
    }, 500) // Debounce delay of 500ms

    return () => clearTimeout(timer)
  }, [searchTerm]);

  const paginatedStudents = students.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleAddClick = () => {
    setIsAddMode(true);
    setFormData({
      firstName: "",
      lastName: "",
      dateOfBirth: "",
      address: "",
      gardian: "",
      gender: "",
      religion: "",
      mobile: "",
      thiredOrUpper: false,
      teacherChild: false,
      registerNo: "",
      addmissionDate: "",
      leaveDate: "",
      classes: null
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (isAddMode) {
        const response = await addStudent(formData);
        if (response.data.success) {
          toast.success(response.data.message || 'Student created successfully');
          fetchStudents();
          setIsAddMode(false);
        } else {
          toast.error(response.data.message || 'Failed to create student');
        } 
      }
    } catch (error: any) {
      console.error('Error saving student:', error);
      toast.error(error.response?.data?.message || 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleViewStudent = (id: number) => {
    if (id) {
      router.push(`/Students/${id}`);
    }
  };

  return (
    <div className='max-w-7xl mx-auto p-6'>
      <div className='flex justify-between items-center gap-4 mb-6'>
        <button 
          className='bg-[#1346DD] text-sm text-white font-semibold px-6 py-2 rounded-lg whitespace-nowrap hover:bg-blue-700 transition shadow-lg'
          onClick={handleAddClick}
        >
          ADD STUDENT
        </button>

        <div className='relative flex-grow max-w-xs'>
          <FaSearch className='absolute left-3 top-2.5 text-black' />
          <input
            type='text'
            placeholder='Search Students...'
            className='w-full pl-10 pr-3 py-1.5 border-3 border-yellow-400 rounded-xl focus:outline-none focus:ring-0 text-sm shadow-lg'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className='bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200'>
        <div className='overflow-x-auto'>
          <table className='min-w-full divide-y divide-gray-200'>
            <thead className='bg-yellow-400/70'>
              <tr>
                <th className='px-6 py-3 text-center text-sm font-medium text-black tracking-wider'>Student Reg. No</th>
                <th className='px-6 py-3 text-center text-sm font-medium text-black tracking-wider'>Name</th>
                <th className='px-6 py-3 text-center text-sm font-medium text-black tracking-wider'>Date of Birth</th>
                <th className='px-6 py-3 text-center text-sm font-medium text-black tracking-wider'>Mobile</th>
                <th className='px-6 py-3 text-center text-sm font-medium text-black tracking-wider'>Religion</th>
                <th className='px-6 py-3 text-center text-sm font-medium text-black tracking-wider'></th>
              </tr>
            </thead>
            <tbody className='bg-white divide-y divide-gray-200'>
              {loading ? (
                <tr>
                  <td colSpan={6} className='px-6 py-4 text-center'>
                    Loading...
                  </td>
                </tr>
              ) : paginatedStudents.length > 0 ? (
                paginatedStudents.map((student) => (
                  <tr key={student.id} className='hover:bg-gray-50'>
                    <td className='px-6 py-4 text-center whitespace-nowrap text-sm text-gray-900'>{student.register_no}</td>
                    <td className='px-6 py-4 text-center whitespace-nowrap text-sm text-gray-900'>
                      {student.first_name} {student.last_name}
                    </td>
                    <td className='px-6 py-4 text-center whitespace-nowrap text-sm text-gray-900'>
                      {new Date(student.dob).toLocaleDateString()}
                    </td>
                    <td className='px-6 py-4 text-center whitespace-nowrap text-sm text-gray-900'>{student.mobile}</td>
                    <td className='px-6 py-4 text-center whitespace-nowrap text-sm text-gray-900 capitalize'>{student.religion}</td>
                    <td className='px-6 py-4 flex items-center justify-center whitespace-nowrap text-right text-sm font-medium'>
                      <button title='view' className='text-black text-lg font-bold' onClick={() => handleViewStudent(student.id)}>
                        <FaEllipsisH />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className='px-6 py-4 text-center text-sm text-black'>
                    No students found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      {students.length > 0 && (
        <div className='hidden sm:flex-1 sm:flex sm:items-center sm:justify-between'>
          <div>
            <p className='text-sm text-gray-700'>
              Showing <span className='font-medium'>{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
              <span className='font-medium'>
                {Math.min(currentPage * itemsPerPage, students.length)}
              </span>{' '}
              of <span className='font-medium'>{students.length}</span> results
            </p>
          </div>
          <div className='flex-1 flex justify-end mt-2 gap-1'>
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className='relative inline-flex items-center px-6 py-1 text-sm font-semibold rounded-l-lg text-white bg-[#1346DD] hover:bg-blue-700 shadow-lg'
            >
               &lt;
            </button>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className='relative inline-flex items-center px-6 py-1 text-sm font-semibold rounded-r-lg text-white bg-[#1346DD] hover:bg-blue-700 shadow-lg'
            >
              &gt;
            </button>
          </div>
        </div>
      )}

      <AddStudentModal
        isOpen={isAddMode}
        isSubmitting={isSubmitting}
        onClose={() => setIsAddMode(false)}
        onSubmit={handleSubmit}
        formData={formData}
        handleInputChange={handleInputChange}
        isAddMode={isAddMode}
      />
    </div>
  )
}

export default Page
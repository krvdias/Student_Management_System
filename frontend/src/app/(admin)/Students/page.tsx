/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import React, { useState, useEffect } from 'react'
import { FaSearch, FaEllipsisH, FaChevronDown } from 'react-icons/fa'
import { addStudent, searchStudents, getClasses } from '@/service/adminRoutes'
import { Student, ClassData } from '@/constants/types'
import { toast } from 'react-toastify'
import AddStudentModal from '../_components/AddStudentModel'
import { useRouter } from 'next/navigation'

function Page() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [classId, setClassId] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isAddMode, setIsAddMode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [classes, setClasses] = useState<ClassData[]>([]);
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

  const fetchStudents = async (term: string = '', classId: string = '') => {
    try {
      setLoading(true)
      const response = await searchStudents({ searchTerm: term, classId: classId })
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
    fetchClasses();
  },[]);

  // Initial fetch and real-time search with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchStudents(searchTerm, classId)
    }, 500) // Debounce delay of 500ms

    return () => clearTimeout(timer)
  }, [searchTerm, classId]);

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

        {/* Combined Filter Group */}
        <div className='flex items-center gap-2 bg-white rounded-xl border-3 border-yellow-400 shadow-lg'>
          {/* Class Filter Dropdown */}
          <div className='relative'>
            <select
              className='w-full px-4 py-1.5 focus:outline-none focus:ring-0 text-sm appearance-none pr-8 border-r border-gray-300'
              value={classId}
              onChange={(e) => setClassId(e.target.value)}
              aria-label='classId'
            >
              <option value="">All Classes</option>
              {classes.map((cls) => (
                <option key={cls.id} value={cls.id}>
                  {cls.name}
                </option>
              ))}
            </select>
            <FaChevronDown className='absolute right-2 top-2.5 text-gray-500 text-xs pointer-events-none' />
          </div>

          {/* Search Input */}
          <div className='relative flex items-center'>
            <FaSearch className='text-black ml-2' />
            <input
              type='text'
              placeholder='Search Students...'
              className='w-full pl-2 pr-3 py-1.5 focus:outline-none focus:ring-0 text-sm'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
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
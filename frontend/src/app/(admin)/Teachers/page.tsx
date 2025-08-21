/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import React, { useState, useEffect } from 'react'
import { FaSearch, FaTrash } from 'react-icons/fa'
import { FiEdit } from 'react-icons/fi'
import { addTeacher, searchTeachers, editTeacher, deleteTeacher } from '@/service/adminRoutes'
import { Teacher, TeacherData } from '@/constants/types'
import { toast } from 'react-toastify'
import AddTeacherModal from '../_components/AddTeacherModel'

function Page() {
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isAddMode, setIsAddMode] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [teacherToDelete, setTeacherToDelete] = useState<number | null>(null);
  const [formData, setFormData] = useState<TeacherData>({
    firstName: "",
    lastName: "",
    address: "",
    mobile: "",
    email: "",
    classes: null,
    training: false,
  });

  const itemsPerPage = 8;

  const fetchTeachers = async (term: string = '') => {
    try {
      setLoading(true);
      const response = await searchTeachers({ searchTerm: term });
      if (response.data.success) {
        setTeachers(response.data.data);
        setTotalPages(Math.ceil(response.data.data.length / itemsPerPage));
        setCurrentPage(1);
      }
    } catch (error) {
      console.error('Error fetching teachers:', error);
      toast.error('Failed to fetch teachers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchTeachers(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const paginatedTeachers = teachers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleAddClick = () => {
    setIsAddMode(true);
    setIsEditMode(false);
    setSelectedTeacher(null);
    setFormData({
      firstName: "",
      lastName: "",
      address: "",
      mobile: "",
      email: "",
      classes: null,
      training: false,
    });
  };

  const handleEditClick = (teacher: Teacher) => {
    setSelectedTeacher(teacher);
    setIsEditMode(true);
    setIsAddMode(false);
    setFormData({
      firstName: teacher.first_name,
      lastName: teacher.last_name,
      address: teacher.address,
      mobile: teacher.mobile,
      email: teacher.email,
      classes: teacher.class,
      training: teacher.training,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (isEditMode && selectedTeacher) {
        const response = await editTeacher(formData, selectedTeacher.id);
        if (response.data.success) {
          toast.success('Teacher updated successfully');
          fetchTeachers();
        } else {
          toast.error(response.data.message || 'Failed to update teacher');
        }
      } else {
        const response = await addTeacher(formData);
        if (response.data.success) {
          toast.success('Teacher added successfully');
          fetchTeachers();
        } else {
          toast.error(response.data.message || 'Failed to add teacher');
        }
      }
      setIsAddMode(false);
      setIsEditMode(false);
    } catch (error: any) {
      console.error('Error:', error);
      toast.error(error.response?.data?.message || 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const confirmDelete = async () => {
    if (!teacherToDelete) return;
    
    try {
      const response = await deleteTeacher(teacherToDelete);
      if (response.data.success) {
        toast.success('Teacher deleted successfully');
        fetchTeachers();
      } else {
        toast.error(response.data.message || 'Failed to delete teacher');
      }
    } catch (error: any) {
      console.error('Error deleting teacher:', error);
      toast.error(error.response?.data?.message || 'An error occurred');
    } finally {
      setShowDeleteConfirm(false);
      setTeacherToDelete(null);
    }
  };

  const renderDeleteConfirm = () => (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-3xl shadow-lg w-full max-w-sm">
        <div className='flex justify-between items-center mb-4'>
          <h2 className="text-2xl font-semibold">Confirm Delete</h2>
          <button 
            onClick={() => setShowDeleteConfirm(false)}
            className="text-black hover:text-gray-700 text-3xl font-light focus:outline-none"
            aria-label="Close"
          >
            &times;
          </button>
        </div>
        
        <p className="mb-6">Do you want to delete this teacher?</p>
        
        <div className="flex flex-col space-y-2">
          <button
            onClick={() => setShowDeleteConfirm(false)}
            className="px-4 py-2 bg-gray-200 rounded-xl hover:bg-gray-300 shadow-lg"
          >
            No, Cancel
          </button>
          <button
            onClick={confirmDelete}
            className="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 shadow-lg"
          >
            Yes, Delete
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className='max-w-7xl mx-auto p-6'>
      {/* Header and Search */}
      <div className='flex justify-between items-center gap-4 mb-6'>
        <button 
          className='bg-[#1346DD] text-sm text-white font-semibold px-6 py-2 rounded-lg whitespace-nowrap hover:bg-blue-700 transition shadow-lg'
          onClick={handleAddClick}
        >
          ADD TEACHER
        </button>

        <div className='relative flex-grow max-w-xs'>
          <FaSearch className='absolute left-3 top-2.5 text-black' />
          <input
            type='text'
            placeholder='Search teachers...'
            className='w-full pl-10 pr-3 py-1.5 border-3 border-yellow-400 rounded-xl focus:outline-none focus:ring-0 text-sm shadow-lg'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Teachers Table */}
      <div className='bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200'>
        <div className='overflow-x-auto'>
          <table className='min-w-full divide-y divide-gray-200'>
            <thead className='bg-yellow-400/70'>
              <tr>
                <th className='px-6 py-3 text-center text-sm font-medium text-black tracking-wider'>Name</th>
                <th className='px-6 py-3 text-center text-sm font-medium text-black tracking-wider'>Address</th>
                <th className='px-6 py-3 text-center text-sm font-medium text-black tracking-wider'>Mobile</th>
                <th className='px-6 py-3 text-center text-sm font-medium text-black tracking-wider'>Email</th>
                <th className='px-6 py-3 text-center text-sm font-medium text-black tracking-wider'>Training</th>
                <th className='px-6 py-3 text-center text-sm font-medium text-black tracking-wider'>Actions</th>
              </tr>
            </thead>
            <tbody className='bg-white divide-y divide-gray-200'>
              {loading ? (
                <tr>
                  <td colSpan={6} className='px-6 py-4 text-center'>
                    Loading...
                  </td>
                </tr>
              ) : paginatedTeachers.length > 0 ? (
                paginatedTeachers.map((teacher) => (
                  <tr key={teacher.id} className='hover:bg-gray-50'>
                    <td className='px-6 py-4 text-center whitespace-nowrap text-sm text-gray-900'>
                      {teacher.first_name} {teacher.last_name}
                    </td>
                    <td className='px-6 py-4 text-center whitespace-nowrap text-sm text-gray-900'>
                      {teacher.address}
                    </td>
                    <td className='px-6 py-4 text-center whitespace-nowrap text-sm text-gray-900'>
                      {teacher.mobile}
                    </td>
                    <td className='px-6 py-4 text-center whitespace-nowrap text-sm text-gray-900'>
                      {teacher.email}
                    </td>
                    <td className='px-6 py-4 text-center whitespace-nowrap text-sm text-gray-900'>
                      {teacher.training ? 'Yes' : 'No'}
                    </td>
                    <td className='px-6 py-4 flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium'>
                      <button 
                        title='Edit'
                        className='bg-[#1346DD] hover:bg-blue-700 text-white font-semibold p-2 rounded-lg transition shadow-lg' 
                        onClick={() => handleEditClick(teacher)}
                      >
                        <FiEdit className="w-4 h-4"/>
                      </button>
                      <button 
                        title='Delete'
                        className='bg-[#DD1313] hover:bg-red-700 text-white font-semibold p-2 rounded-lg transition shadow-lg' 
                        onClick={() => {
                          setTeacherToDelete(teacher.id);
                          setShowDeleteConfirm(true);
                        }}
                      >
                        <FaTrash className="w-4 h-4"/>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className='px-6 py-4 text-center text-sm text-black'>
                    No teachers found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {teachers.length > 0 && (
        <div className='hidden sm:flex-1 sm:flex sm:items-center sm:justify-between mt-1'>
          <div>
            <p className='text-sm text-gray-700'>
              Showing <span className='font-medium'>{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
              <span className='font-medium'>
                {Math.min(currentPage * itemsPerPage, teachers.length)}
              </span>{' '}
              of <span className='font-medium'>{teachers.length}</span> results
            </p>
          </div>
          <div className='flex-1 flex justify-end gap-1'>
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className='relative inline-flex items-center px-6 py-1 text-sm font-semibold rounded-l-lg text-white bg-[#1346DD] hover:bg-blue-700 shadow-lg '
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

      {/* Modals */}
      <AddTeacherModal
        isOpen={isAddMode || isEditMode}
        isSubmitting={isSubmitting}
        onClose={() => {
          setIsAddMode(false);
          setIsEditMode(false);
        }}
        onSubmit={handleSubmit}
        formData={formData}
        handleInputChange={handleInputChange}
        isAddMode={isAddMode}
      />

      {showDeleteConfirm && renderDeleteConfirm()}
    </div>
  );
}

export default Page;
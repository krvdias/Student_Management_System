/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useCallback } from 'react';
import { FaSearch, FaTrash } from 'react-icons/fa';
import { FiEdit } from 'react-icons/fi';
import { FeesForm, FeesData, ClassData } from '@/constants/types';
import { addFees, deleteFees, editFees, searchFees, getClasses } from '@/service/adminRoutes';
import { toast } from 'react-toastify';
import EditFeesModel from './FeesEdit';

function FeesComponent() {
  const [searchTerm, setSearchTerm] = useState('');
  const [fees, setFees] = useState<FeesData[]>([]);
  const [classes, setClasses] = useState<ClassData[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedFees, setSelectedFees] = useState<FeesData | null>(null);
  const [feesToDelete, setFeesToDelete] = useState<number | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [formData, setFormData] = useState<FeesForm>({
      classes: null,
      amount: "",
  });
  const [editFormData, setEditFormData] = useState<FeesForm>({
      classes: null,
      amount: "",
  });
  const itemsPerPage = 5;

  const fetchFees = async (term: string = '') => {
      try {
          setLoading(true);
          const response = await searchFees({ searchTerm: term });
          if (response.data.success) {
              setFees(response.data.data);
              setTotalPages(Math.ceil(response.data.data.length / itemsPerPage));
              setCurrentPage(1);
          }
      } catch (error) {
          console.error('Error fetching subjects:', error);
          toast.error('Failed to fetch subjects');
      } finally {
          setLoading(false);
      }
  };

  useEffect(() => {
      const timer = setTimeout(() => {
          fetchFees(searchTerm);
      }, 500);

      return () => clearTimeout(timer);
  }, [searchTerm]);

  const paginatedFees = fees.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
  );

  const fetchClasses = useCallback(async () => {
    try {
      const response = await getClasses();
      if (response.data.success) {
        setClasses(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching classes:', error);
    }
  }, []); // Empty dependency array means this function is memoized

  useEffect(() => {
    fetchClasses();
  }, [fetchClasses]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value, type } = e.target;
      const checked = (e.target as HTMLInputElement).checked;
      
      setFormData(prev => ({
          ...prev,
          [name]: type === 'checkbox' ? checked : value
      }));
  };

  // NEW: Separate handler for edit form
  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value, type } = e.target;
      const checked = (e.target as HTMLInputElement).checked;
      
      setEditFormData(prev => ({
          ...prev,
          [name]: type === 'checkbox' ? checked : value
      }));
  };
  
  const handleEditClick = (fees: FeesData) => {
      setSelectedFees(fees);
      setIsEditMode(true);
      setEditFormData({
          classes: fees.class,
          amount: fees.amount,
      });
  };

  const handleCancel = () => {
      setFormData({
          classes: null,
          amount: "",
      });
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setIsSubmitting(true);
  
      try {
          const response = await addFees(formData);
          if (response.data.success) {
              toast.success('Fees added successfully');
              handleCancel();
              fetchFees();
          } else {
              toast.error(response.data.message || 'Failed to add fees');
              handleCancel();
          }
      } catch (error: any) {
          console.error('Error:', error);
          toast.error(error.response?.data?.message || 'An error occurred');
      } finally {
          setIsSubmitting(false);
      }
  };

  // NEW: Separate submit handler for edit form
  const handleEditSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setIsSubmitting(true);
  
      try {
          if (selectedFees) {
              const response = await editFees(editFormData, selectedFees.id);
              if (response.data.success) {
                  toast.success('Fees updated successfully');
                  fetchFees();
                  setIsEditMode(false);
              } else {
                  toast.error(response.data.message || 'Failed to update fees');
              }
          }
      } catch (error: any) {
          console.error('Error:', error);
          toast.error(error.response?.data?.message || 'An error occurred');
      } finally {
          setIsSubmitting(false);
      }
  };
  
  const confirmDelete = async () => {
      if (!feesToDelete) return;
      
      try {
          const response = await deleteFees(feesToDelete);
          if (response.data.success) {
              toast.success('Fees deleted successfully');
              fetchFees();
          } else {
              toast.error(response.data.message || 'Failed to delete fees');
          }
      } catch (error: any) {
          console.error('Error deleting fees:', error);
          toast.error(error.response?.data?.message || 'An error occurred');
      } finally {
          setShowDeleteConfirm(false);
          setFeesToDelete(null);
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
              
              <p className="mb-6">Do you want to delete this Fees?</p>
              
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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-2">
          {/* Left side - Search and Table (2/3 width) */}
          <div className="lg:col-span-2 mt-2">
              <div className='relative mb-4 shadow-lg'>
                  <FaSearch className='absolute left-3 top-2.5 text-gray-500' />
                  <input
                      type='text'
                      placeholder='Search...'
                      className='w-full pl-10 pr-3 py-2 border-3 border-yellow-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-300 text-sm shadow-sm'
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                  />
              </div>

              <div className='bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200'>
                  <div className='overflow-x-auto'>
                      <table className='min-w-full divide-y divide-gray-200'>
                          <thead className='bg-yellow-400/70'>
                              <tr>
                                  <th className='px-6 py-3 text-center text-sm font-medium text-black tracking-wider'>Class</th>
                                  <th className='px-6 py-3 text-center text-sm font-medium text-black tracking-wider'>Amount</th>
                                  <th className='px-6 py-3 text-center text-sm font-medium text-black tracking-wider'></th>
                              </tr>
                          </thead>
                          <tbody className='bg-white divide-y divide-gray-200'>
                              {loading ? (
                                  <tr>
                                      <td colSpan={3} className='px-6 py-4 text-center'>
                                          Loading...
                                      </td>
                                  </tr>
                              ) : paginatedFees.length > 0 ? (
                                  paginatedFees.map((fees) => (
                                      <tr key={fees.id} className='hover:bg-gray-50'>
                                          <td className='px-6 py-4 text-center whitespace-nowrap text-sm text-gray-900'>{fees.classFees.name}</td>
                                          <td className='px-6 py-4 text-center whitespace-nowrap text-sm text-gray-900'>
                                              {fees.amount}
                                          </td>
                                          <td className='px-6 py-4 flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium'>
                                              <button 
                                                  title='Edit'
                                                  className='bg-[#1346DD] hover:bg-blue-700 text-white font-semibold p-2 rounded-lg transition shadow-lg' 
                                                  onClick={() => handleEditClick(fees)}
                                              >
                                                  <FiEdit className="w-4 h-4"/>
                                              </button>
                                              <button 
                                                  title='Delete'
                                                  className='bg-[#DD1313] hover:bg-red-700 text-white font-semibold p-2 rounded-lg transition shadow-lg' 
                                                  onClick={() => {
                                                      setFeesToDelete(fees.id);
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
                                      <td colSpan={5} className='px-6 py-4 text-center text-sm text-black'>
                                          No Fees found
                                      </td>
                                  </tr>
                              )}
                          </tbody>
                      </table>
                  </div>
              </div>
              
              {fees.length > 0 && (
                  <div className='hidden sm:flex-1 sm:flex sm:items-center sm:justify-between'>
                  <div>
                      <p className='text-sm text-gray-700'>
                      Showing <span className='font-medium'>{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
                      <span className='font-medium'>
                          {Math.min(currentPage * itemsPerPage, fees.length)}
                      </span>{' '}
                      of <span className='font-medium'>{fees.length}</span> results
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
          </div>

          {/* Right side - Add/Edit Form (1/3 width) */}
          <div className="bg-white rounded-3xl shadow-lg p-6 border border-gray-200">
              <h2 className="text-xl text-center font-bold mb-4">
                  New Fees Add
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-2">
                  <div>
                      <label className="block text-sm font-medium">
                          Class*
                      </label>
                      <p className="text-xs text-gray-500">Add Class</p>
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

                  <div>
                      <label className="block text-sm font-medium">
                          Amount*
                      </label>
                      <p className="text-xs text-gray-500">Add Amount</p>
                      <input
                          type="text"
                          name="amount"
                          value={formData.amount}
                          onChange={handleInputChange}
                          placeholder="fees amount"
                          className="w-full px-3 py-1 text-sm border-3 border-yellow-400 rounded-lg focus:ring-0 focus:border-yellow-500 focus:outline-none"
                          required
                          disabled={isSubmitting}
                      />
                  </div>

                  <div className="flex flex-col gap-3 pt-4 mt-30">
                      <button
                          type="button"
                          onClick={handleCancel}
                          className="flex-1 w-full py-1.5 bg-yellow-400  rounded-lg hover:bg-yellow-500 transition-colors shadow-sm"
                          disabled={isSubmitting}
                      >
                          Cancel
                      </button>
                      <button
                          type="submit"
                          className="flex-1 w-full py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 shadow-sm"
                          disabled={isSubmitting}
                      >
                          {isSubmitting ? 'Saving...' : 'Save Fees'}
                      </button>
                  </div>
              </form>
          </div>

          <EditFeesModel
              isOpen={isEditMode}
              isSubmitting={isSubmitting}
              onClose={() => setIsEditMode(false)}
              onSubmit={handleEditSubmit} // Use the new edit submit handler
              editFormData={editFormData}
              handleInputChange={handleEditInputChange} // Use the new edit input handler
          />

          {showDeleteConfirm && renderDeleteConfirm()}
      </div>
  )
}

export default FeesComponent;
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import React, {useState, useEffect} from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { MarkData, MarkResponse} from '@/constants/types'
import { toast } from 'react-toastify'
import AddMarkModal from '../../../_components/AddMarkModel'
import { FaSearch, FaTrash } from 'react-icons/fa'
import { FiEdit } from 'react-icons/fi'
import { deleteMark, editMark, getAllMarks } from '@/service/adminRoutes'

function Page() {
  const router = useRouter();
  const { id } = useParams();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedMark, setSelectedMark] = useState<MarkResponse | null>(null)
  const [requestData, setRequestData] = useState({
    searchTerm: '',
    id: id ? parseInt(id as string) : null,
  });
  const [formData, setFormData] = useState<MarkData>({
    registerNo: "",
    term: "",
    subject: null,
    marks: ""
  });
  const [marks, setMarks] = useState<MarkResponse[]>([]);
  const [markToDelete, setMarkToDelete] = useState<number | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const itemsPerPage = 8;

  const firstName = searchParams.get('firstName') || '';
  const lastName = searchParams.get('lastName') || '';
  const registerNo = searchParams.get('registerNo') || '';

  const fetchMarks = async () => {
    try {
        setLoading(true);
        const response = await getAllMarks(requestData);
        if (response.data.success) {
            setMarks(response.data.data);
            setTotalPages(Math.ceil(response.data.data.length / itemsPerPage));
            setCurrentPage(1);
        } else {
            toast.error('Failed to fetch marks');
        }
    } catch (error) {
        console.error('Error fetching marks:', error);
        toast.error('Error fetching marks');
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
      fetchMarks();
  }, [requestData.searchTerm]);
  
  const handleBack = () => {
      router.back();
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRequestData({
    ...requestData,
    searchTerm: e.target.value
    });
  };

  const paginatedMarks = marks.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleEditClick = async (mark: MarkResponse) => {
    setIsEditMode(true);
    setSelectedMark(mark);
    setFormData({
    registerNo: registerNo,
    term: mark.term || "",
    subject: mark.subject?.id || null,
    marks: mark.marks || ""
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
    ...prev,
    [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
        if (isEditMode && selectedMark) {
            const response = await editMark(formData, selectedMark.id);
            if (response.data.success) {
                toast.success(response.data.message || 'Mark updated successfully');
                fetchMarks();
                setIsEditMode(false);
            } else {
                toast.error(response.data.message || 'Failed to update mark');
            }
        } 
        setIsEditMode(false);
    } catch (error: any) {
        console.error('Error saving mark:', error);
        toast.error(error.response?.data?.message || 'An error occurred');
    } finally {
        setIsSubmitting(false);
    }
  };

  const confirmDelete = async () => {
      if (markToDelete) {
        try {
          const response = await deleteMark(markToDelete);
          if (response.data.success) {
            toast.success(response.data.message || 'Mark deleted successfully');
            fetchMarks();
            setShowDeleteConfirm(false);
            setMarkToDelete(null);
          } else {
            toast.error(response.data.message || 'Failed to delete mark');
          }
        } catch (error: any) {
          console.error('Error deleting mark:', error);
          toast.error(error.response?.data?.message || 'An error occurred');
        }
      } else {
        toast.error('No mark selected for deletion');
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
        
        <p className="mb-6">Are you sure you want to delete this mark?</p>
        
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
        <div className='flex justify-between items-center gap-2 mb-2'>
            <div className='space-y-1'>
                <h2 className='text-2xl font-semibold'>{firstName} {lastName}</h2>
                <p className='text-sm text-gray-600'>{registerNo}</p>
            </div>

            <div className="relative flex-grow flex-col  max-w-xs">
                <FaSearch className='absolute left-3 top-2.5 text-black' />
                <input
                    type='text'
                    placeholder='Search Marks...'
                    className='w-full pl-10 pr-3 py-1.5 border-3 border-yellow-400 rounded-xl focus:outline-none focus:ring-0 text-sm shadow-lg'
                    value={requestData.searchTerm}
                    onChange={handleSearchChange}
                />
            </div>
        </div>

        <div className='bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200'>
            <div className='overflow-x-auto'>
                <table className='min-w-full divide-y divide-gray-200'>
                <thead className='bg-yellow-400/70'>
                    <tr>
                    <th className='px-6 py-3 text-center text-sm font-medium text-black tracking-wider'>Subject</th>
                    <th className='px-6 py-3 text-center text-sm font-medium text-black tracking-wider'>Year</th>
                    <th className='px-6 py-3 text-center text-sm font-medium text-black tracking-wider'>Term</th>
                    <th className='px-6 py-3 text-center text-sm font-medium text-black tracking-wider'>Marks</th>
                    <th className='px-6 py-3 text-center text-sm font-medium text-black tracking-wider'>Grade</th>
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
                    ) : paginatedMarks.length > 0 ? (
                    paginatedMarks.map((mark) => (
                        <tr key={mark.id} className='hover:bg-gray-50'>
                        <td className='px-6 py-4 text-center whitespace-nowrap text-sm text-gray-900'>{mark.subject?.name || 'N/A'}</td>
                        <td className='px-6 py-4 text-center whitespace-nowrap text-sm text-gray-900'>
                            {mark.year || 'N/A'}
                        </td>
                        <td className='px-6 py-4 text-center whitespace-nowrap text-sm text-gray-900'>
                            {mark.term || 'N/A'}
                        </td>
                        <td className='px-6 py-4 text-center whitespace-nowrap text-sm text-gray-900'>{mark.marks || 'N/A'}</td>
                        <td className='px-6 py-4 text-center whitespace-nowrap text-sm text-gray-900 capitalize'>{mark.grade || 'N/A'}</td>
                        <td className='px-6 py-4 flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium'>
                            <button 
                            title='Edit'
                            className='bg-[#1346DD] hover:bg-blue-700 text-white font-semibold p-2 rounded-lg transition shadow-lg' 
                            onClick={() => handleEditClick(mark)}
                            >
                            <FiEdit className="w-4 h-4" />
                            </button>
                            <button 
                            title='Delete'
                            className='bg-[#DD1313] hover:bg-red-700 text-white font-semibold p-2 rounded-lg transition shadow-lg' 
                            onClick={() => {
                                setMarkToDelete(mark.id as number);
                                setShowDeleteConfirm(true);
                            }}
                            >
                            <FaTrash className="w-4 h-4" />
                            </button>
                        </td>
                        </tr>
                    ))
                    ) : (
                    <tr>
                        <td colSpan={6} className='px-6 py-4 text-center text-sm text-black'>
                        No marks found
                        </td>
                    </tr>
                    )}
                </tbody>
                </table>
            </div>
        </div>
            
        {marks.length > 0 && (
        <div className='hidden sm:flex-1 sm:flex sm:items-center sm:justify-between'>
            <div>
            <p className='text-sm text-gray-700'>
                Showing <span className='font-medium'>{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
                <span className='font-medium'>
                {Math.min(currentPage * itemsPerPage, marks.length)}
                </span>{' '}
                of <span className='font-medium'>{marks.length}</span> results
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

        <div className='flex mt-2'>
            <button
                onClick={handleBack}
                className='bg-[#1346DD] text-sm font-semibold text-white px-6 py-1 rounded-lg hover:bg-blue-800 transition'
                title='Back to Students List'
            >
                &lt; Back
            </button>
        </div>

        <AddMarkModal
            isOpen={isEditMode}
            isSubmitting={isSubmitting}
            onClose={() => setIsEditMode(false)}
            onSubmit={handleSubmit}
            formData={formData}
            handleInputChange={handleInputChange}
            isAddMode={false}
        />

        {showDeleteConfirm && renderDeleteConfirm()}
    </div>
  )
}

export default Page
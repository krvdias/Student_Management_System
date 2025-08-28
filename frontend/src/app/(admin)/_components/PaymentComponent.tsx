/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import React, { useState, useEffect } from 'react'
import { FaEllipsisH } from 'react-icons/fa'
import { toast } from 'react-toastify'
import { addPayment, searchPayment} from '@/service/adminRoutes'
import { PaymentData } from '@/constants/types'
import AddPaymentModel from './AddPaymentModel'

interface PaymentComponentProps {
  searchTerm: string;
}

function PaymentComponent({ searchTerm }: PaymentComponentProps) {
  const [payment, setPayment] = useState<PaymentData[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isAddMode, setIsAddMode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [studentId, setStudentId] = useState(null as number | null);
  const [formData, setFormData] = useState({
    student: null as number | null,
    billId: "",
    term: "",
    method: "",
    discount: 0 
  });
  const itemsPerPage = 8;

  const fetchPayments = async (term: string = '') => {
    try {
      setLoading(true)
      const response = await searchPayment({ searchTerm: term });
      if (response.data.success) {
        setPayment(response.data.data);
        setTotalPages(Math.ceil(response.data.data.length / itemsPerPage))
        setCurrentPage(1) 
      } 
    } catch (error) {
      console.error('Error fetching students:', error)
    } finally {
      setLoading(false)
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchPayments(searchTerm)
    }, 500) // Debounce delay of 500ms

    return () => clearTimeout(timer)
  }, [searchTerm]);

  const paginatedPayments = payment.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleViewpay = (id: number) => {
    if (id) {
      setStudentId(id);
      setIsAddMode(true);
      setFormData({
        student: id,
        billId: "",
        term: "",
        method: "",
        discount: 0
      });
    }
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
        const response = await addPayment(formData);
        if (response.data.success) {
          toast.success(response.data.message || 'payment added successfully');
          fetchPayments();
          setIsAddMode(false);
        } else {
          toast.error(response.data.message || 'Failed to add payment');
        }
      }
    } catch (error: any) {
      console.error('Error saving payment:', error);
      toast.error(error.response?.data?.message || 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className='max-w-7xl mx-auto'>
      <div className='bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200'>
        <div className='overflow-x-auto'>
          <table className='min-w-full divide-y divide-gray-200'>
            <thead className='bg-yellow-400/70'>
              <tr>
                <th className='px-6 py-3 text-center text-sm font-medium text-black tracking-wider'>pay Reg. No</th>
                <th className='px-6 py-3 text-center text-sm font-medium text-black tracking-wider'>Term</th>
                <th className='px-6 py-3 text-center text-sm font-medium text-black tracking-wider'>Bill ID</th>
                <th className='px-6 py-3 text-center text-sm font-medium text-black tracking-wider'>Payment Date</th>
                <th className='px-6 py-3 text-center text-sm font-medium text-black tracking-wider'>Method</th>
                <th className='px-6 py-3 text-center text-sm font-medium text-black tracking-wider'>Status</th>
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
              ) : paginatedPayments.length > 0 ? (
                paginatedPayments.map((pay) => (
                  <tr key={pay.id} className='hover:bg-gray-50'>
                    <td className='px-6 py-4 text-center whitespace-nowrap text-sm text-gray-900'>{pay.studentTFees.register_no || 'Not Available'}</td>
                    <td className='px-6 py-4 text-center whitespace-nowrap text-sm text-gray-900'>
                      {pay.term || 'Not Available'}
                    </td>
                    <td className='px-6 py-4 text-center whitespace-nowrap text-sm text-gray-900'>
                      {pay.bill_id || 'Not Available'}
                    </td>
                    <td className='px-6 py-4 text-center whitespace-nowrap text-sm text-gray-900'>{pay?.payed_date && pay.payed_date !== null ? new Date(pay.payed_date).toLocaleDateString() : 'Not Available'}</td>
                    <td className='px-6 py-4 text-center whitespace-nowrap text-sm text-gray-900 capitalize'>{pay.method || 'Not Available'}</td>
                    <td className='px-6 py-4 text-center whitespace-nowrap text-sm'>
                      {pay.status ? (
                        <span className={`px-3 py-2 rounded-xl text-xs font-medium capitalize ${
                          pay.status.toLowerCase() === 'paid' 
                            ? 'bg-green-200 text-green-800' 
                            : pay.status.toLowerCase() === 'pending' 
                              ? 'bg-yellow-200 text-yellow-800' 
                              : pay.status.toLowerCase() === 'not paid' || pay.status.toLowerCase() === 'not payed'
                                ? 'bg-red-200 text-red-800'
                                : 'bg-gray-100 text-gray-800'
                        }`}>
                          {pay.status.toUpperCase()}
                        </span>
                      ) : (
                        <span className="text-gray-500">Not Available</span>
                      )}
                    </td>
                    <td className='px-6 py-4 flex items-center justify-center whitespace-nowrap text-right text-sm font-medium'>
                      <button title='view' className='text-black text-lg font-bold' onClick={() => handleViewpay(pay.studentTFees.id)}>
                        <FaEllipsisH />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className='px-6 py-4 text-center text-sm text-black'>
                    No payment found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {payment.length > 0 && (
        <div className='hidden sm:flex-1 sm:flex sm:items-center sm:justify-between'>
          <div>
            <p className='text-sm text-gray-700'>
              Showing <span className='font-medium'>{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
              <span className='font-medium'>
                {Math.min(currentPage * itemsPerPage, payment.length)}
              </span>{' '}
              of <span className='font-medium'>{payment.length}</span> results
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

      <AddPaymentModel 
        isOpen={isAddMode}
        isSubmitting={isSubmitting}
        onClose={() => setIsAddMode(false)}
        onSubmit={handleSubmit}
        formData={formData}
        handleInputChange={handleInputChange}
        isAddMode={isAddMode}
        studentId={studentId}
      />

    </div>
  )
}

export default PaymentComponent
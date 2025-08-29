'use client'

import React, { useState, useEffect } from 'react'
import { PaymentForm, PayData, feesTStudent } from '@/constants/types'
import { getPayment, getFees } from '@/service/adminRoutes'

interface AddPaymentModalProps {
    isOpen: boolean
    isSubmitting: boolean
    onClose: () => void
    onSubmit: (e: React.FormEvent) => Promise<void>
    formData: PaymentForm
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void
    isAddMode: boolean
    studentId: number | null
}

const AddPaymentModal: React.FC<AddPaymentModalProps> = ({
  isOpen,
  isSubmitting,
  onClose,
  onSubmit,
  formData,
  handleInputChange,
  isAddMode,
  studentId
}) => {
    const [payments, setPayments] = useState<feesTStudent[]>([]);
    const [studentData, setStudentData] = useState<PayData | null>(null);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [amount, setAmount] = useState<number>(0);
    const [discountedAmount, setDiscountedAmount] = useState<number>(0);
    const itemsPerPage = 3;

    const fetchPayments = async (studentId: number | null) => {
        if (!studentId) return;
        
        try {
            setLoading(true)
            const response = await getPayment(studentId);
            if (response.data.success) {
                setStudentData(response.data.data);
                setPayments(response.data.data.feesTStudent || []);
                setTotalPages(Math.ceil(response.data.data.length / itemsPerPage))
                setCurrentPage(1) 
            } 
        } catch (error) {
            console.error('Error fetching payment:', error);
        } finally {
            setLoading(false)
        }
    };

    const fetchAmount = async (studentId: number | null) => {
        if (!studentId) return;

        try {
            const responce = await getFees(studentId);
            if (responce.data.success) {
                const feeAmount = responce.data.data.amount || 0;
                setAmount(parseFloat(feeAmount));
                setDiscountedAmount(parseFloat(feeAmount)); // Initialize with full amount
            }
        } catch (error) {
            console.error('Error fetching fee:', error);
            setAmount(0);
            setDiscountedAmount(0);
        }
    };

    useEffect(() => {
        if (isOpen && studentId) {
            fetchPayments(studentId);
            fetchAmount(studentId);
        }
    }, [isOpen, studentId]);

    // Calculate discounted amount when discount changes
    useEffect(() => {
        if (amount > 0 && formData.discount) {
            const discountValue = parseFloat(formData.discount.toString());
            const discountAmount = (amount * discountValue) / 100;
            setDiscountedAmount(amount - discountAmount);
        } else {
            setDiscountedAmount(amount);
        }
    }, [formData.discount, amount]);

    const handleDiscountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        handleInputChange(e);
        
        // Also update discounted amount in real-time
        if (amount > 0 && e.target.value) {
            const discountValue = parseFloat(e.target.value);
            const discountAmount = (amount * discountValue) / 100;
            setDiscountedAmount(amount - discountAmount);
        } else {
            setDiscountedAmount(amount);
        }
    };

    const paginatedPayments = payments.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    // Function to render discount description with different colors
    const renderDiscountDescription = () => {
        if (!studentData) return null;
        
        const elements = [];
        
        if (studentData.religion === "Adventis" || studentData.religion === "adventis") {
            elements.push(
                <span key="religion" className="text-blue-600 font-medium">
                    Adventis
                </span>
            );
        }
        
        if (studentData.thired_or_upper) {
            if (elements.length > 0) elements.push(<span key="sep1">, </span>);
            elements.push(
                <span key="third_upper" className="text-green-600 font-medium">
                    3rd or Upper
                </span>
            );
        }
        
        if (studentData.teacher_child) {
            if (elements.length > 0) elements.push(<span key="sep2">, </span>);
            elements.push(
                <span key="teacher_child" className="text-purple-600 font-medium">
                    Teacher`s Child
                </span>
            );
        }
        
        if (elements.length === 0) {
            return <span className="text-gray-500">No special discounts</span>;
        }
        
        return (
            <p className="text-xs text-gray-500">
                Add Discount for: {elements}
            </p>
        );
    };

    if (!isOpen) return null;

    const title = isAddMode ? 'Payment Update' : 'Payment Update';

    return (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-3xl shadow-lg w-full max-w-4xl max-h-[100vh] overflow-y-auto">
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

                <div className='flex justify-between items-start'>
                    {/* Student Info */}
                    {studentData && (
                        <div>
                            <div className='flex items-center mt-3'>
                                <label className='text-sm font-medium w-40'>Student Reg No:</label>
                                <p className='text-sm '>{studentData.register_no}</p>
                            </div>
                            <div className='flex items-center gap-2 mb-3'>
                                <label className='text-sm font-medium w-38'>Name:</label>
                                <p className='text-sm'>{studentData.first_name} {studentData.last_name}</p>
                            </div>
                        </div>
                    )}
                    
                    {/* Fee Amount Preview */}
                    <div className='bg-yellow-100 p-3 rounded-xl border border-yellow-300'>
                        <div className='text-sm font-medium text-gray-700'>Fee Amount:</div>
                        <div className='text-2xl font-bold'>
                            Rs. {typeof discountedAmount === 'number' ? discountedAmount.toFixed(2) : '0.00'}
                        </div>
                        {formData.discount && parseFloat(formData.discount.toString()) > 0 && (
                            <div className='text-xs text-green-600 mt-1'>
                                After {formData.discount}% discount
                                {amount > 0 && (
                                    <span> (Original: Rs. {amount.toFixed(2)})</span>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                <form onSubmit={onSubmit}>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
                        {/* Left Column */}
                        <div className="space-y-1">
                            <div>
                                <label className="block text-sm font-medium">
                                Term*
                                </label>
                                <p className="text-xs text-gray-500">Payment assign term</p>
                                <select
                                    name="term"
                                    value={formData.term || ''}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-1 text-sm border-3 border-yellow-400 rounded-lg focus:ring-0 focus:border-yellow-500 focus:outline-none"
                                    aria-label='term'
                                    required
                                    >
                                    <option value="">Select Term</option>
                                    <option value="1st Term">1st Term</option>
                                    <option value="2nd Term">2nd Term</option>
                                    <option value="3rd Term">3rd Term</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium">
                                Payment Method*
                                </label>
                                <p className="text-xs text-gray-500">Select payment method</p>
                                <select
                                    name="method"
                                    value={formData.method || ''}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-1 text-sm border-3 border-yellow-400 rounded-lg focus:ring-0 focus:border-yellow-500 focus:outline-none"
                                    aria-label='method'
                                    required
                                    >
                                    <option value="">Select Method</option>
                                    <option value="VISA">VISA</option>
                                    <option value="MASTER">MASTER</option>
                                    <option value="CASH">CASH</option>
                                    <option value="BANK TRANSFER">BANK TRANSFER</option>
                                </select>
                            </div>
                        </div>

                        {/* Right Column */}
                        <div className="space-y-1">
                            <div>
                                <label className="block text-sm font-medium">
                                Bill ID*
                                </label>
                                <p className="text-xs text-gray-500">Bill identification number</p>
                                <input
                                type="text"
                                name="billId"
                                value={formData.billId || ''}
                                onChange={handleInputChange}
                                className="w-full px-3 py-1 text-sm border-3 border-yellow-400 rounded-lg focus:ring-0 focus:border-yellow-500 focus:outline-none"
                                aria-label="billId"
                                required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium">
                                Discount*
                                </label>
                                {renderDiscountDescription()}
                                <input
                                type="number"
                                name="discount"
                                min="0"
                                max="100"
                                value={formData.discount || ''}
                                onChange={handleDiscountChange}
                                className="w-full px-3 py-1 text-sm border-3 border-yellow-400 rounded-lg focus:ring-0 focus:border-yellow-500 focus:outline-none"
                                placeholder="Discount percentage"
                                required
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex mt-5 mb-5 gap-4">
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
                        {isSubmitting ? 'Adding...' : 'Add Payment'}
                        </button>
                    </div>
                </form>

                <div className='bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200'>
                    <div className='overflow-x-auto'>
                        <table className='min-w-full divide-y divide-gray-200'>
                            <thead className='bg-yellow-400/70'>
                                <tr>
                                <th className='px-4 py-2 text-center text-sm font-medium text-black tracking-wider'>Term</th>
                                <th className='px-4 py-2 text-center text-sm font-medium text-black tracking-wider'>Bill ID</th>
                                <th className='px-4 py-2 text-center text-sm font-medium text-black tracking-wider'>Payment Date</th>
                                <th className='px-4 py-2 text-center text-sm font-medium text-black tracking-wider'>Amount</th>
                                <th className='px-4 py-2 text-center text-sm font-medium text-black tracking-wider'>Method</th>
                                <th className='px-4 py-2 text-center text-sm font-medium text-black tracking-wider'>Status</th>
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
                                paginatedPayments.map((payment) => (
                                    <tr key={payment.id} className='hover:bg-gray-50'>
                                        <td className='px-4 py-3 text-center whitespace-nowrap text-sm text-gray-900'>{payment.term}</td>
                                        <td className='px-4 py-3 text-center whitespace-nowrap text-sm text-gray-900'>
                                            {payment.bill_id || 'Not Available'}
                                        </td>
                                        <td className='px-4 py-3 text-center whitespace-nowrap text-sm text-gray-900'>
                                            {payment.payed_date ? new Date(payment.payed_date).toLocaleDateString() : 'Not Available'}
                                        </td>
                                        <td className='px-4 py-3 text-center whitespace-nowrap text-sm text-gray-900'>
                                            {payment.fees ? `Rs. ${payment.fees}` : 'Not Available'}
                                        </td>
                                        <td className='px-4 py-3 text-center whitespace-nowrap text-sm text-gray-900 capitalize'>
                                            {payment.method || 'Not Available'}
                                        </td>
                                        <td className='px-4 py-3 text-center whitespace-nowrap text-sm font-medium'>
                                            {payment.status ? (
                                                <span className={`px-3 py-2 rounded-xl text-xs font-medium capitalize ${
                                                payment.status.toLowerCase() === 'paid' 
                                                    ? 'bg-green-200 text-green-800' 
                                                    : payment.status.toLowerCase() === 'pending' 
                                                    ? 'bg-yellow-200 text-yellow-800' 
                                                    : payment.status.toLowerCase() === 'not paid' || payment.status.toLowerCase() === 'not payed'
                                                        ? 'bg-red-200 text-red-800'
                                                        : 'bg-gray-100 text-gray-800'
                                                }`}>
                                                {payment.status.toUpperCase()}
                                                </span>
                                            ) : (
                                                <span className="text-gray-500">Not Available</span>
                                            )}
                                        </td>
                                    </tr>
                                ))
                                ) : (
                                <tr>
                                    <td colSpan={6} className='px-6 py-4 text-center text-sm text-black'>
                                    No payments found
                                    </td>
                                </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
                      
                {payments.length > 0 && (
                <div className='hidden sm:flex-1 sm:flex sm:items-center sm:justify-between'>
                    <div>
                        <p className='text-sm text-gray-700'>
                        Showing <span className='font-medium'>{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
                        <span className='font-medium'>
                            {Math.min(currentPage * itemsPerPage, payments.length)}
                        </span>{' '}
                        of <span className='font-medium'>{payments.length}</span> results
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
        </div>
    )
}

export default AddPaymentModal;
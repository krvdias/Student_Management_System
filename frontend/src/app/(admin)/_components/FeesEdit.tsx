'use client'

import { FeesForm, ClassData } from "@/constants/types"
import { useState, useEffect } from "react";
import { getClasses } from "@/service/adminRoutes";

interface EditFeesModelProps {
    isOpen: boolean;
    isSubmitting: boolean;
    onClose: () => void;
    onSubmit: (e: React.FormEvent) => Promise<void>;
    editFormData: FeesForm
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

const EditFeesModel: React.FC<EditFeesModelProps> = ({
    isOpen,
    isSubmitting,
    onClose,
    onSubmit,
    editFormData,
    handleInputChange
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
    
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-3xl shadow-lg w-full max-w-sm max-h-[100vh] overflow-y-auto">
                <div className='flex justify-between items-center mb-2'>
                    <h2 className='text-2xl font-semibold'>Edit Fees</h2>
                    <button 
                        className='text-black hover:text-gray-700 text-3xl font-light focus:outline-none'
                        onClick={onClose}
                    >
                     &times;
                    </button>
                </div>

                <form onSubmit={onSubmit}>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium">
                                Class*
                            </label>
                            <p className="text-xs text-gray-500">Add Class</p>
                            <select
                                name="classes"
                                value={editFormData.classes || ''}
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
                                value={editFormData.amount}
                                onChange={handleInputChange}
                                placeholder="Fees amount"
                                className="w-full px-3 py-1 text-sm border-3 border-yellow-400 rounded-lg focus:ring-0 focus:border-yellow-500 focus:outline-none"
                                required
                            />
                        </div>

                        <div className="flex flex-col gap-3 pt-4">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 w-full py-1.5 bg-yellow-400 rounded-lg hover:bg-yellow-500 transition-colors shadow-sm"
                                disabled={isSubmitting}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="flex-1 w-full py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 shadow-sm"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Processing...' : 'Edit Fees'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default EditFeesModel;
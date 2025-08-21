'use client'

import { MarkData, SubjectData } from "@/constants/types";
import { getSubjects } from "@/service/adminRoutes";
import React, { useState, useEffect } from "react";

interface AddMarkModalProps {
    isOpen: boolean;
    isSubmitting: boolean;
    onClose: () => void;
    onSubmit: (e: React.FormEvent) => Promise<void>;
    formData: MarkData
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    isAddMode: boolean
}

const AddMarkModal: React.FC<AddMarkModalProps> = ({
    isOpen,
    isSubmitting,
    onClose,
    onSubmit,
    formData,
    handleInputChange,
    isAddMode
}) => {
    const [subjects, setSubjects] = useState<SubjectData[]>([]);
    
    const fetchSubjects = async () => {
        try {
            const response = await getSubjects();
            if (response.data.success) {
            setSubjects(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching subjects:', error);
        }
    };

    useEffect(() => {
        if (isOpen) {  // Only fetch subjects when modal is open
            fetchSubjects();
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const title = isAddMode ? "Add Mark" : "Edit Mark";
    const buttonText = isAddMode ? "Add Mark" : "Update Mark";

    return (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-3xl shadow-lg w-full max-w-sm max-h-[100vh] overflow-y-auto">
                <div className='flex justify-between items-center mb-2'>
                    <h2 className='text-2xl font-semibold'>{title}</h2>
                    <button 
                        className='text-black hover:text-gray-700 text-3xl font-light focus:outline-none'
                        onClick={onClose}
                    >
                     &times;
                    </button>
                </div>

                <form onSubmit={onSubmit}>
                    <div className="space-y-1/2">
                        <div>
                            <label className="block text-md font-medium">
                            Student Reg No*
                            </label>
                            <p className="text-xs text-gray-500">Add register number </p>
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
                            Term*
                            </label>
                            <p className="text-xs text-gray-500">Add term</p>
                            <select
                            name="term"
                            value={formData.term}
                            onChange={handleInputChange}
                            className="w-full px-3 py-1 text-sm border-3 border-yellow-400 rounded-lg focus:ring-0 focus:border-yellow-500 focus:outline-none"
                            aria-label='term'
                            required
                            >
                            <option value="">Select</option>
                            <option value="1st Term">1st Term</option>
                            <option value="2nd Term">2nd Term</option>
                            <option value="3rd Term">3rd Term</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-md font-medium">
                            Subject*
                            </label>
                            <p className="text-xs text-gray-500">Add subject</p>
                            <select
                            name="subject"
                            value={formData.subject || ''}
                            onChange={handleInputChange}
                            className="w-full px-3 py-1 text-sm border-3 border-yellow-400 rounded-lg focus:ring-0 focus:border-yellow-500 focus:outline-none"
                            aria-label='Subject'
                            required
                            >
                            <option value="">Select Subject</option>
                            {subjects.map((sub) => (
                                <option key={sub.id} value={sub.id}>
                                    {sub.name}
                                </option>
                            ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-md font-medium">
                            Marks*
                            </label>
                            <p className="text-xs text-gray-500">Add Marks</p>
                            <input
                            type="number"
                            name="marks"
                            min="0"
                            max="100"
                            value={formData.marks || ''}
                            onChange={handleInputChange}
                            className="w-full px-3 py-1 text-sm border-3 border-yellow-400 rounded-lg focus:ring-0 focus:border-yellow-500 focus:outline-none"
                            placeholder="Marks"
                            required
                            />
                        </div>
                    </div>

                    <div className="flex mt-3 gap-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="w-full py-1.5 bg-yellow-400 rounded-xl hover:bg-yellow-500 shadow-lg"
                            disabled={isSubmitting}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="w-full py-1.5 bg-[#1346DD] text-white rounded-xl hover:bg-blue-800 shadow-lg"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Processing...' : buttonText}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default AddMarkModal;
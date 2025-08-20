'use client'

import { TeacherData, ClassData } from "@/constants/types";
import { getClasses } from "@/service/adminRoutes";
import React, { useState, useEffect } from "react";

interface AddTeacherModalProps {
    isOpen: boolean;
    isSubmitting: boolean;
    onClose: () => void;
    onSubmit: (e: React.FormEvent) => Promise<void>;
    formData: TeacherData
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    isAddMode: boolean
}

const AddTeacherModal: React.FC<AddTeacherModalProps> = ({
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

    if (!isOpen) return null;

    const title = isAddMode ? "Add Teacher" : "Edit Teacher";
    const buttonText = isAddMode ? "Add Teacher" : "Update Teacher";

    return (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-3xl shadow-lg w-full max-w-lg max-h-[100vh] overflow-y-auto">
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
                            pattern="^(94\d{9}|0\d{9}|\d{9})$"
                            required
                            />
                        </div>

                        <div>
                            <label className="block text-md font-medium">
                            Email*
                            </label>
                            <p className="text-xs text-gray-500">Guardian`s mobile number</p>
                            <input
                                title="Email"
                                type="email"
                                name="email"
                                value={formData.email || ''}
                                onChange={handleInputChange}
                                className="w-full px-3 py-1 text-sm border-3 border-yellow-400 rounded-lg focus:ring-0 focus:border-yellow-500 focus:outline-none"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-md font-medium">
                            Training*
                            </label>
                            <p className="text-xs text-gray-500">Students father or mother is a teacher of this school</p>
                            <select
                            name="training"
                            value={formData.training.toString()}
                            onChange={handleInputChange}
                            className="w-full px-3 py-1 text-sm border-3 border-yellow-400 rounded-lg focus:ring-0 focus:border-yellow-500 focus:outline-none"
                            aria-label='training'
                            >
                            <option value="">Select</option>
                            <option value="true">Yes</option>
                            <option value="false">No</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-md font-medium mb-1">
                            Class
                            </label>
                            <select
                            name="classes"
                            value={formData.classes || ''}
                            onChange={handleInputChange}
                            className="w-full px-3 py-1 text-sm border-3 border-yellow-400 rounded-lg focus:ring-0 focus:border-yellow-500 focus:outline-none"
                            aria-label='classes'
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

export default AddTeacherModal;
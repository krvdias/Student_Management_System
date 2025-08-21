'use client'

import { ClassForm } from "@/constants/types";

interface EditClassModelProps {
    isOpen: boolean;
    isSubmitting: boolean;
    onClose: () => void;
    onSubmit: (e: React.FormEvent) => Promise<void>;
    editFormData: ClassForm
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

const EditClassModel: React.FC<EditClassModelProps> = ({
    isOpen,
    isSubmitting,
    onClose,
    onSubmit,
    editFormData,
    handleInputChange
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-3xl shadow-lg w-full max-w-sm max-h-[100vh] overflow-y-auto">
                <div className='flex justify-between items-center mb-2'>
                    <h2 className='text-2xl font-semibold'>Edit Class</h2>
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
                                Class Name*
                            </label>
                            <p className="text-xs text-gray-500">Your class name</p>
                            <input
                                type="text"
                                name="name"
                                value={editFormData.name}
                                onChange={handleInputChange}
                                placeholder="Your class name"
                                className="w-full px-3 py-1 text-sm border-3 border-yellow-400 rounded-lg focus:ring-0 focus:border-yellow-500 focus:outline-none"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium">
                                Year*
                            </label>
                            <p className="text-xs text-gray-500">which years students in this class</p>
                            <input
                                type="text"
                                name="year"
                                value={editFormData.year}
                                onChange={handleInputChange}
                                placeholder="Which years students in this class"
                                className="w-full px-3 py-1 text-sm border-3 border-yellow-400 rounded-lg focus:ring-0 focus:border-yellow-500 focus:outline-none"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium">
                                Subject Count*
                            </label>
                            <p className="text-xs text-gray-500">Total Subject count this class have</p>
                            <input
                                type="number"
                                name="subjectCount"
                                value={editFormData.subjectCount}
                                onChange={handleInputChange}
                                placeholder="Total Subject count this class have"
                                min="0"
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
                                {isSubmitting ? 'Processing...' : 'Update Class'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default EditClassModel;
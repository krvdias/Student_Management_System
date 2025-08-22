'use client'

import { SubjectForm } from "@/constants/types";

interface EditSubjectModelProps {
    isOpen: boolean;
    isSubmitting: boolean;
    onClose: () => void;
    onSubmit: (e: React.FormEvent) => Promise<void>;
    editFormData: SubjectForm
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

const EditSubjectModel: React.FC<EditSubjectModelProps> = ({
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
                    <h2 className='text-2xl font-semibold'>Edit Subject</h2>
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
                                Subject ID*
                            </label>
                            <p className="text-xs text-gray-500">Subjects assigned Id</p>
                            <input
                                type="text"
                                name="subjectId"
                                value={editFormData.subjectId}
                                onChange={handleInputChange}
                                placeholder="Suject Id"
                                className="w-full px-3 py-1 text-sm border-3 border-yellow-400 rounded-lg focus:ring-0 focus:border-yellow-500 focus:outline-none"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium">
                                Subject Name*
                            </label>
                            <p className="text-xs text-gray-500">Subject name</p>
                            <input
                                type="text"
                                name="name"
                                value={editFormData.name}
                                onChange={handleInputChange}
                                placeholder="Subject name"
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
                                {isSubmitting ? 'Processing...' : 'Update Subject'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default EditSubjectModel;
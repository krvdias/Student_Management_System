
'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { getStudent, editStudent, deleteStudent, getClasses } from '@/service/adminRoutes'
import { toast } from 'react-toastify'
import { Student, ClassData } from '@/constants/types'
import { FiEdit } from 'react-icons/fi'
import { FaTrash } from 'react-icons/fa'

function Page() {
  const router = useRouter();
  const { id } = useParams();
  const [student, setStudent] = useState<Student | null>(null);
  const [originalStudent, setOriginalStudent] = useState<Student | null>(null);
  const [classes, setClasses] = useState<ClassData[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const hasChanges = useRef(false);

  const fetchData = async () => {
      try {
        const studentResponse = await getStudent(Number(id))
        if (studentResponse.data.success) {
          const apiData = studentResponse.data.data;
          const formattedStudent = {
            ...apiData,
            firstName: apiData.first_name,
            lastName: apiData.last_name,
            dateOfBirth: apiData.dob,
            registerNo: apiData.register_no,
            addmissionDate: apiData.addmission_date,
            leaveDate: apiData.leave_date,
            thiredOrUpper: apiData.thired_or_upper,
            teacherChild: apiData.teacher_child,
            classes: apiData.class
          };
          setStudent(formattedStudent);
          setOriginalStudent(JSON.parse(JSON.stringify(formattedStudent))); // Deep copy
          hasChanges.current = false;
        }
        
        const classesResponse = await getClasses()
        if (classesResponse.data.success) {
          setClasses(classesResponse.data.data)
        }
      } catch (error) {
        toast.error('Failed to fetch data')
        console.error(error)
      }
    }

  useEffect(() => {
    fetchData()
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked
    
    setStudent(prev => {
      if (!prev) return null;
      
      const newValue = type === 'checkbox' ? checked : value;
      console.log(`Field changed: ${name}, Value: ${value}, Type: ${type}`); // Debug

      

      const newStudent = {
        ...prev,
        [name]: newValue
      };
      
      // Compare with original student to detect changes
      if (originalStudent) {
        hasChanges.current = JSON.stringify(newStudent) !== JSON.stringify(originalStudent);
      }
      
      return newStudent;
    })
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!student || !hasChanges.current) return

    setIsSubmitting(true)
    try {
      const response = await editStudent(student, student.id)
      if (response.data.success) {
        toast.success('Student updated successfully');
        fetchData(); // Refresh student data
      } else {
        toast.error(response.data.message || 'Failed to update student')
      }
    } catch (error) {
      toast.error('An error occurred')
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  };

  const handleDelete = async () => {
    if (!student) return

      try {
        const response = await deleteStudent(student.id)
        if (response.data.success) {
          toast.success('Student deleted successfully')
          router.push('/Students')
        } else {
          toast.error(response.data.message || 'Failed to delete student')
        }
      } catch (error) {
        toast.error('An error occurred')
        console.error(error)
      } finally {
        setShowDeleteConfirm(false)
      }
    
  };

  const handleBack = () => {
    router.push('/Students');
};

  if (!student) {
    return <div className="p-6">Loading...</div>
  };

  const confirmDelete = async () => {
      await handleDelete();
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
        
        <p className="mb-6">Do you want to delete this student?</p>
        
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
        <div className='flex justify-between items-center gap-4 mb-2'>
            <div className='space-y-2'>
                <div className='grid grid-col-1 md:grid-cols-2 gap-6'>
                    <div className='flex items-center gap-2'>
                        <label className='text-xl font-medium w-30'>First Name:</label>
                        <input
                        type='text'
                        name='firstName'
                        value={student.firstName}
                        onChange={handleChange}
                        className='flex-1 px-3 py-1 text-lg font-semibold border-3 border-yellow-400 rounded-lg focus:ring-0 focus:border-yellow-500 focus:outline-none'
                        aria-label='First Name'
                        required
                        />
                    </div>
                    
                    <div className='flex items-center gap-2'>
                        <label className='text-xl font-medium w-30'>Last Name:</label>
                        <input
                        type='text'
                        name='lastName'
                        value={student.lastName}
                        onChange={handleChange}
                        className='flex-1 px-3 py-1 text-lg font-semibold border-3 border-yellow-400 rounded-lg focus:ring-0 focus:border-yellow-500 focus:outline-none'
                        aria-label='Last Name'
                        required
                        />
                    </div>
                </div>
                <div className='flex items-center gap-2'>
                    <label className='text-sm text-gray-600 w-30'>Reg. No :</label>
                    <input
                    type='text'
                    name='registerNo'
                    value={student.registerNo}
                    onChange={handleChange}
                    className='flex-1 px-3 py-1 text-sm border-3 border-yellow-400 rounded-lg focus:ring-0 focus:border-yellow-500 focus:outline-none'
                    aria-label='Register No'
                    required
                    />
                </div>
            </div>

            <div className='grid grid-cols-2 gap-2'>
                <button
                  onClick={handleSubmit}
                  disabled={!hasChanges.current || isSubmitting}
                  className={`text-2xl text-white font-semibold px-3 py-3 rounded-lg transition shadow-lg ${
                      !hasChanges.current || isSubmitting 
                          ? 'bg-gray-400 cursor-not-allowed' 
                          : 'bg-[#1346DD] hover:bg-blue-700'
                  }`}
                  title={!hasChanges.current ? 'No changes made' : isSubmitting ? 'Saving...' : 'Edit Student'}
                >
                    <FiEdit className='w-6 h-6' />
                </button>
                <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className='bg-[#DD1313] text-2xl text-white font-semibold px-3 py-3 rounded-lg hover:bg-red-600 transition shadow-lg'
                    title='Delete Student'
                >
                    <FaTrash />
                </button>
            </div>
        </div>

        <div className='space-y-2'>
            <div className='flex items-center gap-2'>
                <label className='text-md font-medium w-48'>Date of Birth :</label>
                <input
                type='Date'
                name='dateOfBirth'
                value={student.dateOfBirth}
                onChange={handleChange}
                className='flex-1 px-3 py-1 text-sm border-3 border-yellow-400 rounded-lg focus:ring-0 focus:border-yellow-500 focus:outline-none'
                aria-label='Date of Birth'
                required
                />
            </div>

            <div className='flex items-center gap-2'>
                <label className='text-md font-medium w-48'>Address :</label>
                <input
                type='text'
                name='address'
                value={student.address}
                onChange={handleChange}
                className='flex-1 px-3 py-1 text-sm border-3 border-yellow-400 rounded-lg focus:ring-0 focus:border-yellow-500 focus:outline-none'
                aria-label='Address'
                required
                />
            </div>

            <div className='flex items-center gap-2'>
                <label className='text-md font-medium w-48'>Mobile No :</label>
                <input
                type='tel'
                name='mobile'
                value={student.mobile}
                onChange={handleChange}
                className='flex-1 px-3 py-1 text-sm border-3 border-yellow-400 rounded-lg focus:ring-0 focus:border-yellow-500 focus:outline-none'
                aria-label='mobile'
                placeholder="07XXXXXXXX"
                pattern="[0-9]{10}"
                required
                />
            </div>

            <div className='flex items-center gap-2'>
                <label className='text-md font-medium w-48'>Religion :</label>
                <select
                    name='religion'
                    value={student.religion || ''}
                    onChange={handleChange}
                    className='flex-1 px-3 py-1 text-sm border-3 border-yellow-400 rounded-lg focus:ring-0 focus:border-yellow-500 focus:outline-none'
                    aria-label='religion'
                    required
                >
                    <option value=''>Select Religion</option>
                    <option value='Christian'>Christian</option>
                    <option value='Adventis'>Adventis</option>
                    <option value='Catholic'>Catholic</option>
                    <option value='Islam'>Islam</option>
                    <option value='Buddhism'>Buddhism</option>
                    <option value='Hinduism'>Hinduism</option>
                </select>
            </div>

            <div className='flex items-center gap-2'>
                <label className='text-md font-medium w-48'>Addmission Date :</label>
                <input
                type='Date'
                name='addmissionDate'
                value={student.addmissionDate}
                onChange={handleChange}
                className='flex-1 px-3 py-1 text-sm border-3 border-yellow-400 rounded-lg focus:ring-0 focus:border-yellow-500 focus:outline-none'
                aria-label='Addmission Date'
                required
                />
            </div>

            <div className='flex items-center gap-2'>
                <label className='text-md font-medium w-48'>Gardian :</label>
                <input
                type='text'
                name='gardian'
                value={student.gardian}
                onChange={handleChange}
                className='flex-1 px-3 py-1 text-sm border-3 border-yellow-400 rounded-lg focus:ring-0 focus:border-yellow-500 focus:outline-none'
                aria-label='Gardian'
                required
                />
            </div>

            <div className='flex items-center gap-2'>
                <label className='text-md font-medium w-48'>3rd or Upper :</label>
                <select
                    name='thiredOrUpper'
                    value={student.thiredOrUpper.toString()}
                    onChange={handleChange}
                    className='flex-1 px-3 py-1 text-sm border-3 border-yellow-400 rounded-lg focus:ring-0 focus:border-yellow-500 focus:outline-none'
                    aria-label='3rd or Upper'
                    required
                >
                    <option value=''>Select</option>
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                </select>
            </div>

            <div className='flex items-center gap-2'>
                <label className='text-md font-medium w-48'>Teachers Child :</label>
                <select
                    name='teacherChild'
                    value={student.teacherChild.toString()}
                    onChange={handleChange}
                    className='flex-1 px-3 py-1 text-sm border-3 border-yellow-400 rounded-lg focus:ring-0 focus:border-yellow-500 focus:outline-none'
                    aria-label='Teachers Child'
                    required
                >
                    <option value=''>Select</option>
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                </select>
            </div>

            <div className='flex items-center gap-2'>
                <label className='text-md font-medium w-48'>Class :</label>
                <select
                    name='classes'
                    value={student.classes}
                    onChange={handleChange}
                    className='flex-1 px-3 py-1 text-sm border-3 border-yellow-400 rounded-lg focus:ring-0 focus:border-yellow-500 focus:outline-none'
                    aria-label='class'
                    required
                >
                    <option value=''>Select Class</option>
                    {classes.map((cls) => (
                        <option key={cls.id} value={cls.id}>
                            {cls.name}
                        </option>
                    ))}
                </select>
            </div>

            <div className='flex items-center gap-2'>
                <label className='text-md font-medium w-48'>Leave Date :</label>
                <input
                type='Date'
                name='leaveDate'
                value={student.leaveDate || ''}
                onChange={handleChange}
                className='flex-1 px-3 py-1 text-sm border-3 border-yellow-400 rounded-lg focus:ring-0 focus:border-yellow-500 focus:outline-none'
                aria-label='Leave Date'
                />
            </div>
        </div>

        <div className='flex mt-2'>
            <button
                onClick={handleBack}
                className='bg-[#1346DD] text-sm font-semibold text-white px-6 py-1 rounded-lg hover:bg-blue-800 transition'
                title='Back to Students List'
            >
                &lt; Back
            </button>
        </div>

        {showDeleteConfirm && renderDeleteConfirm()}
    </div>
  )
}

export default Page
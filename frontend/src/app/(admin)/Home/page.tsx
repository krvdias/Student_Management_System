/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { studentsTotal, teachersTotal } from '@/resource/icons';
import { getEvents, deleteEvent, summary, editEvent, addEvent } from '@/service/adminRoutes';
import { eventData } from '@/constants/types';
import CustomCalendar from '../_components/CustomCalender';
import { FiEdit } from "react-icons/fi";
import { FaTrash } from "react-icons/fa";
import { toast } from 'react-toastify';
import { isAfter, parseISO } from 'date-fns';

export default function AdminDashboard() {
  const [events, setEvents] = useState<eventData[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<eventData | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isAddMode, setIsAddMode] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<number | null>(null);
  const [studentsCount, setStudentCount] = useState('');
  const [teachersCount, setTeacherCount] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    event_date: '',
    coordinator: ''
  });

  useEffect(() => {
    fetchEvents();
    fetchSumary();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await getEvents();
      setEvents(response.data.data);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const fetchSumary = async () => {
    try {
      const response = await summary();
      setStudentCount(response.data.data.studentsCount);
      setTeacherCount(response.data.data.teachersCount);
    } catch (error) {
      console.error('Error fetching summary:', error);
    }
  };

  const handleAddClick = () => {
    setIsAddMode(true);
    setFormData({
      title: '',
      event_date: '',
      coordinator: ''
    });
  };

   const handleDeleteClick = async (id: number) => {
    try {
      const response = await deleteEvent(id);
      if (response.data.success) {
        toast.success(response.data.message || 'Event deleted successfully');
        fetchEvents();
      } else {
        toast.error(response.data.message || 'Failed to delete event');
      }
    } catch (error: any) {
      console.error('Error deleting event:', error);
      toast.error(error.response?.data?.message || 'An error occurred while deleting');
    } finally {
      setShowDeleteConfirm(false);
      setEventToDelete(null);
    }
  };

  const handleEditClick = (event: eventData) => {
    setSelectedEvent(event);
    setIsEditMode(true);
    setFormData({
      title: event.title,
      event_date: event.event_date.split('T')[0], // Format date for input
      coordinator: event.coordinator
    });
  };

  const confirmDelete = async () => {
    if (eventToDelete !== null) {
      await handleDeleteClick(eventToDelete);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateFutureDate = (dateString: string): boolean => {
    const selectedDate = parseISO(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to compare dates only
    return isAfter(selectedDate, today);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate future date
    if (!validateFutureDate(formData.event_date)) {
      toast.error('Event date must be in the future');
      return;
    }

    try {
      if (isEditMode && selectedEvent) {
        const response = await editEvent(formData, selectedEvent.id);
        if (response.data.success) {
          toast.success(response.data.message || 'Event updated successfully');
          fetchEvents();
          setIsEditMode(false);
        } else {
          toast.error(response.data.message || 'Failed to update event');
        }
      } else if (isAddMode) {
        const response = await addEvent(formData);
        if (response.data.success) {
          toast.success(response.data.message || 'Event created successfully');
          fetchEvents();
          setIsAddMode(false);
        } else {
          toast.error(response.data.message || 'Failed to create event');
        }
      }
    } catch (error: any) {
      console.error('Error saving event:', error);
      toast.error(error.response?.data?.message || 'An error occurred');
    }
  };

  const renderModal = () => {
    const title = isEditMode ? 'Edit Event' : 'Add New Event';
    const buttonText = isEditMode ? 'Update Event' : 'Create Event';

    return (
      <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-3xl shadow-lg w-full max-w-sm">
          <div className='flex justify-between items-center mb-4'>
            <h2 className="text-2xl font-semibold">{title}</h2>
            <button 
              onClick={() => {
                setIsEditMode(false);
                setIsAddMode(false);
              }}
              className="text-black hover:text-gray-700 text-3xl font-light focus:outline-none"
              aria-label="Close"
            >
              &times;
            </button>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="space-y-2">
              <div>
                <label className="block text-md font-medium">
                  Event Title*
                </label>
                <label className="block text-xs text-gray-700 mb-1">
                  Add events name
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-3 py-1 border-3 border-yellow-400 rounded-lg focus:ring-0 focus:border-yellow-500 focus:outline-none"
                  placeholder="Event title"
                  required
                />
              </div>

              <div>
                <label className="block text-md font-medium">
                  Date*
                </label>
                <label className="block text-xs text-gray-700 mb-1">
                  Add events date
                </label>
                <input
                  type="date"
                  name="event_date"
                  value={formData.event_date}
                  onChange={handleInputChange}
                  className="w-full px-3 py-1 border-3 border-yellow-400 rounded-lg focus:ring-0 focus:border-yellow-500 focus:outline-none"
                  aria-label='Event Date'
                  placeholder='mm/dd/yyyy'
                  required
                />
              </div>

              <div>
                <label className="block text-md font-medium">
                  Coordinator/s*
                </label>
                <label className="block text-xs text-gray-700 mb-1">
                  Add who are the coordinator of this event
                </label>
                <input
                  type="text"
                  name="coordinator"
                  value={formData.coordinator}
                  onChange={handleInputChange}
                  className="w-full px-3 py-1 border-3 border-yellow-400 rounded-lg focus:ring-0 focus:border-yellow-500 focus:outline-none"
                  placeholder="Coordinator name"
                  required
                />
              </div>
            </div>

            <div className="flex flex-col mt-6 space-y-2">
              <button
                type="button"
                onClick={() => {
                  setIsEditMode(false);
                  setIsAddMode(false);
                }}
                className="px-4 py-2 bg-yellow-400 rounded-xl hover:bg-yellow-500 shadow-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-[#1346DD] text-white rounded-xl hover:bg-blue-800 shadow-lg"
              >
                {buttonText}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
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
        
        <p className="mb-6">Do you want to delete this event?</p>
        
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
    <div className="max-w-7xl mx-auto p-6">
      {/* Card section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-8">
        <div className="grid grid-cols-2 bg-white px-6 py-3 rounded-xl shadow border-3 border-yellow-400">
          <div className='flex flex-col justify-center items-center'>
            <p className="text-lg font-semibold text-black">Total Students</p>
            <p className="text-5xl font-bold text-black">{studentsCount}</p>
          </div>
          <div className='flex justify-end items-center'>
            <Image
              src={studentsTotal}
              height={70}
              width={70}
              alt='Total Students'
              className="object-contain"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-2 bg-white px-6 py-3 rounded-xl shadow border-3 border-yellow-400">
          <div className='flex flex-col justify-center items-center'>
            <p className="text-lg font-semibold text-black">Total Teachers</p>
            <p className="text-5xl font-bold text-black">{teachersCount}</p>
          </div>
          <div className='flex justify-end items-center'>
            <Image
              src={teachersTotal}
              height={70}
              width={70}
              alt='Total Teachers'
              className="object-contain"
            />
          </div>
        </div>
      </div>

      {/* Main content with calendar and events */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Events Section */}
        <div className="lg:col-span-1">
          <p className='text-xl font-semibold mb-5'>Events</p>
          <div className='px-2 overflow-y-auto max-h-[calc(110vh-500px)]'>
            <div className='space-y-2 pr-2'>
              {events.map((event) => (
                <div key={event.id} className="bg-gray-50 px-4 py-2 rounded-xl border border-gray-200 shadow-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-md font-semibold text-gray-800">{event.title}</p>
                      <p className="text-gray-600 mt-1">{event.coordinator}</p>
                      <p className="text-gray-500 text-xs mt-1">
                        {new Date(event.event_date).toLocaleDateString('en-US', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                    <div className="flex flex-col items-end">
                      <p className="text-gray-500 text-sm">
                        {new Date(event.updatedAt).toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit',
                          hour12: true
                        }).toUpperCase()}
                      </p>
                      <div className="flex space-x-2 mt-2">
                        <button
                          title="Edit Event"
                          className="text-blue-600 hover:text-blue-800 text-sm"
                          onClick={() => {handleEditClick(event)}}
                        >
                          <FiEdit className='w-5 h-5'/>
                        </button>
                        <button 
                          title="Delete Event"
                          className="text-red-600 hover:text-red-800 text-sm"
                          onClick={() => {
                            setEventToDelete(event.id);
                            setShowDeleteConfirm(true);
                          }}
                        >
                          <FaTrash className='w-5 h-5'/>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end mt-6">
            <button 
              className="px-6 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm"
              onClick={() => {handleAddClick()}}
            >
              ADD EVENT
            </button>
          </div>
        </div>

        {/* Calendar Section */}
        <div className="lg:col-span-1 px-10">
          <CustomCalendar 
            events={events} 
          />
        </div>
      </div>

      {/* Modals */}
      {(isEditMode || isAddMode) && renderModal()}
      {showDeleteConfirm && renderDeleteConfirm()}
      
    </div>
  );
}
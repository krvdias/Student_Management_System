// components/CustomCalendar.tsx
'use client'

import React, { useState, useEffect } from 'react';
import { format, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';

interface CalendarProps {
  events: {
    id: number;
    title: string;
    event_date: string;
  }[];
  loading: boolean;
  onLoadComplete?: () => void;
}

const CustomCalendar: React.FC<CalendarProps> = ({ events, loading, onLoadComplete }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [hoveredDate, setHoveredDate] = useState<Date | null>(null);

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  useEffect(() => {
    // Simulate calendar loading
    if (!loading) {
      const timer = setTimeout(() => {
        onLoadComplete && onLoadComplete();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [loading, onLoadComplete]);

  if (loading) return null; // Let parent handle skeleton

  const renderHeader = () => {
    return (
      <div className="flex justify-between items-center mb-4">
        <p className="text-sm font-semibold text-gray-800">
          {format(currentMonth, 'MMMM yyyy')}
        </p>
        <div className="flex space-x-2">
          <button 
            onClick={prevMonth} 
            className="p-1 rounded-full hover:bg-gray-100 text-gray-600"
          >
            &lt;
          </button>
          <button 
            onClick={nextMonth} 
            className="p-1 rounded-full hover:bg-gray-100 text-gray-600"
          >
            &gt;
          </button>
        </div>
      </div>
    );
  };

  const renderDays = () => {
    const dayNames = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
    
    return (
      <div className="grid grid-cols-7 gap-1 text-center mb-2">
        {dayNames.map((day, index) => (
          <div key={index} className="font-medium text-gray-500 text-sm py-1">
            {day}
          </div>
        ))}
      </div>
    );
  };

  const renderCells = () => {
    const monthStart = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    const monthEnd = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
    const startDate = new Date(monthStart);
    const endDate = new Date(monthEnd);

    const rows = [];
    let days = [];
    const day = new Date(startDate);
    
    // Adjust start date to Sunday if it's not already
    while (day.getDay() > 0) {
      day.setDate(day.getDate() - 1);
    }

     while (day <= endDate || day.getDay() !== 0) {
      for (let i = 0; i < 7; i++) {
        const formattedDate = format(day, 'd');
        const cloneDay = new Date(day);
        const dayEvents = events.filter(event => 
          isSameDay(new Date(event.event_date), cloneDay)
        );
        const hasEvent = dayEvents.length > 0;
        const isCurrentMonth = isSameMonth(day, monthStart);
        const isToday = isSameDay(day, new Date());

        days.push(
          <div
            key={day.toString()}
            className={`py-1 text-sm relative text-center
              ${isCurrentMonth ? 'text-gray-800' : 'text-gray-400'} 
              ${isToday ? 'bg-blue-500 text-white rounded-full' : ''}
              ${hasEvent ? 'border-b-2 border-blue-500' : ''}`}
            onMouseEnter={() => setHoveredDate(cloneDay)}
            onMouseLeave={() => setHoveredDate(null)}
          >
            {formattedDate}
            {hasEvent && hoveredDate && isSameDay(hoveredDate, cloneDay) && (
              <div className="absolute z-10 bottom-full left-1/2 transform -translate-x-1/2 mb-2 min-w-[200px]">
                <div className="bg-white border-1 border-yellow-400 text-white text-xs rounded-xl shadow-lg overflow-hidden">
                  {dayEvents.map(event => (
                    <div key={event.id} className="px-3 py-2 border-1 border-yellow-400 last:border-b-0">
                      <div className="font-medium text-black">{event.title}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
        day.setDate(day.getDate() + 1);
      }
      rows.push(
        <div key={day.toString()} className="grid grid-cols-7 gap-1">
          {days}
        </div>
      );
      days = [];
    }
    return <div className="mt-2">{rows}</div>;
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow">
      <div className="mb-4">
        <p className="text-lg font-semibold text-gray-800">
          {format(new Date(), 'EEE, MMM d')}
        </p>
      </div>
      {renderHeader()}
      {renderDays()}
      {renderCells()}
    </div>
  );
};

export default CustomCalendar;
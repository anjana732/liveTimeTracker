import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { TimeEntry } from '../../types';
import { DropDown } from './DropDown';
import { useAuthStore } from '../../store/authStore';
import { Notification } from '../common/Notification';


interface EditTimeEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (entry: Partial<TimeEntry>) => void;
  entry: TimeEntry;
}


export function EditTimeEntryModal({ isOpen, onClose, onSubmit, entry }: EditTimeEntryModalProps) {
  console.log()
  const [useTimeRange, setUseTimeRange] = useState(false);
  const [hours, setHours] = useState('');
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('17:00');
  const [notes, setNotes] = useState('');
  const [id, setId] = useState('');
  const [date, setDate] = useState('');
  const { user } = useAuthStore();
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');


  interface DropdownData {
    [key: string]: {
      [heading: string]: string[];
    };
  }

  const [timEntryType, setTimeEntryType] = useState<string>('');
  const [trainingType, setTrainingType] = useState<string>('');
  const [sessionType, setSessionType] = useState<string>('');

  const dropdownData: DropdownData = {
    Assignment: {
      Sales: ['CRM', 'Begin', 'Forms', 'Sales IQ', 'Booking', 'Sign', 'RouteIQ', 'Thrive', 'Voice'],
      Marketing: ['Social', 'Campaign', 'Survey', 'Sites', 'PageSense', 'BackStage', 'Webinar', 'Marketing Automation', 'Landing Page', 'Publish', 'Community Spaces'],
      Service: ['Desk', 'Assist', 'Lens', 'FMS'],
      Finance: ['Books', 'Invoices', 'expense', 'Inventory', 'Billing', 'Checkout', 'Payroll', 'Practise', 'Commerce', 'Payements'],
      'Human Resource': ['People', 'Recruit', 'Workerly', 'Shifts'],
      Legal: ['Contracts'],
      'Security & IT Management': ['Creator', 'Directory', 'OneAuth', 'Catalyst', 'Vault', 'Toolkit', 'QEngine', 'RPA'],
      'BI & Analytics': ['Analytics', 'Embeded BI', 'DataPrep'],
      'Projcet Management': ['Projects', 'Sprints', 'BugTracker'],
      'Email & Collaboration': ['Mail', 'Meeting', 'Writer', 'Sheet', 'Show', 'Notebook', 'Cliq', 'Connect', 'Bookings', 'Workdrive']
    },
    'Live Session': {
      Sales: ['CRM', 'Begin', 'Forms', 'Sales IQ', 'Booking', 'Sign', 'RouteIQ', 'Thrive', 'Voice'],
      Marketing: ['Social', 'Campaign', 'Survey', 'Sites', 'PageSense', 'BackStage', 'Webinar', 'Marketing Automation', 'Landing Page', 'Publish', 'Community Spaces'],
      Service: ['Desk', 'Assist', 'Lens', 'FMS'],
      Finance: ['Books', 'Invoices', 'expense', 'Inventory', 'Billing', 'Checkout', 'Payroll', 'Practise', 'Commerce', 'Payements'],
      'Human Resource': ['People', 'Recruit', 'Workerly', 'Shifts'],
      Legal: ['Contracts'],
      'Security & IT Management': ['Creator', 'Directory', 'OneAuth', 'Catalyst', 'Vault', 'Toolkit', 'QEngine', 'RPA'],
      'BI & Analytics': ['Analytics', 'Embeded BI', 'DataPrep'],
      'Projcet Management': ['Projects', 'Sprints', 'BugTracker'],
      'Email & Collaboration': ['Mail', 'Meeting', 'Writer', 'Sheet', 'Show', 'Notebook', 'Cliq', 'Connect', 'Bookings', 'Workdrive']
    }
  };


  const getItems = (type: string) => {
    return dropdownData[type] || {};
  };


  const items = trainingType ? getItems(trainingType) : {};

  const handleTimeEntryType = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setTimeEntryType(value);
    setTrainingType('');
    setSessionType('');
  };

  const handleTrainingType = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setTrainingType(value);
    setSessionType('');
  };

  const handleSessionType = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSessionType(e.target.value);
  };


  useEffect(() => {
    if (entry) {
      setDate(entry.date);
      setNotes(entry.notes || '');
      setId(entry.id);

      if (entry.startTime && entry.endTime) {
        setUseTimeRange(true);
        setStartTime(entry.startTime.split('T')[1].slice(0, 5));
        setEndTime(entry.endTime.split('T')[1].slice(0, 5));
      } else {
        setUseTimeRange(false);
        setHours(String(entry.duration / 60));
      }
    }
  }, [entry]);

  if (!isOpen) return null;

  const calculateDuration = (start: string, end: string): number => {
    const [startHour, startMinute] = start.split(':').map(Number);
    const [endHour, endMinute] = end.split(':').map(Number);
    const startMinutes = startHour * 60 + startMinute;
    const endMinutes = endHour * 60 + endMinute;
    return (endMinutes - startMinutes) / 60;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const hoursToDateTime = (hours: number): string => {
      console.log("Hours from frontned", hours / 60)


      const currentDate = new Date();

   
      const wholeHours = Math.floor(hours); 
      const fractionalHours = hours - wholeHours; 
      const minutes = Math.round(fractionalHours * 60); 

      
      currentDate.setHours(wholeHours, minutes, 0, 0);

     
      const year = currentDate.getFullYear();
      const month = String(currentDate.getMonth() + 1).padStart(2, '0');
      const day = String(currentDate.getDate()).padStart(2, '0');
      const hour = String(currentDate.getHours()).padStart(2, '0');
      const minute = String(currentDate.getMinutes()).padStart(2, '0');
      const second = String(currentDate.getSeconds()).padStart(2, '0');

      const formattedDateTime = `${year}-${month}-${day} ${hour}:${minute}:${second}`;

      console.log(`Converted DateTime: ${formattedDateTime}`);
      return formattedDateTime;
    };

    const hoursValue = useTimeRange
      ? parseFloat(hours)
      : calculateDuration(startTime, endTime);


    const timeEntryData = {
      empName: user?.userName ?? '',
      entryType: timEntryType || '',
      trainingType: trainingType || '',
      Assignment: trainingType === 'Assignment' ? sessionType : '',
      liveSession: trainingType === 'Live Session' ? sessionType : '',
      Hours: hoursToDateTime(hoursValue),
      // Hours: '2025-01-09 05:00:00',
      Notes: notes || '',
      email: user?.email ?? '',
      entryDate: new Date(date).toISOString().split('T')[0],
    };


    const response = await fetch(`/server/time_tracker_function/timeEntry/update?ROWID=${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(timeEntryData),

    });

    console.log("Put Response", response);
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to save time entry');
    }


    const responseData = await response.json();
    console.log('Data saved successfully', responseData);
    console.log("Notification Called")
    setShowNotification(true);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Edit Time Entry</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
              required
            />
          </div>

          <div>
            {/* <button
              type="button"
              onClick={() => setUseTimeRange(!useTimeRange)}
              className="text-sm text-blue-600 hover:text-blue-800 underline mb-2"
            >
              {useTimeRange ? 'Enter total hours instead' : 'Set start and end time instead'}
            </button> */}

            {useTimeRange ? (

              <div>
                <label className="block text-sm font-medium text-gray-700">Hours</label>
                <input
                  type="number"
                  step="0.5"
                  value={hours}
                  onChange={(e) => setHours(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                  required
                />
              </div>



            ) : (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Start Time</label>
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">End Time</label>
                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                    required
                  />
                </div>
              </div>
            )}
          </div>
          {/************************************* DropDown Code ****************************************/}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Task <span className="text-red-500">*</span></label>
            <select
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              onChange={handleTimeEntryType} value={timEntryType} required
            >
              <option value="">Select</option>
              <option value="Training">Training</option>
              <option value="Meeting">Meeting</option>
              <option value="Others">Others</option>
            </select>
          </div>

          {/* Dropdown for Training Type */}
          {timEntryType === 'Training' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Sub Task <span className="text-red-500">*</span></label>
              <select
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                onChange={handleTrainingType} value={trainingType} required
              >
                <option value="">Select</option>
                <option value="Assignment">Assignment</option>
                <option value="Live Session">Live Session</option>
              </select>
            </div>
          )}

          {/* Dropdown for Assignment or Live Session */}
          {(trainingType === 'Assignment' || trainingType === 'Live Session') && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Course <span className="text-red-500">*</span></label>
              <select
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                onChange={handleSessionType} value={sessionType} required
              >
                <option value="">Select</option>
                {Object.keys(dropdownData[trainingType]).map((heading, index) => (
                  <optgroup key={index} label={heading}>
                    {dropdownData[trainingType][heading].map((item, itemIndex) => (
                      <option key={itemIndex} value={item}>
                        {item}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </div>
          )}


          <div>
            <label className="block text-sm font-medium text-gray-700">Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
              rows={3}
            />
          </div>

          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Save Changes
            </button>

            {/* Notification */}
            <Notification
              message="Time entry updated successfully!"
              isVisible={showNotification}
              onClose={() => setShowNotification(false)}
            />
          </div>
        </form>
      </div>
    </div>
  );
} 
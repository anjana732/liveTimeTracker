import React, { useState } from 'react';
import { Clock, Plus, AlertCircle } from 'lucide-react';
import { useTimeEntryStore } from '../../store/timeEntryStore';
import { useAuthStore } from '../../store/authStore';
import { Notification } from '../common/Notification';
import { format, subDays, isAfter, isBefore, parseISO } from 'date-fns';
import { useTimeEntries } from '../../hooks/useTimeEntries';

export function ManualEntry() {
  const [hours, setHours] = useState('');
  const [notes, setNotes] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [useTimeRange, setUseTimeRange] = useState(false);
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('17:00');
  const [showNotification, setShowNotification] = useState(false);
  const [dateError, setDateError] = useState<string | null>(null);
  const { user } = useAuthStore();
  const { fetchEntries, addEntry } = useTimeEntries();

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

  const { addManualEntry } = useTimeEntryStore();


  const today = new Date();
  const minDate = format(subDays(today, 7), 'yyyy-MM-dd');
  const maxDate = format(today, 'yyyy-MM-dd');

  const validateDate = (selectedDate: string) => {
    const dateObj = parseISO(selectedDate);

    if (isAfter(dateObj, today)) {
      return "Cannot add entries for future dates";
    }

    if (isBefore(dateObj, parseISO(minDate))) {
      return "Cannot add entries older than 7 days";
    }

    return null;
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = e.target.value;
    setDate(newDate);
    setDateError(validateDate(newDate));
  };

  const calculateHour = (time: string): number => {
    const [hourStr, minuteStr] = time.split(':').map(Number);
  
    // Normalize the minutes: If minutes are greater than 59, convert the excess into hours
    let minutes = minuteStr;
    let hours = hourStr;
  
    if (minutes >= 60) {
      const additionalHours = Math.floor(minutes / 60);
      minutes = minutes % 60;
      hours += additionalHours;
    }
  
    // Convert the total time into a fractional hour format
    const totalHours = hours + (minutes / 60);
  
    console.log(`Converted time: ${totalHours} hours`);
  
    return totalHours;
  };
  

  const calculateDuration = (start: string, end: string): number => {
    const [startHour, startMinute] = start.split(':').map(Number);
    const [endHour, endMinute] = end.split(':').map(Number);

    const startMinutes = startHour * 60 + startMinute;
    const endMinutes = endHour * 60 + endMinute;

    console.log("Start end time Calculate: ", (endMinutes - startMinutes));

    return (endMinutes - startMinutes) / 60;

  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.email) return;


    try {
      const hoursToDateTime = (hours: number): string => {
        console.log("Hours from frontned", hours)

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
        ? calculateHour(hours)
        : calculateDuration(startTime, endTime);

      const timeEntryData = {
        empName: user.userName,
        entryType: timEntryType || '',
        trainingType: trainingType || '',
        Assignment: trainingType === 'Assignment' ? sessionType : '',
        liveSession: trainingType === 'Live Session' ? sessionType : '',
        Hours: hoursToDateTime(hoursValue),
        Notes: notes || '',
        email: user.email,
        entryDate: new Date(date).toISOString().split('T')[0]
      };


      addEntry(timeEntryData);
      console.log('Time entry data..............................:', timeEntryData);

      const response = await fetch('/server/time_tracker_function/timeEntry', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(timeEntryData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save time entry');
      }

      await fetchEntries(user.email);


      setHours('');
      setNotes('');
      setTimeEntryType('');
      setTrainingType('');
      setSessionType('');
      setShowNotification(true);
      setUseTimeRange(true);
      

    } catch (error) {
      console.error('Error saving time entry:', error);
      alert(error instanceof Error ? error.message : 'Failed to save time entry. Please try again.');
      await fetchEntries(user.email);
    }
  };


  const handleHoursChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let input = e.target.value;
  

    input = input.replace(/[^0-9:]/g, "");
    if (input.length > 2 && !input.includes(":")) {
      input = input.slice(0, 2) + ":" + input.slice(2);
    }
    if (input.length > 5) {
      input = input.slice(0, 5);
    }
    console.log("Total Hours...: ", input);
    setHours(input);
    
  };
  

  return (
    <>
      <div className="bg-white p-6 rounded-lg shadow-md mt-6 w-full max-w-4xl min-w-[600px] mx-auto">
        <h2 className="text-xl font-semibold flex items-center mb-6 text-gray-800">
          <Clock className="w-6 h-6 mr-3 text-blue-600" />
          Manual Time Entry
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Date Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date <span className="text-red-500">*</span></label>
            <input
              type="date"
              value={date}
              onChange={handleDateChange}
              className={`mt-1 block w-full rounded-md border ${dateError ? 'border-red-300' : 'border-gray-300'} shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200`}
              required
            />
            {dateError && (
              <div className="mt-1 text-sm text-red-600 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {dateError}
              </div>
            )}
          </div>

          {/* Time Range or Hours */}
          <div>
            {useTimeRange ? (

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Hours <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={hours}
                  // onChange={(e) => setHours(e.target.value)}
                  // onChange={(e) => {
                  //   handleHoursChange(e); 
                  //    setHours(e.target.value); 
                  // }}
                  onChange={handleHoursChange}
                  placeholder='00:00'
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                  required
                />
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Start Time <span className="text-red-500">*</span></label>
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">End Time <span className="text-red-500">*</span></label>
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
            <button
            type="button"
            onClick={() => setUseTimeRange(!useTimeRange)}
            className="text-sm text-red-400 hover:text-red-600 mt-2"
          >
            {useTimeRange ? 'Set start and end time' : 'Enter total hours'}
          </button>
          </div>

          {/* Dropdown for Task */}
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

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Notes <span className="text-red-500">*</span></label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
              rows={3}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!!dateError}
            className={`flex items-center px-6 py-3 bg-blue-600 text-white rounded-md ${dateError ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'} w-auto`}
          >
            <Plus className="w-2 h-4 mr-2" />
            Add Entry
          </button>
        </form>
      </div>

      {/* Notification */}
      <Notification
        message="Time entry added successfully!"
        isVisible={showNotification}
        onClose={() => setShowNotification(false)}
      />
    </>
  );
}
import React, { useState } from 'react';
import { X } from 'lucide-react';


interface NotesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (notes: string, timeEntryType: string, trainingType: string, sessionType: string) => void;
}

export function NotesModal({ isOpen, onClose, onSubmit }: NotesModalProps) {
  const [notes, setNotes] = React.useState('');


  const [timeEntryType, setTimeEntryType] = useState<string>('');
  const [trainingType, setTrainingType] = useState<string>('');
  const [sessionType, setSessionType] = useState<string>('');

  interface DropdownData {
    [key: string]: {
      [heading: string]: string[];
    };
  }

  const dropdownData: DropdownData = {
    Assignment: {
      Sales: ['CRM', 'Begin', 'Forms', 'Sales IQ', 'Booking', 'Sign', 'RouteIQ', 'Thrive', 'Voice'],
      Marketing: ['Social', 'Campaign', 'Survey', 'Sites', 'PageSense', 'BackStage', 'Webinar', 'Marketing Automation', 'Landing Page', 'Publish', 'Community Spaces'],
      Service: ['Desk', 'Assist', 'Lens', 'FMS'],
      Finance: ['Books', 'Invoices', 'Expense', 'Inventory', 'Billing', 'Checkout', 'Payroll', 'Practice', 'Commerce', 'Payments'],
      'Human Resource': ['People', 'Recruit', 'Workerly', 'Shifts'],
      Legal: ['Contracts'],
      'Security & IT Management': ['Creator', 'Directory', 'OneAuth', 'Catalyst', 'Vault', 'Toolkit', 'QEngine', 'RPA'],
      'BI & Analytics': ['Analytics', 'Embedded BI', 'DataPrep'],
      'Project Management': ['Projects', 'Sprints', 'BugTracker'],
      'Email & Collaboration': ['Mail', 'Meeting', 'Writer', 'Sheet', 'Show', 'Notebook', 'Cliq', 'Connect', 'Bookings', 'Workdrive']
    },
    'Live Session': {
      Training: ['Product Training', 'Technical Training', 'Soft Skills Training'],
      Meeting: ['Team Meeting', 'Client Meeting', 'Project Meeting'],
      Workshop: ['Technical Workshop', 'Product Workshop', 'Skill Development Workshop']
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



  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(notes, timeEntryType, trainingType, sessionType);
    setNotes('');
    setTimeEntryType('');
    setTrainingType('');
    setSessionType('');
  };



  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Time Entry</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" /> 
          </button>
        </div>
        <form onSubmit={handleSubmit}>
        <div className="p-1 pb-8 space-y-6">
      {/* Time Entry Type Dropdown */}
      <div className="max-w-md">
        <label className="block text-sm font-medium text-gray-700 mb-2">Select Time Entry Type <span className="text-red-500 relative top-1">*</span></label>
        <select
          className="w-full border border-gray-300 rounded-lg shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
          onChange={handleTimeEntryType}
          value={timeEntryType}
          required
        >
          <option value="">Select</option>
          <option value="Training">Training</option>
          <option value="Meeting">Meeting</option>
          <option value="Others">Others</option>
        </select>
      </div>

      {/* Training Type Dropdown */}
      {timeEntryType === 'Training' && (
        <div className="max-w-md">
          <label className="block text-sm font-medium text-gray-700 mb-2">Select Training Type <span className="text-red-500 relative top-1">*</span></label>
          <select
            className="w-full border border-gray-300 rounded-lg shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            onChange={handleTrainingType}
            value={trainingType}
            required
          >
            <option value="">Select</option>
            <option value="Assignment">Assignment</option>
            <option value="Live Session">Live Session</option>
          </select>
        </div>
      )}

      {/* Session Type Dropdown */}
      {(trainingType === 'Assignment' || trainingType === 'Live Session') && (
        <div className="max-w-md">
          <label className="block text-sm font-medium text-gray-700 mb-2">Select Session Type <span className="text-red-500 relative top-1">*</span></label>
          <select
            className="w-full border border-gray-300 rounded-lg shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            onChange={handleSessionType}
            value={sessionType}
            required
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

      {/* Selected Values Display */}
      {timeEntryType && sessionType && (
        <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg text-blue-700 text-sm max-w-md">
          <strong>Selected:</strong> {timeEntryType} - {trainingType} - {sessionType}
        </div>
      )}
    </div>
          
          <textarea 
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full p-2 border rounded-md mb-2"
            rows={4}
            placeholder="Enter your notes here ..."
            autoFocus
          />

          
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
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
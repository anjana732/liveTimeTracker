import React, { useState } from 'react';

export function DropDown() {
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

  return (
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
  );
}

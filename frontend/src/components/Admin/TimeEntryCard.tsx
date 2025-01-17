import React from 'react';
import { format, parseISO } from 'date-fns';
import { Clock, Calendar, FileText } from 'lucide-react';
import { TimeEntry } from '../../types';
import { mockInterns } from '../../data/mockData';

interface DBTimeEntry {
  ROWID: string;
  empName: string;
  entryType: string;
  trainingType: string;
  Assignment: string;
  liveSession: string;
  Hours: string;
  Notes: string;
  email: string;
  entryDate: string;
}

interface TimeEntryCardProps {
  dbEntry: {
    ROWID: string;
    empName: string;
    entryType: string;
    trainingType: string;
    Assignment: string;
    liveSession: string;
    Hours: string;
    Notes: string;
    email: string;
    entryDate: string;
  };
}

export function TimeEntryCard({ dbEntry }: TimeEntryCardProps) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">{dbEntry.empName}</h3>
          <p className="text-sm text-gray-600">{dbEntry.email}</p>
        </div>
        <span className="text-sm text-gray-500">{dbEntry.entryDate}</span>
      </div>
      
      <div className="mt-3 grid grid-cols-2 gap-2">
        <div>
          <p className="text-sm font-medium text-gray-600">Entry Type</p>
          <p className="text-sm text-gray-800">{dbEntry.entryType}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-600">Training Type</p>
          <p className="text-sm text-gray-800">{dbEntry.trainingType}</p>
        </div>
        {dbEntry.Assignment && (
          <div>
            <p className="text-sm font-medium text-gray-600">Assignment</p>
            <p className="text-sm text-gray-800">{dbEntry.Assignment}</p>
          </div>
        )}
        {dbEntry.liveSession && (
          <div>
            <p className="text-sm font-medium text-gray-600">Live Session</p>
            <p className="text-sm text-gray-800">{dbEntry.liveSession}</p>
          </div>
        )}
      </div>

      <div className="mt-3">
        <p className="text-sm font-medium text-gray-600">Hours</p>
        <p className="text-sm text-gray-800">{dbEntry.Hours}</p>
      </div>

      {dbEntry.Notes && (
        <div className="mt-3">
          <p className="text-sm font-medium text-gray-600">Notes</p>
          <p className="text-sm text-gray-800">{dbEntry.Notes}</p>
        </div>
      )}
    </div>
  );
}
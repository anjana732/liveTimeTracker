import { useState, useCallback } from 'react';
import { TimeEntry } from '../types';

export const useTimeEntries = () => {
  const [entries, setEntries] = useState<TimeEntry[]>([]);

  const fetchEntries = useCallback(async (email: string) => {
    try {
      const url = `/server/time_tracker_function/timeEntry?email=${encodeURIComponent(email)}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error('Failed to fetch entries');
      }
      
      const result = await response.json();
      
      if (!result?.data) {
        throw new Error('Invalid data format received');
      }
      
      const timeEntries = result.data.map((item: any) => {
        const entry = item.timeEntries || item;
        return {
          id: entry.ROWID,
          email: entry.email,
          date: entry.entryDate,
          duration: entry.Hours,
          manualEntry: true,
          notes: entry.Notes,
          startTime: undefined,
          endTime: undefined
        };
      });
      
      setEntries(timeEntries);
    } catch (error) {
      console.error('Error fetching time entries:', error);
    }
  }, []);

  const addEntry = useCallback((newEntry: any) => {
    setEntries(currentEntries => [
      {
        id: Date.now().toString(), // Temporary ID until server response
        email: newEntry.email,
        date: newEntry.entryDate,
        duration: newEntry.Hours,
        manualEntry: true,
        notes: newEntry.Notes,
        startTime: undefined,
        endTime: undefined
      },
      ...currentEntries
    ]);
  }, []);

  return { entries, setEntries, fetchEntries, addEntry };
}; 
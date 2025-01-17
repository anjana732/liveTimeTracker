import { create } from 'zustand';
import { TimeEntry } from '../types';

interface TimeEntriesState {
  entries: TimeEntry[];
  setEntries: (entries: TimeEntry[]) => void;
  addEntry: (entry: any) => void;
  fetchEntries: (email: string) => Promise<void>;
}

export const useTimeEntriesStore = create<TimeEntriesState>()((set) => ({
  entries: [],
  setEntries: (entries: TimeEntry[]) => set(() => ({ entries })),
  addEntry: (newEntry: any) => set((state) => ({
    entries: [
      {
        id: Date.now().toString(),
        email: newEntry.email,
        date: newEntry.entryDate,
        duration: newEntry.Hours,
        manualEntry: true,
        notes: newEntry.Notes,
        startTime: undefined,
        endTime: undefined,
       
      },
      ...state.entries
    ]
  })),
  fetchEntries: async (email: string) => {
    try {
      const url = `/server/time_tracker_function/timeEntry?email=${encodeURIComponent(email)}`;
      const response = await fetch(url);
      
      
      if (!response.ok) {
        throw new Error('Failed to fetch entries');
      }
      
      const result = await response.json();
      console.log("Time Entry by mail", result)
      
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
      
      set(() => ({ entries: timeEntries }));
    } catch (error) {
      console.error('Error fetching time entries:', error);
    }
  }
})); 
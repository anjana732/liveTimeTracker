import { create } from 'zustand';
import { TimeEntry } from '../types';

interface TimeEntryState {
  entries: TimeEntry[];
  activeEntry: TimeEntry | null;
  startTimer: (email: string) => void;
  stopTimer: (notes?: string) => void;
  addManualEntry: (entry: Omit<TimeEntry, 'id'>) => void;
  editEntry: (id: string, updates: Partial<TimeEntry>) => void;
}

export const useTimeEntryStore = create<TimeEntryState>((set, get) => ({
  entries: [],
  activeEntry: null,

  startTimer: (email: string) => {
    const newEntry: TimeEntry = {
      id: Date.now().toString(),
      email,
      date: new Date().toISOString().split('T')[0],
      startTime: new Date().toISOString(),
      duration: 0,
      manualEntry: false,
    };
    set({ activeEntry: newEntry });
  },

  stopTimer: (notes?: string) => {
    const { activeEntry, entries } = get();
    if (!activeEntry) return;

    const endTime = new Date().toISOString();
    const duration = Math.floor(
      (new Date(endTime).getTime() - new Date(activeEntry.startTime!).getTime()) / 60000
    );

    const completedEntry: TimeEntry = {
      ...activeEntry,
      endTime,
      duration,
      notes,
    };

    set({
      entries: [...entries, completedEntry],
      activeEntry: null,
    });
  },

  addManualEntry: (entry) =>
    set((state) => ({
      entries: [
        ...state.entries,
        {
          ...entry,
          id: Math.random().toString(36).substr(2, 9),
        },
      ],
    })),

  editEntry: (id, updates) =>
    set((state) => ({
      entries: state.entries.map((entry) =>
        entry.id === id ? { ...entry, ...updates } : entry
      ),
    })),
}));
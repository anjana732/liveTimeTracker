import { useState, useEffect } from 'react';
import { Play, Pause, Square } from 'lucide-react';
import { useTimeEntryStore } from '../../store/timeEntryStore';
import { useAuthStore } from '../../store/authStore';
import { NotesModal } from './NotesModal';
import { Clock } from 'lucide-react';
import { Notification } from '../common/Notification';
import { useTimeEntriesStore } from '../../store/timeEntriesStore';

const formatTime = (seconds: number) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

export function Timer() {
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const { activeEntry, startTimer, stopTimer } = useTimeEntryStore();
  const { fetchEntries, addEntry } = useTimeEntriesStore();
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (activeEntry && !isPaused) {
      interval = setInterval(() => {
        setElapsedTime((time) => time + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [activeEntry, isPaused]);

  const handleStart = () => {
    if (user) {
      startTimer(user.email);
    }
  };

  const handlePauseResume = () => {
    setIsPaused(!isPaused);
  };

  const handleStop = () => {
    setIsModalOpen(true);
  };

  const handleNotesSubmit = async (
    notes: string,
    timeEntryType: string,
    trainingType: string,
    sessionType: string
  ) => {
    if (!user) return;

    try {
      // Convert elapsed time to hours and format as DateTime
      const hoursToDateTime = (seconds: number) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;

        // Create a date object for today
        const date = new Date();
        date.setHours(hours, minutes, secs, 0);

        // Format as "YYYY-MM-DD HH:MM:SS"
        return `${date.toISOString().split('T')[0]} ${date.toTimeString().split(' ')[0]}`;
      };

      const currentDate = new Date().toISOString().split('T')[0];

      // Prepare the data for the API
      const timeEntryData = {
        empName: user.userName,
        entryType: timeEntryType || 'Timer',
        trainingType: trainingType || '',
        Assignment: trainingType === 'Assignment' ? sessionType : '',
        liveSession: trainingType === 'Live Session' ? sessionType : '',
        Hours: hoursToDateTime(elapsedTime),
        Notes: notes || '',
        email: user.email,
        entryDate: currentDate
      };

      console.log('Sending time entry data:', timeEntryData);

      // Optimistically add the entry
      addEntry(timeEntryData);

      const response = await fetch('/server/time_tracker_function/timeEntry', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(timeEntryData),
      });

      if (!response.ok) {
        throw new Error('Failed to save time entry');
      }

      // Refresh entries to get server data
      await fetchEntries(user.email);
      
      // Reset UI state
      stopTimer(notes);
      setIsModalOpen(false);
      setElapsedTime(0);
      setIsPaused(false);
      setNotificationMessage('Time entry saved successfully!');
      setShowNotification(true);
      

    } catch (error) {
      console.error('Error saving time entry:', error);
      setNotificationMessage(error instanceof Error ? error.message : 'Failed to save time entry');
      setShowNotification(true);
      await fetchEntries(user.email);
    }
  };

  return (
    <>
      <div className="bg-gradient-to-br from-primary-50 to-white rounded-2xl shadow-lg overflow-hidden border border-primary-100">
        <div className="bg-gradient-to-r from-primary-600 to-secondary-600 p-6">
          <h2 className="text-xl font-semibold text-white flex items-center">
            <Clock className="w-6 h-6 mr-2" />
            Time Tracker
          </h2>
        </div>
        <div className="p-8">
          <div className="text-7xl font-mono text-center my-8 font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
            {formatTime(elapsedTime)}
          </div>
          <div className="flex justify-center space-x-4">
            {!activeEntry ? (
              <button
                onClick={handleStart}
                className="flex items-center px-8 py-4 bg-gradient-to-r from-primary-600 to-primary-500 text-white rounded-xl hover:from-primary-700 hover:to-primary-600 transform hover:scale-105 transition-all duration-200 shadow-lg"
              >
                <Play className="w-5 h-5 mr-2" />
                Start Timer
              </button>
            ) : (
              <>
                <button
                  onClick={handlePauseResume}
                  className={`flex items-center px-8 py-4 rounded-xl transform hover:scale-105 transition-all duration-200 shadow-lg ${
                    isPaused
                      ? 'bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600'
                      : 'bg-gradient-to-r from-secondary-500 to-secondary-400 hover:from-secondary-600 hover:to-secondary-500'
                  } text-white`}
                >
                  {isPaused ? (
                    <>
                      <Play className="w-5 h-5 mr-2" />
                      Resume
                    </>
                  ) : (
                    <>
                      <Pause className="w-5 h-5 mr-2" />
                      Pause
                    </>
                  )}
                </button>
                <button
                  onClick={handleStop}
                  className="flex items-center px-8 py-4 bg-gradient-to-r from-red-600 to-red-500 text-white rounded-xl hover:from-red-700 hover:to-red-600 transform hover:scale-105 transition-all duration-200 shadow-lg"
                >
                  <Square className="w-5 h-5 mr-2" />
                  Stop
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      <NotesModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleNotesSubmit}
      />

      <Notification
        message={notificationMessage}
        isVisible={showNotification}
        onClose={() => setShowNotification(false)}
      />
    </>
  );
}
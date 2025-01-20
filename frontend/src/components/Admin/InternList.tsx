import React, { useState, useEffect } from 'react';
import { Users, Search, Calendar, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { startOfWeek, addWeeks, subWeeks, format } from 'date-fns';
import { useTimeEntryStore } from '../../store/timeEntryStore';
import { TimeEntryCard } from './TimeEntryCard';
import { WeeklyPerformance } from './WeeklyPerformance';
import { TopPerformers } from './TopPerformers';
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

export function InternList() {
  const [empName2, setEmpName2] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedIntern, setSelectedIntern] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentWeek, setCurrentWeek] = useState(startOfWeek(new Date()));
  const [dbEntries, setDbEntries] = useState<DBTimeEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const entries = useTimeEntryStore((state) => state.entries);


  useEffect(() => {
    fetchTimeEntries();
  }, []);

  const fetchTimeEntries = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('/server/time_tracker_function/timeEntry');


      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to fetch time entries');
      }

      const result = await response.json();
      console.log('Server response:', result.data);
      const allData = result.data;


      interface TimeEntry {
        Assignment: string;
        CREATEDTIME: string;
        CREATORID: string;
        Hours: string;
        MODIFIEDTIME: string;
        Notes: string;
        ROWID: string;
        email: string;
        empName: string;
        entryDate: string;
        entryType: string;
        liveSession: string;
        trainingType: string;
      }


      interface DataItem {
        timeEntries: TimeEntry;
      }


      interface ApiResponse {
        status: string;
        message: string;
        data: DataItem[];
      }

      if (!result?.data?.[0]?.timeEntries) {
        throw new Error('Invalid data format received from server');
      }

      const entries = result.data.map((item: any) => item.timeEntries);
      setDbEntries(entries);

    } catch (error) {
      console.error('Error fetching time entries:', error);
      setError(error instanceof Error ? error.message : 'Error loading time entries');
    } finally {
      setIsLoading(false);
    }
  };

  /********************************* All Employees  ***********************************/


  useEffect(() => {
    console.log("Component loaded");
    fetchEmployees();
  }, []);



  const fetchEmployees = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('/server/time_tracker_function/user');

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to fetch time entries');
      }

      const result = await response.json();
      console.log('All Employees:', result.data);
      const allData = result.data;

      interface Users {
        ROWID: string;
        email: string;
        userName: string;
      }

      interface DataItem {
        Users: Users;
      }

      const empNames: string[] = allData
        .map((item: DataItem) => item.Users?.userName)

      console.log("All Employee Names:", empNames);
      setEmpName2(empNames);

      console.log("empName2", empName2)

    } catch (error) {
      console.error('Error fetching employee details:', error);
      setError(error instanceof Error ? error.message : 'Error loading employees');
    } finally {
      setIsLoading(false);
    }
  };

  const convertToTimeEntry = (dbEntry: DBTimeEntry) => ({
    id: dbEntry.ROWID,
    email: dbEntry.email,
    date: dbEntry.entryDate,
    duration: parseFloat(dbEntry.Hours) * 60,
    manualEntry: true,
    notes: dbEntry.Notes,
    startTime: undefined,
    endTime: undefined
  });

  const filteredDbEntries = dbEntries.filter((entry) => {
    const matchesEmail = selectedIntern ? entry.email === selectedIntern : true;
    const matchesDate = selectedDate ? entry.entryDate === selectedDate : true;
    const matchesSearch = searchTerm
      ? entry.empName.toLowerCase().includes(searchTerm.toLowerCase())
      : true;
    return matchesEmail && matchesDate && matchesSearch;
  });


  const convertedEntries = filteredDbEntries.map(convertToTimeEntry);

  const clearFilters = () => {
    setSelectedDate('');
    setSelectedIntern('');
    setSearchTerm('');
  };

  const navigateWeek = (direction: 'prev' | 'next') => {
    setCurrentWeek(current =>
      direction === 'prev' ? subWeeks(current, 1) : addWeeks(current, 1)
    );
  };


  return (
    <div className="max-w-7xl mx-auto">
      {/* Header and Filters */}
      <div className="bg-white shadow-md rounded-lg mb-6">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold flex items-center mb-6">
            <Users className="w-8 h-8 mr-2 text-primary-600" />
            Employee Time Tracking
          </h1>
          <button className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none">
      Export to Sheet
    </button>
    </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by employee name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            {/* Intern Select */}
            <div>
              <select
                value={selectedIntern}
                onChange={(e) => setSelectedIntern(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="">All Employees</option>
                {empName2.map((empName,index) => (
                  <option value={empName}>
                    {empName}
                  </option>
                ))}
              </select>
            </div>

            {/* Date Filter */}
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
          </div>

          {/* Active Filters */}
          {(selectedDate || selectedIntern || searchTerm) && (
            <div className="mt-4 flex items-center space-x-2">
              <span className="text-sm text-gray-500">Active filters:</span>
              <div className="flex flex-wrap gap-2">
                {selectedIntern && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary-100 text-primary-800">
                    {mockInterns.find(i => i.email === selectedIntern)?.name}
                    <X
                      className="w-4 h-4 ml-2 cursor-pointer"
                      onClick={() => setSelectedIntern('')}
                    />
                  </span>
                )}
                {selectedDate && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary-100 text-primary-800">
                    {new Date(selectedDate).toLocaleDateString()}
                    <X
                      className="w-4 h-4 ml-2 cursor-pointer"
                      onClick={() => setSelectedDate('')}
                    />
                  </span>
                )}
                {searchTerm && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary-100 text-primary-800">
                    Search: {searchTerm}
                    <X
                      className="w-4 h-4 ml-2 cursor-pointer"
                      onClick={() => setSearchTerm('')}
                    />
                  </span>
                )}
                <button
                  onClick={clearFilters}
                  className="text-sm text-gray-500 hover:text-gray-700 underline"
                >
                  Clear all filters
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Show TopPerformers when no filters are active */}
      {!selectedIntern && !selectedDate && !searchTerm && (
        <TopPerformers entries={entries} />
      )}

      {/* Weekly Performance Section */}
      {(selectedIntern || searchTerm) && (
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Weekly Overview</h2>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigateWeek('prev')}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="text-sm text-gray-600">
                {format(currentWeek, 'MMMM d, yyyy')}
              </span>
              <button
                onClick={() => navigateWeek('next')}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
          <WeeklyPerformance
            entries={convertedEntries}
            weekStart={currentWeek}
          />
        </div>
      )}

      {/* Time Entries List */}
      <div className="bg-white shadow-md rounded-lg">
        <div className="p-6">
          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Loading time entries...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-500">{error}</p>
              <button
                onClick={fetchTimeEntries}
                className="mt-4 text-primary-600 hover:text-primary-700"
              >
                Try again
              </button>
            </div>
          ) : filteredDbEntries.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No time entries found</p>
              {(selectedDate || selectedIntern || searchTerm) && (
                <button
                  onClick={clearFilters}
                  className="mt-2 text-primary-600 hover:text-primary-700"
                >
                  Clear filters
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-4 max-h-[calc(100vh-300px)] overflow-y-auto">
                <table className="table-auto w-full border-collapse border border-gray-300 text-sm text-left">
        <thead className="bg-gray-100 text-gray-700">
          <tr>
            <th className="border border-gray-300 px-4 py-2">Employee Name</th>
            <th className="border border-gray-300 px-4 py-2">Task</th>
            <th className="border border-gray-300 px-4 py-2">Hours</th>
            {/* <th className="border border-gray-300 px-4 py-2">Live Session</th> */}
            <th className="border border-gray-300 px-4 py-2">Date</th>
            <th className="border border-gray-300 px-4 py-2">View</th>
          </tr>
        </thead>
        <tbody>
        {filteredDbEntries.map((entry) => (
                <TimeEntryCard
                  key={entry.ROWID}
                  dbEntry={entry}
                />
              ))}
        </tbody>
        </table>
             
              <div className="text-sm text-gray-500 text-center pt-4">
                Showing {filteredDbEntries.length} entries
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
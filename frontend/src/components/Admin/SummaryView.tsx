import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FcCalendar } from "react-icons/fc"; 
import { CgUserList } from "react-icons/cg"; 
import { MdOutlineCategory } from "react-icons/md"; 

interface TimeEntry {
    // Assignment: String,
    // Hours: String
  date: string;
  meeting: number;
  training: number;
  other: number;
  total: number;
}

export const TimeEntriesSummary: React.FC = () => {
  const [fromDate, setFromDate] = useState<Date | null>(null);
  const [toDate, setToDate] = useState<Date | null>(null);
  const [summaryData, setSummaryData] = useState<TimeEntry[]>([]);


  const fetchSummaryData = async () => {
    if (fromDate && toDate) {
        try {
            const fromDateFormatted = fromDate.toISOString().split('T')[0]; 
            const toDateFormatted = toDate.toISOString().split('T')[0]; 
            
            const response = await fetch(`/server/time_tracker_function/sheetTimeEntry/EntryWithDate?fromDate=${fromDateFormatted}&toDate=${toDateFormatted}`);
            
            const result = await response.json();
            console.log('Result:', result);
            console.log(`Dates receives in excelData function: From Date: ${fromDate} ToDate:${toDate}`)
            setSummaryData(result);
            console.log("Summary Data Content",summaryData);
            
        } catch (error) {
            console.log("Error ftching data",error)
        }
   
      const mockData: TimeEntry[] = [
        {
          date: "2025-01-20",
          meeting: 2,
          training: 1,
          other: 3,
          total: 6,
        },
        {
          date: "2025-01-21",
          meeting: 1,
          training: 2,
          other: 2,
          total: 5,
        },
      ];
    // setSummaryData(result);
    }
  };

  
  useEffect(() => {
    fetchSummaryData();
  }, [fromDate, toDate]);

  return (
    <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-200 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
        Time Entries Summary{" "}
        <CgUserList
          className="ml-2 text-blue-500 cursor-pointer"
          title="Displays the summary of time entries based on selected dates."
        />
      </h2>
      <div className="flex items-center gap-6 mb-6">
        {/* From Date Picker */}
        <div className="flex flex-col">
          <label className="block text-sm font-medium mb-2 text-gray-700">
            From Date
          </label>
          <div className="relative">
            <DatePicker
              selected={fromDate}
              onChange={(date) => setFromDate(date)}
              dateFormat="yyyy-MM-dd"
              className="border px-4 py-2 rounded-lg w-full text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholderText="Select from date"
            />
            <FcCalendar className="absolute top-1/2 transform -translate-y-1/2 right-4 text-gray-500 pointer-events-none" />
          </div>
        </div>
        {/* To Date Picker */}
        <div className="flex flex-col">
          <label className="block text-sm font-medium mb-2 text-gray-700">
            To Date
          </label>
          <div className="relative">
            <DatePicker
              selected={toDate}
              onChange={(date) => setToDate(date)}
              dateFormat="yyyy-MM-dd"
              className="border px-4 py-2 rounded-lg w-full text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholderText="Select to date"
            />
            <FcCalendar className="absolute top-1/2 transform -translate-y-1/2 right-4 text-gray-500 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Table */}
      {summaryData.length > 0 ? (
        <table className="w-full border-collapse border border-gray-300 bg-gradient-to-tr from-white to-blue-50 rounded-lg shadow-md overflow-hidden">
          <thead className="bg-gradient-to-r from-blue-400 via-blue-300 to-blue-500 text-white">
            <tr>
              <th className="border border-gray-300 px-6 py-3 text-left flex items-center gap-2">
                <MdOutlineCategory className="text-white" />
                Category
              </th>
              {summaryData.map((entry) => (
                <th
                  key={entry.date}
                  className="border border-gray-300 px-6 py-3 text-center"
                >
                  {entry.date}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {["meeting", "training", "other", "total"].map((category, rowIndex) => (
              <tr
                key={category}
                className={
                  rowIndex % 2 === 0
                    ? "bg-gradient-to-r from-gray-50 to-blue-50"
                    : "bg-white"
                }
              >
                <td className="border border-gray-300 px-6 py-3 font-medium text-gray-800">
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </td>
                {summaryData.map((entry) => (
                  <td
                    key={`${entry.date}-${category}`}
                    className="border border-gray-300 px-6 py-3 text-gray-700 text-center"
                  >
                    {entry[category as keyof TimeEntry] || 0}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-gray-600 text-center mt-6">
          No data available for the selected date range. Please adjust the dates and try again.
        </p>
      )}
    </div>
  );
};

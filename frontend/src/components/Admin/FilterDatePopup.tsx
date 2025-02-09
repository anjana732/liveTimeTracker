import React, { useState } from "react";
import * as XLSX from 'xlsx';

interface FilterDatePopupProps {
    isOpen: boolean;
    onClose: () => void;
    onApply: (fromDate: string, toDate: string) => void;
}

export const FilterDatePopup: React.FC<FilterDatePopupProps> = ({ isOpen, onClose, onApply }) => {
    const [fromDate, setFromDate] = useState<string>("");
    const [toDate, setToDate] = useState<string>("");

        const excelData = async () => {
            try {
                const response = await fetch(`/server/time_tracker_function/sheetTimeEntry/EntryWithDate?fromDate=${fromDate}&toDate=${toDate}`);
                const result = await response.json();
                console.log('Result:', result);
                console.log(`Dates receives in excelData function: From Date: ${fromDate} ToDate:${toDate}`)
                
                if (result && result.data && Array.isArray(result.data)) {
                    const headers = Object.keys(result.data[0].timeEntries);
                    const flattenedData = result.data.map((entry: any) => {
                        const timeEntries = entry.timeEntries;
                        return { ...timeEntries };
                    });
        
                    console.log('Flattened Data:', flattenedData);
                    const ws = XLSX.utils.json_to_sheet(flattenedData, { header: headers });
                    const wb = XLSX.utils.book_new();
                    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
                    XLSX.writeFile(wb, 'data.xlsx');
                } else {
                    console.error('Invalid data structure:', result);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-80">
                <h3 className="text-lg font-semibold mb-4">Filter by Date</h3>
                <div className="mb-4">
                    <label className="block text-gray-700">From Date</label>
                    <input
                        type="date"
                        value={fromDate}
                        onChange={(e) => setFromDate(e.target.value)}
                        className="border border-gray-300 rounded-md w-full px-3 py-2 mt-1"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">To Date</label>
                    <input
                        type="date"
                        value={toDate}
                        onChange={(e) => setToDate(e.target.value)}
                        className="border border-gray-300 rounded-md w-full px-3 py-2 mt-1"
                    />
                </div>
                <div className="flex justify-end space-x-4">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => {onApply(fromDate, toDate)
                            excelData()
                        }}
                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                    >
                        Apply
                    </button>
                </div>
            </div>
        </div>
    );
};

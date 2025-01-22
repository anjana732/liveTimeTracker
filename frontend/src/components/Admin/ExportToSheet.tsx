
import React, { useState } from "react";
import { FilterDatePopup } from "./FilterDatePopup";
import * as XLSX from 'xlsx';

export function ExportToSheet() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [isSelectEmpPopupOpen, setSelectEmpPopupOpen] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState("");
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('')
    const [employees, setEmployees] = useState<{ userName: string; email: string }[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [selectedEmail, setSelectedEmail] = useState<string | null>(null);

    const handleOpenPopup = () => {
        setIsPopupOpen(true);
    };


    const handleClosePopup = () => {
        setIsPopupOpen(false);
    };


    const handleApplyDate = (fromDate: string, toDate: string) => {
        console.log("FromDate", fromDate);
        console.log("To Date", toDate);
        setIsPopupOpen(false);
    };


    const handleOpenSelectEmpPopup = () => {
        setSelectEmpPopupOpen(true);
    };


    const handleCloseSelectEmpPopup = () => {
        setSelectEmpPopupOpen(false);
    };

    const toggleMenu = () => {
        setMenuOpen((prevState) => !prevState);
    };
    const onCloseEmpPopup = () => {
        setSelectEmpPopupOpen(false);
    }


    const onApplyEmpPopup = (fromDate: string, toDate: string) => {
        setSelectEmpPopupOpen(false);
    };

    const excelData = async () => {
        try {
            const response = await fetch(`/server/time_tracker_function/sheetTimeEntry/getEntryWithName?fromDate=${fromDate}&toDate=${toDate}&email=${selectedEmail}`);
            const result = await response.json();
            console.log(`Dates receives in excelData function: From Date: ${fromDate} ToDate:${toDate}`)
            console.log('Result:', result);

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

            interface Users {
                ROWID: string;
                email: string;
                userName: string;
            }

            interface DataItem {
                Users: Users;
            }

            const allData = result.data;
            const employeesData = allData
                .filter((item: DataItem) => item.Users?.userName && item.Users?.email) // Ensure valid data
                .map((item: DataItem) => ({
                    userName: item.Users.userName,
                    email: item.Users.email,
                }));

            console.log('Processed Employee Data:', employeesData);
            setEmployees(employeesData);

        } catch (error) {
            console.error('Error fetching employee details:', error);
            setError(error instanceof Error ? error.message : 'Error loading employees');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="relative inline-block">
            <button
                className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none"
                onClick={toggleMenu}
            >
                Export to Sheet
            </button>

            {menuOpen && (
                <div
                    className="absolute mt-2 bg-white border border-gray-200 rounded-md shadow-lg w-48 z-50"
                    style={{ position: "absolute" }}
                >
                    <button
                        className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 focus:outline-none"
                        onClick={handleOpenPopup}
                    >
                        All Employee Data
                    </button>
                    {isPopupOpen && (
                        <FilterDatePopup
                            isOpen={isPopupOpen}
                            onClose={handleClosePopup}
                            onApply={handleApplyDate}
                        />
                    )}
                    <button
                        className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 focus:outline-none"
                        onClick={() => {
                            handleOpenSelectEmpPopup();
                            fetchEmployees();
                        }}
                    >
                        Select Employee
                    </button>
                </div>
            )}

            {isSelectEmpPopupOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-80">
                        <h3 className="text-lg font-semibold mb-4">Select Employee</h3>



                        <div className="mb-4">
                            <label className="block text-gray-700">Employee</label>
                            <select
                                className="border border-gray-300 rounded-md w-full px-3 py-2 mt-1"
                                value={selectedEmployee}
                                onChange={(e) => {
                                    const selectedName = e.target.value;
                                    setSelectedEmployee(selectedName);

                                    // Find the email associated with the selected name
                                    const selectedEmployeeData = employees.find(
                                        (employee) => employee.userName === selectedName
                                    );
                                    setSelectedEmail(selectedEmployeeData?.email || null);
                                }}
                            >
                                <option value="">Select an employee</option>
                                {employees.map((employee, index) => (
                                    <option key={index} value={employee.userName}>
                                        {employee.userName}
                                    </option>
                                ))}
                            </select>
                            {/* {selectedEmail && (
      <p className="mt-2 text-sm text-gray-600">
        Selected Employee Email: {selectedEmail}
      </p>
    )} */}
                        </div>

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
                                onClick={onCloseEmpPopup}
                                className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => {
                                    onApplyEmpPopup(fromDate, toDate);
                                    excelData();
                                }}
                                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                            >
                                Apply
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

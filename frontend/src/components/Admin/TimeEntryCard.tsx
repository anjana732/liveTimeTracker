import React, { useState } from "react";
import { AiOutlineEye } from "react-icons/ai";

interface TimeEntryCardProps {
  dbEntry: {
    ROWID: string;
    empName: string;
    entryType: string;
    trainingType?: string;
    Assignment?: string;
    liveSession?: string;
    Hours: string;
    Notes?: string;
    email?: string;
    entryDate: string;
  };
}

export function TimeEntryCard({ dbEntry }: TimeEntryCardProps) {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const handleRowClick = () => {
    console.log("Icon clicked! Opening popup."); // Debugging message
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    console.log("Closing popup."); // Debugging message
    setIsPopupOpen(false);
  };

const dateTime = dbEntry.Hours;
const date = new Date(dateTime)
const hour = date.getHours();
const min = date.getMinutes();
const sec = date.getSeconds();

const timeEntryDate = `${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;

  return (
    <>
      <tr className="hover:bg-gray-200">
        <td className="border border-gray-300 px-4 py-2">{dbEntry.empName}</td>
        <td className="border border-gray-300 px-4 py-2">{dbEntry.entryType}</td>
        <td className="border border-gray-300 px-4 py-2">{timeEntryDate}</td>
        <td className="border border-gray-300 px-4 py-2">{dbEntry.entryDate}</td>
        <td
          className="border border-gray-300 px-4 py-2 text-center cursor-pointer"
          onClick={handleRowClick} // Correctly binding the click event
        >
          <AiOutlineEye className="text-gray-600 hover:text-blue-500" />
        </td>
      </tr>

      {isPopupOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-800">Entry Details</h3>
              <button
                className="text-gray-500 hover:text-gray-800"
                onClick={handleClosePopup}
              >
                ✕
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium text-gray-600">Name</p>
                <p className="text-sm text-gray-800">{dbEntry.empName}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Task</p>
                <p className="text-sm text-gray-800">{dbEntry.entryType}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Hours</p>
                <p className="text-sm text-gray-800">{dbEntry.Hours}</p>
              </div>
              {dbEntry.liveSession && (
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Live Session
                  </p>
                  <p className="text-sm text-gray-800">{dbEntry.liveSession}</p>
                </div>
              )}
              <div>
                <p className="text-sm font-medium text-gray-600">Date</p>
                <p className="text-sm text-gray-800">{dbEntry.entryDate}</p>
              </div>
              {dbEntry.Notes && (
                <div>
                  <p className="text-sm font-medium text-gray-600">Notes</p>
                  <p className="text-sm text-gray-800">{dbEntry.Notes}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

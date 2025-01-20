// import React from 'react';
// import { format, parseISO } from 'date-fns';
// import { Clock, Calendar, FileText } from 'lucide-react';
// import { TimeEntry } from '../../types';
// import { mockInterns } from '../../data/mockData';

// interface DBTimeEntry {
//   ROWID: string;
//   empName: string;
//   entryType: string;
//   trainingType: string;
//   Assignment: string;
//   liveSession: string;
//   Hours: string;
//   Notes: string;
//   email: string;
//   entryDate: string;
// }

// interface TimeEntryCardProps {
//   dbEntry: {
//     ROWID: string;
//     empName: string;
//     entryType: string;
//     trainingType: string;
//     Assignment: string;
//     liveSession: string;
//     Hours: string;
//     Notes: string;
//     email: string;
//     entryDate: string;
//   };
// }

// export function TimeEntryCard({ dbEntry }: TimeEntryCardProps) {
//   return (
//     <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow">
//       <div className="flex justify-between items-start">
//         <div>
//           <h3 className="text-lg font-semibold text-gray-800">{dbEntry.empName}</h3>
//           {/* <p className="text-sm text-gray-600">{dbEntry.email}</p> */}
//         </div>
//         <span className="text-sm text-gray-500">{dbEntry.entryDate}</span>
//       </div>

//       <div className="mt-3 grid grid-cols-2 gap-2">
//         <div>
//           <p className="text-sm font-medium text-gray-600">Task : {dbEntry.entryType}</p>
//           {/* <p className="text-sm text-gray-800">{dbEntry.entryType}</p> */}
//         </div>
//         {/* <div>
//           <p className="text-sm font-medium text-gray-600">Training Type</p>
//           <p className="text-sm text-gray-800">{dbEntry.trainingType}</p>
//         </div> */}
//         {/* {dbEntry.Assignment && (
//           <div>
//             <p className="text-sm font-medium text-gray-600">Assignment</p>
//             <p className="text-sm text-gray-800">{dbEntry.Assignment}</p>
//           </div>
//         )} */}
//         {dbEntry.liveSession && (
//           <div>
//             <p className="text-sm font-medium text-gray-600">Live Session</p>
//             <p className="text-sm text-gray-800">{dbEntry.liveSession}</p>
//           </div>
//         )}
//       </div>

//       <div className="mt-3">
//         <p className="text-sm font-medium text-gray-600">Hours</p>
//         <p className="text-sm text-gray-800">{dbEntry.Hours}</p>
//       </div>

//       {/* {dbEntry.Notes && (
//         <div className="mt-3">
//           <p className="text-sm font-medium text-gray-600">Notes</p>
//           <p className="text-sm text-gray-800">{dbEntry.Notes}</p>
//         </div>
//       )} */}
//     </div>
//   );
// }



// import React, { useState } from "react";
// import { Eye } from "lucide-react";
// import { AiOutlineEye } from "react-icons/ai";


// interface TimeEntryCardProps {
//   dbEntry: {
//     ROWID: string;
//     empName: string;
//     entryType: string;
//     trainingType: string;
//     Assignment: string;
//     liveSession: string;
//     Hours: string;
//     Notes: string;
//     email: string;
//     entryDate: string;
//   };
// }

// export function TimeEntryCard({ dbEntry }: TimeEntryCardProps) {
//   const [isPopupOpen, setIsPopupOpen] = useState(false);

//   const handleRowClick = () => {
//     setIsPopupOpen(true);
//   };

//   const handleClosePopup = () => {
//     setIsPopupOpen(false);
//   };

//   return (
//     // <div>
//     //   <table className="table-auto w-full border-collapse border border-gray-300 text-sm text-left">
//     //     <thead className="bg-gray-100 text-gray-700">
//     //       <tr>
//     //         <th className="border border-gray-300 px-4 py-2">Employee Name</th>
//     //         <th className="border border-gray-300 px-4 py-2">Task</th>
//     //         <th className="border border-gray-300 px-4 py-2">Hours</th>
//     //         <th className="border border-gray-300 px-4 py-2">Live Session</th>
//     //         <th className="border border-gray-300 px-4 py-2">Date</th>
//     //       </tr>
//     //     </thead>
//     //     <tbody>
//     //       <tr
//     //         className="hover:bg-gray-200 cursor-pointer"
//     //         onClick={handleRowClick}
//     //       >
//     //         <td className="border border-gray-300 px-4 py-2">{dbEntry.empName}</td>
//     //         <td className="border border-gray-300 px-4 py-2">{dbEntry.entryType}</td>
//     //         <td className="border border-gray-300 px-4 py-2">{dbEntry.Hours}</td>
//     //         <td className="border border-gray-300 px-4 py-2">{dbEntry.liveSession || "N/A"}</td>
//     //         <td className="border border-gray-300 px-4 py-2">{dbEntry.entryDate}</td>
//     //       </tr>
//     //     </tbody>
//     //   </table>

//     //   {isPopupOpen && (
//     //     <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
//     //       <div className="bg-white p-6 rounded-lg shadow-lg w-96">
//     //         <div className="flex justify-between items-center mb-4">
//     //           <h3 className="text-lg font-bold text-gray-800">
//     //             Entry Details
//     //           </h3>
//     //           <button
//     //             className="text-gray-500 hover:text-gray-800"
//     //             onClick={handleClosePopup}
//     //           >
//     //             ✕
//     //           </button>
//     //         </div>
//     //         <div className="space-y-3">
//     //           <div>
//     //             <p className="text-sm font-medium text-gray-600">Name</p>
//     //             <p className="text-sm text-gray-800">{dbEntry.empName}</p>
//     //           </div>
//     //           <div>
//     //             <p className="text-sm font-medium text-gray-600">Task</p>
//     //             <p className="text-sm text-gray-800">{dbEntry.entryType}</p>
//     //           </div>
//     //           <div>
//     //             <p className="text-sm font-medium text-gray-600">Hours</p>
//     //             <p className="text-sm text-gray-800">{dbEntry.Hours}</p>
//     //           </div>
//     //           {dbEntry.liveSession && (
//     //             <div>
//     //               <p className="text-sm font-medium text-gray-600">
//     //                 Live Session
//     //               </p>
//     //               <p className="text-sm text-gray-800">{dbEntry.liveSession}</p>
//     //             </div>
//     //           )}
//     //           <div>
//     //             <p className="text-sm font-medium text-gray-600">Date</p>
//     //             <p className="text-sm text-gray-800">{dbEntry.entryDate}</p>
//     //           </div>
//     //           {dbEntry.Notes && (
//     //             <div>
//     //               <p className="text-sm font-medium text-gray-600">Notes</p>
//     //               <p className="text-sm text-gray-800">{dbEntry.Notes}</p>
//     //             </div>
//     //           )}
//     //         </div>
//     //       </div>
//     //     </div>
//     //   )}
//     // </div>


//     <tr
//       className="hover:bg-gray-200 cursor-pointer"
//     // onClick={() => onRowClick(dbEntry)}
//     >
//       <td className="border border-gray-300 px-4 py-2">{dbEntry.empName}</td>
//       <td className="border border-gray-300 px-4 py-2">{dbEntry.entryType}</td>
//       <td className="border border-gray-300 px-4 py-2">{dbEntry.Hours}</td>
//       {/* <td className="border border-gray-300 px-4 py-2">{dbEntry.liveSession || "N/A"}</td> */}
//       <td className="border border-gray-300 px-4 py-2">{dbEntry.entryDate}</td>
//       <td className="border border-gray-300 px-4 py-2" onClick={handleRowClick}><AiOutlineEye /></td>
//     </tr>
   
//    {
//     isPopupOpen && (
//       <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
//         <div className="bg-white p-6 rounded-lg shadow-lg w-96">
//           <div className="flex justify-between items-center mb-4">
//             <h3 className="text-lg font-bold text-gray-800">
//               Entry Details
//             </h3>
//             <button
//               className="text-gray-500 hover:text-gray-800"
//               onClick={handleClosePopup}
//             >
//               ✕
//             </button>
//           </div>
//           <div className="space-y-3">
//             <div>
//               <p className="text-sm font-medium text-gray-600">Name</p>
//               <p className="text-sm text-gray-800">{dbEntry.empName}</p>
//             </div>
//             <div>
//               <p className="text-sm font-medium text-gray-600">Task</p>
//               <p className="text-sm text-gray-800">{dbEntry.entryType}</p>
//             </div>
//             <div>
//               <p className="text-sm font-medium text-gray-600">Hours</p>
//               <p className="text-sm text-gray-800">{dbEntry.Hours}</p>
//             </div>
//             {dbEntry.liveSession && (
//               <div>
//                 <p className="text-sm font-medium text-gray-600">
//                   Live Session
//                 </p>
//                 <p className="text-sm text-gray-800">{dbEntry.liveSession}</p>
//               </div>
//             )}
//             <div>
//               <p className="text-sm font-medium text-gray-600">Date</p>
//               <p className="text-sm text-gray-800">{dbEntry.entryDate}</p>
//             </div>
//             {dbEntry.Notes && (
//               <div>
//                 <p className="text-sm font-medium text-gray-600">Notes</p>
//                 <p className="text-sm text-gray-800">{dbEntry.Notes}</p>
//               </div>
//             )}

//             );
// }


// import React, { useState } from "react";
// import { AiOutlineEye } from "react-icons/ai";

// interface TimeEntryCardProps {
//   dbEntry: {
//     ROWID: string;
//     empName: string;
//     entryType: string;
//     trainingType?: string;
//     Assignment?: string;
//     liveSession?: string;
//     Hours: string;
//     Notes?: string;
//     email?: string;
//     entryDate: string;
//   };
// }

// export function TimeEntryCard({ dbEntry }: TimeEntryCardProps) {
//   const [isPopupOpen, setIsPopupOpen] = useState(false);

//   const handleRowClick = () => {
//     setIsPopupOpen(true);
//   };

//   const handleClosePopup = () => {
//     setIsPopupOpen(false);
//   };

//   return (
//     <>
//       <tr className="hover:bg-gray-200">
//         <td className="border border-gray-300 px-4 py-2">{dbEntry.empName}</td>
//         <td className="border border-gray-300 px-4 py-2">{dbEntry.entryType}</td>
//         <td className="border border-gray-300 px-4 py-2">{dbEntry.Hours}</td>
//         <td className="border border-gray-300 px-4 py-2">{dbEntry.entryDate}</td>
//         <td
//           className="border border-gray-300 px-4 py-2 text-center cursor-pointer"
//           onClick={handleRowClick}
//         >
//           <AiOutlineEye className="text-gray-600 hover:text-blue-500" />
//         </td>
//       </tr>

//       {isPopupOpen && (
//         <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
//           <div className="bg-white p-6 rounded-lg shadow-lg w-96">
//             <div className="flex justify-between items-center mb-4">
//               <h3 className="text-lg font-bold text-gray-800">Entry Details</h3>
//               <button
//                 className="text-gray-500 hover:text-gray-800"
//                 onClick={handleClosePopup}
//               >
//                 ✕
//               </button>
//             </div>
//             <div className="space-y-3">
//               <div>
//                 <p className="text-sm font-medium text-gray-600">Name</p>
//                 <p className="text-sm text-gray-800">{dbEntry.empName}</p>
//               </div>
//               <div>
//                 <p className="text-sm font-medium text-gray-600">Task</p>
//                 <p className="text-sm text-gray-800">{dbEntry.entryType}</p>
//               </div>
//               <div>
//                 <p className="text-sm font-medium text-gray-600">Hours</p>
//                 <p className="text-sm text-gray-800">{dbEntry.Hours}</p>
//               </div>
//               {dbEntry.liveSession && (
//                 <div>
//                   <p className="text-sm font-medium text-gray-600">
//                     Live Session
//                   </p>
//                   <p className="text-sm text-gray-800">{dbEntry.liveSession}</p>
//                 </div>
//               )}
//               <div>
//                 <p className="text-sm font-medium text-gray-600">Date</p>
//                 <p className="text-sm text-gray-800">{dbEntry.entryDate}</p>
//               </div>
//               {dbEntry.Notes && (
//                 <div>
//                   <p className="text-sm font-medium text-gray-600">Notes</p>
//                   <p className="text-sm text-gray-800">{dbEntry.Notes}</p>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// }


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

  return (
    <>
      <tr className="hover:bg-gray-200">
        <td className="border border-gray-300 px-4 py-2">{dbEntry.empName}</td>
        <td className="border border-gray-300 px-4 py-2">{dbEntry.entryType}</td>
        <td className="border border-gray-300 px-4 py-2">{dbEntry.Hours}</td>
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

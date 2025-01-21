// import React,{useState} from "react";

// interface FilterDatePopupProps {
//     isOpen: boolean;
//     onClose: () => void;
//     onApply: (fromDate: string, toDate: string) => void;
// }


// export function FilterDatePopup: React.FC<FilterDatePopupProps> = ({ isOpen , onClose, onApply }) =>{

//     const[fromDate, setFromDate] = useState('');
//     const[toDate, setToDate] = useState('');



//     if(!isOpen) return null;

//     return (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//             <div className="bg-white p-6 rounded-lg shadow-lg w-80">
//                 <h3 className="text-lg font-semibold mb-4">Filter by Date</h3>
//                 <div className="mb-4"> 
//                     <label className="block text-gray-700">From Date</label>
//                     <input
//                         type="date"
//                         value={fromDate}
//                         onChange={(e) => setFromDate(e.target.value)}
//                         className="border border-gray-300 rounded-md w-full px-3 py-2 mt-1"
//                     />
//                 </div>
//                 <div className="mb-4">
//                     <label className="block text-gray-700">To Date</label>
//                     <input
//                         type="date"
//                         value={toDate}
//                         onChange={(e) => setToDate(e.target.value)}
//                         className="border border-gray-300 rounded-md w-full px-3 py-2 mt-1"
//                     />
//                 </div>
//                 <div className="flex justify-end space-x-4">
//                     <button
//                         onClick={onClose}
//                         className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
//                     >
//                         Cancel
//                     </button>
//                     <button
//                         onClick={() => onApply(fromDate, toDate)}
//                         className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
//                     >
//                         Apply
//                     </button>
//                 </div>
//             </div>
//         </div>
//     );
// }


import React, { useState } from "react";

interface FilterDatePopupProps {
    isOpen: boolean;
    onClose: () => void;
    onApply: (fromDate: string, toDate: string) => void;
}

export const FilterDatePopup: React.FC<FilterDatePopupProps> = ({ isOpen, onClose, onApply }) => {
    const [fromDate, setFromDate] = useState<string>("");
    const [toDate, setToDate] = useState<string>("");

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
                        onClick={() => onApply(fromDate, toDate)}
                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                    >
                        Apply
                    </button>
                </div>
            </div>
        </div>
    );
};

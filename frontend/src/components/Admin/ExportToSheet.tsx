import React, { useState } from "react";
import { FilterDatePopup } from "./FilterDatePopup";

export function ExportToSheet() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [isPopupOpen, setIsPopupOpen] = useState(false);

    const handleOpenPopup = () =>{
        setIsPopupOpen(true);
    }

    const handleClosePopup = () =>{
        setIsPopupOpen(false);
    }

    const handleApplyDate = (fromDate :String, toDate: String) =>{
        console.log("FromDate", fromDate);
        console.log("To Date", toDate);
        setIsPopupOpen(false);
    }

    const toggleMenu = () => {
        setMenuOpen((prevState) => !prevState);
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
                        onClick= {handleOpenPopup}
                    >
                        All Employee Data
                    </button>
                    {<FilterDatePopup 
                            isOpen = {isPopupOpen}
                            onClose={handleClosePopup}
                            onApply={handleApplyDate}
                            />}
                    <button
                        className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 focus:outline-none"
                        onClick={() => alert("Exporting Selected Employee Data")}
                    >
                        Select Employee
                    </button>
                </div>
            )}
        </div>
    );
}

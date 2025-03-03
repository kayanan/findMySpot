// src/pages/components/Navbar.jsx

import { MenuIcon, SearchIcon, BellIcon, ChevronDownIcon } from "@heroicons/react/outline";
import { useState } from "react";

import { useNavigate } from "react-router-dom";

const Navbar = ({ isSidebarOpen, setIsSidebarOpen }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
 
  
  const navigate = useNavigate();

  // Toggle dropdown visibility
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Toggle sidebar visibility
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };




  return (
    <div className="mb-20">
      {/* Navbar */}
      <nav
        className={`bg-gray-800 h-16 flex items-center fixed top-0 ${
          isSidebarOpen ? "left-64" : "left-20"
        } right-0 z-30 transition-all duration-300`}
      >
        {/* Sidebar Toggle Button */}
        <button
          onClick={toggleSidebar}
          className="text-gray-400 hover:text-cyan-500 focus:outline-none ml-4"
        >
          <MenuIcon className="h-6 w-6" />
        </button>

        {/* Search Box */}
        <div className="flex-grow mx-4">
          <div className="relative w-3/4">
            <input
              type="text"
              placeholder="Search here..."
              className="w-full bg-gray-300 text-gray-700 rounded-lg pl-10 pr-4 py-2 focus:outline-none"
            />
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          </div>
        </div>

        {/* Notification Icon and Profile Picture with Dropdown */}
        <div className="flex items-center space-x-4 mr-10 relative">
          <div className="relative">
            <BellIcon className="h-6 w-6 text-gray-400 cursor-pointer" />
            <span className="absolute top-0 right-0 bg-red-500 rounded-full h-2 w-2"></span>
          </div>

       

          <ChevronDownIcon
            className={`h-6 w-6 text-gray-400 cursor-pointer ml-2 ${
              isDropdownOpen ? "rotate-180" : ""
            }`}
            onClick={toggleDropdown}
          />

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute right-0 top-12 bg-gray-800 rounded-md shadow-md w-40">
              <ul>
                <li
                  className="py-2 px-4 hover:bg-gray-700 hover:rounded-md text-white cursor-pointer"
                  onClick={() => navigate("/profile")}
                >
                  View Profile
                </li>
                <li
                  className="py-2 px-4 hover:bg-gray-700 hover:rounded-md text-red-700 font-medium cursor-pointer"
                 
                >
                  Logout
                </li>
              </ul>
            </div>
          )}
        </div>
      </nav>
    </div>
  );
};



export default Navbar;

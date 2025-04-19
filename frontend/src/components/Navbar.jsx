// src/pages/components/Navbar.jsx

import { MenuIcon, SearchIcon, BellIcon, ChevronDownIcon, UserCircleIcon } from "@heroicons/react/outline";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Navbar = ({ isSidebarOpen, setIsSidebarOpen }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="mb-16">
      <nav
        className={`bg-gray-800 h-16 flex items-center fixed top-0 ${
          isSidebarOpen ? "left-64" : "left-20"
        } right-0 z-30 transition-all duration-300`}
      >
        {/* Sidebar Toggle Button */}
        <button
          onClick={toggleSidebar}
          className="text-gray-400 hover:text-cyan-500 focus:outline-none ml-4 transition-colors duration-200"
        >
          <MenuIcon className="h-6 w-6" />
        </button>

        {/* Search Box */}
        <div className="flex-grow mx-4">
          <div className="relative w-3/4 max-w-2xl">
            <input
              type="text"
              placeholder="Search here..."
              className="w-full bg-gray-700 border border-gray-600 text-gray-200 rounded-lg pl-12 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
            />
            <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          </div>
        </div>

        {/* Notification and Profile Section */}
        <div className="flex items-center space-x-6 mr-8 relative">
          {/* Notification Icon */}
          <div className="relative group">
            <BellIcon className="h-6 w-6 text-gray-400 cursor-pointer hover:text-cyan-500 transition-colors duration-200" />
            <span className="absolute -top-1 -right-1 bg-red-500 rounded-full h-4 w-4 flex items-center justify-center text-xs text-white font-medium">
              3
            </span>
          </div>

          {/* Profile Section */}
          <div className="flex items-center space-x-3 cursor-pointer group" onClick={toggleDropdown}>
            <div className="h-8 w-8 rounded-full bg-gray-700 flex items-center justify-center">
              <UserCircleIcon className="h-6 w-6 text-gray-400 group-hover:text-cyan-500 transition-colors duration-200" />
            </div>
            <ChevronDownIcon
              className={`h-5 w-5 text-gray-400 group-hover:text-cyan-500 transition-all duration-200 ${
                isDropdownOpen ? "rotate-180" : ""
              }`}
            />
          </div>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute right-0 top-14 bg-gray-800 rounded-lg shadow-lg w-48 border border-gray-700 transform transition-all duration-200">
              <ul className="py-2">
                <li
                  className="py-2.5 px-4 hover:bg-gray-700 text-gray-400 hover:text-cyan-500 cursor-pointer transition-colors duration-200"
                  onClick={() => navigate("/profile")}
                >
                  View Profile
                </li>
                <li
                  className="py-2.5 px-4 hover:bg-gray-700 text-red-400 hover:text-red-500 font-medium cursor-pointer transition-colors duration-200"
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

// src/pages/User/UserList.jsx

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { EyeIcon, PencilAltIcon } from "@heroicons/react/outline";
import Dropdown from "../../utils/Dropdown";
import { statusOptions, designationOptions } from "../../utils/DropdownOptions";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [branches, setBranches] = useState([]);

  // Default to "active" so the dropdown shows Active initially
  // We still have an "All" option if the user wants to see all
  const [filters, setFilters] = useState({
    status: "active",
    branch: "",
    designation: "",
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch users and branches on mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const userRes = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/user`,
          { withCredentials: true }
        );
        const branchRes = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/branch`,
          { withCredentials: true }
        );
        const activeBranches = branchRes.data.branches.filter(
          (b) => b.status === "active"
        );

        setUsers(userRes.data.users);
        setBranches(activeBranches);
      } catch (error) {
        console.error("Error fetching data:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Re-filter whenever data or filters change
  useEffect(() => {
    filterAllUsers();
  }, [users, filters, searchTerm]);

  // Main filtering logic
  const filterAllUsers = () => {
    const { status, branch, designation } = filters;
    const lowerSearch = searchTerm.toLowerCase();

    const filtered = users.filter((user) => {
      // Status filter
      const matchesStatus = status ? user.status === status : true;
      // Branch filter
      const matchesBranch = branch ? user.branchId?.name === branch : true;
      // Designation filter
      const matchesDesignation = designation
        ? user.designation === designation
        : true;
      // Search filter
      const matchesSearch =
        user.firstName.toLowerCase().includes(lowerSearch) ||
        user.lastName.toLowerCase().includes(lowerSearch) ||
        user.nic?.toLowerCase().includes(lowerSearch) ||
        user.mobile?.toLowerCase().includes(lowerSearch) ||
        user.designation?.toLowerCase().includes(lowerSearch);

      return (
        matchesStatus &&
        matchesBranch &&
        matchesDesignation &&
        matchesSearch
      );
    });

    setFilteredUsers(filtered);
  };

  // Handle dropdown changes
  const handleFilterChange = (filterName, value) => {
    setFilters((prev) => ({ ...prev, [filterName]: value }));
  };

  // Handle search input
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="p-4 max-w-7xl mx-auto">
      {/* Header & Search & Add User */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 space-y-4 sm:space-y-0">
        <h1 className="text-2xl sm:text-3xl font-bold text-cyan-500">
          User Management
        </h1>
        <div className="w-full sm:w-auto sm:flex-1 sm:mx-4 relative">
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
        </div>
        <Link
          to="/user/add"
          className="bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-2 rounded-md shadow-md transition duration-200"
        >
          Add User
        </Link>
      </div>

      {/* Filters */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
        {/* Status (All, Active, Inactive) */}
        <Dropdown
          label="Status"
          filterName="status"
          selectedValue={filters.status}
          options={statusOptions}
          onChange={handleFilterChange}
        />

        {/* Branch (All + branches) */}
        <Dropdown
          label="Branch"
          filterName="branch"
          selectedValue={filters.branch}
          options={[
            { value: "", label: "All" },
            ...branches.map((b) => ({ value: b.name, label: b.name })),
          ]}
          onChange={handleFilterChange}
        />

        {/* Designation (All, ADMIN, RM, etc.) */}
        <Dropdown
          label="Designation"
          filterName="designation"
          selectedValue={filters.designation}
          options={designationOptions}
          onChange={handleFilterChange}
        />
      </div>

      {/* Loading Spinner or Table */}
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-cyan-500"></div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            {/* Desktop Table */}
            <table className="w-full table-auto text-sm hidden md:table">
              <thead>
                <tr className="bg-gray-100 text-gray-700">
                  <th className="py-3 px-4 font-semibold">Profile</th>
                  <th className="py-3 px-4 font-semibold">First Name</th>
                  <th className="py-3 px-4 font-semibold">Last Name</th>
                  <th className="py-3 px-4 font-semibold hidden lg:table-cell">
                    NIC
                  </th>
                  <th className="py-3 px-4 font-semibold hidden sm:table-cell">
                    Mobile
                  </th>
                  <th className="py-3 px-4 font-semibold hidden md:table-cell">
                    Designation
                  </th>
                  <th className="py-3 px-4 font-semibold text-center">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr
                    key={user._id}
                    className="border-t hover:bg-cyan-50"
                  >
                    <td className="py-3 px-4 text-center">
                      <img
                        src={
                          user.profileImage
                            ? `${import.meta.env.VITE_BACKEND_URL}${user.profileImage}`
                            : `http://localhost:5173/assets/default-avatar.png`
                        }
                        alt="Profile"
                        className="h-10 w-10 sm:h-16 sm:w-16 rounded-full object-cover mx-auto"
                      />
                    </td>
                    <td className="py-3 px-4">{user.firstName}</td>
                    <td className="py-3 px-4">{user.lastName}</td>
                    <td className="py-3 px-4 hidden lg:table-cell">{user.nic}</td>
                    <td className="py-3 px-4 hidden sm:table-cell">{user.mobile}</td>
                    <td className="py-3 px-4 hidden md:table-cell">
                      {user.designation}
                    </td>
                    <td className="py-3 px-4 flex justify-center space-x-2">
                      <Link
                        to={`/user/view/${user._id}`}
                        className="bg-gray-400 hover:bg-gray-600 text-white px-3 py-2 rounded-full"
                      >
                        <EyeIcon className="h-5 w-5" />
                      </Link>
                      <Link
                        to={`/user/update/${user._id}`}
                        className="bg-cyan-500 hover:bg-cyan-600 text-white px-3 py-2 rounded-full"
                      >
                        <PencilAltIcon className="h-5 w-5" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Mobile Stacked Layout */}
            <div className="md:hidden">
              {filteredUsers.map((user) => (
                <div
                  key={user._id}
                  className="border-b p-4 flex flex-col space-y-2 hover:bg-cyan-50"
                >
                  <div className="flex items-center space-x-4">
                    <img
                      src={
                        user.profileImage
                          ? `${import.meta.env.VITE_BACKEND_URL}${user.profileImage}`
                          : `http://localhost:5173/assets/default-avatar.png`
                      }
                      alt="Profile"
                      className="h-16 w-16 rounded-full object-cover"
                    />
                    <div>
                      <h3 className="font-semibold text-lg">{`${user.firstName} ${user.lastName}`}</h3>
                      <p className="text-sm text-gray-500">{user.designation}</p>
                    </div>
                  </div>
                  <p className="text-sm">
                    <span className="font-medium">NIC:</span> {user.nic}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Mobile:</span> {user.mobile}
                  </p>
                  <div className="flex justify-between">
                    <Link
                      to={`/user/view/${user._id}`}
                      className="bg-gray-400 hover:bg-gray-600 text-white px-3 py-2 rounded-full"
                    >
                      View
                    </Link>
                    <Link
                      to={`/user/update/${user._id}`}
                      className="bg-cyan-500 hover:bg-cyan-600 text-white px-3 py-2 rounded-full"
                    >
                      Edit
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserList;

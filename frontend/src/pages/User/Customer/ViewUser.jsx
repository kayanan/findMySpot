// src/pages/User/ViewUser.jsx

import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { FaArrowLeft, FaEnvelope, FaPhone, FaBuilding, FaUserAlt } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SkeletonLoader = () => (
  <div className="grid md:grid-cols-2 gap-6 animate-pulse">
    {/* Profile Skeleton */}
    <div className="bg-gray-200 rounded-lg p-6 flex flex-col items-center">
      <div className="w-32 h-32 rounded-full bg-gray-300"></div>
      <div className="mt-4 w-3/4 h-6 bg-gray-300 rounded"></div>
      <div className="mt-2 w-1/2 h-4 bg-gray-300 rounded"></div>
    </div>
    {/* Details Skeleton */}
    <div className="bg-gray-200 rounded-lg p-6 space-y-4">
      <div className="w-1/2 h-6 bg-gray-300 rounded"></div>
      <div className="grid grid-cols-2 gap-4">
        <div className="w-full h-4 bg-gray-300 rounded"></div>
        <div className="w-full h-4 bg-gray-300 rounded"></div>
        <div className="w-full h-4 bg-gray-300 rounded"></div>
        <div className="w-full h-4 bg-gray-300 rounded"></div>
      </div>
    </div>
    {/* Additional Sections */}
    <div className="bg-gray-200 rounded-lg p-6 space-y-4">
      <div className="w-1/3 h-6 bg-gray-300 rounded"></div>
      <div className="w-full h-4 bg-gray-300 rounded"></div>
      <div className="w-2/3 h-4 bg-gray-300 rounded"></div>
    </div>
    <div className="bg-gray-200 rounded-lg p-6 space-y-4">
      <div className="w-1/3 h-6 bg-gray-300 rounded"></div>
      <div className="w-full h-4 bg-gray-300 rounded"></div>
      <div className="w-2/3 h-4 bg-gray-300 rounded"></div>
    </div>
  </div>
);

const ViewUser = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUser = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/user/${id}`, {
        withCredentials: true, // Include cookies
      });
      setUser(data.user);
    } catch (err) {
      console.error("Error fetching user:", err.message);
      setError("Failed to load user details. Please try again.");
      // Show error using Toastify
      toast.error("Failed to load user details. Please try again.", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [id]);

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <SkeletonLoader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-6 text-red-500">
        <p>{error}</p>
        <button
          onClick={fetchUser}
          className="mt-4 bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-md"
        >
          Retry
        </button>
        <br />
        <Link
          to="/user"
          className="mt-4 inline-flex items-center text-gray-600 hover:text-cyan-600"
        >
          <FaArrowLeft className="mr-2" />
          Back to User List
        </Link>
        <ToastContainer />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      {/* Back Button */}
      <Link to="/user" className="mb-6 inline-flex items-center text-gray-600 hover:text-cyan-600">
        <FaArrowLeft className="mr-2" />
        Back to User List
      </Link>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Profile Section */}
<div className="bg-white shadow-md rounded-lg p-6 flex flex-col items-center">
  <div className="relative w-32 h-32 rounded-full border-4 border-gray-200 overflow-hidden">
    <img
      src={
        user.profileImage
          ? `${import.meta.env.VITE_BACKEND_URL}${user.profileImage}`
          : `http://localhost:5173/assets/default-avatar.png`
      }
      alt={`${user.firstName} ${user.lastName}`}
      className="object-cover w-full h-full"
    />
  </div>
  <div className="mt-4 text-center">
    <h2 className="text-2xl font-bold capitalize">{`${user.firstName} ${user.lastName}`}</h2>
    <p className="text-lg text-gray-500">{user.designation}</p>
  </div>
</div>


        {/* User Details Section */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold">User Details</h3>
            <span
              className={`text-base font-semibold px-2 py-1 rounded ${
                user.status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
              }`}
            >
              {user.status}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-base font-medium text-gray-500">First Name</p>
              <p className="text-base font-semibold">{user.firstName}</p>
            </div>
            <div>
              <p className="text-base font-medium text-gray-500">Last Name</p>
              <p className="text-base font-semibold">{user.lastName}</p>
            </div>
            <div>
              <p className="text-base font-medium text-gray-500">NIC</p>
              <p className="text-base font-semibold">{user.nic}</p>
            </div>
            <div>
              <p className="text-base font-medium text-gray-500">Username</p>
              <p className="text-base font-semibold">{user.username}</p>
            </div>
          </div>
        </div>

        {/* Contact Information Section */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h3 className="text-xl font-bold mb-4">Contact Information</h3>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <FaEnvelope className="text-gray-500" />
              <a href={`mailto:${user.email}`} className="text-base text-cyan-600 hover:underline">
                {user.email}
              </a>
            </div>
            <div className="flex items-center gap-2">
              <FaPhone className="text-gray-500" />
              <span className="text-base">{user.mobile}</span>
            </div>
            <div className="flex items-center gap-2">
              <FaBuilding className="text-gray-500" />
              <span className="text-base">{user.address}</span>
            </div>
          </div>
        </div>

        {/* Branch Information Section */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h3 className="text-xl font-bold mb-4">Branch Information</h3>
          <div className="space-y-2">
            <p>
              <span className="text-base font-medium text-gray-500">Branch Name:</span>{" "}
              <span className="text-base font-semibold">{user.branchId?.name || "N/A"}</span>
            </p>
            <p>
              <span className="text-base font-medium text-gray-500">Branch Address:</span>{" "}
              <span className="text-base font-semibold">{user.branchId?.address || "N/A"}</span>
            </p>
            <p>
              <span className="text-base font-medium text-gray-500">Branch Contact:</span>{" "}
              <span className="text-base font-semibold">{user.branchId?.mobile || "N/A"}</span>
            </p>
          </div>
        </div>

        {/* Privileges Section */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h3 className="text-xl font-bold mb-4">Privileges</h3>
          <ul className="space-y-2">
            {user.privilegeList.length > 0 ? (
              user.privilegeList.map((privilege, index) => (
                <li key={index} className="flex items-center gap-2">
                  <FaUserAlt className="text-gray-500" />
                  <span className="text-base">{privilege}</span>
                </li>
              ))
            ) : (
              <li className="text-base">No privileges assigned</li>
            )}
          </ul>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default ViewUser;


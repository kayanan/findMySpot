// src/pages/User/ParkingOwner/ViewParkingOwner.jsx

import { useEffect, useState } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import axios from "axios";
import { FaArrowLeft, FaEnvelope, FaPhone, FaBuilding, FaParking, FaCar, FaCheck, FaTimes } from "react-icons/fa";
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
  </div>
);

const ViewParkingOwner = () => {
  const { id } = useParams();
  const [owner, setOwner] = useState(null);
  const { filters } = useLocation().state;
  const [parkingAreas, setParkingAreas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchParkingOwner = async () => {
    setLoading(true);
    setError(null);
    try {
      const [ownerResponse, parkingAreasResponse] = await Promise.all([
        axios.get(`${import.meta.env.VITE_BACKEND_APP_URL}/v1/user/profile/${id}`, { withCredentials: true }),
        axios.get(`${import.meta.env.VITE_BACKEND_ADMIN_URL}/v1/parking-area/owner/${id}`, { withCredentials: true })
      ]);
      setOwner(ownerResponse.data.user);
      setParkingAreas(parkingAreasResponse.data.data);
    } catch (err) {
      console.error("Error fetching data:", err.message);
      setError("Failed to load data. Please try again.");
      toast.error("Failed to load data. Please try again.", {
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
    fetchParkingOwner();
  }, [id]);

  const getSlotTypeCount = (slots) => {
    const countByType = {};
    slots.forEach(slot => {
      const type = slot?.vehicleType?.vehicleType || 'Unknown';
      countByType[type] = (countByType[type] || 0) + 1;
    });
    return countByType;
  };

  const handleApprove = async () => {
    try {
      await axios.patch(`${import.meta.env.VITE_BACKEND_ADMIN_URL}/v1/users/approve/${id}`, {}, { withCredentials: true });
      toast.success("Parking owner approved successfully", {
        onClose: () => {
          fetchParkingOwner();
        },
        autoClose: 1000,
      });
    } catch (err) {
      console.error("Error approving parking owner:", err.message);
      toast.error("Error approving parking owner: " + err.message);
    }
  };

  const handleReject = async () => {
    try {
      await axios.patch(`${import.meta.env.VITE_BACKEND_ADMIN_URL}/v1/users/reject/${id}`, {}, { withCredentials: true });
      toast.success("Parking owner rejected successfully");
      fetchParkingOwner();
    } catch (err) {
      console.error("Error rejecting parking owner:", err.message);
      toast.error("Error rejecting parking owner: " + err.message);
    }
  };

  const handleStatusChange = async (isActive) => {
    try {
      await axios.patch(
        `${import.meta.env.VITE_BACKEND_ADMIN_URL}/v1/users/status/${id}`,
        { isActive },
        { withCredentials: true }
      );
      toast.success(`Parking owner ${isActive ? 'activated' : 'deactivated'} successfully`);
      fetchParkingOwner();
    } catch (err) {
      console.error("Error updating status:", err.message);
      toast.error("Error updating status: " + err.message);
    }
  };

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
          onClick={fetchParkingOwner}
          className="mt-4 bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-md"
        >
          Retry
        </button>
        <br />
        <Link
          to="/parking-owner"
          state={{ filters }}
          className="mt-4 inline-flex items-center text-gray-600 hover:text-cyan-600"
        >
          <FaArrowLeft className="mr-2" />
          Back to Parking Owner List
        </Link>
        <ToastContainer />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      {/* Back Button */}
      <Link to="/owner" state={{ filters }} className="mb-6 inline-flex items-center text-gray-600 hover:text-cyan-600">
        <FaArrowLeft className="mr-2" />
        Back to Parking Owner List
      </Link>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Profile Section */}
        <div className="bg-white shadow-md rounded-lg p-6 flex flex-col items-center">
          <div className="relative w-32 h-32 rounded-full border-4 border-gray-200 overflow-hidden">
            <img
              src={
                owner.profileImage
                  ? `${import.meta.env.VITE_BACKEND_URL}${owner.profileImage}`
                  : `http://localhost:5173/assets/default-avatar.png`
              }
              alt={`${owner.firstName} ${owner.lastName}`}
              className="object-cover w-full h-full"
            />
          </div>
          <div className="mt-4 text-center">
            <h2 className="text-2xl font-bold capitalize">{`${owner.firstName} ${owner.lastName}`}</h2>
            <p className="text-lg text-gray-500">Parking Owner</p>
          </div>
        </div>

        {/* Owner Details Section */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold">Owner Details</h3>
            <div className="flex gap-2">
              <span
                className={`text-base font-semibold px-2 py-1 rounded ${
                  owner.approvalStatus ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {owner.approvalStatus ? "Approved" : "Pending"}
              </span>
              {owner.approvalStatus && (
                <span
                  className={`text-base font-semibold px-2 py-1 rounded ${
                    owner.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                  }`}
                >
                  {owner.isActive ? "Active" : "Inactive"}
                </span>
              )}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-base font-medium text-gray-500">First Name</p>
              <p className="text-base font-semibold">{owner.firstName}</p>
            </div>
            <div>
              <p className="text-base font-medium text-gray-500">Last Name</p>
              <p className="text-base font-semibold">{owner.lastName}</p>
            </div>
            <div>
              <p className="text-base font-medium text-gray-500">NIC</p>
              <p className="text-base font-semibold">{owner.nic}</p>
            </div>
            <div>
              <p className="text-base font-medium text-gray-500">Username</p>
              <p className="text-base font-semibold">{owner.username}</p>
            </div>
          </div>
        </div>

        {/* Contact Information Section */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h3 className="text-xl font-bold mb-4">Contact Information</h3>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <FaEnvelope className="text-gray-500" />
              <a href={`mailto:${owner.email}`} className="text-base text-cyan-600 hover:underline">
                {owner.email}
              </a>
            </div>
            <div className="flex items-center gap-2">
              <FaPhone className="text-gray-500" />
              <span className="text-base">{owner.mobile}</span>
            </div>
            <div className="flex items-center gap-2">
              <FaBuilding className="text-gray-500" />
              <span className="text-base">{owner.address}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h3 className="text-xl font-bold mb-4">Actions</h3>
          <div className="space-y-4">
            {!owner.approvalStatus ? (
              <>
                <button
                  onClick={handleApprove}
                  className="w-full flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-md transition duration-300"
                >
                  <FaCheck className="text-lg" />
                  Approve Parking Owner
                </button>
                <button
                  onClick={handleReject}
                  className="w-full flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-md transition duration-300"
                >
                  <FaTimes className="text-lg" />
                  Reject Parking Owner
                </button>
              </>
            ) : (
              <div className="space-y-2">
                <button
                  onClick={() => handleStatusChange(true)}
                  className={`w-full flex items-center justify-center gap-2 py-2 px-4 rounded-md transition duration-300 ${
                    owner.isActive
                      ? "bg-green-500 hover:bg-green-600 text-white"
                      : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                  }`}
                >
                  <FaCheck className="text-lg" />
                  Activate Account
                </button>
                <button
                  onClick={() => handleStatusChange(false)}
                  className={`w-full flex items-center justify-center gap-2 py-2 px-4 rounded-md transition duration-300 ${
                    !owner.isActive
                      ? "bg-red-500 hover:bg-red-600 text-white"
                      : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                  }`}
                >
                  <FaTimes className="text-lg" />
                  Deactivate Account
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Parking Areas Section */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-6">Parking Areas</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {parkingAreas.map((area) => {
            const slotTypeCount = getSlotTypeCount(area?.slots || []);
            return (
              <div key={area._id} className="bg-white shadow-md rounded-lg p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold">{area?.name}</h3>
                  <span className={`px-2 py-1 rounded ${
                    area?._doc.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                  }`}>
                    {area?._doc.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
                
                <div className="mb-4">
                  <p className="text-gray-600 mb-2">{area?.description}</p>
                  <div className="flex items-center text-gray-600 mb-2">
                    <FaBuilding className="mr-2" />
                    <span>{area?._doc.addressLine1},{area?._doc.addressLine2} ,{area?._doc.city?.name}</span>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h4 className="font-semibold mb-2">Parking Slots</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Slots:</span>
                      <span className="font-semibold">{area.slots?.length || 0}</span>
                    </div>
                    {Object.entries(slotTypeCount).map(([type, count]) => (
                      <div key={type} className="flex justify-between">
                        <span className="text-gray-600">{type}:</span>
                        <span className="font-semibold">{count}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t">
                  <Link
                    to={`/parking-area/view/${area._id}`}
                    className="block w-full bg-cyan-500 hover:bg-cyan-600 text-white text-center py-2 rounded-md transition duration-300"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <ToastContainer />
    </div>
  );
};

export default ViewParkingOwner;


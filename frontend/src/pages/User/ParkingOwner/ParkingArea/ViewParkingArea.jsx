import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { FaArrowLeft, FaMapMarkerAlt, FaPhone, FaUser, FaParking, FaCar, FaCheck, FaTimes, FaClock } from "react-icons/fa";
import { toast } from "react-toastify";

const ViewParkingArea = () => {
    const { id } = useParams();
    const [parkingArea, setParkingArea] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchParkingArea = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_APP_URL}/v1/parking-area/${id}`, { withCredentials: true });
            
            setParkingArea(response.data.data);
            console.log(response.data.data);
        } catch (err) {
            console.error("Error fetching parking area:", err);
            setError("Failed to load parking area details");
            toast.error("Failed to load parking area details");
        } finally {
            setLoading(false);
        }
    };
    const fetchParkingSlots = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_APP_URL}/v1/parking-area/${id}/slots`, { withCredentials: true });
        } catch (err) {
            console.error("Error fetching parking slots:", err);
        }
    }

    useEffect(() => {
        fetchParkingArea();
        fetchParkingSlots();
    }, [id]);

    if (loading) {
        return (
            <div className="container mx-auto p-6">
                <div className="animate-pulse space-y-4">
                    <div className="h-8 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-64 bg-gray-200 rounded"></div>
                    <div className="grid grid-cols-3 gap-4">
                        <div className="h-32 bg-gray-200 rounded"></div>
                        <div className="h-32 bg-gray-200 rounded"></div>
                        <div className="h-32 bg-gray-200 rounded"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto p-6 text-center">
                <p className="text-red-500 mb-4">{error}</p>
                <button
                    onClick={fetchParkingArea}
                    className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-md"
                >
                    Retry
                </button>
            </div>
        );
    }

    const totalSlots = parkingArea?.slots?.length || 0;
    const reservedSlots = parkingArea?.slots?.filter(slot => slot.isReserved)?.length || 0;
    const availableSlots = totalSlots - reservedSlots;

    return (
        <div className="container mx-auto p-6">
            {/* Back Button */}
            <Link to="/owner" className="inline-flex items-center text-gray-600 hover:text-cyan-600 mb-6">
                <FaArrowLeft className="mr-2" />
                Back to Parking Areas
            </Link>

            {/* Header Section */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
                <div className="bg-gradient-to-r from-cyan-500 to-cyan-600 p-6 text-white">
                    <div className="flex justify-between items-center">
                        <h1 className="text-3xl font-bold">{parkingArea?.name}</h1>
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                            parkingArea?.isActive 
                                ? "bg-green-100 text-green-800" 
                                : "bg-red-100 text-red-800"
                        }`}>
                            {parkingArea?.isActive ? "Active" : "Inactive"}
                        </span>
                    </div>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid md:grid-cols-3 gap-6">
                {/* Left Column - Basic Information */}
                <div className="md:col-span-2 space-y-6">
                    {/* Description Card */}
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <h2 className="text-xl font-semibold mb-4">Description</h2>
                        <p className="text-gray-600">{parkingArea?.description}</p>
                    </div>

                    {/* Location Card */}
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <h2 className="text-xl font-semibold mb-4">Location</h2>
                        <div className="space-y-3">
                            <div className="flex items-center text-gray-600">
                                <FaMapMarkerAlt className="mr-3 text-cyan-500" />
                                <span>{parkingArea?.addressLine1}, {parkingArea?.addressLine2}</span>
                            </div>
                            <div className="flex items-center text-gray-600">
                                <FaMapMarkerAlt className="mr-3 text-cyan-500" />
                                <span>{parkingArea?.city?.name}, {parkingArea?.district?.name}</span>
                            </div>
                        </div>
                    </div>

                    {/* Contact Information Card */}
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
                        <div className="space-y-3">
                            <div className="flex items-center text-gray-600">
                                <FaPhone className="mr-3 text-cyan-500" />
                                <span>{parkingArea?.contactNumber}</span>
                            </div>
                            <div className="flex items-center text-gray-600">
                                <FaUser className="mr-3 text-cyan-500" />
                                <span>Manager: {parkingArea?.manager?.firstName} {parkingArea?.manager?.lastName}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column - Statistics */}
                <div className="space-y-6">
                    {/* Statistics Card */}
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <h2 className="text-xl font-semibold mb-4">Parking Statistics</h2>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center">
                                    <FaParking className="mr-3 text-cyan-500" />
                                    <span className="text-gray-600">Total Slots</span>
                                </div>
                                <span className="font-semibold text-cyan-600">{totalSlots}</span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center">
                                    <FaCheck className="mr-3 text-green-500" />
                                    <span className="text-gray-600">Available Slots</span>
                                </div>
                                <span className="font-semibold text-green-600">{availableSlots}</span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center">
                                    <FaClock className="mr-3 text-orange-500" />
                                    <span className="text-gray-600">Reserved Slots</span>
                                </div>
                                <span className="font-semibold text-orange-600">{reservedSlots}</span>
                            </div>
                        </div>
                    </div>

                    {/* Operating Hours Card */}
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <h2 className="text-xl font-semibold mb-4">Operating Hours</h2>
                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600">Opening Time</span>
                                <span className="font-semibold">{parkingArea?.openingTime || "N/A"}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600">Closing Time</span>
                                <span className="font-semibold">{parkingArea?.closingTime || "N/A"}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Parking Slots Section */}
            <div className="mt-8">
                <h2 className="text-2xl font-bold mb-6">Parking Slots</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {parkingArea?.slots?.map((slot) => (
                        <div key={slot._id} className="bg-white rounded-xl shadow-md p-4">
                            <div className="flex justify-between items-center mb-3">
                                <div className="flex items-center">
                                    <FaCar className="mr-2 text-cyan-500" />
                                    <span className="font-semibold">Slot {slot.slotNumber}</span>
                                </div>
                                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                    slot.isReserved 
                                        ? "bg-orange-100 text-orange-800" 
                                        : "bg-green-100 text-green-800"
                                }`}>
                                    {slot.isReserved ? "Reserved" : "Available"}
                                </span>
                            </div>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Vehicle Type:</span>
                                    <span className="font-medium">{slot.vehicleType?.vehicleType}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Size:</span>
                                    <span className="font-medium">{slot.slotSize} sq ft</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Price:</span>
                                    <span className="font-medium">Rs. {slot.slotPrice}/hr</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ViewParkingArea;
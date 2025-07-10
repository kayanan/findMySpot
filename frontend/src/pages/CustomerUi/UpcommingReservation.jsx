import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import { FaCalendarAlt, FaMapMarkerAlt, FaCar, FaParking, FaChevronRight, FaArrowLeft } from "react-icons/fa";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";

const StatusBadge = ({ status }) => (
  <span
    className={`px-3 py-1 rounded-full text-xs font-semibold ${
      status === "confirmed" || status === "pending"
        ? "bg-blue-100 text-blue-700"
        : "bg-gray-200 text-gray-600"
    }`}
  >
    {status.charAt(0).toUpperCase() + status.slice(1)}
  </span>
);

const ReservationCard = ({ reservation }) => (
  <div className="bg-white rounded-2xl shadow p-5 mb-6 flex flex-col md:flex-row md:items-center md:justify-between transition hover:shadow-lg">
    {/* Left: Main Info */}
    <div className="flex-1 flex flex-col gap-2">
      <div className="flex items-center gap-2 mb-2">
        <StatusBadge status={reservation.status} />
        <span className="text-xs text-gray-400">
          {dayjs(reservation.startDateAndTime).format("MMM D, YYYY h:mm A")}
        </span>
      </div>
      <div className="flex items-center gap-2 text-lg font-bold text-gray-800">
        <FaMapMarkerAlt className="text-cyan-500" />
        {reservation.parkingArea?.name || 'Unknown Location'}
      </div>
      <div className="text-sm text-gray-500 mb-2">
        {reservation.parkingArea?.addressLine1} {reservation.parkingArea?.addressLine2}
      </div>
      <div className="flex flex-wrap gap-4 text-sm">
        <div className="flex items-center gap-1">
          <FaParking className="text-yellow-500" />
          <span>
            <span className="font-semibold">Slot:</span> {reservation.parkingSlot?.slotNumber || 'N/A'} ({reservation.parkingSlot?.type || 'N/A'})
          </span>
        </div>
        <div className="flex items-center gap-1">
          <FaCar className="text-blue-500" />
          <span>
            <span className="font-semibold">Vehicle:</span> {reservation.vehicleNumber} ({reservation.vehicleType?.vehicleType || 'N/A'})
          </span>
        </div>
      </div>
    </div>
    {/* Right: Actions */}
    <div className="flex flex-col gap-2 mt-4 md:mt-0 md:ml-8 min-w-[160px]">
      <button className="px-4 py-2 bg-cyan-500 text-white rounded-lg flex items-center gap-2 hover:bg-cyan-600 transition">
        View Details <FaChevronRight />
      </button>
    </div>
  </div>
);

const UpcommingReservation = () => {
  const { authState } = useAuth();
  const navigate = useNavigate();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUpcomingReservations();
  }, []);

  const fetchUpcomingReservations = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Get user's reservations and filter for upcoming ones
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_APP_URL}/v1/reservation/user/${authState.user.userId}`,
        {
          params: {
            status: 'confirmed', 
            isParked: false,
            startDate: dayjs().format('YYYY-MM-DD'),
            page: 1,
            limit: 50
          },
          withCredentials: true
        }
      );

      if (response.data.success) {
        // Filter for upcoming reservations (not started yet)
        const upcomingReservations = response.data.data.filter(reservation => {
          const now = new Date();
          const startTime = new Date(reservation.startDateAndTime);
          
          // Reservation is upcoming if it hasn't started yet
          return startTime > now;
        });
        
        setReservations(upcomingReservations);
      } else {
        setError('Failed to fetch upcoming reservations');
      }
    } catch (err) {
      console.error('Error fetching upcoming reservations:', err);
      setError('Failed to load upcoming reservations');
      toast.error('Failed to load upcoming reservations');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading upcoming reservations...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Reservations</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchUpcomingReservations}
            className="px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-2 sm:px-6 md:px-16">
      {/* Back Arrow */}
      <button
        className="flex items-center gap-2 mb-4 text-white bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 font-semibold text-lg rounded-full px-4 py-3 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95"
        onClick={() => navigate("/customer-landing-page")}
        aria-label="Go to Home"
      >
        <FaArrowLeft />
        <span>Back to Home</span>
      </button>
      <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center md:text-left">
        Upcoming Reservations
      </h1>
      <div className="max-w-3xl mx-auto">
        {reservations.length === 0 ? (
          <div className="text-center text-gray-400 py-20">
            <FaCalendarAlt className="mx-auto text-6xl mb-4" />
            <div className="text-lg">No upcoming reservations</div>
            <p className="text-sm text-gray-500 mt-2">You don't have any upcoming parking reservations.</p>
          </div>
        ) : (
          reservations.map((res) => (
            <ReservationCard key={res._id} reservation={res} />
          ))
        )}
      </div>
      <ToastContainer />
    </div>
  );
};

export default UpcommingReservation;
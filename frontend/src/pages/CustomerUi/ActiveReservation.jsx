import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import { FaClock, FaMapMarkerAlt, FaCar, FaMoneyBillWave, FaParking, FaChevronRight, FaCreditCard, FaArrowLeft, FaDirections } from "react-icons/fa";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";

dayjs.extend(relativeTime);

function getElapsedTime(start) {
  const now = dayjs();
  const startTime = dayjs(start);
  const diff = now.diff(startTime, "minute");
  const hours = Math.floor(diff / 60);
  const minutes = diff % 60;
  return `${hours > 0 ? `${hours}h ` : ""}${minutes}m`;
}

const StatusBadge = ({ status }) => (
  <span
    className={`px-3 py-1 rounded-full text-xs font-semibold ${
      status === "active" || status === "confirmed"
        ? "bg-green-100 text-green-700"
        : "bg-gray-200 text-gray-600"
    }`}
  >
    {status.charAt(0).toUpperCase() + status.slice(1)}
  </span>
);

const PaymentBadge = ({ paymentStatus }) => (
  <span
    className={`px-2 py-1 rounded-full text-xs font-semibold ml-2 ${
      paymentStatus === "paid"
        ? "bg-emerald-100 text-emerald-700"
        : "bg-orange-100 text-orange-700"
    }`}
  >
    {paymentStatus === "paid" ? "Paid" : "Payment Pending"}
  </span>
);

const ReservationCard = ({ reservation, onMakePayment }) => {
  const [elapsed, setElapsed] = useState(getElapsedTime(reservation.startDateAndTime));

  useEffect(() => {
    const interval = setInterval(() => {
      setElapsed(getElapsedTime(reservation.startDateAndTime));
    }, 60000); // update every minute
    return () => clearInterval(interval);
  }, [reservation.startDateAndTime]);

  const handleGetDirection = (reservation) => {
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${reservation.parkingArea?.location?.coordinates[1]},${reservation.parkingArea?.location?.coordinates[0]}`, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="bg-white rounded-2xl shadow p-5 mb-6 flex flex-col md:flex-row md:items-center md:justify-between transition hover:shadow-lg">
      {/* Left: Main Info */}
      <div className="flex-1 flex flex-col gap-2">
        <div className="flex items-center gap-2 mb-2">
          <StatusBadge status={reservation.status} />
          <span className="text-xs text-gray-400">
            Started {dayjs(reservation.startDateAndTime).fromNow()}
          </span>
          <PaymentBadge paymentStatus={reservation.paymentStatus} />
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
            <FaClock className="text-gray-400" />
            <span>
              <span className="font-semibold">Elapsed:</span> {elapsed}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <FaMoneyBillWave className="text-gray-400" />
            <span>
              <span className="font-semibold">Rate:</span> Rs. {reservation.perHourRate}/hr
            </span>
          </div>
        </div>
      </div>
      {/* Right: Slot & Vehicle & Actions */}
      <div className="flex flex-col gap-2 mt-4 md:mt-0 md:ml-8 min-w-[200px]">
        <div className="flex items-center gap-2">
          <FaParking className="text-yellow-500" />
          <span className="font-semibold">Slot:</span>
          <span>{reservation.parkingSlot?.slotNumber || 'N/A'} ({reservation.parkingSlot?.type || 'N/A'})</span>
        </div>
        <div className="flex items-center gap-2">
          <FaCar className="text-blue-500" />
          <span className="font-semibold">Vehicle:</span>
          <span>{reservation.vehicleNumber} ({reservation.vehicleType?.vehicleType || 'N/A'})</span>
        </div>
        <div className="flex flex-col gap-2 mt-2">
          <button className="px-4 py-2 bg-cyan-500 text-white rounded-lg flex items-center gap-2 hover:bg-cyan-600 transition">
            View Details <FaChevronRight />
          </button>
          <button className="px-4 py-2 bg-cyan-500 text-white rounded-lg flex items-center gap-2 hover:bg-cyan-600 transition" onClick={() => handleGetDirection(reservation)}>
            <FaDirections className="text-white" />
            Get Direction
          </button>
          {reservation.paymentStatus !== "paid" && (
            <button
              className="px-4 py-2 bg-amber-500 text-white rounded-lg flex items-center gap-2 hover:bg-amber-600 transition"
              onClick={() => onMakePayment(reservation)}
            >
              <FaCreditCard />
              Make Payment
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const ActiveReservation = () => {
  const { authState } = useAuth();
  const navigate = useNavigate();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  

  useEffect(() => {
    fetchActiveReservations();
  }, []);

  const fetchActiveReservations = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Get user's reservations and filter for active ones
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_APP_URL}/v1/reservation/active`,
        {
          params: {
            userId: authState.user.userId,
            page: 1,
            limit: 9999
          },
          withCredentials: true
        }
      );

      if (response.data.success) {
        // Filter for currently active reservations (started but not ended)
        const activeReservations = response.data.data.filter(reservation => {
          const now = new Date();
          const startTime = new Date(reservation.startDateAndTime);
          const endTime = reservation.endDateAndTime ? new Date(reservation.endDateAndTime) : null;
          
          // Reservation is active if it has started and either has no end time or hasn't ended yet
          return startTime <= now && (!endTime || endTime > now);
        });
        
        //setReservations(activeReservations);
        setReservations(response.data.data);
        console.log(response.data.data);
        

      } else {
        setError('Failed to fetch active reservations');
      }
    } catch (err) {
      console.error('Error fetching active reservations:', err);
      setError('Failed to load active reservations');
      toast.error('Failed to load active reservations');
    } finally {
      setLoading(false);
    }
  };

  const handleMakePayment = (reservation) => {
    // Implement payment logic here
    toast.info(`Payment functionality for reservation ${reservation._id} will be implemented`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading active reservations...</p>
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
            onClick={fetchActiveReservations}
            className="px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-2 sm:px-6 md:px-16 scroll-mt-24" >
      {/* Back Arrow Navigation */}
      <div className="max-w-3xl mx-auto mb-6">
        <button
          className="flex items-center gap-2 text-white bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 font-semibold text-lg rounded-full px-4 py-3 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95"
          onClick={() => navigate('/customer-landing-page')}
        >
          <FaArrowLeft className="text-xl" />
          <span className="hidden sm:inline">Back to Home</span>
        </button>
      </div>
      
      <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center md:text-left">
        Active Reservations
      </h1>
      <div className="max-w-3xl mx-auto">
        {reservations.length === 0 ? (
          <div className="text-center text-gray-400 py-20">
            <FaParking className="mx-auto text-6xl mb-4" />
            <div className="text-lg">No active reservations</div>
            <p className="text-sm text-gray-500 mt-2">You don't have any active parking reservations at the moment.</p>
          </div>
        ) : (
          reservations.map((res) => (
            <ReservationCard
              key={res._id}
              reservation={res}
              onMakePayment={handleMakePayment}
            />
          ))
        )}
      </div>
      <ToastContainer />
    </div>
  );
};

export default ActiveReservation;
import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Car, Truck, Bike, Bus, HelpCircle } from "lucide-react"
import axios from 'axios';
import dayjs from 'dayjs';

import {
    FaParking,
    FaCar,
    FaSearch,
    FaMapMarkerAlt,
    FaCalendarAlt,
    FaClock,
    FaCreditCard,
    FaShieldAlt,
    FaMobileAlt,
    FaStar,
    FaBars,
    FaTimes,
    FaArrowRight,
    FaHistory,
    FaCheckCircle,
    FaClock as FaClockAlt,
    FaUser,
    FaSignOutAlt,
    FaPlus,
    FaList,
    FaBell,
    FaCog,
    FaHome,
    FaMapPin,
    FaTicketAlt,
    FaWallet,
    FaMotorcycle,
    FaBicycle,
    FaBus,
    FaTruck,
} from 'react-icons/fa';
import MapComponent from '../../utils/MapComponent';
import { toast, ToastContainer } from 'react-toastify';

const CustomerLandingPage = () => {
    const { authState, logout } = useAuth();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [searchLocation, setSearchLocation] = useState('');
    const [searchDate, setSearchDate] = useState('');
    const [searchTime, setSearchTime] = useState('');
    const [position, setPosition] = useState(null);
    const [vehicleType, setVehicleType] = useState(["Car", "Truck", "Bike", "Bus", "Van"]);
    const [selectedVehicle, setSelectedVehicle] = useState(null);
    const [activeTab, setActiveTab] = useState('home');
    const navigate = useNavigate();
    const mapRef = useRef(null);
    const [activeReservations, setActiveReservations] = useState(0);
    const [upcomingReservations, setUpcomingReservations] = useState(0);
    const [completedReservations, setCompletedReservations] = useState(0);
    const [totalSpent, setTotalSpent] = useState(0);

    useEffect(()=>{
        fetchActiveReservations();
        fetchUpcomingReservations();
        fetchReservations();
        
    },[])


    const fetchActiveReservations = async () => {
        try {
            
            
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
                setActiveReservations(response.data.data);
            }
        } catch (err) {
           
        } 
    };
    const fetchUpcomingReservations = async () => {
        try {



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
                console.log(upcomingReservations)
                setUpcomingReservations(upcomingReservations);
            } else {
            }
        } catch (err) {
            
        }
    };


    const fetchReservations = async () => {
        try {
            
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_APP_URL}/v1/reservation/user/${authState.user.userId}`, {
                params: {
                    status: 'completed',
                    paymentStatus: 'paid',
                    isParked: true,
                    page: 1,
                    limit: 9999
                },
                withCredentials: true
            });
            
            if (response.data.success) {
                setCompletedReservations(response.data.count);
                const total = response.data.data.reduce((acc, reservation) => acc + reservation.totalAmount, 0);
                setTotalSpent(total);
            }
        } catch (err) {
            
        } 
    };




    const quickActions = [
        {
            icon: <FaPlus className="text-xl" />,
            title: 'Book Spot',
            description: 'Find & reserve parking',
            link: '/reservation/find-parking-spot',
            color: 'bg-gradient-to-r from-cyan-500 to-blue-500'
        },
        {
            icon: <FaList className="text-xl" />,
            title: 'History',
            description: 'Past reservations',
            link: '/reservation/history',
            color: 'bg-gradient-to-r from-blue-500 to-indigo-500'
        },
        {
            icon: <FaCheckCircle className="text-xl" />,
            title: 'Active',
            description: 'Current bookings',
            link: '/reservation/active',
            color: 'bg-gradient-to-r from-green-500 to-emerald-500'
        },
        {
            icon: <FaClockAlt className="text-xl" />,
            title: 'Upcoming',
            description: 'Future bookings',
            link: '/reservation/upcoming',
            color: 'bg-gradient-to-r from-purple-500 to-pink-500'
        }
    ];

    const getVehicleType = (type) => {
        switch (type) {
            case 'car':
                return <Car className="w-8 h-8 md:w-10 md:h-10" />;
            case 'truck':
                return <Truck className="w-8 h-8 md:w-10 md:h-10" />;
            case 'bike':
                return <Bike className="w-8 h-8 md:w-10 md:h-10" />;
            case 'bus':
                return <Bus className="w-8 h-8 md:w-10 md:h-10" />;
            default:
                return <HelpCircle className="w-8 h-8 md:w-10 md:h-10" />;
        }
    }

 


    const selectedVehicleType = (type) => {
        setSelectedVehicle(type);
    }

    const BottomNavItem = ({ icon, label, isActive, onClick }) => (
        <button
            onClick={onClick}
            className={`flex flex-col items-center justify-center py-2 px-3 min-w-0 flex-1 transition-colors duration-200 ${isActive ? 'text-cyan-600' : 'text-gray-500'
                }`}
        >
            <div className={`text-lg mb-1 ${isActive ? 'text-cyan-600' : 'text-gray-400'}`}>
                {icon}
            </div>
            <span className="text-xs font-medium">{label}</span>
        </button>
    );

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col mt-[-20px]">

            {/* Main Content */}
            <main className="flex-1 pb-20 md:pb-0">
                {/* Welcome Section */}
                <section className="bg-gradient-to-br from-cyan-500 to-blue-600 text-white">
                    <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
                        <div className="text-center">
                            <h1 className="text-2xl md:text-4xl font-bold mb-2 md:mb-4">
                                Welcome back, {authState.user?.firstName}!
                            </h1>
                            <p className="text-lg md:text-xl text-cyan-100 mb-6 md:mb-8">
                                Find Your Parking Spot Now!
                            </p>

                            {/* Vehicle Selection Card */}
                            <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl p-4 md:p-6">
                                <h2 className="text-xl md:text-2xl text-gray-800 font-bold text-center mb-4">
                                    INSTANT PARKING SPOT FINDER
                                </h2>

                                <div className="text-center mb-6">
                                    <label className="text-sm md:text-base font-bold text-gray-700 block mb-3">
                                        {!selectedVehicle ? "SELECT VEHICLE TYPE" : `SELECTED: ${selectedVehicle.toUpperCase()}`}
                                    </label>

                                    {!selectedVehicle ? (
                                        <div className="grid grid-cols-3 gap-3">
                                            {vehicleType.map((type, index) => (
                                                <button
                                                    key={index}
                                                    className="flex flex-col items-center bg-gradient-to-br from-cyan-500 to-blue-500 text-white p-3 rounded-xl hover:from-cyan-600 hover:to-blue-600 transition-all duration-300 transform hover:scale-105 active:scale-95"
                                                    onClick={() => selectedVehicleType(type)}
                                                >
                                                    {getVehicleType(type?.toLowerCase())}
                                                    <span className="text-xs font-bold mt-1">{type}</span>
                                                </button>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="space-y-3">
                                            <div className="flex flex-col items-center bg-gradient-to-br from-cyan-600 to-blue-600 text-white p-4 rounded-xl">
                                                {getVehicleType(selectedVehicle?.toLowerCase())}
                                                <span className="text-sm font-bold mt-2">{selectedVehicle}</span>
                                            </div>
                                            <button
                                                className="w-full bg-rose-500 hover:bg-rose-600 text-white py-2 px-4 rounded-lg transition-colors duration-200"
                                                onClick={() => setSelectedVehicle(null)}
                                            >
                                                Change Vehicle
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {selectedVehicle && (
                                    <>
                                        <div className="mb-4 z-0 relative">
                                            <MapComponent
                                                ref={mapRef}
                                                position={position}
                                                setPosition={setPosition}
                                                zoom={15}
                                                height="200px"
                                                message="Pick your current location"
                                            />
                                        </div>

                                        <div className="space-y-3">
                                            <div className="grid grid-cols-2 gap-2">
                                                <div>
                                                    <label className="text-xs font-bold text-gray-700 block mb-1">LONGITUDE</label>
                                                    <input
                                                        type="text"
                                                        value={position?.lng || ""}
                                                        disabled
                                                        className="w-full p-2 text-sm text-gray-800 rounded-lg border-2 border-gray-200 text-center bg-gray-50"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="text-xs font-bold text-gray-700 block mb-1">LATITUDE</label>
                                                    <input
                                                        type="text"
                                                        value={position?.lat || ""}
                                                        disabled
                                                        className="w-full p-2 text-sm text-gray-800 rounded-lg border-2 border-gray-200 text-center bg-gray-50"
                                                    />
                                                </div>
                                            </div>

                                            <button
                                                className="w-full bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-lg transition-colors duration-200 text-sm"
                                                onClick={() => mapRef.current.getLocation()}
                                            >
                                                Reset Location
                                            </button>

                                            <button
                                                className="w-full bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white py-3 px-4 rounded-lg transition-all duration-200 font-bold text-sm transform hover:scale-105 active:scale-95"
                                                onClick={() => navigate("/reservation/find-parking-spot", {
                                                    state: {
                                                        vehicleType: selectedVehicle,
                                                        position: position,
                                                        startDateAndTime: new Date(),
                                                        endDateAndTime: new Date(new Date().setHours(new Date().getHours() + 1))
                                                    }
                                                })}
                                            >
                                                Find Parking Spot
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Quick Actions Section */}
                <section className="py-6 md:py-12 bg-white">
                    <div className="max-w-7xl mx-auto px-4">
                        <div className="text-center mb-6 md:mb-8">
                            <h2 className="text-xl md:text-3xl font-bold text-gray-900 mb-2">
                                Quick Actions
                            </h2>
                            <p className="text-gray-600 text-sm md:text-base">
                                What would you like to do today?
                            </p>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 ">
                            {quickActions.map((action, index) => (
                                <Link
                                    key={index}
                                    to={action.link}
                                    className={`${action.color} text-white rounded-xl p-4 md:p-6 text-center hover:shadow-lg transition-all duration-300 transform hover:scale-105 active:scale-95`}
                                >
                                    <div className="flex justify-center mb-3">
                                        {action.icon}
                                    </div>
                                    <h3 className="text-sm md:text-lg font-semibold mb-1">{action.title}</h3>
                                    <p className="text-xs md:text-sm opacity-90">{action.description}</p>
                                </Link>
                            ))}
                        </div>
                       

                    </div>
                </section>

                

                {/* Stats Section */}
                <section className="py-6 md:py-12 bg-white">
                    <div className="max-w-7xl mx-auto px-4">
                        <h2 className="text-xl md:text-3xl font-bold text-gray-900 mb-6 text-center">
                            Your Parking Stats
                        </h2>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
                            <div className="bg-gradient-to-r from-cyan-500 to-cyan-600 text-white rounded-xl p-4 text-center">
                                <div className="text-2xl md:text-3xl font-bold mb-1">{activeReservations?.length}</div>
                                <div className="text-cyan-100 text-xs md:text-sm">Active</div>
                            </div>
                            <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl p-4 text-center">
                                <div className="text-2xl md:text-3xl font-bold mb-1">{upcomingReservations?.length}</div>
                                <div className="text-blue-100 text-xs md:text-sm">Upcoming</div>
                            </div>
                            <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl p-4 text-center">
                                <div className="text-2xl md:text-3xl font-bold mb-1">{completedReservations}</div>
                                <div className="text-green-100 text-xs md:text-sm">Completed</div>
                            </div>
                            <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl p-4 text-center">
                                <div className="text-2xl md:text-3xl font-bold mb-1">Rs. {totalSpent}</div>
                                <div className="text-purple-100 text-xs md:text-sm">Total Spent</div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            
            <ToastContainer />
        </div>
    );
};

export default CustomerLandingPage;
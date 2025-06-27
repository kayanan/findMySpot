import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Car, Truck, Bike, Bus, HelpCircle } from "lucide-react"

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
    const navigate = useNavigate();
    const mapRef = useRef(null);

    // Mock data for customer dashboard
    const activeReservations = [
        {
            id: 1,
            location: 'Downtown Parking',
            date: '2024-01-15',
            time: '14:00',
            duration: '2 hours',
            status: 'Active',
            spotNumber: 'A-12'
        },
        {
            id: 2,
            location: 'Airport Parking',
            date: '2024-01-16',
            time: '09:00',
            duration: '4 hours',
            status: 'Active',
            spotNumber: 'B-05'
        }
    ];

    const upcomingReservations = [
        {
            id: 3,
            location: 'Shopping Mall Parking',
            date: '2024-01-18',
            time: '16:00',
            duration: '3 hours',
            status: 'Upcoming',
            spotNumber: 'C-08'
        }
    ];

    const recentHistory = [
        {
            id: 4,
            location: 'University Parking',
            date: '2024-01-10',
            time: '10:00',
            duration: '2 hours',
            status: 'Completed',
            amount: '$5.00'
        },
        {
            id: 5,
            location: 'Hospital Parking',
            date: '2024-01-08',
            time: '13:00',
            duration: '1 hour',
            status: 'Completed',
            amount: '$3.00'
        }
    ];

    const quickActions = [
        {
            icon: <FaPlus className="text-2xl" />,
            title: 'Make Reservation',
            description: 'Book a new parking spot',
            link: '/customer/find-parking-spot',
            color: 'bg-cyan-500 hover:bg-cyan-600'
        },
        {
            icon: <FaList className="text-2xl" />,
            title: 'Reservation History',
            description: 'View all past reservations',
            link: '/customer/history',
            color: 'bg-blue-500 hover:bg-blue-600'
        },
        {
            icon: <FaCheckCircle className="text-2xl" />,
            title: 'Active Reservations',
            description: 'Manage current bookings',
            link: '/customer/active',
            color: 'bg-green-500 hover:bg-green-600'
        },
        {
            icon: <FaClockAlt className="text-2xl" />,
            title: 'Upcoming Reservations',
            description: 'View future bookings',
            link: '/customer/upcoming',
            color: 'bg-purple-500 hover:bg-purple-600'
        }
    ];

    const getVehicleType = (type) => {
        switch (type) {
            case 'car':
                return <Car className="w-10 h-20 " />;
            case 'truck':
                return <Truck className="w-10 h-20 " />;
            case 'bike':
                return <Bike className="w-10 h-20 " />;
            case 'bus':
                return <Bus className="w-10 h-20 " />;
            default:
                return <HelpCircle className="w-10 h-20 " />;
        }
    }
    const handleSearch = (e) => {
        e.preventDefault();
        // Handle search logic here
        console.log('Search:', { searchLocation, searchDate, searchTime });
    };

    const handleLogout = () => {
        logout(true);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Active':
                return 'bg-green-100 text-green-800';
            case 'Upcoming':
                return 'bg-blue-100 text-blue-800';
            case 'Completed':
                return 'bg-gray-100 text-gray-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };
    const selectedVehicleType = (type) => {
        setSelectedVehicle(type);
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            {/* <header className="bg-white shadow-sm sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16"> */}
            {/* Logo */}
            {/* <div className="flex items-center space-x-3">
                            <div className="flex items-center space-x-2">
                                <FaParking className="h-8 w-8 text-cyan-600" />
                                <FaCar className="h-6 w-6 text-cyan-500" />
                            </div>
                            <span className="text-xl font-bold text-cyan-700">FindMySpot</span>
                        </div> */}

            {/* Desktop Navigation */}
            {/* <nav className="hidden md:flex items-center space-x-6">
                            <Link to="/customer" className="text-cyan-600 font-medium flex items-center">
                                <FaHome className="mr-1" />
                                Dashboard
                            </Link>
                            <Link to="/customer/reservation" className="text-gray-600 hover:text-cyan-600 transition-colors">
                                Make Reservation
                            </Link>
                            <Link to="/customer/history" className="text-gray-600 hover:text-cyan-600 transition-colors">
                                History
                            </Link> */}

            {/* User Menu */}
            {/* <div className="flex items-center space-x-4">
                                <div className="flex items-center space-x-2">
                                    <FaUser className="text-gray-600" />
                                    <span className="text-gray-700 font-medium">
                                        {authState.user?.firstName} {authState.user?.lastName}
                                    </span>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg transition-colors flex items-center space-x-1"
                                >
                                    <FaSignOutAlt className="text-sm" />
                                    <span>Logout</span>
                                </button>
                            </div>
                        </nav> */}

            {/* Mobile menu button */}
            {/* <button
                            className="md:hidden p-2"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        >
                            {isMobileMenuOpen ? (
                                <FaTimes className="h-6 w-6 text-gray-600" />
                            ) : (
                                <FaBars className="h-6 w-6 text-gray-600" />
                            )}
                        </button>
                    </div> */}

            {/* Mobile Navigation */}
            {/* {isMobileMenuOpen && (
                        <div className="md:hidden py-4 border-t border-gray-200">
                            <div className="flex flex-col space-y-4">
                                <Link to="/customer" className="text-cyan-600 font-medium flex items-center">
                                    <FaHome className="mr-2" />
                                    Dashboard
                                </Link>
                                <Link to="/customer/reservation" className="text-gray-600 hover:text-cyan-600 transition-colors">
                                    Make Reservation
                                </Link>
                                <Link to="/customer/history" className="text-gray-600 hover:text-cyan-600 transition-colors">
                                    History
                                </Link>
                                <div className="pt-2 border-t border-gray-200">
                                    <div className="flex items-center space-x-2 mb-2">
                                        <FaUser className="text-gray-600" />
                                        <span className="text-gray-700 font-medium">
                                            {authState.user?.firstName} {authState.user?.lastName}
                                        </span>
                                    </div>
                                    <button
                                        onClick={handleLogout}
                                        className="w-full bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg transition-colors flex items-center justify-center space-x-2"
                                    >
                                        <FaSignOutAlt />
                                        <span>Logout</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    )} */}
            {/* </div>
            </header> */}

            {/* Welcome Section */}
            <section className="bg-gradient-to-br from-cyan-500 to-blue-600 text-white mt-[-20px]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="text-center">
                        <h1 className="text-3xl md:text-4xl font-bold mb-4">
                            Welcome back, {authState.user?.firstName}!
                        </h1>
                        <p className="text-xl text-cyan-100 mb-8">
                            Find Your Parking Spot Now!
                        </p>

                        {/* Quick Search Widget */}
                        {/* <div className="  mx-auto bg-white rounded-xl shadow-2xl p-6 md:p-8">
                             <form onSubmit={handleSearch} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="relative">
                                        <FaMapMarkerAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                        <input
                                            type="text"
                                            placeholder="Where do you need parking?"
                                            value={searchLocation}
                                            onChange={(e) => setSearchLocation(e.target.value)}
                                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                                        />
                                    </div>
                                    <div className="relative">
                                        <FaCalendarAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                        <input
                                            type="date"
                                            value={searchDate}
                                            onChange={(e) => setSearchDate(e.target.value)}
                                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                                        />
                                    </div>
                                    <div className="relative">
                                        <FaClock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                        <input
                                            type="time"
                                            value={searchTime}
                                            onChange={(e) => setSearchTime(e.target.value)}
                                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                                        />
                                    </div>
                                </div>
                                <button
                                    type="submit"
                                    className="w-full bg-cyan-500 hover:bg-cyan-600 text-white py-3 px-6 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2"
                                >
                                    <FaSearch className="text-lg" />
                                    <span>Find Parking Spots</span>
                                </button>5
                            </form> 
                            <div className="text-center mb-8">
                                <MapComponent position={position} setPosition={setPosition} zoom={15}  />
                            </div>

                        </div> */}
                        <div className="flex justify-center mb-8 ">
                            <div className="w-full max-w-xl bg-white rounded-xl shadow-lg p-4">
                                <div className="text-black text-center mb-8">
                                    <label className="text-lg font-bold">{!selectedVehicle ? ("Select a Vehicle Type You Want To Park").toUpperCase() : ("You Have Selected : " + selectedVehicle).toUpperCase()}</label>
                                    {!selectedVehicle && (<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                                        {vehicleType.map((type, index) => (
                                            <button key={index} className=" flex flex-col bg-cyan-500 text-white p-2 rounded-md hover:bg-cyan-600 transition-all duration-300  flex items-center justify-center mt-4" onClick={() => selectedVehicleType(type)}>
                                                {getVehicleType(type?.toLowerCase())}
                                                <span className="text-sm font-bold mt-[-15px]">{type.trim().toUpperCase()}</span>
                                            </button>
                                        ))}
                                    </div>)}
                                    {selectedVehicle && (<div className="grid grid-cols justify-center">
                                        <div className="flex flex-col gap-2 items-center bg-cyan-600 text-white p-2 rounded-md  items-center justify-center mt-4">
                                            {getVehicleType(selectedVehicle?.toLowerCase())}
                                            <span className="text-sm font-bold mt-[-15px]">{selectedVehicle.toUpperCase()}</span>
                                        </div>
                                        <button className=" flex flex-col bg-rose-500 text-white p-2 rounded-md hover:bg-rose-600 transition-all duration-300  flex items-center justify-center mt-4" onClick={() => setSelectedVehicle(null)}>

                                            <span className="text-sm font-bold ">Change Vehicle Type</span>
                                        </button>
                                    </div>)}
                                </div>


                                {selectedVehicle && (
                                    <>
                                        <div className=" relative z-0">
                                            <MapComponent ref={mapRef} position={position} setPosition={setPosition} zoom={15} height="300px" message={`Help us find the best spot for you – \n pick your current location.`} />
                                        </div>
                                        <div className="grid grid-cols-1 gap-2 ">
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  gap-2 mt-4 justify-center">
                                                <div className="flex flex-col gap-2 w-full">
                                                    <label className="text-sm font-bold text-black">{("Longitude").toUpperCase()}</label>
                                                    <input type="text" placeholder="longitude" className=" p-2 h-10 rounded-md border-2 border-gray-300 text-center text-black" value={position?.lng || ""} disabled />
                                                </div>
                                                <div className="flex flex-col gap-2 w-full">
                                                    <label className="text-sm font-bold text-black">{("Latitude").toUpperCase()}</label>
                                                    <input type="text" placeholder="latitude" className="p-2 h-10 rounded-md border-2 border-gray-300 text-center text-black" value={position?.lat || ""} disabled />
                                                </div>
                                                <button className=" flex flex-col bg-cyan-500 text-white px-2 py-1 rounded-md hover:bg-cyan-600 transition-all duration-300  flex items-center justify-center mt-7 h-10 " onClick={() => mapRef.current.getLocation()}>
                                                    <span className="text-xs font-bold ">Reset Location</span>
                                                </button>
                                            </div>
                                            <button className=" flex flex-col bg-emerald-500 text-white p-2 rounded-md hover:bg-emerald-600 transition-all duration-300  flex items-center justify-center mt-2  h-12"
                                                onClick={() => navigate("/customer/find-parking-spot", { state: { vehicleType: selectedVehicle, position: position, dateAndTime: new Date() } })}>


                                                <span className="text-sm font-bold ">Find Parking Spot</span>
                                            </button>

                                        </div>
                                    </>
                                )}

                            </div>


                        </div>
                    </div>
                </div>
            </section>

            {/* Quick Actions Section */}
            <section className="py-12 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-8">
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                            Quick Actions
                        </h2>
                        <p className="text-gray-600">
                            What would you like to do today?
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {quickActions.map((action, index) => (
                            <Link
                                key={index}
                                to={action.link}
                                className={`${action.color} text-white rounded-xl p-6 text-center hover:shadow-lg transition-all duration-300 transform hover:scale-105`}
                            >
                                <div className="flex justify-center mb-4">
                                    {action.icon}
                                </div>
                                <h3 className="text-lg font-semibold mb-2">{action.title}</h3>
                                <p className="text-sm opacity-90">{action.description}</p>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Active Reservations Section */}
            <section className="py-12 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                            Active Reservations
                        </h2>
                        <Link
                            to="/customer/active"
                            className="text-cyan-600 hover:text-cyan-700 font-medium flex items-center"
                        >
                            View All <FaArrowRight className="ml-1" />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {activeReservations.map((reservation) => (
                            <div key={reservation.id} className="bg-white rounded-lg shadow-md p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center space-x-2">
                                        <FaTicketAlt className="text-cyan-500" />
                                        <h3 className="font-semibold text-gray-900">{reservation.location}</h3>
                                    </div>
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(reservation.status)}`}>
                                        {reservation.status}
                                    </span>
                                </div>
                                <div className="space-y-2 text-sm text-gray-600">
                                    <div className="flex items-center">
                                        <FaCalendarAlt className="mr-2 text-gray-400" />
                                        {reservation.date}
                                    </div>
                                    <div className="flex items-center">
                                        <FaClock className="mr-2 text-gray-400" />
                                        {reservation.time} ({reservation.duration})
                                    </div>
                                    <div className="flex items-center">
                                        <FaMapPin className="mr-2 text-gray-400" />
                                        Spot: {reservation.spotNumber}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Upcoming Reservations Section */}
            <section className="py-12 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                            Upcoming Reservations
                        </h2>
                        <Link
                            to="/customer/upcoming"
                            className="text-cyan-600 hover:text-cyan-700 font-medium flex items-center"
                        >
                            View All <FaArrowRight className="ml-1" />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {upcomingReservations.map((reservation) => (
                            <div key={reservation.id} className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center space-x-2">
                                        <FaClockAlt className="text-blue-500" />
                                        <h3 className="font-semibold text-gray-900">{reservation.location}</h3>
                                    </div>
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(reservation.status)}`}>
                                        {reservation.status}
                                    </span>
                                </div>
                                <div className="space-y-2 text-sm text-gray-600">
                                    <div className="flex items-center">
                                        <FaCalendarAlt className="mr-2 text-gray-400" />
                                        {reservation.date}
                                    </div>
                                    <div className="flex items-center">
                                        <FaClock className="mr-2 text-gray-400" />
                                        {reservation.time} ({reservation.duration})
                                    </div>
                                    <div className="flex items-center">
                                        <FaMapPin className="mr-2 text-gray-400" />
                                        Spot: {reservation.spotNumber}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Recent History Section */}
            <section className="py-12 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                            Recent History
                        </h2>
                        <Link
                            to="/customer/history"
                            className="text-cyan-600 hover:text-cyan-700 font-medium flex items-center"
                        >
                            View All <FaArrowRight className="ml-1" />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {recentHistory.map((reservation) => (
                            <div key={reservation.id} className="bg-white rounded-lg shadow-md p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center space-x-2">
                                        <FaHistory className="text-gray-500" />
                                        <h3 className="font-semibold text-gray-900">{reservation.location}</h3>
                                    </div>
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(reservation.status)}`}>
                                        {reservation.status}
                                    </span>
                                </div>
                                <div className="space-y-2 text-sm text-gray-600">
                                    <div className="flex items-center">
                                        <FaCalendarAlt className="mr-2 text-gray-400" />
                                        {reservation.date}
                                    </div>
                                    <div className="flex items-center">
                                        <FaClock className="mr-2 text-gray-400" />
                                        {reservation.time} ({reservation.duration})
                                    </div>
                                    <div className="flex items-center">
                                        <FaWallet className="mr-2 text-gray-400" />
                                        {reservation.amount}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Quick Stats Section */}
            <section className="py-12 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 text-center">
                        Your Parking Stats
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div className="bg-gradient-to-r from-cyan-500 to-cyan-600 text-white rounded-lg p-6 text-center">
                            <div className="text-3xl font-bold mb-2">{activeReservations.length}</div>
                            <div className="text-cyan-100">Active Reservations</div>
                        </div>
                        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg p-6 text-center">
                            <div className="text-3xl font-bold mb-2">{upcomingReservations.length}</div>
                            <div className="text-blue-100">Upcoming Reservations</div>
                        </div>
                        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg p-6 text-center">
                            <div className="text-3xl font-bold mb-2">{recentHistory.length}</div>
                            <div className="text-green-100">Completed This Month</div>
                        </div>
                        <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg p-6 text-center">
                            <div className="text-3xl font-bold mb-2">$28.00</div>
                            <div className="text-purple-100">Total Spent</div>
                        </div>
                    </div>
                </div>
            </section>
            <ToastContainer />
        </div>
    );
};

export default CustomerLandingPage;
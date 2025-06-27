import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import MapComponent from '../../utils/MapComponent';
import { FaMapMarkerAlt, FaCar, FaMotorcycle, FaBus, FaSearch } from 'react-icons/fa';
import CustomPointsMapContainer from '../../utils/CustomPointsMapContainer';
import SpotDetailsPopup from '../../utils/SpotDetailsPopup';
import { toast, ToastContainer } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';


const vehicleTypes = [
    { label: 'Car', value: 'car', icon: <FaCar /> },
    { label: 'Motorcycle', value: 'motorcycle', icon: <FaMotorcycle /> },
    { label: 'Bus', value: 'bus', icon: <FaBus /> },
];

const FindParkingSpot = () => {
    const { authState } = useAuth();
    console.log(authState, "authState");
    const mapRef = useRef(null);
    const navigate = useNavigate();
    const { vehicleType, position: positionFromState, dateAndTime } = useLocation().state || {};
    const [selectedArea, setSelectedArea] = useState(null);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [selectedSpotData, setSelectedSpotData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [parkingSpots, setParkingSpots] = useState([]);
    const [position, setPosition] = useState(positionFromState || null);
    const [zoom, setZoom] = useState(12);


    const [filters, setFilters] = useState({
        date: dateAndTime ? dateAndTime.toISOString().split('T')[0] : '',
        time: dateAndTime ? dateAndTime.toISOString().split('T')[1] : '',
        vehicleType: vehicleType.toLowerCase() || '',
        radius: 10000,
        coords: position,
        startTime: dateAndTime ? dateAndTime : new Date()
    });
    const [selectedSpot, setSelectedSpot] = useState(null);




    useEffect(() => {
        if (selectedArea && position) {
            const getDistance = async () => {
                try {
                    setIsLoading(true);
                    const response = await axios.get(`https://router.project-osrm.org/route/v1/driving/${selectedArea.coords[1]},${selectedArea.coords[0]};${position.lng},${position.lat}?overview=false`)

                    const spotData = {
                        id: selectedArea.id,
                        name: authState.user.firstName + " " + authState.user.lastName,
                        lat: selectedArea.coords[0],
                        lng: selectedArea.coords[1],
                        address: 'Location',
                        available: true,
                        vehicleType: vehicleType,
                        price: selectedArea.price || 0,
                        rating: selectedArea.rating || 0,
                        distance: (+(response.data.routes[0].distance) / 1000)?.toFixed(2)
                    };

                    setSelectedSpotData(spotData);
                    setIsPopupOpen(true);
                    setIsLoading(false);

                } catch (error) {
                    setIsLoading(false);
                    toast.error(`Error: Could't Calculate Distance`);
                    setSelectedSpotData({
                        id: selectedArea.id,
                        name: authState.user.firstName + " " + authState.user.lastName,
                        lat: selectedArea.coords[0],
                        lng: selectedArea.coords[1],
                        address: 'Location',
                        available: true,
                        vehicleType: vehicleType,
                        price: selectedArea.price || 0,
                        rating: selectedArea.rating || 0,
                        distance: "N/A"

                    });
                    setIsPopupOpen(true);

                }
            }
            getDistance();
        }

    }, [selectedArea]);


    useEffect(() => {

        if (filters.radius / 1000 <= 1) {

            setZoom(16);
        } else if (filters.radius / 1000 <= 5) {
            setZoom(14);
        } else if (filters.radius / 1000 <= 50) {
            setZoom(12);
        } else if (filters.radius / 1000 <= 100) {
            setZoom(10);
        } else if (filters.radius / 1000 <= 200) {
            setZoom(9);
        } else if (filters.radius / 1000 <= 300) {
            setZoom(8);
        } else if (filters.radius / 1000 <= 500) {
            setZoom(7);
        } else {

            setZoom(6);
        }
    }, [filters.radius]);

    useEffect(() => {
        try {

            const setTimeOut = setTimeout(() => {
                getParkingSpots();
            }, 1000)

            const getParkingSpots = async () => {
                const response = await axios.post(`${import.meta.env.VITE_BACKEND_APP_URL}/v1/parking-area/nearest-parking-spots`, filters)
                const filteredResponse = response.data.map(item => ({
                    id: item._id,
                    name: item.parkingArea.name,
                    coords: [item?.parkingArea?.location?.coordinates[1], item?.parkingArea?.location?.coordinates[0]],
                    address: item?.parkingArea?.location?.address,
                    available: item.slotCount > 0,
                    vehicleType: item.vehicleType,
                    price: item.price,
                    rating: item?.parkingArea?.averageRating || 0,

                }));
                setParkingSpots(filteredResponse);
            }
            return () => clearTimeout(setTimeOut);


        } catch (error) {
            toast.error("Failed to fetch parking spots");
            console.log(error, "error");
        }

    }, [position, filters]);


    const handleReservationSubmit = async (reservationData) => {
        setIsLoading(true);
        try {
            // Here you would typically make an API call to save the reservation
            console.log('Reservation data:', reservationData);

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000));

            toast.success('Reservation confirmed successfully!');

            // You can navigate to a confirmation page or update the UI
            // navigate('/customer/reservation-confirmation', { state: { reservationData } });

        } catch (error) {
            toast.error('Failed to confirm reservation. Please try again.');
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const handleClosePopup = () => {
        setIsPopupOpen(false);
        setSelectedSpotData(null);
    };



    return (
        <div className="min-h-screen bg-gray-50 p-2 md:p-6">
            {isLoading && (
                <div className="flex items-center justify-center h-screen">
                    <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-cyan-500"></div>
                </div>
            )}
            {(
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row gap-6">
                        {/* Map: always on top for mobile, right for desktop */}
                        <div className="grid grid-cols-1 order-1 md:order-2 w-full md:w-1/2 flex items-center justify-center">

                            <div className="w-full max-w-xl bg-white rounded-xl shadow-lg p-2 md:p-4 h-56 xs:h-64 sm:h-72 md:h-[500px] flex items-center z-0">
                                <CustomPointsMapContainer parkingSpots={parkingSpots} setSelectedArea={setSelectedArea} currentPosition={position} zoom={zoom} />
                            </div>
                            <div className=" bottom-4 left-4 right-4 bg-white p-4 rounded-lg shadow-md z-0 ml-2 mt-2 mr-6">
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-medium text-gray-700">
                                        Filter Radius: {filters.radius / 1000 || 0} km
                                    </label>
                                    <input
                                        type="range"
                                        min="0"
                                        max="300"
                                        value={filters.radius / 1000 || 0}
                                        onChange={(e) => setFilters(f => ({ ...f, radius: parseInt(e.target.value) * 1000 }))}
                                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                                    />
                                    <div className="flex justify-between text-xs text-gray-500">
                                        <span>0 km</span>
                                        <span>300 km</span>
                                    </div>
                                </div>
                            </div>

                        </div>

                        {/* Filter: below map on mobile, left on desktop */}
                        <div className="order-2 md:order-1 w-full md:w-1/2 flex flex-col gap-6">
                            {(!vehicleType || !position) && (<div className="bg-white rounded-xl shadow-md p-4">
                                <h2 className="text-xl font-bold text-cyan-700 mb-4 flex items-center gap-2 justify-center">
                                    {("Schedule a Parking").toUpperCase()}
                                </h2>
                                <div className="grid grid-cols-1   gap-4">
                                    <div className="flex flex-col gap-2">
                                        <div className=" relative z-0">
                                            <MapComponent ref={mapRef} position={position} setPosition={setPosition} zoom={12} height="300px" message={`Help us find the best spot for you – \n pick your current location.`} />
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


                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <input
                                            type="date"
                                            value={filters.date}
                                            onChange={e => setFilters(f => ({ ...f, date: e.target.value }))}
                                            className="w-full py-2 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
                                        />
                                        <input
                                            type="time"
                                            value={filters.time}
                                            onChange={e => setFilters(f => ({ ...f, time: e.target.value }))}
                                            className="w-full py-2 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
                                        />
                                        <select
                                            value={filters.vehicleType}
                                            onChange={e => setFilters(f => ({ ...f, vehicleType: e.target.value }))}
                                            className="w-full py-2 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 col-span-2"
                                        >
                                            <option value="">All Vehicle Types</option>
                                            {vehicleTypes.map(type => (
                                                <option key={type.value} value={type.value}>{type.label}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <button className=" flex flex-col bg-emerald-500 text-white p-2 rounded-md hover:bg-emerald-600 transition-all duration-300  flex items-center justify-center mt-2  h-12"
                                        onClick={() => navigate("/customer/find-parking-spot")}>


                                        <span className="text-sm font-bold ">Find Parking Spot</span>
                                    </button>
                                </div>
                            </div>)}
                            {/* Results List */}
                            <div className="bg-white rounded-xl shadow-md p-4">
                                <h3 className="text-lg font-bold text-cyan-700 mb-4">Available Spots</h3>
                                <div className="flex flex-col gap-4">
                                    {parkingSpots.length === 0 && (
                                        <div className="text-gray-500 text-center">No spots found for your filters.</div>
                                    )}
                                    {parkingSpots.map(spot => (
                                        <div
                                            key={spot.id}
                                            className={`border rounded-lg p-3 flex items-center gap-4 cursor-pointer hover:shadow-md transition ${selectedSpot?.id === spot.id ? 'border-cyan-500 bg-cyan-50' : 'border-gray-200 bg-white'}`}
                                            onClick={() => setSelectedSpot(spot)}
                                        >
                                            <div className="text-cyan-500 text-2xl">
                                                {vehicleTypes.find(v => v.value === spot.vehicleType)?.icon}
                                            </div>
                                            <div className="flex-1">
                                                <div className="font-semibold text-gray-800">{spot.name}</div>
                                                <div className="text-sm text-gray-500">{spot.address}</div>
                                                <div className="text-xs text-gray-400">{spot.distance} km away</div>
                                            </div>
                                            <div className="text-right">
                                                <div className="font-bold text-cyan-700">Rs.{spot?.price?.toFixed(2) || "N/A"}/hr</div>
                                                <div className={`text-xs ${spot.available ? 'text-green-600' : 'text-red-500'}`}>{spot.available ? 'Available' : 'Full'}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>)}

            {/* Spot Details Popup */}
            <SpotDetailsPopup
                isOpen={isPopupOpen}
                onClose={handleClosePopup}
                onSubmit={handleReservationSubmit}
                spotData={selectedSpotData}
                loading={isLoading}
                userData={authState.user}
            />

            <ToastContainer />
        </div>
    );
};

export default FindParkingSpot;
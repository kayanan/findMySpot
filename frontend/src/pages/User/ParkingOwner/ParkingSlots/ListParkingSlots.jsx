import { useState } from 'react';
import { FaCar, FaTruck, FaBus, FaMotorcycle, FaCheck, FaTimes, FaClock, FaPlus, FaEdit } from "react-icons/fa";
import { toast } from "react-toastify";
import axios from "axios";
import PopUpMenu from "../../../../utils/PopUpMenu";
import ParkingDetailsPopup from "../../../../utils/ParkingDetailsPopup";
import UserDetailsPopup from "../../../../utils/UserDetailsPopup";

const ListParkingSlots = ({ slots, fetchParkingSlots, parkingAreaId }) => {
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [isParkingDetailsOpen, setIsParkingDetailsOpen] = useState(false);
    const [isUserDetailsOpen, setIsUserDetailsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [userDetails, setUserDetails] = useState(null);
    console.log(selectedSlot);
    // Group slots by vehicle type
    const groupedSlots = slots?.reduce((acc, slot) => {
        const vehicleType = slot.vehicleType?.vehicleType || "Unknown";
        if (!acc[vehicleType]) {
            acc[vehicleType] = [];
        }
        acc[vehicleType].push(slot);
        return acc;
    }, {});

    const getSlotBackgroundColor = (slot) => {
        if (!slot.isActive) return "rose";
        if (slot.isReserved) return "slate";
        return "emerald";
    };

    // const fetchSlotData = async (slot) => {
    //     try {
    //         const response = await axios.get(`/api/parking-slots/${slot._id}`);
    //     } catch (error) {
    //         console.error("Error fetching slot data:", error);
    //     }
    // };
    const handlePriceChange = async (price, vehicleId) => {
        try {
            console.log(vehicleId);
            await axios.patch(`${import.meta.env.VITE_BACKEND_APP_URL}/v1/parking-slot/parking-area/${parkingAreaId}`, { slotPrice: +price, vehicleId: vehicleId });
            toast.success("Price updated successfully");
            fetchParkingSlots();
        } catch (error) {
            toast.error("Failed to update price");
            console.error("Error updating price:", error);
        }
    };

    const handleParkingDetailsSubmit = async (details) => {
        setLoading(true);
        setUserDetails(details);
        try {
            try {
                const user = await axios.get(`${import.meta.env.VITE_BACKEND_APP_URL}/v1/user/mobile-number/${details.customerMobile}`);



                toast.success("Parking reservation created successfully");
                fetchParkingSlots(); // Refresh slots data
            }
            catch (error) {
                if (error.response.data.status === false) {
                    setIsUserDetailsOpen(true);

                }
                else {
                    toast.error("Failed to create parking reservation");
                }
            }

        } catch (error) {
            console.log(error, "error------------------------------------------");
            toast.error("Failed to create parking reservation");
            console.error("Error creating reservation:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleUserDetailsSubmit = async (details) => {
        console.log(details, "details------------------------------------------");
    };
    console.log(groupedSlots);

    const handleSlotClick = (slot) => {
        // if (slot.isActive) {
        //     setSelectedSlot(slot);
        //     setIsPopupOpen(true);
        // } else {
        //     toast.error("Slot is inactive");
        // }
        setSelectedSlot(slot);
        setIsPopupOpen(true);
    };

    const handleStatusUpdate = async (updates) => {
        if (updates.isReserved) {
            // Open parking details popup for reservation
            setIsParkingDetailsOpen(true);
        } else {
            try {
                await axios.patch(`${import.meta.env.VITE_BACKEND_APP_URL}/v1/parking-slot/${selectedSlot._id}`, updates);
                toast.success("Slot status updated successfully");
                fetchParkingSlots();
            } catch (error) {
                toast.error("Failed to update slot status");
                console.error("Error updating slot:", error);
            }
        }
    };

    const getSlotDetails = (slot) => {
        return `
            Slot Details:
            - Vehicle Type: ${slot.vehicleType?.vehicleType || 'N/A'}
            - Slot Number: ${slot.slotNumber}
            - Size: ${slot.slotSize ? `${slot.slotSize} sq ft` : 'N/A'}
            - Price: ${slot.slotPrice ? `Rs.${slot.slotPrice}/hr` : 'N/A'}
            - Status: ${!slot.isActive ? 'Inactive' : slot.isReserved ? 'Reserved' : 'Available'}
        `;
    };
    console.log(Object.entries(groupedSlots));

    return (
        <>
            <div className="space-y-4">
                {Object.entries(groupedSlots || {}).map(([vehicleType, slots]) => (
                    <div key={vehicleType} className="bg-white rounded-lg shadow-sm p-4 shadow-gray-400 border-2 border-gray-200">
                        <h3 className="text-3xl font-bold text-gray-700">{vehicleType.toUpperCase()}</h3>
                        <div className="flex gap-10 items-center pb-4">
                            <h3 className="text-xl font-bold mb-3 text-cyan-700">Total Slots: {slots.length}</h3>
                            <h3 className="text-xl font-bold mb-3 text-emerald-700 border-l-2 border-gray-400 pl-4">Available Slots: {slots.filter(slot => slot?.isActive && !slot?.isReserved).length}</h3>
                            <h3 className="text-xl font-bold mb-3 text-cyan-700 border-l-2 border-gray-400 pl-4">Price: </h3>
                            <span className="text-cyan-700 font-bold text-3xl mb-3">{slots[0].slotPrice ? `Rs.${slots[0].slotPrice}/hr` : 'N/A'}</span>
                            <button
                                className="bg-cyan-700 text-white px-4 py-2 rounded-md mb-3 flex items-center gap-2 hover:scale-110 transition-transform duration-200 ease-in-out bg-cyan-700"
                                onClick={() => {
                                    const currentPrice = slots[0].slotPrice || 'N/A';
                                    const isConfirmed = confirm('Do you want to change the price?');
                                    if (isConfirmed) {
                                        const newPrice = prompt(`Current price: Rs.${currentPrice}/hr\nEnter new price:`);
                                        if (newPrice) {
                                            handlePriceChange(newPrice, slots[0].vehicleType._id);
                                        }
                                    }
                                }}
                            >
                                <FaEdit />
                            </button>
                        </div>
                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
                            {slots.map((slot) => (
                                <div
                                    key={slot._id}
                                    className={`bg-${getSlotBackgroundColor(slot)}-300 hover:bg-${getSlotBackgroundColor(slot)}-400 rounded-lg p-2 hover:shadow-lg transition-shadow duration-300`}
                                    onClick={() => handleSlotClick(slot)}
                                >
                                    <div className="flex items-center justify-between mb-1">
                                        <div className="flex items-center">
                                            <div className="w-5 h-5 bg-cyan-100 rounded-full flex items-center justify-center mr-1">
                                                {vehicleType.toLowerCase() === "car" && <FaCar className="text-cyan-500 text-xs" />}
                                                {vehicleType.toLowerCase() === "truck" && <FaTruck className="text-cyan-500 text-xs" />}
                                                {vehicleType.toLowerCase() === "bus" && <FaBus className="text-cyan-500 text-xs" />}
                                                {vehicleType.toLowerCase() === "motorcycle" && <FaMotorcycle className="text-cyan-500 text-xs" />}
                                            </div>
                                            <span className="text-xs font-medium">{`${vehicleType.charAt(0).toUpperCase()}-${slot.slotNumber}`}</span>
                                        </div>
                                        <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${!slot.isActive
                                            ? "bg-red-100 text-red-800"
                                            : slot.isReserved
                                                ? "bg-orange-100 text-orange-800"
                                                : "bg-green-100 text-green-800"
                                            }`}>
                                            {!slot.isActive ? "Inactive" : slot.isReserved ? "Reserved" : "Available"}
                                        </span>
                                    </div>
                                    <div className="space-y-1 text-[10px]">
                                        <div className="flex justify-between items-center bg-white px-1.5 py-0.5 rounded">
                                            <span className="text-gray-600">Size:</span>
                                            <span className="w-1/2 font-medium text-cyan-600">{slot.slotSize ? `${slot.slotSize} sq ft` : "N/A"}</span>
                                        </div>
                                        <div className="flex justify-between items-center bg-white px-1.5 py-0.5 rounded">
                                            <span className="text-gray-600">Price:</span>
                                            <span className="w-1/2 font-bold text-cyan-800">{slot.slotPrice ? `Rs.${slot.slotPrice}/hr` : "N/A"}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <PopUpMenu
                isOpen={isPopupOpen}
                onClose={() => setIsPopupOpen(false)}
                title="Update Slot Status"
                message={selectedSlot ? getSlotDetails(selectedSlot) : ''}
                type="info"
                buttons={[
                    selectedSlot?.isActive ? !selectedSlot?.isReserved && {
                        text: "Set Inactive",
                        variant: "danger",
                        icon: <FaTimes />,
                        onClick: () => handleStatusUpdate({ isActive: false, isReserved: false })
                    } : {
                        text: "Set Active",
                        variant: "success",
                        icon: <FaCheck />,
                        onClick: () => handleStatusUpdate({ isActive: true, isReserved: false })
                    },
                    selectedSlot?.isReserved ? {
                        text: "Set Available",
                        variant: "success",
                        icon: <FaCheck />,
                        onClick: () => handleStatusUpdate({ isActive: true, isReserved: false })
                    } : selectedSlot?.isActive ? {
                        text: "Set Reserved",
                        variant: "warning",
                        icon: <FaClock />,
                        onClick: () => handleStatusUpdate({ isActive: true, isReserved: true })
                    } : false,
                ]}
            />

            <ParkingDetailsPopup
                isOpen={isParkingDetailsOpen}
                onClose={() => setIsParkingDetailsOpen(false)}
                onSubmit={handleParkingDetailsSubmit}
                title="Parking Reservation Details"
                loading={loading}
            />
            <UserDetailsPopup
                isOpen={isUserDetailsOpen}
                key={userDetails?.customerMobile}
                onClose={() => setIsUserDetailsOpen(false)}
                onSubmit={handleUserDetailsSubmit}
                title="User Details"
                loading={loading}
                initialData={userDetails}
            />
        </>
    );
};

export default ListParkingSlots;
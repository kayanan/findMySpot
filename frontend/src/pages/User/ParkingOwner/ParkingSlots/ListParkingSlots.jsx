import { useState } from 'react';
import { FaCar, FaTruck, FaBus, FaMotorcycle, FaCheck, FaTimes, FaClock } from "react-icons/fa";
import { toast } from "react-toastify";
import axios from "axios";
import PopUpMenu from "../../../../utils/PopUpMenu";

const ListParkingSlots = ({slots, fetchParkingSlots}) => {
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
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

    const handleSlotClick = (slot) => {
        if(slot.isActive){
        setSelectedSlot(slot);
        setIsPopupOpen(true);
        }else{
            toast.error("Slot is inactive");
        }
    };

    const handleStatusUpdate = async (updates) => {
        try {
            await axios.patch(`${import.meta.env.VITE_BACKEND_APP_URL}/v1/parking-slot/${selectedSlot._id}`, updates);
            toast.success("Slot status updated successfully",
                {
                    position: "top-right",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    onClose: () => {
                        fetchParkingSlots();
                    }
                }
            );
            // You might want to refresh the slots data here
        } catch (error) {
            toast.error("Failed to update slot status");
            console.error("Error updating slot:", error);
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

    return (
        <>
            <div className="space-y-4">
                {Object.entries(groupedSlots || {}).map(([vehicleType, typeSlots]) => (
                    <div key={vehicleType} className="bg-white rounded-lg shadow-sm p-4 shadow-gray-400 border-2 border-gray-200">
                        <h3 className="text-lg font-bold mb-3 text-cyan-700">{vehicleType.toUpperCase()} Slots</h3>
                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
                            {typeSlots.map((slot) => (
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
                                        <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                                            !slot.isActive 
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
                                            <span className="w-1/2 font-medium text-cyan-600">{slot.slotPrice ? `Rs.${slot.slotPrice}/hr` : "N/A"}</span>
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
        </>
    );
};

export default ListParkingSlots;
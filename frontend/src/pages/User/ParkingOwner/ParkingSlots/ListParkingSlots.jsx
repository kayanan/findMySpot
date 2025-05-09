import { FaCar,FaTruck,FaBus,FaMotorcycle} from "react-icons/fa";
import { toast } from "react-toastify";
import axios from "axios";

const ListParkingSlots = ({slots}) => {
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
    const fetchSlotData = async (slot) => {
        try {
            const response = await axios.get(`/api/parking-slots/${slot._id}`);
            console.log(response.data);
        } catch (error) {
            console.error("Error fetching slot data:", error);
        }
    };

    const handleSlotClick = (slot) => {
       toast.success(`Slot ${slot.slotNumber} clicked`);
    };



    return (
        <div className="space-y-4">
            {Object.entries(groupedSlots || {}).map(([vehicleType, typeSlots]) => (
                <div key={vehicleType} className="bg-white rounded-lg shadow-sm p-4">
                    <h3 className="text-lg font-bold mb-3 text-cyan-700">{vehicleType.toUpperCase()} Slots</h3>
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
                        {typeSlots.map((slot) => (
                            <div 
                                key={slot._id} 
                                className={`bg-${getSlotBackgroundColor(slot)}-300  hover:bg-${getSlotBackgroundColor(slot)}-400 rounded-lg p-2 hover:shadow-lg transition-shadow duration-300`}
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
    );
};

export default ListParkingSlots;
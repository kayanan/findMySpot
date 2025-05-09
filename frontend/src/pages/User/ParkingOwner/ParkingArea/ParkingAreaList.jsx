import { Link } from "react-router-dom";
import { FaBuilding, FaParking, FaCar, FaMapMarkerAlt } from "react-icons/fa";
import { toast } from "react-toastify";
import axios from "axios";

const getSlotTypeCount = (slots) => {
  const countByType = {};
  slots.forEach(slot => {
    const type = slot?.vehicleType?.vehicleType || 'Unknown';
    countByType[type] = (countByType[type] || 0) + 1;
  });
  return countByType;
};

const ParkingAreaList = ({parkingAreas, fetchParkingOwner, parkingOwner}) => {
  
    const handleStatusChange = async (id, status) => {
      const approve = window.confirm(`Are you sure you want to ${status ? "activate" : "deactivate"} this parking area?`);
      if(!approve) return;
        try {
            const response = await axios.patch(`${import.meta.env.VITE_BACKEND_APP_URL}/v1/parking-area/${id}`, {isActive: status});
            if(response.status === 200){
                toast.success("Parking area status updated successfully", {
                    onClose: () => {
                        fetchParkingOwner();
                    },
                    autoClose: 1000
                });
            }
        } catch (error) {
            console.log(error);
            toast.error("Failed to update parking area status");
        }
    }

    return (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {parkingAreas.map((area) => {
            const slotTypeCount = getSlotTypeCount(area?.slots?.data || []);
            return (
              <div key={area?._doc._id} className="bg-white shadow-md rounded-xl overflow-hidden hover:shadow-lg transition-shadow duration-300">
                {/* Header Section */}
                <div className="bg-gradient-to-r from-cyan-500 to-cyan-600 p-4 text-white">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-bold truncate">{area?._doc.name}</h3>
                    <span className={`px-2 py-0.5 rounded-full text-sm font-semibold ${
                      area?._doc.isActive 
                        ? "bg-green-100 text-green-800" 
                        : "bg-red-100 text-red-800"
                    }`}>
                      {area?._doc.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-4 ">
                  {/* Description */}
                  <div className="">
                    <p className="text-gray-600 line-clamp-2">{area?.description}</p>
                    <div className="flex items-center text-gray-600">
                      <FaMapMarkerAlt className="mr-2 text-cyan-500" />
                      <span className="text-sm">
                        {area?._doc.addressLine1}, {area?._doc.addressLine2}, {area?._doc.city?.name}
                      </span>
                    </div>
                  </div>

                  {/* Parking Slots Section */}
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center mb-2">
                      <FaParking className="text-cyan-500 mr-2" />
                      <h4 className="font-semibold text-gray-800">Parking Slots</h4>
                    </div>
                    <div >
                      <div className="w-full flex justify-between items-center bg-white p-2 rounded-md">
                        <span className="text-gray-600">Total Slots</span>
                        <span className="font-semibold text-cyan-600">{area.slots?.data?.length || 0}</span>
                      </div>
                      {Object.entries(slotTypeCount).map(([type, count]) => (
                        <div key={type} className="w-full flex justify-between items-center bg-white p-2 rounded-md">
                          <div className="flex items-center">
                            <FaCar className="text-gray-400 mr-2" />
                            <span className="text-gray-600">{type}</span>
                          </div>
                          <span className="font-semibold text-cyan-600">{count}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-1">
                    <Link
                      to={`/parking-area/view/${area?._doc._id}`}
                      state={{ slots: area?.slots , parkingOwnerId: parkingOwner?._id}}
                      className="flex-1 bg-cyan-500 hover:bg-cyan-600 text-white text-center py-2 rounded-lg transition duration-300 font-medium"
                    >
                      View Details
                    </Link>
                    {parkingOwner?.isActive && (
                      <button
                        type="button"
                        onClick={() => handleStatusChange(area?._doc._id, !area?._doc.isActive)}
                      className={`flex-1 py-2 rounded-lg transition duration-300 font-medium ${
                        area?._doc.isActive
                          ? "bg-red-500 hover:bg-red-600 text-white"
                          : "bg-green-500 hover:bg-green-600 text-white"
                      }`}
                    >
                      {area?._doc.isActive ? "Deactivate" : "Activate"}
                    </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
    )
}

export default ParkingAreaList;
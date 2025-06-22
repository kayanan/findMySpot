import { Link } from "react-router-dom";
import { FaBuilding, FaParking, FaCar, FaMapMarkerAlt } from "react-icons/fa";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import PayhereButton from "../../../../utils/PayhereButton";
import axios from "axios";
import BankTransferPopup from "../../../../utils/BankTransferPopup";
import dayjs from "dayjs";

const getSlotTypeCount = (slots) => {
  const countByType = {};
  slots.forEach(slot => {
    const type = slot?.vehicleType?.vehicleType || 'Unknown';
    countByType[type] = (countByType[type] || 0) + 1;
  });

  return countByType;
};

const calculateAmount = (parkingArea, subscriptionFee) => {

  const slotTypeCount = getSlotTypeCount(parkingArea?.slots?.data || []);
  const amount = Object.entries(slotTypeCount).reduce((acc, [type, count]) => {
    const fee = subscriptionFee.find(fee => fee?.vehicleType?.vehicleType === type);
    return acc + (count < 100 ? fee?.below100 : count < 300 ? fee?.between100and300 : count < 500 ? fee?.between300and500 : fee?.above500) * count;
  }, 0);

  return amount;
}

const ParkingAreaList = ({ parkingOwner }) => {
  const [isBankTransferOpen, setIsBankTransferOpen] = useState(false);
  const [parkingAreas, setParkingAreas] = useState([]);
  const [activeSubscriptionFee, setActiveSubscriptionFee] = useState(0);
  const [amount, setAmount] = useState(0);

  const handleBankTransferSubmit = async (formData) => {

    const formDataToSend = new FormData();
    for (const key in formData) {
      if (key === "images") {
        for (const image of formData[key]) {
          formDataToSend.append("images", image);
        }
      } else {
        formDataToSend.append(key, formData[key]);
      }
    }
    const response = await axios.post(`${import.meta.env.VITE_BACKEND_APP_URL}/v1/subscription-payment`, formDataToSend, { withCredentials: true });
    if (response.status === 201) {
      toast.success("Bank transfer successful");
    } else {
      toast.error("Bank transfer failed");
    }

    // Handle the form submission
    // formData will contain:
    // {
    //   referenceNumber: string,
    //   bankName: string,
    //   branch: string,
    //   images: string[],
    //   amount: number
    // }
  };

  const fetchParkingAreas = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_ADMIN_URL}/v1/parking-area/owner/${parkingOwner?._id}`, { withCredentials: true });
      setParkingAreas(response.data.data);
    } catch (err) {
      console.error("Error fetching parking areas:", err.message);
      setError("Failed to load parking areas. Please try again.");
      toast.error("Failed to load parking areas. Please try again.", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };
  const fetchActiveSubscriptionFee = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_APP_URL}/v1/parking-subscription-fee/active`);
      setActiveSubscriptionFee(response?.data || []);
    } catch (err) {
      console.error("Error fetching active subscription fee:", err.message);
    }
  };
  useEffect(() => {
    fetchParkingAreas();
    fetchActiveSubscriptionFee();
  }, []);

  const handleStatusChange = async (id, status) => {
    const approve = window.confirm(`Are you sure you want to ${status ? "activate" : "deactivate"} this parking area?`);
    if (!approve) return;
    try {
      const response = await axios.patch(`${import.meta.env.VITE_BACKEND_APP_URL}/v1/parking-area/${id}`, { isActive: status });
      if (response.status === 200) {
        toast.success("Parking area status updated successfully", {
          onClose: () => {
            fetchParkingAreas();
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
          <div key={area?._doc._id} className="bg-white shadow-md rounded-xl overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col">
            {/* Header Section */}
            <div className="bg-gradient-to-r from-cyan-500 to-cyan-600 p-4 text-white">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold truncate">{area?._doc.name}</h3>
                {(area?._doc?.parkingSubscriptionPaymentId?.subscriptionEndDate && dayjs(area?._doc?.parkingSubscriptionPaymentId?.subscriptionEndDate).isAfter(dayjs())) ? (
                  <span className={`px-4 py-0.5 rounded-full text-sm font-semibold bg-cyan-100 text-cyan-800 `} >
                    Subscribed
                  </span>
                ) : (
                  <span className={`px-4 py-0.5 rounded-full text-sm font-semibold bg-rose-100 text-rose-800 `} >
                    Subscribe For Go Live
                  </span>
                )}
                <span className={`px-2 py-0.5 rounded-full text-sm font-semibold ${area?._doc.isActive
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
                  }`}>
                  {area?._doc.isActive ? "Active" : "Inactive"}
                </span>
              </div>
            </div>

            {/* Content Section */}
            <div className="p-4 flex-1 flex flex-col">
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
              <div className="bg-gray-50 rounded-lg p-3 mt-4 flex-1">
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
                        <FaCar className="text-gray-400 mr-5 " />
                        <span className="text-gray-600">{type}</span>
                      </div>
                      <span className="font-semibold text-cyan-600">{count}</span>
                    </div>
                  ))}
                </div>

              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-4 mt-auto">
                <Link
                  to={`/parking-area/view/${area?._doc._id}`}
                  state={{ slots: area?.slots, parkingOwnerId: parkingOwner?._id }}
                  className="flex-1 bg-cyan-500 hover:bg-cyan-600 text-white text-center py-2 rounded-lg transition duration-300 font-medium"
                >
                  View Details
                </Link>
                {(parkingOwner?.isActive && area?._doc?.parkingSubscriptionPaymentId && dayjs(area?._doc?.parkingSubscriptionPaymentId?.subscriptionEndDate).isAfter(dayjs())) ? (
                  <button
                    type="button"
                    onClick={() => handleStatusChange(area?._doc._id, !area?._doc.isActive)}
                    className={`flex-1 py-2 rounded-lg transition duration-300 font-medium ${area?._doc.isActive
                      ? "bg-rose-500 hover:bg-rose-600 text-white"
                      : "bg-emerald-500 hover:bg-emerald-600 text-white"
                      }`}
                  >
                    {area?._doc.isActive ? "Deactivate" : "Activate"}
                  </button>
                ) : (
                  <>
                    <PayhereButton paymentDetails={
                      {
                        order_id: "ItemNo12345",
                        amount: calculateAmount(area, activeSubscriptionFee).toFixed(2).toString(),
                        currency: "LKR",
                        items: "Parking Subscription",
                        first_name: parkingOwner?.firstName,
                        last_name: parkingOwner?.lastName,
                        email: parkingOwner?.email,
                        phone: parkingOwner?.phoneNumber,
                        address: area?._doc?.addressLine1,
                        city: area?._doc?.city?.name,
                        country: "Sri Lanka",
                        custom_1: parkingOwner?._id,
                        custom_2: area?._doc._id,
                        return_url: `/owner/view/${parkingOwner?._id}`,
                        cancel_url: `/owner/view/${parkingOwner?._id}`,
                        notify_url: `${import.meta.env.VITE_BACKEND_ADMIN_URL_PUBLIC}/api/admin/v1/subscription-payment/notify-payment`,
                      }
                    } onComplete={fetchParkingAreas} />
                    <button className="bg-gray-500 hover:bg-gray-600 text-white p-2 rounded-lg" onClick={() => {
                      setIsBankTransferOpen(true)
                      setAmount(calculateAmount(area, activeSubscriptionFee).toFixed(2).toString())
                    }}>
                      Bank Transfer
                    </button>
                    <BankTransferPopup
                      isOpen={isBankTransferOpen}
                      onClose={() => setIsBankTransferOpen(false)}
                      onSubmit={handleBankTransferSubmit}
                      parkingAreaId={area?._doc._id}
                      parkingOwnerId={parkingOwner?._id}
                      amount={amount}
                    />
                  </>
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
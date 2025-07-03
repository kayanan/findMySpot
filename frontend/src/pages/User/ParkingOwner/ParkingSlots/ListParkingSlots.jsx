import { useState } from 'react';
import { FaCar, FaTruck, FaBus, FaMotorcycle, FaCheck, FaTimes, FaClock, FaPlus, FaEdit, FaCashRegister, FaUniversity } from "react-icons/fa";
import { toast } from "react-toastify";
import axios from "axios";
import PopUpMenu from "../../../../utils/PopUpMenu";
import ParkingDetailsPopup from "../../../../utils/ParkingDetailsPopup";
import UserDetailsPopup from "../../../../utils/UserDetailsPopup";
import BankTransferPopup from '../../../../utils/BankTransferPopup';
import PaymentOptionPopup from '../../../../utils/PaymentOptionPopup';
import ConfirmationPopup from '../../../../utils/ConfirmationPopup';
import PromptPopup from '../../../../utils/PromptPopup';
import dayjs from 'dayjs';

const ListParkingSlots = ({ slots, fetchParkingSlots, parkingArea }) => {
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [paymentOption, setPaymentOption] = useState(null);
    const [isPaymentOptionPopupOpen, setIsPaymentOptionPopupOpen] = useState(false);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [isBankTransferPopupOpen, setIsBankTransferPopupOpen] = useState(false);
    const [isParkingDetailsOpen, setIsParkingDetailsOpen] = useState(false);
    const [isUserDetailsOpen, setIsUserDetailsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [userDetails, setUserDetails] = useState(null);
    const [finalAmount, setFinalAmount] = useState(0);
    const [isConfirmationPopupOpen, setIsConfirmationPopupOpen] = useState(false);
    const [isPromptPopupOpen, setIsPromptPopupOpen] = useState(false);
    const [vehicleTypeForPriceChange, setVehicleTypeForPriceChange] = useState(null);
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
        if (slot.isOccupied) return "slate";
        if (slot.isReservationPending) return "amber";
        if (slot.isReserved) return "indigo";
        return "emerald";
    };

    // const fetchSlotData = async (slot) => {
    //     try {
    //         const response = await axios.get(`/api/parking-slots/${slot._id}`);
    //     } catch (error) {
    //         console.error("Error fetching slot data:", error);
    //     }
    // };
    const handlePriceChange = async (price) => {
        setLoading(true);
        setIsPromptPopupOpen(false);
        const data = {
            slotPrice: +price,
            vehicleId: vehicleTypeForPriceChange
        }
        try {
            await axios.patch(`${import.meta.env.VITE_BACKEND_APP_URL}/v1/parking-slot/parking-area/${parkingArea._id}`, data);
            toast.success("Price updated successfully");
            fetchParkingSlots();
        } catch (error) {
            toast.error("Failed to update price");
        }
    };

    const handleParkingDetailsSubmit = async (details) => {
        setLoading(true);
        setUserDetails(details);
        try {
            try {
                const vehicle = await axios.get(`${import.meta.env.VITE_BACKEND_APP_URL}/v1/reservation/vehicle/${details.vehicleNumber}`);
                if (vehicle.data.success) {
                    toast.error("Vehicle already reserved", { position: "top-center", autoClose: false });
                    setLoading(false);
                    return;
                }
                const user = await axios.get(`${import.meta.env.VITE_BACKEND_APP_URL}/v1/user/mobile-number/${details.customerMobile}`);


                const reservation = await axios.post(`${import.meta.env.VITE_BACKEND_APP_URL}/v1/reservation`, {
                    parkingSlot: selectedSlot._id,
                    parkingArea: parkingArea._id,
                    user: user.data._id,
                    vehicleNumber: details.vehicleNumber,
                    customerMobile: details.customerMobile,
                    perHourRate: selectedSlot.slotPrice,
                    vehicleType: selectedSlot.vehicleType._id,
                    paymentStatus: "pending",
                    status: "confirmed",
                    createdBy: user.data._id,
                    type: "on_spot",
                    startDateAndTime: new Date(),

                });


                await axios.patch(`${import.meta.env.VITE_BACKEND_APP_URL}/v1/parking-slot/${selectedSlot._id}`,
                     { isOccupied: true, reservedVehicleNumber: details.vehicleNumber, addReservationId: reservation.data.data._id });



                toast.success("Parking reservation created successfully");
                fetchParkingSlots(); // Refresh slots data
            }
            catch (error) {
                if (error.response.data.status === false) {
                    setLoading(false);
                    setIsUserDetailsOpen(true);

                }
                else {
                    toast.error("Failed to create parking reservation");
                }
            }

        } catch (error) {

            toast.error("Failed to create parking reservation");
            console.error("Error creating reservation:", error);
        } finally {
            setLoading(false);
        }
    };


    console.log(groupedSlots);

    const handleSlotClick = (slot) => {
        if (slot.isReservationPending) {
            return;
        }
        setSelectedSlot(slot);
        setIsPopupOpen(true);
    };

    const handleStatusUpdate = async (updates) => {
        if (updates.isOccupied && !selectedSlot.reservationId) {
            // Open parking details popup for reservation
            setIsParkingDetailsOpen(true);
        }
         else {
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
            - Price: ${slot.slotPrice ? `Rs.${slot.slotPrice}/hr` : 'N/A'}
            - Status: ${!slot.isActive ? 'Inactive' : slot.isReserved ? 'Reserved' : slot.isOccupied ? 'Occupied' : slot.isReservationPending ? 'Pending' : 'Available'}
            - Reserved Vehicle Number: ${slot.reservedVehicleNumber || 'N/A'}
        `;
    };

    const processParkingCheckout = async (slot) => {
        try {
            const reservation = await axios.patch(`${import.meta.env.VITE_BACKEND_APP_URL}/v1/reservation/${slot.reservationId._id}/complete`);
            const totalAmount = reservation.data.data.totalAmount;
            setFinalAmount(totalAmount);
            setIsPaymentOptionPopupOpen(true);





        } catch (error) {
            toast.error("Failed to process parking checkout");
        }
    }

    const handleBankTransferSubmit = async (data) => {

        await axios.post(`${import.meta.env.VITE_BACKEND_APP_URL}/v1/reservation-payment`, {
            referenceNumber: data.referenceNumber,
            bankName: data.bankName,
            branch: data.branch,
            customer: selectedSlot.reservationId.user,
            parkingArea: parkingArea._id,
            parkingSlot: selectedSlot._id,
            reservation: selectedSlot.reservationId._id,
            paymentMethod: "bank_transfer",
            paymentAmount: finalAmount,
            paymentStatus: "paid",
            paidBy: "667367367367367367367367",
        })
        await axios.patch(`${import.meta.env.VITE_BACKEND_APP_URL}/v1/parking-slot/${selectedSlot._id}`, { isOccupied: false, reservedVehicleNumber: null, removeReservationId: selectedSlot?.reservationId?._id });
        toast.success("Bank transfer submitted successfully");
        setIsBankTransferPopupOpen(false);
        fetchParkingSlots();
    }

    const handlePaymentOptionSubmit = async (data) => {

        if (data.paymentMethod === "cash") {
            await axios.post(`${import.meta.env.VITE_BACKEND_APP_URL}/v1/reservation-payment`, {
                customer: selectedSlot.reservationId.user,
                parkingArea: parkingArea._id,
                parkingSlot: selectedSlot._id,
                reservation: selectedSlot.reservationId._id,
                paymentMethod: data.paymentMethod,
                paymentAmount: finalAmount,
                paymentStatus: "paid",
                paidBy: "667367367367367367367367",
            })
            await axios.patch(`${import.meta.env.VITE_BACKEND_APP_URL}/v1/parking-slot/${selectedSlot._id}`, { isOccupied: false, reservedVehicleNumber: null, removeReservationId: selectedSlot?.reservationId?._id });
            toast.success("Payment received successfully");
        }
        else if (data.paymentMethod === "bank_transfer") {
            toast.success("Payment received successfully");
            setIsBankTransferPopupOpen(true);
        }
        else if (data.paymentMethod === "card") {
            toast.error("card payment not supported yet", { position: "top-center", autoClose: false });
        }
        fetchParkingSlots();
    }

    return (
        <>
            <div className="space-y-4">
                {Object.entries(groupedSlots || {}).map(([vehicleType, slots]) => (
                    <div key={vehicleType} className="bg-white rounded-lg shadow-sm p-4 shadow-gray-400 border-2 border-gray-200">
                        <h3 className="text-3xl font-bold text-gray-700">{vehicleType.toUpperCase()}</h3>
                        <div className="flex gap-10 items-center pb-4">
                            <h3 className="text-xl font-bold mb-3 text-cyan-700">Total Slots: {slots.length}</h3>
                            <h3 className="text-xl font-bold mb-3 text-emerald-700 border-l-2 border-gray-400 pl-4">Available Slots: {slots.filter(slot => slot?.isActive && (!slot?.isReserved && !slot?.isOccupied && !slot?.isReservationPending)).length}</h3>
                            <h3 className="text-xl font-bold mb-3 text-cyan-700 border-l-2 border-gray-400 pl-4">Price: </h3>
                            <span className="text-cyan-700 font-bold text-3xl mb-3">{slots[0].slotPrice ? `Rs.${slots[0].slotPrice}/hr` : 'N/A'}</span>
                            <button
                                className="bg-cyan-700 text-white px-4 py-2 rounded-md mb-3 flex items-center gap-2 hover:scale-110 transition-transform duration-200 ease-in-out bg-cyan-700"
                                onClick={() => {
                                    setIsConfirmationPopupOpen(true)
                                    setVehicleTypeForPriceChange(slots[0].vehicleType._id)
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
                                        <span className={`px-1.5 py-0.5 rounded-full text-[10px] bg-${getSlotBackgroundColor(slot)}-100 text-${getSlotBackgroundColor(slot)}-800`}>
                                            {!slot.isActive ? "Inactive" : slot.isOccupied ? "Occupied" : slot.isReservationPending ? "Pending" : slot.isReserved ? "Reserved" : "Available"}
                                        </span>
                                    </div>
                                    <div className="space-y-1 text-[10px]">
                                        <div className="flex justify-between items-center bg-white px-1.5 py-0.5 rounded">
                                            <span className="text-gray-600">Vehicle Number:</span>
                                            <span className="w-1/2 font-bold text-2xltext-cyan-600">{slot.reservedVehicleNumber ? `${slot.reservedVehicleNumber}` : "N/A"}</span>
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
                buttons={
                    parkingArea?.parkingSubscriptionPaymentId?.subscriptionEndDate && dayjs(parkingArea.parkingSubscriptionPaymentId.subscriptionEndDate).isAfter(dayjs()) ? ([
                        selectedSlot?.isActive ? !selectedSlot?.isOccupied && {
                            text: "Set Inactive",
                            variant: "danger",
                            icon: <FaTimes />,
                            onClick: () => handleStatusUpdate({ isActive: false, isOccupied: false })
                        } : {
                            text: "Set Active",
                            variant: "success",
                            icon: <FaCheck />,
                            onClick: () => handleStatusUpdate({ isActive: true, isOccupied: false })
                        },
                        selectedSlot?.isOccupied ? {
                            text: "Checkout",
                            variant: "success",
                            icon: <FaCheck />,
                            // onClick: () => handleStatusUpdate({ isActive: true, isReserved: false })
                            onClick: () => processParkingCheckout(selectedSlot)
                        } : selectedSlot?.isActive ? {
                            text: "set Occupied",
                            variant: "success",
                            icon: <FaClock />,
                            onClick: () => handleStatusUpdate({ isActive: true, isOccupied: true })
                        } : false,
                    ]) : []}
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
                onSubmit={handleParkingDetailsSubmit}
                title="User Details"
                loading={loading}
                initialData={userDetails}
            />
            <BankTransferPopup
                isOpen={isBankTransferPopupOpen}
                onClose={() => setIsBankTransferPopupOpen(false)}
                onSubmit={handleBankTransferSubmit}
                amount={finalAmount}
                parkingAreaId={null}
                parkingOwnerId={null}
            />
            <PaymentOptionPopup
                isOpen={isPaymentOptionPopupOpen}
                onClose={() => setIsPaymentOptionPopupOpen(false)}
                onSubmit={handlePaymentOptionSubmit}
                amount={finalAmount}

            />
            <ConfirmationPopup
                isOpen={isConfirmationPopupOpen}
                onClose={() => setIsConfirmationPopupOpen(false)}
                onConfirm={() => setIsPromptPopupOpen(true)}
                title="Confirmation"
                message="Are you sure you want to change the price?"
            />
            <PromptPopup
                isOpen={isPromptPopupOpen}
                onClose={() => setIsPromptPopupOpen(false)}
                onConfirm={handlePriceChange}
                title="Prompt"
                message="Enter the new price:"
                type="number"
                placeholder="Enter the new price"
                minValue={0}
            />
        </>
    );
};

export default ListParkingSlots;
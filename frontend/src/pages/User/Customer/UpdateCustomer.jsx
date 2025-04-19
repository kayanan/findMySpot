// src/pages/User/UpdateUser.jsx

import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import axios from "axios";
import { FaArrowLeft } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const addressSchema = {
  // line1: z.string().regex(/^[a-zA-Z0-9\s]+$/, "Invalid address format"),
  // line2: z.string().regex(/^[a-zA-Z0-9\s]*$/, "Invalid address format"),
  // city: z.string().regex(/^[a-zA-Z\s]+$/, "Invalid city format"),
  // district: z.string().regex(/^[a-zA-Z\s]+$/, "Invalid district format"),
  // province: z.string().regex(/^[a-zA-Z\s]+$/, "Invalid province format"),
  // zipCode: z.string().regex(/^[0-9]{5}$/, "Invalid ZIP code format"),
  line1: z.string().optional(),
  line2: z.string().optional(),
  city: z.string().optional(),
  district: z.string().optional(),
  province: z.string().optional(),
  zipCode: z.string().optional(),
};

const vehicleSchema = z.object({
  number: z.string().min(4, "Vehicle number is required").max(4, "Maximum 4 digits").regex(/^[a-zA-Z0-9]+$/, "Invalid vehicle number format"),
  isDefault: z.boolean(),
});

const cardDetailSchema = z.object({
  // nameOnCard: z.string().min(1, "Name on card is required").regex(/^[a-zA-Z\s]+$/, "Invalid name format"),
  // cardNumber: z.string().min(1, "Card number is required").regex(/^[0-9]{16}$/, "Invalid card number format"),
  // expiryDate: z.string().min(1, "Expiry date is required").regex(/^[0][0-9]|[1][0-2]\/[0-9]{2}$/, "Invalid expiry date format"),
  // cvv: z.string().min(3, "CVV is a 3 digit number").max(3, "Maximum 3 digits").regex(/^[0-9]{3}$/, "Invalid CVV format"),
  // isDefault: z.boolean(),
  nameOnCard: z.string().optional(),
  cardNumber: z.string().optional(),
  expiryDate: z.string().optional(),
  cvv: z.string().optional(),
  isDefault: z.boolean(),
});

const customerSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  nic: z.string().min(1, "NIC is required").regex(/^(\d{9}[V|v])|(\d{4}\s?\d{4}\s?\d{4})$/, "Invalid NIC format"),
  phoneNumber: z.string().min(1, "Phone number is required").regex(/^07[01245678][0-9]{7}$/, "Invalid phone number format"),
  email: z.string().min(1, "Email is required").email("Invalid email format"),
  address1: z.object(addressSchema),
  address2: z.object(addressSchema),
  isActive: z.boolean(),
  isPremiumCustomer: z.boolean(),
  approvalStatus: z.boolean(),
  vehicle: z.array(vehicleSchema),
  cardDetails: z.array(cardDetailSchema),
});

const UpdateCustomer = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [previewImage, setPreviewImage] = useState(null);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    reset,
    setValue,
    getValues,
  } = useForm({
    resolver: zodResolver(customerSchema),

  });
  const { fields: vehicleFields, append: appendVehicle, remove: removeVehicle } = useFieldArray({
    control,
    name: "vehicle",
  });

  const { fields: cardFields, append: appendCard, remove: removeCard } = useFieldArray({
    control,
    name: "cardDetails",
  });

  // Fetch user details when the component loads
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_APP_URL}/v1/user/profile/${id}`, {
          withCredentials: true,
        });
        const userData = { ...data.user };
        delete userData.password;
        if (userData?.phoneNumber) {
          userData.phoneNumber = userData.phoneNumber.replace(/^94/g, '0');
        }
        reset(userData);
      } catch (error) {
        console.error("Error fetching user:", error.message);
        toast.error("Failed to load user details.");
      }
    };

    fetchUser();
  }, [id, reset]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setValue("profileImage", file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleDefaultVehicleChange = (index) => {
    const currentVehicles = vehicleFields.map((_, i) => ({
      ...control._formValues.vehicle[i],
      isDefault: i === index
    }));
    setValue("vehicle", currentVehicles);
  };

  const handleDefaultCardChange = (index) => {
    const currentCards = cardFields.map((_, i) => ({
      ...control._formValues.cardDetails[i],
      isDefault: i === index
    }));
    setValue("cardDetails", currentCards);
  };
  const onSubmit = async (data) => {
    const formData = new FormData();
    const dataToSend = { _id: getValues()["_id"], ...data };
    Object.keys(dataToSend).forEach(key => {
      if (dataToSend[key] !== undefined && dataToSend[key]?.length > 0) {
        if (dataToSend[key] instanceof Array) {
          dataToSend[key].forEach((item) => {
            formData.append(key, JSON.stringify(item));
          });
        } else {
          formData.append(key, dataToSend[key]);
        }
      }
      else if (dataToSend[key] !== undefined && dataToSend[key] instanceof File) {
        formData.append(key, dataToSend[key]);
      } else if (dataToSend[key] !== undefined && dataToSend[key] instanceof Object && Object.keys(dataToSend[key]).length > 0) {
        formData.append(key, JSON.stringify(dataToSend[key]));
      }
    });
    console.log(Array.from(formData));
    try {
      await axios.patch(
        `${import.meta.env.VITE_BACKEND_ADMIN_URL}/v1/users/update/${id}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );
      toast.success("User updated successfully!");
      setTimeout(() => navigate("/user"), 3000);
    } catch (error) {
      console.error("Error updating user:", error.response?.data || error.message);
      if (error.response?.data) {
        const { message, error: errorDetail } = error.response.data;
        if (message?.toLowerCase().includes("duplicate")) {
          toast.error(errorDetail);
        } else {
          toast.error(message || "Error updating user. Please try again.");
        }
      } else {
        toast.error("Error updating user. Please try again.");
      }
    }
  };
  console.log(errors);
  return (
    <div className="min-h-screen bg-gray-50 pb-4">
      <div className="max-w-7xl mx-auto bg-white  shadow-lg overflow-hidden">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-cyan-500 to-blue-500 px-6 py-3">
          <div className="flex items-center justify-between">
            <Link to="/customer" className="flex items-center text-white hover:text-gray-100 transition duration-150">
              <FaArrowLeft className="mr-2" />
              <span>Back to Customer List</span>
            </Link>
            <h1 className="text-xl font-bold text-white">Update Customer</h1>
          </div>
        </div>

        {/* Form Section */}
        <div className="p-4">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
            {/* Personal Information Section */}
            <div className="bg-white p-3 rounded-lg border border-gray-100 shadow-sm">
              <h2 className="text-base font-semibold text-gray-800 mb-2">Personal Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                  <input
                    type="text"
                    {...register("firstName")}
                    placeholder="Enter first name"
                    required
                    className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition duration-150 ${errors.firstName ? 'border-red-500' : 'border-gray-300'
                      }`}
                  />
                  {errors.firstName && (
                    <p className="mt-1 text-xs text-red-500 flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {errors.firstName.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                  <input
                    type="text"
                    {...register("lastName")}
                    placeholder="Enter last name"
                    required
                    className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition duration-150 ${errors.lastName ? 'border-red-500' : 'border-gray-300'
                      }`}
                  />
                  {errors.lastName && (
                    <p className="mt-1 text-xs text-red-500 flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {errors.lastName.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">NIC</label>
                  <input
                    type="text"
                    {...register("nic")}
                    placeholder="Enter NIC"
                    required
                    className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition duration-150 ${errors.nic ? 'border-red-500' : 'border-gray-300'
                      }`}
                  />
                  {errors.nic && (
                    <p className="mt-1 text-xs text-red-500 flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {errors.nic.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Contact Information Section */}
            <div className="bg-white p-3 rounded-lg border border-gray-100 shadow-sm">
              <h2 className="text-base font-semibold text-gray-800 mb-2">Contact Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    {...register("email")}
                    placeholder="Enter email"
                    required
                    className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition duration-150 ${errors.email ? 'border-red-500' : 'border-gray-300'
                      }`}
                  />
                  {errors.email && (
                    <p className="mt-1 text-xs text-red-500 flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <input
                    type="text"
                    {...register("phoneNumber")}
                    placeholder="07XXXXXXXXX"
                    required
                    className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition duration-150 ${errors.phoneNumber ? 'border-red-500' : 'border-gray-300'
                      }`}
                  />
                  {errors.phoneNumber && (
                    <p className="mt-1 text-xs text-red-500 flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {errors.phoneNumber.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Address Sections */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              {/* Permanent Address Section */}
              <div className="bg-white p-3 rounded-lg border border-gray-100 shadow-sm">
                <h2 className="text-base font-semibold text-gray-800 mb-2">Permanent Address</h2>
                <div className="space-y-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address Line 1</label>
                    <input
                      type="text"
                      {...register("address1.line1")}
                      className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition duration-150 ${errors.address1?.line1 ? 'border-red-500' : 'border-gray-300'
                        }`}
                    />
                    {errors.address1?.line1 && (
                      <p className="mt-1 text-xs text-red-500 flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {errors.address1.line1.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address Line 2</label>
                    <input
                      type="text"
                      {...register("address1.line2")}
                      className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition duration-150 ${errors.address1?.line2 ? 'border-red-500' : 'border-gray-300'
                        }`}
                    />
                    {errors.address1?.line2 && (
                      <p className="mt-1 text-xs text-red-500 flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {errors.address1.line2.message}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                      <input
                        type="text"
                        {...register("address1.city")}

                        className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition duration-150 ${errors.address1?.city ? 'border-red-500' : 'border-gray-300'
                          }`}
                      />
                      {errors.address1?.city && (
                        <p className="mt-1 text-xs text-red-500 flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                          {errors.address1.city.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">District</label>
                      <input
                        type="text"
                        {...register("address1.district")}

                        className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition duration-150 ${errors.address1?.district ? 'border-red-500' : 'border-gray-300'
                          }`}
                      />
                      {errors.address1?.district && (
                        <p className="mt-1 text-xs text-red-500 flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                          {errors.address1.district.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Province</label>
                      <input
                        type="text"
                        {...register("address1.province")}

                        className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition duration-150 ${errors.address1?.province ? 'border-red-500' : 'border-gray-300'
                          }`}
                      />
                      {errors.address1?.province && (
                        <p className="mt-1 text-xs text-red-500 flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                          {errors.address1.province.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">ZIP Code</label>
                      <input
                        type="text"
                        {...register("address1.zipCode")}

                        className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition duration-150 ${errors.address1?.zipCode ? 'border-red-500' : 'border-gray-300'
                          }`}
                      />
                      {errors.address1?.zipCode && (
                        <p className="mt-1 text-xs text-red-500 flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                          {errors.address1.zipCode.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Residential Address Section */}
              <div className="bg-white p-3 rounded-lg border border-gray-100 shadow-sm">
                <h2 className="text-base font-semibold text-gray-800 mb-2">Residential Address</h2>
                <div className="space-y-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address Line 1</label>
                    <input
                      type="text"
                      {...register("address2.line1")}

                      className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition duration-150 ${errors.address2?.line1 ? 'border-red-500' : 'border-gray-300'
                        }`}
                    />
                    {errors.address2?.line1 && (
                      <p className="mt-1 text-xs text-red-500 flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {errors.address2.line1.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address Line 2</label>
                    <input
                      type="text"
                      {...register("address2.line2")}
                      className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition duration-150 ${errors.address2?.line2 ? 'border-red-500' : 'border-gray-300'
                        }`}
                    />
                    {errors.address2?.line2 && (
                      <p className="mt-1 text-xs text-red-500 flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {errors.address2.line2.message}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                      <input
                        type="text"
                        {...register("address2.city")}

                        className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition duration-150 ${errors.address2?.city ? 'border-red-500' : 'border-gray-300'
                          }`}
                      />
                      {errors.address2?.city && (
                        <p className="mt-1 text-xs text-red-500 flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                          {errors.address2.city.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">District</label>
                      <input
                        type="text"
                        {...register("address2.district")}

                        className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition duration-150 ${errors.address2?.district ? 'border-red-500' : 'border-gray-300'
                          }`}
                      />
                      {errors.address2?.district && (
                        <p className="mt-1 text-xs text-red-500 flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                          {errors.address2.district.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Province</label>
                      <input
                        type="text"
                        {...register("address2.province")}

                        className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition duration-150 ${errors.address2?.province ? 'border-red-500' : 'border-gray-300'
                          }`}
                      />
                      {errors.address2?.province && (
                        <p className="mt-1 text-xs text-red-500 flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                          {errors.address2.province.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">ZIP Code</label>
                      <input
                        type="text"
                        {...register("address2.zipCode")}

                        className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition duration-150 ${errors.address2?.zipCode ? 'border-red-500' : 'border-gray-300'
                          }`}
                      />
                      {errors.address2?.zipCode && (
                        <p className="mt-1 text-xs text-red-500 flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                          {errors.address2.zipCode.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Vehicle and Card Information */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              {/* Vehicle Information */}
              <div className="bg-white p-3 rounded-lg border border-gray-100 shadow-sm">
                <div className="flex justify-between items-center mb-2">
                  <h2 className="text-base font-semibold text-gray-800">Vehicle Information</h2>
                  <button
                    type="button"
                    onClick={() => appendVehicle({ number: "", isDefault: false })}
                    className="inline-flex items-center px-3 py-1 text-sm border border-cyan-500 text-cyan-500 rounded-lg hover:bg-cyan-50 transition duration-150"
                  >
                    <span className="mr-1">+</span> Add Vehicle
                  </button>
                </div>
                <div className="space-y-2">
                  {vehicleFields.map((field, index) => (
                    <div key={field.id} className="relative p-3 border border-gray-200 rounded-lg hover:border-cyan-300 transition-colors duration-150">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Number {index + 1}</label>
                          <input
                            type="text"
                            {...register(`vehicle.${index}.number`)}
                            placeholder="Enter vehicle number"
                            className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition duration-150 ${errors.vehicle?.[index]?.number ? 'border-red-500' : 'border-gray-300'
                              }`}
                          />
                          {errors.vehicle?.[index]?.number && (
                            <p className="mt-1 text-xs text-red-500 flex items-center">
                              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                              </svg>
                              {errors.vehicle[index].number.message}
                            </p>
                          )}
                        </div>
                        {vehicleFields.length > 1 && (
                          <button
                            type="button"
                            onClick={() => {
                              window.confirm("Are you sure you want to delete this vehicle?") && removeVehicle(index)
                            }}
                            className="ml-2 p-1 text-red-500 hover:text-red-600 transition-colors duration-150"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                          </button>
                        )}
                      </div>
                      <div className="mt-2">
                        <label className="inline-flex items-center cursor-pointer">
                          <input
                            type="radio"
                            checked={control._formValues.vehicle[index]?.isDefault}
                            onChange={() => handleDefaultVehicleChange(index)}
                            className="form-radio h-4 w-4 text-cyan-600 transition duration-150 ease-in-out"
                          />
                          <span className="ml-2 text-sm text-gray-700">Set as Default Vehicle</span>
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Card Details */}
              <div className="bg-white p-3 rounded-lg border border-gray-100 shadow-sm">
                <h2 className="text-base font-semibold text-gray-800 mb-2">Payment Information</h2>
                <div className="space-y-2">
                  {cardFields.map((field, index) => (
                    <div key={field.id} className="grid grid-cols-2 gap-2 p-2 border border-gray-100 rounded-lg">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Name on Card</label>
                        <input
                          type="text"
                          {...register(`cardDetails.${index}.nameOnCard`)}
                          placeholder="Name on Card"
                          className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition duration-150 ${errors.cardDetails?.[index]?.nameOnCard ? 'border-red-500' : 'border-gray-300'
                            }`}
                        />
                        {errors.cardDetails?.[index]?.nameOnCard && (
                          <p className="mt-1 text-xs text-red-500 flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            {errors.cardDetails[index].nameOnCard.message}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
                        <input
                          type="text"
                          {...register(`cardDetails.${index}.cardNumber`)}
                          placeholder="Card Number"
                          className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition duration-150 ${errors.cardDetails?.[index]?.cardNumber ? 'border-red-500' : 'border-gray-300'
                            }`}
                        />
                        {errors.cardDetails?.[index]?.cardNumber && (
                          <p className="mt-1 text-xs text-red-500 flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            {errors.cardDetails[index].cardNumber.message}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                        <input
                          type="text"
                          {...register(`cardDetails.${index}.expiryDate`)}
                          placeholder="MM/YY"
                          className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition duration-150 ${errors.cardDetails?.[index]?.expiryDate ? 'border-red-500' : 'border-gray-300'
                            }`}
                        />
                        {errors.cardDetails?.[index]?.expiryDate && (
                          <p className="mt-1 text-xs text-red-500 flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            {errors.cardDetails[index].expiryDate.message}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
                        <input
                          type="number"
                          {...register(`cardDetails.${index}.cvv`)}
                          placeholder="Please check your card back side"
                          maxLength="3"
                          className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition duration-150 ${errors.cardDetails?.[index]?.cvv ? 'border-red-500' : 'border-gray-300'
                            }`}
                        />
                        {errors.cardDetails?.[index]?.cvv && (
                          <p className="mt-1 text-xs text-red-500 flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            {errors.cardDetails[index].cvv.message}
                          </p>
                        )}
                      </div>
                      <div className="col-span-2 flex justify-between items-center">
                        <label className="inline-flex items-center cursor-pointer">
                          <input
                            type="radio"
                            checked={control._formValues.cardDetails[index]?.isDefault}
                            onChange={() => handleDefaultCardChange(index)}
                            className="form-radio h-4 w-4 text-cyan-600 transition duration-150 ease-in-out"
                          />
                          <span className="ml-2 text-sm text-gray-700">Default Card</span>
                        </label>
                        {cardFields.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeCard(index)}
                            className="text-red-500 hover:text-red-600 transition-colors duration-150"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => appendCard({
                      nameOnCard: "",
                      cardNumber: "",
                      expiryDate: "",
                      cvv: "",
                      isDefault: false,
                    })}
                    className="w-full mt-2 inline-flex items-center justify-center px-3 py-1.5 border border-cyan-500 text-cyan-500 rounded-lg hover:bg-cyan-50 transition duration-150"
                  >
                    <span className="mr-1">+</span> Add Card
                  </button>
                </div>
              </div>
            </div>

            {/* Status Options */}
            <div className="bg-white p-3 rounded-lg border border-gray-100 shadow-sm">
              <h2 className="text-base font-semibold text-gray-800 mb-2">Account Status</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    {...register("isActive")}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition duration-150"
                  >
                    <option value={true}>Active</option>
                    <option value={false}>Inactive</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Premium Customer</label>
                  <select
                    {...register("isPremiumCustomer")}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition duration-150"
                  >
                    <option value={true}>Yes</option>
                    <option value={false}>No</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Approval Status</label>
                  <select
                    {...register("approvalStatus")}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition duration-150"
                  >
                    <option value={true}>Approved</option>
                    <option value={false}>Pending</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Profile Image */}
            <div className="bg-white p-3 rounded-lg border border-gray-100 shadow-sm">
              <h2 className="text-base font-semibold text-gray-800 mb-2">Profile Image</h2>
              <div className="flex items-center space-x-4">
                {previewImage && (
                  <img
                    src={previewImage.startsWith('blob:') ? previewImage : `${import.meta.env.VITE_BACKEND_URL}${previewImage}`}
                    alt="Profile Preview"
                    className="w-20 h-20 rounded-full object-cover border-4 border-cyan-500"
                  />
                )}
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Upload New Image</label>
                  <input
                    type="file"
                    {...register("profileImage")}
                    onChange={handleImageUpload}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition duration-150"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center pt-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg hover:from-cyan-600 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 transform transition-all duration-150 hover:scale-105"
              >
                Update Customer
              </button>
            </div>
          </form>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default UpdateCustomer;


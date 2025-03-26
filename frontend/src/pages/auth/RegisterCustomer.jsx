import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { FaCar, FaParking, FaUserPlus, FaUser } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { useState, useEffect } from "react";
export default function CustomerRegistration() {
    const {
        register,
        handleSubmit,
        watch,
        reset,
        formState: { errors, isSubmitting },
    } = useForm();

    const password = watch("password", "");
    const [signupAs, setSignupAs] = useState(null);
    const [roles, setRoles] = useState();
    useEffect(() => {
        const fetchRoles = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_ADMIN_URL}/v1/roles`);
                if (response.data.status !== true) {
                    toast.error("Internal server error");
                } else {
                    setRoles(response.data?.roles);
                }
            } catch (error) {
                toast.error("Internal server error");
            }
        };
        fetchRoles();
    }, []);
    
    const onSubmit = async (data) => {
        delete data.confirmPassword;
        data.role = roles.find(role => role?.type === signupAs)._id;
        console.log(data);
        try {
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_APP_URL}/v1/user/signup`, data);
            toast.success("Registration successful!", {
                onClose: () => {
                    setSignupAs(null);
                    reset();
                },
                autoClose: 1500,
            });

        } catch (error) {
            toast.error(error.message || "Registration failed. Please try again.");
        }
    };

    return (
        <div className="flex min-h-screen bg-gradient-to-br from-cyan-500 to-blue-600">
            <div className="m-auto w-full max-w-2xl p-4 sm:p-8">
                {!signupAs && (
                    <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-xl p-8 max-w-md mx-auto">
                        <div className="flex flex-col items-center justify-center space-y-6 mb-6">
                            <div className="flex items-center space-x-3 mb-2">
                                <FaUserPlus className="text-3xl text-cyan-500" />
                                <h2 className="text-2xl font-bold text-cyan-700">Sign up as</h2>
                            </div>
                            <p className="text-gray-600 text-center text-lg font-bold mb-6">Choose your account type to get started</p>
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full">
                                <button
                                    onClick={() => setSignupAs("CUSTOMER")}
                                    className="w-full sm:w-48 bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-4 rounded-lg shadow-md transition duration-200 flex items-center justify-center space-x-2 min-h-[100px]"
                                >
                                    <FaUser className="text-2xl" />
                                    <span className="text-lg">Customer</span>
                                </button>
                                <button
                                    onClick={() => setSignupAs("PARKING_OWNER")}
                                    className="w-full sm:w-48 bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-4 rounded-lg shadow-md transition duration-200 flex items-center justify-center space-x-2 min-h-[100px]"
                                >
                                    <FaParking className="text-2xl" />
                                    <span className="text-lg">Parking Owner</span>
                                </button>
                            </div>
                        </div>
                        <Link to="/" className="block text-center text-gray-600 rounded-lg p-2 hover:text-gray-800">
                            Already have an account? <span className="text-cyan-500">Sign in here</span>
                        </Link>
                    </div>
                )}
                {signupAs && (<div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-lg">
                    <div className="p-4">
                        <div className="flex items-center justify-center mb-2 space-x-4">
                            <FaParking className="h-10 w-10 text-cyan-600" />
                            <FaCar className="h-8 w-8 text-cyan-500" />
                        </div>
                        <h2 className="text-2xl font-bold text-center text-cyan-700">
                            Find My Spot
                        </h2>
                        <h2 className="text-2xl font-bold text-center text-cyan-700 mb-2">
                            {`${signupAs?.split("_").join(" ").charAt(0).toUpperCase() + signupAs?.split("_").join(" ").slice(1).toLowerCase()} Registration`}
                        </h2>
                        <p className="text-center text-gray-500">
                            Register to find your perfect parking spot
                        </p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="p-4 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                                <input
                                    type="text"
                                    {...register("firstName", { required: "First name is required" })}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
                                    placeholder="Enter your first name"
                                />
                                {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName.message}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                                <input
                                    type="text"
                                    {...register("lastName", { required: "Last name is required" })}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
                                    placeholder="Enter your last name"
                                />
                                {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName.message}</p>}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">NIC</label>
                                <input
                                    type="text"
                                    {...register("nic", {
                                        required: "NIC is required", pattern: {
                                            value: /^([0-9]{9}[vVxX]|[0-9]{12})$/,
                                            message: "Please enter a valid  NIC number"
                                        }
                                    })}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
                                    placeholder="Enter your NIC"
                                />
                                {errors.nic && <p className="text-red-500 text-sm mt-1">{errors.nic.message}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Mobile</label>
                                <input

                                    type="tel"
                                    {...register("phoneNumber", {
                                        required: "Mobile number is required",
                                        pattern: {
                                            value: /^[0-9]{10}$/,
                                            message: "Please enter a valid 10-digit mobile number"
                                        }
                                    })}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
                                    placeholder="Eg: 0712345678"
                                />
                                {errors.phoneNumber && <p className="text-red-500 text-sm mt-1">{errors.phoneNumber.message}</p>}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                            <input
                                type="email"
                                {...register("email", {
                                    required: "Email is required",
                                    pattern: {
                                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                        message: "Please enter a valid email address"
                                    }
                                })}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
                                placeholder="Enter your email"
                            />
                            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                                <input
                                    type="password"
                                    {...register("password", {
                                        required: "Password is required",
                                        pattern: {
                                            value: /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$/,
                                            message: "Password must be at least 8 characters and contain an uppercase letter, lowercase letter, and number"
                                        }
                                    })}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
                                    placeholder="Enter your password"
                                />
                                {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                                <input
                                    type="password"
                                    {...register("confirmPassword", {
                                        required: "Please confirm your password",
                                        validate: value => value === password || "Passwords do not match"
                                    })}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
                                    placeholder="Confirm your password"
                                />
                                {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>}
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full p-3 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg transition-all duration-200"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Registering..." : "Register"}
                        </button>

                        <Link to="/" className="block text-center text-gray-600 rounded-lg p-2 hover:text-gray-800">
                            Already have an account? <span className="text-cyan-500">Sign in here</span>
                        </Link>
                    </form>
                </div>)}

                <div className="mt-4 text-center text-white text-sm">
                    <p>
                        Need help? Contact support at{" "}
                        <a
                            href="mailto:support@findmyspot.com"
                            className="underline text-cyan-300 hover:text-cyan-400"
                        >
                            support@findmyspot.com
                        </a>
                    </p>
                </div>
            </div>
            <ToastContainer />
        </div>
    );
}

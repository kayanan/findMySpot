// src/pages/auth/Login.jsx

import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";
import { FaCar, FaParking } from "react-icons/fa";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Login = () => {
  const { login } = useAuth();
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error,setError]= useState();
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordPattern = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$/;

  const handleChange = (e) => {
    setCredentials((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    setError(prev=>{
      return {
        ...prev, [e.target.name]:""
      }
    })
  };
const validateInput=()=>{
  const newError={}
  if(credentials.username===""){
    newError.username="Email Is Required"
  }
  else if(!credentials.username.match(emailPattern)){
    newError.username="Must Be a Valid Email Address (example@example.com)"
    
  }
  if(credentials.password===""){
    newError.password="Password Is Required"
  }
  else if(!credentials.password.match(passwordPattern)){
    newError.password="Must Be a Valid Pasword (At least 8 characters and contain an uppercase letter, lowercase letter, and number)"
    
  }
  if(Object.keys(newError).length>0){
    console.log(newError)
    setError(newError)
    return false
  }
  else{
    return true
  }
  
  }



  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!validateInput()){
        return
    }
    setIsLoading(true);
  
    // Re fetch actual email from DOM 
    const realEmail = document.getElementById("email").value.trim();
    if (realEmail && realEmail !== credentials.username) {
      setCredentials(prev => ({ ...prev, username: realEmail }));
    }
  
    // attempt login
    try {
      await login(credentials);
      toast.success("Login successful!", {
        position: "top-center",
        autoClose: 3000,
      });
    } catch (error) {
      console.log(error)
      if (error.response) {
        // inactive
        if (error.response.status === 403) {
          toast.error(error.response.data.message, {
            position: "top-center",
            autoClose: 3000,
          });
        }
        // email not found
        else if (error.response.status === 404) {
          toast.error("Invalid email", {
            position: "top-center",
            autoClose: 3000,
          });
        }
        // wrong password
        else if (error.response.status === 401) {
          toast.error("Invalid credentials", {
            position: "top-center",
            autoClose: 3000,
          });
        } else {
          // other server error
          toast.error(
            error.response.data.message || "Server error",
            { position: "top-center", autoClose: 3000 }
          );
        }
      } else {
        // network / client‑side
        console.log(error,"error");
        toast.error(error.message || "Network error", {
          position: "top-center",
          autoClose: 3000,
        });
      }
    } finally {
      setIsLoading(false);
    }    
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-cyan-500 to-blue-600">
      <div className="m-auto w-full max-w-md p-4 sm:p-8">
        <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-lg">
          <div className="p-4">
            <div className="flex items-center justify-center mb-2 space-x-4">
              <FaParking className="h-10 w-10 text-cyan-600" />
              <FaCar className="h-8 w-8 text-cyan-500" />
            </div>
            <h2 className="text-2xl font-bold text-center text-cyan-700">
              Find My Spot
            </h2>
            <p className="text-center text-gray-500">
              Sign in to manage and book your parking spot
            </p>
          </div>
          <form onSubmit={handleSubmit} className="p-4 space-y-6">
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                id="email"
                name="username"
                type="email"
                placeholder="Enter your email"
                value={credentials.username}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
              />
              {error?.username &&(<p className="pl-1 block text-sm font-medium text-red-500">*{error.username}</p>)}
            </div>
            <div className="space-y-2">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={credentials.password}
                  onChange={handleChange}
                  className="w-full p-3 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <FaEye className="h-5 w-5" />
                  ) : (
                    <FaEyeSlash className="h-5 w-5" />
                  )}
                </button>
                {error?.password && (<p className=" pl-1 block text-sm font-medium text-red-500">*{error.password}</p>)}
              </div>
            </div>
            <button
              type="submit"
              className="w-full p-3 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg transition-all duration-200"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign in to Dashboard"}
            </button>
            <div className="space-y-2">
              <Link to="/customer/register" className="block text-gray-600 rounded-lg p-2 hover:text-gray-800 text-center">
                Don&apos;t have an account? <span className="text-cyan-500">Register here</span>
              </Link>
              <Link to="/forgot-password" className="block text-gray-600 rounded-lg p-2 hover:text-gray-800 text-center">
                <span className="text-cyan-500">Forgot Password?</span>
              </Link>
            </div>
          </form>
        </div>
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
};

export default Login;

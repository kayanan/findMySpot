// import { useEffect, useState } from "react";
// import { Link, useNavigate,useLocation } from "react-router-dom";
// import axios from "axios";
// import { EyeIcon, PencilAltIcon, GlobeAltIcon } from "@heroicons/react/outline";
// import ToggleGroup from "../../../utils/ToggleGroup";
// import {statusOptions} from "../../../utils/DropdownOptions"

// const CityList = ({ District,Province }) => {
//   const location = useLocation();
//         const state = location.state || {};
//   const navigate = useNavigate();
//   const [Cities, setCities] = useState([]);
//   const [status, setStatus] = useState(state?.status||"active");
//   const [searchTerm, setSearchTerm] = useState("");
//   const [loading, setLoading] = useState(true);
//   const [currentPage, setCurrentPage] = useState(1);
//   const CitiesPerPage = 10;

//   useEffect(() => {
//     const fetchDistricts = async () => {
//       setLoading(true);
//       try {
//         const { data } = await axios.get(
//           `${import.meta.env.VITE_BACKEND_APP_URL}/city`,
//           { withCredentials: true }
//         );
//         setCities(data.cities);
//       } catch (error) {
//         console.error("Error fetching Cities:", error.message);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchDistricts();
//   }, []);

//   const filteredCities = Cities.filter(
//     (city) =>
//       city.status === status &&
//       (searchTerm
//         ? city.name?.toLowerCase().includes(searchTerm.toLowerCase())
//         : true) && city.districtId==District._id
//   );
//   const indexOfLastCity = currentPage * CitiesPerPage;
//   const indexOfFirstCity = indexOfLastCity - CitiesPerPage;
//   const currentCity = filteredCities.slice(
//     indexOfFirstCity,
//     indexOfLastCity
//   );
//   const totalPages = Math.ceil(filteredCities.length / CitiesPerPage);

//   return (
//     <div className="p-4 max-w-7xl mx-auto">
//       <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
//         <h1 className="text-2xl sm:text-3xl font-bold text-cyan-500">
//           Districts
//         </h1>
//         <div className="flex items-center gap-3 w-full sm:w-auto">
//           <input
//             type="text"
//             placeholder="Search Cities..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className="w-full sm:w-64 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-cyan-500"
//           />
//           <ToggleGroup  value={status} setValue={setStatus} values={statusOptions}/>
//         </div>
//         <button
//           onClick={() =>
//             navigate("/city/add", {
//               state: { District: District, Province:Province,status},
//             })
//           }
//           className="bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-2 rounded-md shadow-md transition w-full sm:w-auto"
//         >
//           Add City
//         </button>
//       </div>

//       {loading ? (
//         <div className="flex justify-center items-center h-40">
//           <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-cyan-500"></div>
//         </div>
//       ) : (
//         <div className="bg-white rounded-lg shadow-md overflow-x-auto">
//           <table className="w-full table-auto text-sm">
//             <thead>
//               <tr className="bg-gray-100 text-gray-700">
//                 <th className="py-3 px-4 font-semibold">Icon</th>
//                 <th className="py-3 px-4 font-semibold">Name</th>
//                 <th className="py-3 px-4 font-semibold text-center">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {currentCity.map((city) => (
//                 <tr key={city._id} className="border-t hover:bg-cyan-50">
//                   <td className="py-3 px-4 flex justify-center items-center">
//                     <GlobeAltIcon className="h-8 w-8 text-cyan-600" />
//                   </td>
//                   <td className="py-3 px-4">{city.name}</td>
//                   <td className="py-3 px-4 flex justify-center space-x-2">
//                     <Link
//                       to={`/city/view/${city._id}`}
//                       state={{ City: city,District ,Province ,status}}
//                       className="bg-gray-400 hover:bg-gray-600 text-white px-3 py-2 rounded-full"
//                     >
//                       <EyeIcon className="h-5 w-5" />
//                     </Link>
//                     <button
//                       onClick={() =>
//                         navigate(`/city/update/${city._id}`, {
//                           state: { City: city,District,Province ,status},
//                         })
//                       }
//                       className="bg-cyan-500 hover:bg-cyan-600 text-white px-3 py-2 rounded-full"
//                     >
//                       <PencilAltIcon className="h-5 w-5" />
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//           {totalPages > 1 && (
//             <div className="flex justify-center mt-4 space-x-4">
//               <button
//                 disabled={currentPage === 1}
//                 onClick={() => setCurrentPage(currentPage - 1)}
//                 className="w-24 px-4 py-2 mb-6 bg-gray-300 hover:bg-gray-600 rounded-md text-center"
//               >
//                 Previous
//               </button>
//               <button
//                 disabled={currentPage === totalPages}
//                 onClick={() => setCurrentPage(currentPage + 1)}
//                 className="w-24 px-4 py-2 mb-6 bg-gray-300 hover:bg-gray-600 rounded-md text-center"
//               >
//                 Next
//               </button>
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// export default CityList;

import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import {
  EyeIcon,
  PencilAltIcon,
  GlobeAltIcon,
  TrashIcon,
} from "@heroicons/react/outline";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ToggleGroup from "../../../utils/ToggleGroup";
import { statusOptions } from "../../../utils/DropdownOptions";

const CityList = ({ District, Province }) => {
  const location = useLocation();
  const state = location.state || {};
  const navigate = useNavigate();
  const [cities, setCities] = useState([]);
  const [status, setStatus] = useState(state?.status || "active");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const citiesPerPage = 10;
  const [deleted, setDeleted] = useState(false);

  useEffect(() => {
    const fetchCities = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_BACKEND_APP_URL}/city`,
          { withCredentials: true }
        );
        setCities(data.cities);
      } catch (error) {
        console.error("Error fetching Cities:", error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCities();
  }, [deleted]);

  const handleDelete = async (id) => {
    try {
      if (!window.confirm("Are you sure you want to delete this city?")) {
        return;
      }
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_ADMIN_URL}/city/${id}`,
        { withCredentials: true }
      );
      toast.error("City deleted!");
      setDeleted((prev) => !prev);
    } catch (error) {
      toast.error("Error deleting city. Please try again.");
    }
  };

  const filteredCities = cities.filter(
    (city) =>
      city.status === status &&
      (searchTerm
        ? city.name?.toLowerCase().includes(searchTerm.toLowerCase())
        : true) &&
      city.districtId === District._id
  );

  const handleActiveReactive = async (city) => {
    if (
      !window.confirm(
        `Are you sure you want to ${
          city.status === "active" ? "deactivate" : "activate"
        } this city?`
      )
    )
      return;
    try {
      
      let updatedData = {
        ...city,
        status: city.status === "active" ? "inactive" : "active",
      };
      await axios.put(
        `${import.meta.env.VITE_BACKEND_ADMIN_URL}/city/${city._id}`,
        updatedData,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      if(city.status === "active"){
        toast.error("City deactivated!");
     }
     else{
       toast.success("City activated!");
     }
      setDeleted((prev) => !prev);
    } catch (error) {
      toast.error("Error updating district status. Please try again.");
    }
  };

  const indexOfLastCity = currentPage * citiesPerPage;
  const indexOfFirstCity = indexOfLastCity - citiesPerPage;
  const currentCities = filteredCities.slice(indexOfFirstCity, indexOfLastCity);
  const totalPages = Math.ceil(filteredCities.length / citiesPerPage);

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <div
        className={`flex flex-col sm:flex-row justify-between items-center mb-6 gap-4 ${
          !(status === "active") ? "pr-96" : ""
        }`}
      >
        <h1 className="text-2xl sm:text-3xl font-bold text-cyan-500">Cities</h1>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <input
            type="text"
            placeholder="Search Cities..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-64 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-cyan-500"
          />
          <ToggleGroup
            value={status}
            setValue={setStatus}
            values={statusOptions}
          />
        </div>
        {Province.status==="active" && District.status==="active" &&status === "active" && (
          <button
            onClick={() =>
              navigate("/city/add", { state: { District, Province, status } })
            }
            className="bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-2 rounded-md shadow-md transition w-full sm:w-auto"
          >
            Add City
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-cyan-500"></div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-x-auto">
          <table className="w-full table-auto text-sm">
            <thead>
              <tr className="bg-gray-100 text-gray-700">
                <th className="py-3 px-4 font-semibold">#</th>
                <th className="py-3 px-4 font-semibold">Name</th>
                <th className="py-3 px-4 font-semibold text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentCities.map((city,index) => (
                <tr key={city._id} className="border-t hover:bg-cyan-50">
                  <td className="py-3 px-4 flex justify-center items-center">
                   {index+1}
                  </td>
                  <td className="py-3 px-4">{city.name}</td>
                  <td className="py-3 px-4 flex justify-center gap-2 space-x-2">
                    <Link
                      to={`/city/view/${city._id}`}
                      state={{ City: city, District, Province, status }}
                      className="bg-gray-400 hover:bg-gray-600 text-white px-3 py-2 rounded-full"
                    >
                      <EyeIcon className="h-5 w-5" />
                    </Link>
                    {status === "active" && (
                      <button
                        onClick={() =>
                          navigate(`/city/update/${city._id}`, {
                            state: { City: city, District, Province, status },
                          })
                        }
                        className="bg-cyan-500 hover:bg-cyan-600 text-white px-3 py-2 rounded-full"
                      >
                        <PencilAltIcon className="h-5 w-5" />
                      </button>
                    )}
                    
                    {Province.status==="active" && District.status==="active"&&(<button
                      onClick={() => handleActiveReactive(city)}
                      className={`px-4 py-2 rounded-md font-semibold ${
                        city.status === "active"
                          ? "bg-gray-300 hover:bg-gray-600"
                          : "bg-green-500 text-white hover:bg-green-600"
                      } `}
                    >
                      {city.status === "active" ? "Deactivate" : "Activate"}
                    </button>)}
                    {status === "active" && (
                      <button
                        onClick={() => handleDelete(city._id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-full"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {totalPages > 1 && (
            <div className="flex justify-center mt-4 space-x-4">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
                className="w-24 px-4 py-2 mb-6 bg-gray-300 hover:bg-gray-600 rounded-md text-center"
              >
                Previous
              </button>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
                className="w-24 px-4 py-2 mb-6 bg-gray-300 hover:bg-gray-600 rounded-md text-center"
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}
      <ToastContainer />
    </div>
  );
};

export default CityList;

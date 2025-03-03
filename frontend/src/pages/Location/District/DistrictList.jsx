// import { Menu } from "@headlessui/react";
// import { useEffect, useState } from "react";
// import { Link, useNavigate,useLocation } from "react-router-dom";
// import axios from "axios";
// import { EyeIcon, PencilAltIcon, GlobeAltIcon } from "@heroicons/react/outline";
// import ToggleGroup from "../../../utils/ToggleGroup";
// import {statusOptions} from "../../../utils/DropdownOptions"

// const DistrictList = ({ Province }) => {
//   const navigate = useNavigate();
//   const location = useLocation();
//       const state = location.state || {};
//   const [districts, setDistricts] = useState([]);
//   const [status, setStatus] = useState(state?.status||"active");
//   const [searchTerm, setSearchTerm] = useState("");
//   const [loading, setLoading] = useState(true);
//   const [currentPage, setCurrentPage] = useState(1);
//   const districtsPerPage = 10;

//   useEffect(() => {
//     const fetchDistricts = async () => {
//       setLoading(true);
//       try {
//         const { data } = await axios.get(
//           `${import.meta.env.VITE_BACKEND_APP_URL}/district`,
//           { withCredentials: true }
//         );
//         setDistricts(data.districts);
//       } catch (error) {
//         console.error("Error fetching districts:", error.message);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchDistricts();
//   }, []);

//   const filteredDistricts = districts.filter(
//     (district) =>
//       district.status === status &&
//       (searchTerm
//         ? district.name?.toLowerCase().includes(searchTerm.toLowerCase())
//         : true) && district.provinceId===Province._id
//   );

//   const indexOfLastDistrict = currentPage * districtsPerPage;
//   const indexOfFirstDistrict = indexOfLastDistrict - districtsPerPage;
//   const currentDistricts = filteredDistricts.slice(
//     indexOfFirstDistrict,
//     indexOfLastDistrict
//   );
//   const totalPages = Math.ceil(filteredDistricts.length / districtsPerPage);

//   return (
//     <div className="p-4 max-w-7xl mx-auto">
//       <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
//         <h1 className="text-2xl sm:text-3xl font-bold text-cyan-500">
//           Districts
//         </h1>
//         <div className="flex  items-center gap-3 w-full sm:w-auto">
//           <input
//             type="text"
//             placeholder="Search districts..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className="w-full sm:w-64 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-cyan-500"
//           />
//           <ToggleGroup  value={status} setValue={setStatus} values={statusOptions}/>
//         </div>
//         <button
//           onClick={() =>
//             navigate("/district/add", {
//               state: { Province ,status}
//             })
//           }
//           className="bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-2 rounded-md shadow-md transition w-full sm:w-auto"
//         >
//           Add District
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
//               {currentDistricts.map((district) => (
//                 <tr key={district._id} className="border-t hover:bg-cyan-50">
//                   <td className="py-3 px-4 flex justify-center items-center">
//                     <GlobeAltIcon className="h-8 w-8 text-cyan-600" />
//                   </td>
//                   <td className="py-3 px-4">{district.name}</td>
//                   <td className="py-3 px-4 flex justify-center space-x-2">
//                     <Link
//                       to={`/district/view/${district._id}`}
//                       state={{ District: district,Province ,status }}
//                       className="bg-gray-400 hover:bg-gray-600 text-white px-3 py-2 rounded-full"
//                     >
//                       <EyeIcon className="h-5 w-5" />
//                     </Link>
//                     <button
//                       onClick={() =>
//                         navigate(`/district/update/${district._id}`, {
//                           state: { District: district,Province ,status},
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

// export default DistrictList;

import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import {
  EyeIcon,
  PencilAltIcon,
  
  TrashIcon,
} from "@heroicons/react/outline";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ToggleGroup from "../../../utils/ToggleGroup";
import { statusOptions } from "../../../utils/DropdownOptions";

const DistrictList = ({ Province }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state || {};
  const [districts, setDistricts] = useState([]);
  const [status, setStatus] = useState(state?.status || "active");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [deleted, setDeleted] = useState(false);
  const districtsPerPage = 10;

  useEffect(() => {
    const fetchDistricts = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_BACKEND_APP_URL}/district`,
          { withCredentials: true }
        );
        setDistricts(data.districts);
      } catch (error) {
        console.error("Error fetching districts:", error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchDistricts();
  }, [deleted]);

  const handleDelete = async (id) => {
    try {
      if (!window.confirm("Are you sure you want to delete this item?")) return;
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_ADMIN_URL}/district/${id}`,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      toast.error("District deleted!");
      setTimeout(() => navigate("/district", { state: { status } }), 300);
      setDeleted((prev) => !prev);
    } catch (error) {
      toast.error("Error deleting District. Please try again.");
    }
  };

  const handleActiveReactive = async (district) => {
    if (
      !window.confirm(
        `Are you sure you want to ${
          district.status === "active" ? "deactivate" : "activate"
        } this district?`
      )
    )
      return;
    try {
      
      let updatedData = {
        ...district,
        status: district.status === "active" ? "inactive" : "active",
      };
      await axios.put(
        `${import.meta.env.VITE_BACKEND_ADMIN_URL}/district/${district._id}`,
        updatedData,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      if(district.status === "active"){
        toast.error("District deactivated!");
     }
     else{
       toast.success("District activated!");
     }
      setDeleted((prev) => !prev);
    } catch (error) {
      toast.error("Error updating district status. Please try again.");
    }
  };

  const filteredDistricts = districts.filter(
    (district) =>
      district.status === status &&
      (searchTerm
        ? district.name?.toLowerCase().includes(searchTerm.toLowerCase())
        : true) &&
      district.provinceId === Province._id
  );

  const indexOfLastDistrict = currentPage * districtsPerPage;
  const indexOfFirstDistrict = indexOfLastDistrict - districtsPerPage;
  const currentDistricts = filteredDistricts.slice(
    indexOfFirstDistrict,
    indexOfLastDistrict
  );
  const totalPages = Math.ceil(filteredDistricts.length / districtsPerPage);

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <div
        className={`flex flex-col sm:flex-row justify-between items-center mb-6 gap-4 ${
          !(status === "active") ? "pr-96" : ""
        }`}
      >
        <h1 className="text-2xl sm:text-3xl font-bold text-cyan-500">
          Districts
        </h1>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <input
            type="text"
            placeholder="Search districts..."
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
        {Province.status==="active" &&status === "active" && (
          <button
            onClick={() =>
              navigate("/district/add", { state: { Province, status } })
            }
            className="bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-2 rounded-md shadow-md transition w-full sm:w-auto"
          >
            Add District
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
              {currentDistricts.map((district,index) => (
                <tr key={district._id} className="border-t hover:bg-cyan-50">
                  <td className="py-3 px-4 flex justify-center items-center">
                  {index+1}
                  </td>
                  <td className="py-3 px-4">{district.name}</td>
                  <td className="py-3 px-4 flex justify-center  gap-2 space-x-2">
                    <Link
                      to={`/district/view/${district._id}`}
                      state={{ District: district, Province, status }}
                      className="bg-gray-400 hover:bg-gray-600 text-white px-3 py-2 rounded-full"
                    >
                      <EyeIcon className="h-5 w-5" />
                    </Link>
                    {status === "active" && (
                      <button
                        onClick={() =>
                          navigate(`/district/update/${district._id}`, {
                            state: { District: district, Province, status },
                          })
                        }
                        className="bg-cyan-500 hover:bg-cyan-600 text-white px-3 py-2 rounded-full"
                      >
                        <PencilAltIcon className="h-5 w-5" />
                      </button>
                    )}
                    {Province.status==="active" &&(<button
                      onClick={() => handleActiveReactive(district)}
                      className={`px-4 py-2 rounded-md font-semibold ${
                        district.status === "active"
                          ? "bg-gray-300 hover:bg-gray-600"
                          : "bg-green-500 text-white hover:bg-green-600"
                      } `}
                    >
                      {district.status === "active" ? "Deactivate" : "Activate"}
                    </button>)}
                    {status === "active" && (
                      <button
                        onClick={() => {
                          handleDelete(district._id);
                        }}
                        className="bg-red-500 hover:bg-red-700 text-white px-3 py-2 rounded-full"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <ToastContainer />
    </div>
  );
};

export default DistrictList;

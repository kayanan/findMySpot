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

const ProvinceList = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state || {};
  const [provinces, setProvinces] = useState([]);
  const [status, setStatus] = useState(state?.status || "active");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const provincesPerPage = 10;
  const [deleted, setDeleted] = useState(true);

  useEffect(() => {
    const fetchProvinces = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_BACKEND_APP_URL}/province`,
          { withCredentials: true }
        );
        setProvinces(data.provinces);
      } catch (error) {
        console.error("Error fetching provinces:", error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProvinces();
  }, [deleted]);

  const handleDelete = async (id) => {
    try {
      if (!window.confirm("Are you sure you want to delete this item?")) {
        return;
      }

      await axios.delete(
        `${import.meta.env.VITE_BACKEND_ADMIN_URL}/province/${id}`,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      toast.error("Province deleted!");
      setTimeout(() => navigate("/province", { state: { status } }), 300);
      setDeleted((prev) => !prev);
    } catch (error) {
      toast.error("Error adding Province. Please try again.");
    }
  };

  const handleActiveReactive = async (province) => {
    if (
      !window.confirm(
        `Are you sure you want to ${
          province.status === "active" ? "deactivate" : "activate"
        } this province?`
      )
    ) {
      return;
    }
    try {
      
      let data = {};
      if (province.status === "active") {
        data = { ...province, status: "inactive" };
      } else {
        data = { ...province, status: "active" };
      }

      await axios.put(
        `${import.meta.env.VITE_BACKEND_ADMIN_URL}/province/${province._id}`,
        data,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      if(province.status === "active"){
         toast.error("Province deactivated!");
      }
      else{
        toast.success("Province activated!");
      }
     
      setTimeout(() => navigate("/province", { state: { status } }), 300);
      setDeleted((prev) => !prev);
    } catch (error) {
      toast.error("Error updating Province. Please try again.");
    }
  };

  const filteredProvinces = provinces.filter(
    (province) =>
      province.status === status &&
      (searchTerm
        ? province.name?.toLowerCase().includes(searchTerm.toLowerCase())
        : true)
  );

  const indexOfLastProvince = currentPage * provincesPerPage;
  const indexOfFirstProvince = indexOfLastProvince - provincesPerPage;
  const currentProvinces = filteredProvinces.slice(
    indexOfFirstProvince,
    indexOfLastProvince
  );
  const totalPages = Math.ceil(filteredProvinces.length / provincesPerPage);

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <div
        className={`flex flex-col sm:flex-row justify-between items-center mb-6 gap-4 ${
          !(status === "active") ? "pr-96" : ""
        }`}
      >
        <h1 className="text-2xl sm:text-3xl font-bold text-cyan-500">
          Provinces
        </h1>
        <div className={`flex items-center gap-3 w-full sm:w-auto`}>
          <input
            type="text"
            placeholder="Search provinces..."
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
        {status === "active" && (
          <button
            onClick={() => navigate("/province/add", { state: { status } })}
            className="bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-2 rounded-md shadow-md transition w-full sm:w-auto"
          >
            Add Province
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
              {currentProvinces.map((province,index) => (
                <tr key={province._id} className="border-t hover:bg-cyan-50">
                  <td className="py-3 px-4 flex justify-center items-center">
                  {index+1}
                  </td>
                  <td className="py-3 px-4">{province.name}</td>
                  <td className="py-3 px-4 flex justify-center  gap-2 space-x-2">
                    <Link
                      to={`/province/view/${province._id}`}
                      state={{ Province: province, status }}
                      className="bg-gray-400 hover:bg-gray-600 text-white px-3 py-2 rounded-full"
                    >
                      <EyeIcon className="h-5 w-5" />
                    </Link>
                    {status === "active" && (
                      <button
                        onClick={() =>
                          navigate(`/province/update/${province._id}`, {
                            state: { Province: province, status },
                          })
                        }
                        className="bg-cyan-500 hover:bg-cyan-600 text-white px-3 py-2 rounded-full"
                      >
                        <PencilAltIcon className="h-5 w-5" />
                      </button>
                    )}
                    

                    <button
                      onClick={() => {
                        handleActiveReactive(province);
                      }}
                      className={`px-4 py-2 rounded-md font-semibold transition-colors duration-200 ${
                        (province.status === "active")
                          ? "bg-gray-300 hover:bg-gray-600"
                          : "bg-green-500 text-white hover:bg-green-600"
                      }`}
                    >
                      {province.status === "active"
                        ? " Deactive"
                        : "Activate"}
                    </button>
                    {status === "active" && (
                      <button
                        onClick={() => {
                          handleDelete(province._id);
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

export default ProvinceList;

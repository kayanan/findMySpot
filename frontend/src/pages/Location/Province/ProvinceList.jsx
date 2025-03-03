import { Menu } from "@headlessui/react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { EyeIcon, PencilAltIcon, GlobeAltIcon,TrashIcon } from "@heroicons/react/outline";

const Dropdown = ({ label, options, filterName, selectedValue, onChange }) => (
  <Menu as="div" className="relative inline-block text-left w-full">
    <Menu.Button className="w-full p-2 border border-gray-300 rounded bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500">
      {selectedValue ? options.find((option) => option.value === selectedValue)?.label || label : label}
    </Menu.Button>
    <Menu.Items className="absolute mt-2 w-full bg-white border border-gray-200 rounded shadow-lg z-10">
      {options.map((option) => (
        <Menu.Item key={option.value}>
          {({ active }) => (
            <div
              onClick={() => onChange(filterName, option.value)}
              className={`cursor-pointer px-4 py-2 ${active ? "bg-cyan-500 text-white" : "text-gray-700"}`}
            >
              {option.label}
            </div>
          )}
        </Menu.Item>
      ))}
    </Menu.Items>
  </Menu>
);

const ProvinceList = () => {
  const navigate = useNavigate();
  const [provinces, setProvinces] = useState([]);
  const [status, setStatus] = useState("active");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const provincesPerPage = 5;

  useEffect(() => {
    const fetchProvinces = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/province`, { withCredentials: true });
        setProvinces(data.provinces);
      } catch (error) {
        console.error("Error fetching provinces:", error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProvinces();
  }, []);

  // const handleDelete = async (e) => {
  //   e.preventDefault();

  //   if (Object.values(errors).some((error) => error)) {
  //     toast.error("Please fix validation errors before submitting.");
  //     return;
  //   }
  //   try {
      
  //     await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/admin/province`, formData, {
  //       headers: { "Content-Type": "application/json" },
  //       withCredentials: true,
  //     });
  //     toast.success("Province added successfully!");
  //     setTimeout(() => navigate("/province"), 300);
  //   } catch (error) {
  //     toast.error("Error adding Province. Please try again.");
  //   }
  // };


  const filteredProvinces = provinces.filter((province) =>
    province.status === status && (searchTerm ? province.name?.toLowerCase().includes(searchTerm.toLowerCase()) : true)
  );

  const indexOfLastProvince = currentPage * provincesPerPage;
  const indexOfFirstProvince = indexOfLastProvince - provincesPerPage;
  const currentProvinces = filteredProvinces.slice(indexOfFirstProvince, indexOfLastProvince);
  const totalPages = Math.ceil(filteredProvinces.length / provincesPerPage);

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-cyan-500">Provinces</h1>
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <input
            type="text"
            placeholder="Search provinces..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-64 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-cyan-500"
          />
          <Dropdown
            label="Status"
            filterName="status"
            selectedValue={status}
            options={[{ value: "active", label: "Active" }, { value: "inactive", label: "Inactive" }]}
            onChange={(filterName, value) => setStatus(value)}
          />
        </div>
        <button
          onClick={() => navigate("/province/add")}
          className="bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-2 rounded-md shadow-md transition w-full sm:w-auto"
        >
          Add Province
        </button>
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
                <th className="py-3 px-4 font-semibold">Icon</th>
                <th className="py-3 px-4 font-semibold">Name</th>
                <th className="py-3 px-4 font-semibold text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentProvinces.map((province) => (
                <tr key={province._id} className="border-t hover:bg-cyan-50">
                  <td className="py-3 px-4 flex justify-center items-center">
                    <GlobeAltIcon className="h-8 w-8 text-cyan-600" />
                  </td>
                  <td className="py-3 px-4">{province.name}</td>
                  <td className="py-3 px-4 flex justify-center space-x-2">
                    <Link
                      to={`/province/view/${province._id}`}
                      state= {{ Province: province }}
                      className="bg-gray-400 hover:bg-gray-600 text-white px-3 py-2 rounded-full"
                    >
                      <EyeIcon className="h-5 w-5" />
                    </Link>
                    <button
                      onClick={() => navigate(`/province/update/${province._id}`,{
                        state: { Province: province },
                      })}
                      className="bg-cyan-500 hover:bg-cyan-600 text-white px-3 py-2 rounded-full"
                    >
                      <PencilAltIcon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => navigate(`/province/update/${province._id}`,{
                        state: { Province: province },
                      })}
                      className="bg-red-500 hover:bg-cyan-600 text-white px-3 py-2 rounded-full"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
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
    </div>
  );
};

export default ProvinceList;

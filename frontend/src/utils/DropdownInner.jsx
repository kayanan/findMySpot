// // src/utils/Dropdown.jsx
// // src/utils/Dropdown.jsx

// import PropTypes from "prop-types";

// const Dropdown = ({ label, name, options, formData, setFormData, errors, setErrors, defaultValue }) => {
//   if (!formData[name] && defaultValue) {
//     setFormData((prev) => ({ ...prev, [name]: defaultValue }));
//   }

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//     setErrors({ ...errors, [name]: "" }); // Clear errors when value changes
//   };

//   return (
//     <div>
//       {label && <label className="block text-gray-700 mb-1">{label}</label>}
//       <div className="relative">
//         <select
//           name={name}
//           value={formData[name] || defaultValue || ""}
//           onChange={handleChange}
//           className={`w-full p-2 border rounded focus:outline-none focus:ring-2 ${
//             errors[name] ? "border-red-500" : "border-gray-300"
//           } focus:ring-cyan-500 appearance-none`}
//           style={{
//             backgroundColor: formData[name] || defaultValue || "white", // Show selected color
//             color: "#000",
//           }}
//         >
//           {options.map((option) => (
//             <option
//               key={option.value}
//               value={option.value}
//               style={{ backgroundColor: option.value, color: "#fff" }} // Color preview in options
//             >
//               {option.label}
//             </option>
//           ))}
//         </select>
//         <div
//           className="absolute top-1/2 right-3 transform -translate-y-1/2 w-5 h-5 rounded-full border border-gray-400"
//           style={{ backgroundColor: formData[name] || defaultValue || "white" }}
//         />
//       </div>
//       {errors[name] && <p className="text-red-500 text-sm">{errors[name]}</p>}
//     </div>
//   );
// };

// Dropdown.propTypes = {
//   label: PropTypes.string,
//   name: PropTypes.string.isRequired,
//   options: PropTypes.arrayOf(
//     PropTypes.shape({
//       value: PropTypes.string.isRequired,
//       label: PropTypes.string.isRequired,
//     })
//   ).isRequired,
//   formData: PropTypes.object.isRequired,
//   setFormData: PropTypes.func.isRequired,
//   errors: PropTypes.object,
//   setErrors: PropTypes.func.isRequired,
//   defaultValue: PropTypes.string,
// };

// export default Dropdown;


// import { useState, useEffect, useRef } from "react";
// import PropTypes from "prop-types";

// const Dropdown = ({ label, name, options, formData, setFormData, errors, setErrors, defaultValue }) => {
//   const [search, setSearch] = useState("");
//   const [filteredOptions, setFilteredOptions] = useState(options);
//   const [isOpen, setIsOpen] = useState(false);
//   const dropdownRef = useRef(null);

//   useEffect(() => {
//     setFilteredOptions(
//       options.filter((option) =>
//         option.label.toLowerCase().includes(search.toLowerCase())
//       )
//     );
//   }, [search, options]);

//   useEffect(() => {
//     if (!formData[name] && defaultValue) {
//       setFormData((prev) => ({ ...prev, [name]: defaultValue }));
//     }
//   }, [formData, name, defaultValue, setFormData]);

//   const handleSelection = (value) => {
//     setFormData({ ...formData, [name]: value });
//     setErrors({ ...errors, [name]: "" }); // Clear errors when value changes
//     setSearch(""); // Reset search after selection
//     setIsOpen(false); // Close dropdown
//   };

//   const handleClickOutside = (event) => {
//     if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//       setIsOpen(false);
//     }
//   };

//   useEffect(() => {
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, []);

//   return (
//     <div className="relative w-full" ref={dropdownRef}>
//       {label && <label className="block text-gray-700 mb-1">{label}</label>}
//       <div
//         className={`border rounded p-2 cursor-pointer bg-white ${
//           errors[name] ? "border-red-500" : "border-gray-300"
//         }`}
//         onClick={() => setIsOpen(!isOpen)}
//       >
//         <span>{options.find((opt) => opt.value === formData[name])?.label || "Select an option"}</span>
//       </div>

//       {isOpen && (
//         <div className="absolute w-full mt-1 bg-white border border-gray-300 rounded shadow-lg z-10">
//           <input
//             type="text"
//             placeholder="Search..."
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//             className="w-full p-2 border-b border-gray-300 focus:outline-none"
//           />
//           <div className="max-h-48 overflow-y-auto">
//             {filteredOptions.length > 0 ? (
//               filteredOptions.map((option) => (
//                 <div
//                   key={option.value}
//                   onClick={() => handleSelection(option.value)}
//                   className="p-2 hover:bg-gray-200 cursor-pointer flex items-center"
//                   style={{ backgroundColor: option.value, color: "#fff" }}
//                 >
//                   {option.label}
//                 </div>
//               ))
//             ) : (
//               <div className="p-2 text-gray-500">No results found</div>
//             )}
//           </div>
//         </div>
//       )}

//       {errors[name] && <p className="text-red-500 text-sm mt-1">{errors[name]}</p>}
//     </div>
//   );
// };

// Dropdown.propTypes = {
//   label: PropTypes.string,
//   name: PropTypes.string.isRequired,
//   options: PropTypes.arrayOf(
//     PropTypes.shape({
//       value: PropTypes.string.isRequired,
//       label: PropTypes.string.isRequired,
//     })
//   ).isRequired,
//   formData: PropTypes.object.isRequired,
//   setFormData: PropTypes.func.isRequired,
//   errors: PropTypes.object,
//   setErrors: PropTypes.func.isRequired,
//   defaultValue: PropTypes.string,
// };

// export default Dropdown;

// import { useState, useEffect, useRef } from "react";
// import PropTypes from "prop-types";

// const Dropdown = ({ label, name, options, formData, setFormData, errors, setErrors, defaultValue }) => {
//   if (!formData[name] && defaultValue) {
//     setFormData((prev) => ({ ...prev, [name]: defaultValue }));
//   }

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//     setErrors({ ...errors, [name]: "" }); // Clear errors when value changes
//   };

//   return (
//     <div>
//       {label && <label className="block text-gray-700 mb-1">{label}</label>}
//       <div className="relative">
//         <select
//           name={name}
//           value={formData[name] || defaultValue || ""}
//           onChange={handleChange}
//           className={`w-full p-2 border rounded focus:outline-none focus:ring-2 ${
//             errors[name] ? "border-red-500" : "border-gray-300"
//           } focus:ring-cyan-500 appearance-none`}
//           style={{
//             backgroundColor: formData[name] || defaultValue || "white", // Show selected color
//             color: "#000",
//           }}
//         >
//           {options.map((option) => (
//             <option
//               key={option.value}
//               value={option.value}
//               style={{ backgroundColor: option.value, color: "#fff" }} // Color preview in options
//             >
//               {option.label}
//             </option>
//           ))}
//         </select>
//         <div
//           className="absolute top-1/2 right-3 transform -translate-y-1/2 w-5 h-5 rounded-full border border-gray-400"
//           style={{ backgroundColor: formData[name] || defaultValue || "white" }}
//         />
//       </div>
//       {errors[name] && <p className="text-red-500 text-sm">{errors[name]}</p>}
//     </div>
//   );
// };

// Dropdown.propTypes = {
//   label: PropTypes.string,
//   name: PropTypes.string.isRequired,
//   options: PropTypes.arrayOf(
//     PropTypes.shape({
//       value: PropTypes.string.isRequired,
//       label: PropTypes.string.isRequired,
//     })
//   ).isRequired,
//   formData: PropTypes.object.isRequired,
//   setFormData: PropTypes.func.isRequired,
//   errors: PropTypes.object,
//   setErrors: PropTypes.func.isRequired,
//   defaultValue: PropTypes.string,
// };

// export default Dropdown;


// import { useState, useEffect, useRef } from "react";
// import PropTypes from "prop-types";

// const Dropdown = ({ label, name, options, formData, setFormData, errors, setErrors, defaultValue }) => {
//   const [search, setSearch] = useState("");
//   const [filteredOptions, setFilteredOptions] = useState(options);
//   const [isOpen, setIsOpen] = useState(false);
//   const dropdownRef = useRef(null);

//   useEffect(() => {
//     setFilteredOptions(
//       options.filter((option) =>
//         option.label.toLowerCase().includes(search.toLowerCase())
//       )
//     );
//   }, [search, options]);

//   useEffect(() => {
//     if (!formData[name] && defaultValue) {
//       setFormData((prev) => ({ ...prev, [name]: defaultValue }));
//     }
//   }, [formData, name, defaultValue, setFormData]);

//   const handleSelection = (value) => {
//     setFormData({ ...formData, [name]: value });
//     setErrors({ ...errors, [name]: "" }); // Clear errors when value changes
//     setSearch(""); // Reset search after selection
//     setIsOpen(false); // Close dropdown
//   };

//   const handleClickOutside = (event) => {
//     if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//       setIsOpen(false);
//     }
//   };

//   useEffect(() => {
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, []);

//   return (
//     <div className="relative w-full" ref={dropdownRef}>
//       {label && <label className="block text-gray-700 mb-1">{label}</label>}
//       <div
//         className={`border rounded p-2 cursor-pointer bg-white ${
//           errors[name] ? "border-red-500" : "border-gray-300"
//         }`}
//         onClick={() => setIsOpen(!isOpen)}
//       >
//         <span>{options.find((opt) => opt.value === formData[name])?.label || "Select an option"}</span>
//       </div>

//       {isOpen && (
//         <div className="absolute w-full mt-1 bg-white border border-gray-300 rounded shadow-lg z-10">
//           <input
//             type="text"
//             placeholder="Search..."
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//             className="w-full p-2 border-b border-gray-300 focus:outline-none"
//           />
//           <div className="max-h-48 overflow-y-auto">
//             {filteredOptions.length > 0 ? (
//               filteredOptions.map((option) => (
//                 <div
//                   key={option.value}
//                   onClick={() => handleSelection(option.value)}
//                   className="p-2 hover:bg-gray-200 cursor-pointer flex items-center"
//                   style={{ backgroundColor: option.value, color: "#fff" }}
//                 >
//                   {option.label}
//                 </div>
//               ))
//             ) : (
//               <div className="p-2 text-gray-500">No results found</div>
//             )}
//           </div>
//         </div>
//       )}

//       {errors[name] && <p className="text-red-500 text-sm mt-1">{errors[name]}</p>}
//     </div>
//   );
// };

// Dropdown.propTypes = {
//   label: PropTypes.string,
//   name: PropTypes.string.isRequired,
//   options: PropTypes.arrayOf(
//     PropTypes.shape({
//       value: PropTypes.string.isRequired,
//       label: PropTypes.string.isRequired,
//     })
//   ).isRequired,
//   formData: PropTypes.object.isRequired,
//   setFormData: PropTypes.func.isRequired,
//   errors: PropTypes.object,
//   setErrors: PropTypes.func.isRequired,
//   defaultValue: PropTypes.string,
// };

// export default Dropdown;

// import { useState, useEffect, useRef } from "react";
// import PropTypes from "prop-types";

// const Dropdown = ({ label, name, options, formData, setFormData, errors, setErrors, defaultValue }) => {
//   const [search, setSearch] = useState("");
//   const [filteredOptions, setFilteredOptions] = useState(options);
//   const [isOpen, setIsOpen] = useState(false);
//   const dropdownRef = useRef(null);

//   useEffect(() => {
//     setFilteredOptions(
//       options.filter((option) =>
//         option.label.toLowerCase().includes(search.toLowerCase())
//       )
//     );
//   }, [search, options]);

//   useEffect(() => {
//     if (!formData[name] && defaultValue) {
//       setFormData((prev) => ({ ...prev, [name]: defaultValue }));
//     }
//   }, [formData, name, defaultValue, setFormData]);

//   const handleSelection = (value) => {
//     setFormData({ ...formData, [name]: value });
//     setErrors({ ...errors, [name]: "" }); // Clear errors when value changes
//     setSearch(""); // Reset search after selection
//     setIsOpen(false); // Close dropdown
//   };

//   const handleClickOutside = (event) => {
//     if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//       setIsOpen(false);
//     }
//   };

//   useEffect(() => {
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, []);
// const Dropdown = ({ label, name, options, formData, setFormData, errors, setErrors, defaultValue }) => {
//   const [search, setSearch] = useState("");
//   const [filteredOptions, setFilteredOptions] = useState(options);
//   const [isOpen, setIsOpen] = useState(false);
//   const dropdownRef = useRef(null);

//   useEffect(() => {
//     setFilteredOptions(
//       options.filter((option) =>
//         option.label.toLowerCase().includes(search.toLowerCase())
//       )
//     );
//   }, [search, options]);

//   useEffect(() => {
//     if (!formData[name] && defaultValue) {
//       setFormData((prev) => ({ ...prev, [name]: defaultValue }));
//     }
//   }, [formData, name, defaultValue, setFormData]);

//   const handleSelection = (value) => {
//     setFormData({ ...formData, [name]: value });
//     setErrors({ ...errors, [name]: "" }); // Clear errors when value changes
//     setSearch(""); // Reset search after selection
//     setIsOpen(false); // Close dropdown
//   };

//   const handleClickOutside = (event) => {
//     if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//       setIsOpen(false);
//     }
//   };

//   useEffect(() => {
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, []);

//   return (
//     <div className="relative w-full" ref={dropdownRef}>
//       {label && <label className="block text-gray-700 mb-1">{label}</label>}
//       <div
//         className={`border rounded p-2 cursor-pointer bg-white ${
//           errors[name] ? "border-red-500" : "border-gray-300"
//         }`}
//         onClick={() => setIsOpen(!isOpen)}
//       >
//         <span>{options.find((opt) => opt.value === formData[name])?.label || "Select an option"}</span>
//       </div>

//       {isOpen && (
//         <div className="absolute w-full mt-1 bg-white border border-gray-300 rounded shadow-lg z-10">
//           <input
//             type="text"
//             placeholder="Search..."
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//             className="w-full p-2 border-b border-gray-300 focus:outline-none"
//           />
//           <div className="max-h-48 overflow-y-auto">
//             {filteredOptions.length > 0 ? (
//               filteredOptions.map((option) => (
//                 <div
//                   key={option.value}
//                   onClick={() => handleSelection(option.value)}
//                   className="p-2 hover:bg-gray-200 cursor-pointer flex items-center bg-white text-black"
//                 >
//                   {option.label}
//                 </div>
//               ))
//             ) : (
//               <div className="p-2 text-gray-500">No results found</div>
//     <div className="relative w-full" ref={dropdownRef}>
//       {label && <label className="block text-gray-700 mb-1">{label}</label>}
//       <div
//         className={`border rounded p-2 cursor-pointer bg-white ${
//           errors[name] ? "border-red-500" : "border-gray-300"
//         }`}
//         onClick={() => setIsOpen(!isOpen)}
//       >
//         <span>{options.find((opt) => opt.value === formData[name])?.label || "Select an option"}</span>
//       </div>

//       {isOpen && (
//         <div className="absolute w-full mt-1 bg-white border border-gray-300 rounded shadow-lg z-10">
//           <input
//             type="text"
//             placeholder="Search..."
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//             className="w-full p-2 border-b border-gray-300 focus:outline-none"
//           />
//           <div className="max-h-48 overflow-y-auto">
//             {filteredOptions.length > 0 ? (
//               filteredOptions.map((option) => (
//                 <div
//                   key={option.value}
//                   onClick={() => handleSelection(option.value)}
//                   className="p-2 hover:bg-gray-200 cursor-pointer flex items-center bg-white text-black"
//                 >
//                   {option.label}
//                 </div>
//               ))
//             ) : (
//               <div className="p-2 text-gray-500">No results found</div>
//             )}
//           </div>
//         </div>
//       )}

//       {errors[name] && <p className="text-red-500 text-sm mt-1">{errors[name]}</p>}
//     </div>
//           </div>
//         </div>
//       )}

//       {errors[name] && <p className="text-red-500 text-sm mt-1">{errors[name]}</p>}
//     </div>
//   );
// };

// Dropdown.propTypes = {
//   label: PropTypes.string,
//   name: PropTypes.string.isRequired,
//   label: PropTypes.string,
//   name: PropTypes.string.isRequired,
//   options: PropTypes.arrayOf(
//     PropTypes.shape({
//       value: PropTypes.string.isRequired,
//       label: PropTypes.string.isRequired,
//       value: PropTypes.string.isRequired,
//       label: PropTypes.string.isRequired,
//     })
//   ).isRequired,
//   formData: PropTypes.object.isRequired,
//   setFormData: PropTypes.func.isRequired,
//   errors: PropTypes.object,
//   setErrors: PropTypes.func.isRequired,
//   defaultValue: PropTypes.string,
//   formData: PropTypes.object.isRequired,
//   setFormData: PropTypes.func.isRequired,
//   errors: PropTypes.object,
//   setErrors: PropTypes.func.isRequired,
//   defaultValue: PropTypes.string,
// };

// export default Dropdown;

// src/utils/Dropdown.jsx

// import { Menu } from "@headlessui/react";
// import PropTypes from "prop-types";

// /**
//  * Production-ready Headless UI dropdown.
//  * - label: Placeholder text if nothing is selected.
//  * - options: e.g. [ { value: "", label: "All" }, ... ]
//  * - filterName: e.g. "status", "branch"
//  * - selectedValue: current filter value (e.g. "active")
//  * - onChange: callback(filterName, newValue)
//  */
// const Dropdown = ({ label, options, filterName, selectedValue, onChange }) => {
//   // Find the label to display for the current selection
//   const currentLabel =
//     selectedValue && options.find((opt) => opt.value === selectedValue)
//       ? options.find((opt) => opt.value === selectedValue).label
//       : label;

//   return (
//     <Menu as="div" className="relative inline-block text-left w-full">
//       <Menu.Button className="w-full p-2 border border-gray-300 rounded bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500">
//         {currentLabel}
//       </Menu.Button>

//       <Menu.Items className="absolute mt-2 w-full bg-white border border-gray-200 rounded shadow-lg z-10">
//         {options.map((option) => (
//           <Menu.Item key={option.value}>
//             {({ active }) => (
//               <div
//                 onClick={() => onChange(filterName, option.value)}
//                 className={`cursor-pointer px-4 py-2 ${
//                   active ? "bg-cyan-500 text-white" : "text-gray-700"
//                 }`}
//               >
//                 {option.label}
//               </div>
//             )}
//           </Menu.Item>
//         ))}
//       </Menu.Items>
//     </Menu>
//   );
// };

// Dropdown.propTypes = {
//   label: PropTypes.string.isRequired,
//   options: PropTypes.arrayOf(
//     PropTypes.shape({
//       value: PropTypes.string,
//       label: PropTypes.string,
//     })
//   ).isRequired,
//   filterName: PropTypes.string.isRequired,
//   selectedValue: PropTypes.string,
//   onChange: PropTypes.func.isRequired,
// };

// export default Dropdown;

import { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";

const DropdownInner= ({ label, name, options, formData, setFormData, errors, setErrors, defaultValue }) => {
  const [search, setSearch] = useState("");
  const [filteredOptions, setFilteredOptions] = useState(options);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    setFilteredOptions(
      options.filter((option) =>
        option.label.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search, options]);

  useEffect(() => {
    if (!formData[name] && defaultValue) {
      setFormData((prev) => ({ ...prev, [name]: defaultValue }));
    }
  }, [formData, name, defaultValue, setFormData]);

  const handleSelection = (value) => {
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" }); // Clear errors when value changes
    setSearch(""); // Reset search after selection
    setIsOpen(false); // Close dropdown
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative w-full" ref={dropdownRef}>
      {label && <label className="block text-gray-700 mb-1">{label}</label>}
      <div
        className={`border rounded p-2 cursor-pointer bg-white ${
          errors[name] ? "border-red-500" : "border-gray-300"
        }`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{options.find((opt) => opt.value === formData[name])?.label || "Select an option"}</span>
      </div>

      {isOpen && (
        <div className="absolute w-full mt-1 bg-white border border-gray-300 rounded shadow-lg z-10">
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full p-2 border-b border-gray-300 focus:outline-none"
          />
          <div className="max-h-48 overflow-y-auto">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <div
                  key={option.value}
                  onClick={() => handleSelection(option.value)}
                  className="p-2 hover:bg-gray-200 cursor-pointer flex items-center bg-white text-black"
                >
                  {option.label}
                </div>
              ))
            ) : (
              <div className="p-2 text-gray-500">No results found</div>
            )}
          </div>
        </div>
      )}

      {errors[name] && <p className="text-red-500 text-sm mt-1">{errors[name]}</p>}
    </div>
  );
};

DropdownInner.propTypes = {
  label: PropTypes.string,
  name: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
  formData: PropTypes.object.isRequired,
  setFormData: PropTypes.func.isRequired,
  errors: PropTypes.object,
  setErrors: PropTypes.func.isRequired,
  defaultValue: PropTypes.string,
};

export default DropdownInner;

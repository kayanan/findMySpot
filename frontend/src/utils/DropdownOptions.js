/**
 * src/utils/DropdownOptions.js
 *
 * Central place to store commonly used dropdown options (status, color, payment types, etc.).
 */

// Status Options
export const statusOptions = [
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
];

// Color Options (e.g., used for color pickers or theming)
export const colorOptions = [
  { value: "#f43f5e", label: "ROSE" }, // Rose-500
  { value: "#f97316", label: "ORANGE" }, // Orange-500
  { value: "#eab308", label: "YELLOW" }, // Yellow-500
  { value: "#10b981", label: "EMERALD" }, // Emerald-500
  { value: "#0ea5e9", label: "SKY" }, // Sky-500
  { value: "#6366f1", label: "INDIGO" }, // Indigo-500
  { value: "#9333ea", label: "VIOLET" }, // Violet-500
  { value: "#14b8a6", label: "TEAL" }, // Teal-500
];

// Payment Type Options
export const paymentTypeOptions=[
  { value: "credit", label: "CREDIT" },
  { value: "cash", label: "CASH" },
  { value: "bank transfer", label: "BANK TRANSFER" },
  { value: "cheque", label: "CHEQUE" },
];

// Designation Options
export const designationOptions = [
  { value: "", label: "All" },
  { value: "ADMIN", label: "Admin" },
  { value: "RM", label: "Regional Manager" },
  { value: "MIS", label: "MIS" },
  { value: "REP", label: "Sales Representative" },
];

export const brandTypeOptions = [
  { value: "", label: "All" },
  { value: "MOBILE", label: "Mobile" },
  { value: "TAB", label: "Tab" },
  // Add more if needed (e.g. LAPTOP, ACCESSORY, etc.)
];
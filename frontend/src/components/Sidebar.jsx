
import { NavLink } from "react-router-dom";
import { UserCircleIcon,MapIcon} from "@heroicons/react/outline";

const Sidebar = ({ isOpen }) => {
 

 
  const navLinks = [
     { name: "Location Management", path: "/province", icon: MapIcon },
    
  ];

  return (
    <div
      className={`fixed top-0 left-0 h-full bg-gray-800 text-white shadow-lg z-40 flex flex-col ${isOpen ? "w-64" : "w-20"
        } transition-all duration-300`}
    >
      {/* Sidebar Header */}
      <div className="flex flex-col items-center pt-4 pb-4">
        <h2 className={`${isOpen ? "text-2xl font-bold text-cyan-500" : "text-lg font-bold text-cyan-500"}`}>
          {isOpen ? "Find My Spot" : "Find"}
        </h2>
        {isOpen && <p className="text-sm font-medium text-gray-400">Parking System</p>}
      </div>

      {/* Navigation Links */}
      <div className="flex flex-col w-full space-y-4 mt-8">
        {navLinks
          // .filter((link) => privilegeList.includes(link.privilege)) // Filter links based on privileges
          .map((link) => {
            const IconComponent = link.icon;
            return (
              <NavLink
                key={link.name}
                to={link.path}
                className={({ isActive }) =>
                  `flex items-center px-4 py-2 rounded-md text-base font-medium hover:bg-cyan-500 transition-colors duration-300 ${isActive ? "bg-cyan-500 text-gray-900" : "text-gray-400"
                  }`
                }
              >
                <IconComponent className="h-6 w-6" />
                {isOpen && <span className="ml-3">{link.name}</span>}
              </NavLink>
            );
          })}
      </div>
    </div>
  );
};



export default Sidebar;

import { NavLink } from "react-router-dom";
import { UserCircleIcon, MapIcon, UserIcon ,UsersIcon,IdentificationIcon} from "@heroicons/react/outline";
import { useState } from "react";

const Sidebar = ({ isOpen }) => {
  const [openName, setOpenName] = useState("");

  const navLinks = [
    { name: "Location Management", path: "/province", icon: MapIcon },
    {
      name: "User Management",
      icon: UsersIcon,
      subLink: [
        { name: "Paking Owner", path: "/owner", icon: MapIcon },
        { name: "Customers", path: "/user", icon: IdentificationIcon },
        { name: "Roles", path: "/role", icon: MapIcon },
      ],
    },
  ];

  return (
    <div
      className={`fixed top-0 left-0 h-full bg-gray-800 text-white shadow-lg z-40 flex flex-col ${
        isOpen ? "w-64" : "w-20"
      } transition-all duration-300`}
    >
      {/* Sidebar Header */}
      <div className="flex flex-col items-center pt-4 pb-4">
        <h2
          className={`${
            isOpen
              ? "text-2xl font-bold text-cyan-500"
              : "text-lg font-bold text-cyan-500"
          }`}
        >
          {isOpen ? "Find My Spot" : "Find"}
        </h2>
        {isOpen && (
          <p className="text-sm font-medium text-gray-400">Parking System</p>
        )}
      </div>

      {/* Navigation Links */}
      <div className="flex flex-col w-full space-y-4 mt-8">
        {navLinks
          // .filter((link) => privilegeList.includes(link.privilege)) // Filter links based on privileges

          .map((link) => {
            let subComponent;
            if (link?.subLink && link.name === openName) {
              subComponent = link.subLink.map((subLink) => {
                const IconComponent = subLink.icon;
                return (
                  <NavLink
                    key={Math.random()}
                    to={subLink.path}
                    className={({ isActive }) =>
                      `flex items-center px-4 pl-8 py-2 rounded-md text-base font-xl hover:bg-cyan-500 transition-colors duration-300 ${
                        isActive ? "bg-cyan-500 text-gray-900" : "text-gray-400"
                      }`
                    }
                  >
                    <IconComponent className="h-6 w-6" />
                    {isOpen && <span className="ml-3">{subLink.name}</span>}
                  </NavLink>
                );
              });
            }
            const IconComponent = link.icon;
            if (link.path) {
              return (
                <NavLink
                  key={link.name}
                  to={link.path}
                  onClick={() => {
                    if (openName == link.name) {
                      setOpenName("");
                    } else {
                      setOpenName(link.name);
                    }
                  }}
                  className={({ isActive }) =>
                    `flex items-center px-4 py-2 rounded-md text-base font-medium hover:bg-cyan-500 transition-colors duration-300 ${
                      isActive ? "bg-cyan-500 text-gray-900" : "text-gray-400"
                    }`
                  }
                >
                  <IconComponent className="h-6 w-6" />
                  {isOpen && <span className="ml-3">{link.name}</span>}
                </NavLink>
              );
            } else {
              return [
                <button
                  key={link.name}
                  onClick={() => {
                    if (openName == link.name) {
                      setOpenName("");
                    } else {
                      setOpenName(link.name);
                    }
                  }}
                  className={
                    `flex items-center px-4 py-2 rounded-md text-base font-medium hover:bg-cyan-500 transition-colors duration-300 ${
                      openName==link.name ? "bg-cyan-500 text-gray-900" : "text-gray-400"
                    }`
                  }
                >
                  <IconComponent className="h-6 w-6" />
                  {isOpen && <span className="ml-3">{link.name}</span>}
                </button>,

                subComponent,
              ];
            }
          })}
      </div>
    </div>
  );
};

export default Sidebar;

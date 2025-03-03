import React from "react";
import { NavLink } from "react-router-dom";

interface SideNavItemProps {
  title: string;
  icon: React.ReactNode;
  to: string;
}

const SideNavItem: React.FC<SideNavItemProps> = ({ title, icon, to }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center px-2 py-1 gap-2 rounded-md transition-colors ${
          isActive
            ? "bg-primary text-white font-semibold"
            : "hover:bg-gray-200 "
        }`
      }
    >
      <div>{icon}</div>
      <div>{title}</div>
    </NavLink>
  );
};

export default SideNavItem;

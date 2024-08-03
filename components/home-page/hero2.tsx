// components/Sidebar.js
import {
  FaHome,
  FaUserCircle,
  FaCalendarAlt,
  FaTasks,
  FaRegBell,
  FaSignOutAlt,
} from "react-icons/fa";

const Sidebar = () => {
  return (
    <aside className="w-64 bg-white shadow-md h-screen p-4">
      <div className="text-xl font-bold mb-6">Connected</div>
      <nav className="flex flex-col space-y-4">
        <a
          href="#"
          className="flex items-center space-x-2 text-gray-700 hover:text-black"
        >
          <FaHome />
          <span>Home</span>
        </a>
        <a
          href="#"
          className="flex items-center space-x-2 text-gray-700 hover:text-black"
        >
          <FaUserCircle />
          <span>Pet Profile</span>
        </a>
        <a
          href="#"
          className="flex items-center space-x-2 text-gray-700 hover:text-black"
        >
          <FaCalendarAlt />
          <span>Appointments</span>
        </a>
        <a
          href="#"
          className="flex items-center space-x-2 text-gray-700 hover:text-black"
        >
          <FaTasks />
          <span>Manage</span>
        </a>
        <a
          href="#"
          className="flex items-center space-x-2 text-gray-700 hover:text-black"
        >
          <FaRegBell />
          <span>Reminders</span>
        </a>
        <a
          href="#"
          className="flex items-center space-x-2 text-gray-700 hover:text-black mt-auto"
        >
          <FaSignOutAlt />
          <span>Sign Out</span>
        </a>
      </nav>
    </aside>
  );
};

export default Sidebar;

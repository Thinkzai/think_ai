import { NavLink } from "react-router-dom";
import {
  FaHome,
  FaBook,
  FaUsers,
  FaUserGraduate,
  FaUserCircle,
} from "react-icons/fa";

function Sidebar() {
  const menuItems = [
    {
      name: "Dashboard",
      path: "/admin/dashboard",
      icon: <FaHome />,
    },
    {
      name: "Courses",
      path: "/admin/courses",
      icon: <FaBook />,
    },
    {
      name: "Batches",
      path: "/admin/batches",
      icon: <FaUserGraduate />,
    },
    {
      name: "Users",
      path: "/admin/users",
      icon: <FaUsers />,
    },
    {
      name: "Profile",
      path: "/admin/profile",
      icon: <FaUserCircle />,
    },
  ];

  return (
    <div className="w-64 h-screen bg-blue-700 text-white fixed">
      <div className="text-2xl font-bold p-6 border-b">
        Thinkz AI LMS
      </div>

      <nav className="mt-5">
        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-6 py-4 hover:bg-blue-600 ${
                isActive ? "bg-blue-800" : ""
              }`
            }
          >
            {item.icon}
            {item.name}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}

export default Sidebar;
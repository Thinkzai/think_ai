import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../../features/auth/authSlice";

function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login", { replace: true });
  };

  return (
    <div className="bg-white shadow h-16 flex justify-between items-center px-8">
      <h2 className="text-2xl font-semibold">
        Thinkz AI LMS
      </h2>

      <div className="flex items-center gap-4">
        <span className="font-medium">
          Welcome, {user?.name || "Admin"}
        </span>
        <button
          onClick={handleLogout}
          className="text-sm font-medium text-gray-600 hover:text-red-500 transition-colors px-3 py-1.5 rounded-lg hover:bg-gray-100"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default Navbar;
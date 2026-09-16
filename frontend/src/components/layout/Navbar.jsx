import { FaBell } from "react-icons/fa";

function Navbar() {
  return (
    <header className="flex items-center justify-between bg-[#0B0F19] border-b border-gray-800 px-8 py-4">
      {/* Left */}
      <div>
        <h2 className="text-2xl font-bold text-white">
          Dashboard
        </h2>
        <p className="text-sm text-gray-400">
          Welcome to Thinkz AI Learning Management System
        </p>
      </div>

      {/* Right */}
      <div className="flex items-center gap-6">
        {/* Notification */}
        <button className="text-gray-400 hover:text-cyan-400 transition-colors">
          <FaBell size={18} />
        </button>

        {/* Profile */}
        <div className="flex items-center gap-3 bg-[#112435] px-4 py-2 rounded-xl border border-gray-800">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-cyan-500/20 border border-cyan-500 flex items-center justify-center text-cyan-400 font-semibold">
              A
            </div>

            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border border-[#112435]"></div>
          </div>

          <div>
            <p className="text-sm font-semibold text-white">
              Admin
            </p>

            <p className="text-xs text-gray-400">
              System Administrator
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
import { Menu, Bell, ChevronDown } from "lucide-react";

function Topbar({
  userName = "Admin User",
  userRole = "Quality Manager",
  notificationCount = 3,
  showComplaints = false,
  onToggleComplaints,
}) {
  const initial = userName.charAt(0).toUpperCase();

  return (
    <header className="bg-white border-b border-gray-200 shrink-0">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Left: Menu + Title */}
        <div className="flex items-center gap-4">
          <button
            type="button"
            className="text-gray-500 hover:text-gray-800 transition-colors"
          >
            <Menu className="w-7 h-7" />
          </button>

          <div className="flex flex-col justify-center">
            <h1 className="text-lg font-bold text-gray-900 leading-snug">
              Customer Complaint Management System
            </h1>

            <p className="text-sm text-gray-400 leading-snug">
              AI-Powered Pharmaceutical Quality Assurance Platform
            </p>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-5">
          {/* View Complaints Button */}
          <button
            type="button"
            onClick={onToggleComplaints}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition"
          >
            {showComplaints ? "Back to Form" : "View Complaints"}
          </button>

          {/* Notification */}
          <button
            type="button"
            className="relative text-gray-500 hover:text-gray-800 transition-colors"
          >
            <Bell className="w-5 h-5" />

            {notificationCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {notificationCount}
              </span>
            )}
          </button>

          {/* User Profile */}
          <button
            type="button"
            className="flex items-center gap-2 cursor-pointer"
          >
            <div className="w-9 h-9 rounded-full bg-indigo-600 text-white flex items-center justify-center font-semibold text-sm">
              {initial}
            </div>

            <div className="leading-tight text-left">
              <p className="text-sm font-semibold text-gray-900">{userName}</p>

              <p className="text-xs text-gray-500">{userRole}</p>
            </div>

            <ChevronDown className="w-4 h-4 text-gray-400" />
          </button>
        </div>
      </div>
    </header>
  );
}

export default Topbar;

import React from "react";
import { NavLink } from "react-router-dom";

const navItems = [
  {
    to: "/cycle-tracking",
    label: "My Menstrual Cycle",
    icon: "🩸",
  },
  {
    to: "/cycle-summary",
    label: "History",
    icon: "📊",
  },
  {
    to: "/period-calendar",
    label: "My Appointment",
    icon: "📅",
  },
];

const PatientDashboard: React.FC = () => {
  return (
    <div className="flex min-h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 p-6 flex flex-col shadow-lg">
        <div className="mb-10 flex flex-col items-center">
          <NavLink to="/">
            <img src="/logo192.png" alt="Home" className="w-14 mb-2 rounded-full shadow" />
          </NavLink>
          <h2 className="text-xl font-bold tracking-wide">Patient</h2>
        </div>
        <nav className="flex flex-col gap-4">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2 rounded-lg transition-all font-medium text-lg hover:bg-pink-700/80 hover:text-white ${
                  isActive ? "bg-pink-600 text-white" : "text-pink-200"
                }`
              }
            >
              <span className="text-2xl">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>
      {/* Main content */}
      <main className="flex-1 flex flex-col items-center justify-center p-8">
        <h1 className="text-3xl font-bold mb-4">Welcome, Patient!</h1>
        <p className="text-lg text-pink-200 mb-8 text-center max-w-xl">
          Đây là dashboard dành cho bệnh nhân. Bạn có thể theo dõi chu kỳ kinh nguyệt, lịch sử và các cuộc hẹn tại đây.
        </p>
        {/* TODO: Thêm các widget thống kê, lịch hẹn, v.v. */}
      </main>
    </div>
  );
};

export default PatientDashboard; 
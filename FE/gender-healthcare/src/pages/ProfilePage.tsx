import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const roleDashboards = [
  { role: "Admin", label: "Bảng điều khiển Admin", icon: "🛠️", path: "/admin" },
  { role: "Manager", label: "Quản lý phân ca tư vấn viên", icon: "📋", path: "/manager" },
  { role: "Counselor", label: "Dashboard Tư vấn viên", icon: "📊", path: "/counselor" },
  { role: "Counselor", label: "Quản lý lịch tư vấn", icon: "📅", path: "/counselor-consultations" },
  { role: "Counselor", label: "Lịch làm việc", icon: "🕐", path: "/my-schedule" },
  { role: "Patient", label: "Lịch tư vấn của tôi", icon: "👤", path: "/patient-consultations" },
  { role: "Patient", label: "Đặt lịch mới", icon: "🆕", path: "/booking-consultation" },
];

const ProfilePage: React.FC = () => {
  const [userRoles, setUserRoles] = useState<string[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    let role = localStorage.getItem("userRole");
    let roles: string[] = [];
    try {
      roles = role ? JSON.parse(role) : [];
    } catch {
      if (role) roles = [role];
    }
    setUserRoles(roles);
  }, []);

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-4">Tài khoản của tôi</h1>
      <p className="mb-6">Thông tin tài khoản, đổi mật khẩu, v.v. sẽ hiển thị ở đây.</p>
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-3">Truy cập nhanh Dashboard</h2>
        <div className="flex flex-wrap gap-4">
          {roleDashboards.filter(d => userRoles.includes(d.role)).map((d, idx) => (
            <button
              key={d.role + d.path + idx}
              onClick={() => navigate(d.path)}
              className="px-6 py-3 bg-purple-600 text-white rounded-lg shadow hover:bg-purple-700 flex items-center gap-2"
            >
              <span className="text-xl">{d.icon}</span>
              {d.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage; 
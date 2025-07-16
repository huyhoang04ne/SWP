import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { logout } from "../api/authApi";

const Navbar = () => {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userRoles, setUserRoles] = useState<string[]>([]);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("token");
    let role = localStorage.getItem("userRole");
    let roles: string[] = [];
    try {
      // Nếu backend trả về dạng mảng
      roles = role ? JSON.parse(role) : [];
    } catch {
      // Nếu là chuỗi
      if (role) roles = [role];
    }
    setIsLoggedIn(!!token);
    setUserRole(roles.length > 0 ? roles[0] : null);
    setUserRoles(roles);
  }, []);

  const toggleDropdown = (menu: string) =>
    setOpenDropdown(openDropdown === menu ? null : menu);

  const handleLogout = () => {
    logout();
    setIsLoggedIn(false);
    setUserRole(null);
    setOpenDropdown(null);
  };

  const isInDichVu =
    location.pathname.startsWith("/cycle-tracking") ||
    location.pathname.startsWith("/dich-vu") ||
    location.pathname.startsWith("/medication-reminder");

  return (
    <nav className="bg-purple-100 border-t border-b border-purple-200 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">
        <ul className="flex space-x-6 font-semibold text-purple-800 text-sm relative items-center">
          <li>
            <Link
              to="/"
              className={`px-4 py-1 rounded-md ${
                location.pathname === "/"
                  ? "bg-purple-600 text-white"
                  : "hover:text-purple-600"
              }`}
            >
              Trang chủ
            </Link>
          </li>

          <li>
            <Link
              to="/gioi-thieu"
              className={`px-4 py-1 rounded-md ${
                location.pathname === "/gioi-thieu"
                  ? "bg-purple-600 text-white"
                  : "hover:text-purple-600"
              }`}
            >
              Giới thiệu
            </Link>
          </li>

          <li className="relative">
            <div
              onClick={() => toggleDropdown("dich-vu")}
              className={`px-4 py-1 rounded-md cursor-pointer inline-flex items-center ${
                isInDichVu
                  ? "bg-purple-600 text-white"
                  : "hover:text-purple-600"
              }`}
            >
              <span>Dịch vụ</span>
              <svg
                className="ml-1 w-3 h-3"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
            {openDropdown === "dich-vu" && (
              <ul className="absolute left-0 mt-2 w-56 bg-white border border-purple-200 rounded-md shadow-lg z-10">
                <li>
                  <Link
                    to="/cycle-tracking"
                    className={`block px-4 py-2 text-sm ${
                      location.pathname === "/cycle-tracking"
                        ? "bg-purple-100 font-bold text-purple-800"
                        : "text-purple-700 hover:bg-purple-100"
                    }`}
                    onClick={() => setOpenDropdown(null)}
                  >
                    Chu kỳ kinh nguyệt
                  </Link>
                </li>
                <li>
                  <Link
                    to="/medication-reminder"
                    className={`block px-4 py-2 text-sm ${
                      location.pathname === "/medication-reminder"
                        ? "bg-purple-100 font-bold text-purple-800"
                        : "text-purple-700 hover:bg-purple-100"
                    }`}
                    onClick={() => setOpenDropdown(null)}
                  >
                    Nhắc thuốc
                  </Link>
                </li>
                <li>
                  <Link
                    to="/booking-consultation"
                    className={`block px-4 py-2 text-sm ${
                      location.pathname === "/booking-consultation"
                        ? "bg-purple-100 font-bold text-purple-800"
                        : "text-purple-700 hover:bg-purple-100"
                    }`}
                    onClick={() => setOpenDropdown(null)}
                  >
                    Đặt lịch tư vấn mới
                  </Link>
                </li>
              </ul>
            )}
          </li>



          <li>
            <Link
              to="/cam-nang"
              className={`px-4 py-1 rounded-md ${
                location.pathname === "/cam-nang"
                  ? "bg-purple-600 text-white"
                  : "hover:text-purple-600"
              }`}
            >
              Cẩm nang
            </Link>
          </li>

          <li>
            <Link
              to="/bang-gia"
              className={`px-4 py-1 rounded-md ${
                location.pathname === "/bang-gia"
                  ? "bg-purple-600 text-white"
                  : "hover:text-purple-600"
              }`}
            >
              Bảng giá
            </Link>
          </li>

          <li>
            <Link
              to="/benh-hoc"
              className={`px-4 py-1 rounded-md ${
                location.pathname === "/benh-hoc"
                  ? "bg-purple-600 text-white"
                  : "hover:text-purple-600"
              }`}
            >
              Bệnh học
            </Link>
          </li>

          <li>
            <Link
              to="/tin-tuc"
              className={`px-4 py-1 rounded-md ${
                location.pathname === "/tin-tuc"
                  ? "bg-purple-600 text-white"
                  : "hover:text-purple-600"
              }`}
            >
              Tin tức
            </Link>
          </li>
        </ul>

        <div className="flex space-x-4 items-center">
          <button
            title="Thông báo"
            className="text-purple-600 text-xl hover:text-purple-800"
          >
            🔔
          </button>

          {isLoggedIn ? (
            <div className="relative">
              <button
                onClick={() => toggleDropdown("user-menu")}
                className="text-purple-700 font-semibold text-sm hover:underline flex items-center gap-1"
              >
                <span>👤</span>
                <span>{userRole || 'User'}</span>
              </button>
              {openDropdown === "user-menu" && (
                <ul className="absolute right-0 mt-2 w-56 bg-white border border-purple-200 rounded-md shadow-lg z-10 text-sm">
                  {/* Dashboard links theo role */}
                  {userRoles.includes("Admin") && (
                    <li>
                      <Link
                        to="/admin"
                        className={`block px-4 py-2 text-purple-700 hover:bg-purple-100 ${location.pathname === "/admin" ? "font-bold" : ""}`}
                        onClick={() => setOpenDropdown(null)}
                      >
                        🛠️ Bảng điều khiển Admin
                      </Link>
                    </li>
                  )}
                  {userRoles.includes("Manager") && (
                    <li>
                      <Link
                        to="/manager"
                        className={`block px-4 py-2 text-purple-700 hover:bg-purple-100 ${location.pathname === "/manager" ? "font-bold" : ""}`}
                        onClick={() => setOpenDropdown(null)}
                      >
                        📋 Quản lý phân ca tư vấn viên
                      </Link>
                    </li>
                  )}
                  {userRoles.includes("Counselor") && (
                    <>
                      <li>
                        <Link
                          to="/counselor"
                          className={`block px-4 py-2 text-purple-700 hover:bg-purple-100 ${location.pathname === "/counselor" ? "font-bold" : ""}`}
                          onClick={() => setOpenDropdown(null)}
                        >
                          📊 Dashboard Tư vấn viên
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/counselor-consultations"
                          className={`block px-4 py-2 text-purple-700 hover:bg-purple-100 ${location.pathname === "/counselor-consultations" ? "font-bold" : ""}`}
                          onClick={() => setOpenDropdown(null)}
                        >
                          📅 Quản lý lịch tư vấn
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/my-schedule"
                          className={`block px-4 py-2 text-purple-700 hover:bg-purple-100 ${location.pathname === "/my-schedule" ? "font-bold" : ""}`}
                          onClick={() => setOpenDropdown(null)}
                        >
                          🕐 Lịch làm việc
                        </Link>
                      </li>
                    </>
                  )}
                  {userRoles.includes("Patient") && (
                    <>
                      <li>
                        <Link
                          to="/patient-consultations"
                          className={`block px-4 py-2 text-purple-700 hover:bg-purple-100 ${location.pathname === "/patient-consultations" ? "font-bold" : ""}`}
                          onClick={() => setOpenDropdown(null)}
                        >
                          👤 Lịch tư vấn của tôi
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/booking-consultation"
                          className={`block px-4 py-2 text-purple-700 hover:bg-purple-100 ${location.pathname === "/booking-consultation" ? "font-bold" : ""}`}
                          onClick={() => setOpenDropdown(null)}
                        >
                          🆕 Đặt lịch mới
                        </Link>
                      </li>
                    </>
                  )}
                  <li>
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-purple-700 hover:bg-purple-100"
                      onClick={() => setOpenDropdown(null)}
                    >
                      Tài khoản của tôi
                    </Link>
                  </li>
                  <li>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-red-600 hover:bg-purple-100"
                    >
                      Đăng xuất
                    </button>
                  </li>
                </ul>
              )}
            </div>
          ) : (
            <Link
              to="/auth"
              className="text-red-600 font-bold text-sm hover:underline"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

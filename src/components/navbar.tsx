import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { logout } from "../api/authApi";

const Navbar = () => {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const toggleDropdown = (menu: string) =>
    setOpenDropdown(openDropdown === menu ? null : menu);

  const handleLogout = () => {
    logout();
    setIsLoggedIn(false);
    setOpenDropdown(null);
  };

  const isInDichVu =
    location.pathname.startsWith("/cycle-tracking") ||
    location.pathname.startsWith("/dich-vu") ||
    location.pathname.startsWith("/medication-reminder");

  const isInCamNang =
    location.pathname.startsWith("/cam-nang/luu-y-truoc") ||
    location.pathname.startsWith("/cam-nang/luu-y-sau") ||
    location.pathname.startsWith("/cam-nang/faq");

  const isInGioiThieu = location.pathname.startsWith("/gioi-thieu");

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

          {/* Giới thiệu */}
          <li className="relative">
            <div
              onClick={() => toggleDropdown("gioi-thieu")}
              className={`px-4 py-1 rounded-md cursor-pointer inline-flex items-center ${
                isInGioiThieu
                  ? "bg-purple-600 text-white"
                  : "hover:text-purple-600"
              }`}
            >
              <span>Giới thiệu</span>
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
            {openDropdown === "gioi-thieu" && (
              <ul className="absolute left-0 mt-2 w-64 bg-white border border-purple-200 rounded-md shadow-lg z-10">
                <li>
                  <Link
                    to="/gioi-thieu/he-thong"
                    className={`block px-4 py-2 text-sm ${
                      location.pathname === "/gioi-thieu/he-thong"
                        ? "bg-purple-100 font-bold text-purple-800"
                        : "text-purple-700 hover:bg-purple-100"
                    }`}
                    onClick={() => setOpenDropdown(null)}
                  >
                    Hệ thống GenderCare
                  </Link>
                </li>
                <li>
                  <Link
                    to="/gioi-thieu/doi-ngu"
                    className={`block px-4 py-2 text-sm ${
                      location.pathname === "/gioi-thieu/doi-ngu"
                        ? "bg-purple-100 font-bold text-purple-800"
                        : "text-purple-700 hover:bg-purple-100"
                    }`}
                    onClick={() => setOpenDropdown(null)}
                  >
                    Đội ngũ chuyên gia
                  </Link>
                </li>
                <li>
                  <Link
                    to="/gioi-thieu/tuyen-dung"
                    className={`block px-4 py-2 text-sm ${
                      location.pathname === "/gioi-thieu/tuyen-dung"
                        ? "bg-purple-100 font-bold text-purple-800"
                        : "text-purple-700 hover:bg-purple-100"
                    }`}
                    onClick={() => setOpenDropdown(null)}
                  >
                    Tuyển dụng
                  </Link>
                </li>
              </ul>
            )}
          </li>

          {/* Dịch vụ */}
          <li className="relative">
            <div
              onClick={() => toggleDropdown("dich-vu")}
              className={`px-4 py-1 rounded-md cursor-pointer inline-flex items-center ${
                isInDichVu ? "bg-purple-600 text-white" : "hover:text-purple-600"
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
                  <Link
                    to="/consultant"
                    className={`block px-4 py-2 text-sm ${
                      location.pathname === "/consultant"
                        ? "bg-purple-100 font-bold text-purple-800"
                        : "text-purple-700 hover:bg-purple-100"
                    }`}
                    onClick={() => setOpenDropdown(null)}
                  >
                    Tư vấn
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
              </ul>
            )}
          </li>

          {/* Cẩm nang */}
          <li className="relative">
            <div
              onClick={() => toggleDropdown("cam-nang")}
              className={`px-4 py-1 rounded-md cursor-pointer inline-flex items-center ${
                isInCamNang
                  ? "bg-purple-600 text-white"
                  : "hover:text-purple-600"
              }`}
            >
              <span>Cẩm nang</span>
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
            {openDropdown === "cam-nang" && (
              <ul className="absolute left-0 mt-2 w-64 bg-white border border-purple-200 rounded-md shadow-lg z-10">
                <li>
                  <Link
                    to="/cam-nang/luu-y-truoc"
                    className={`block px-4 py-2 text-sm ${
                      location.pathname === "/cam-nang/luu-y-truoc"
                        ? "bg-purple-100 font-bold text-purple-800"
                        : "text-purple-700 hover:bg-purple-100"
                    }`}
                    onClick={() => setOpenDropdown(null)}
                  >
                    Lưu ý trước xét nghiệm
                  </Link>
                  <Link
                    to="/cam-nang/luu-y-sau"
                    className={`block px-4 py-2 text-sm ${
                      location.pathname === "/cam-nang/luu-y-sau"
                        ? "bg-purple-100 font-bold text-purple-800"
                        : "text-purple-700 hover:bg-purple-100"
                    }`}
                    onClick={() => setOpenDropdown(null)}
                  >
                    Lưu ý sau xét nghiệm
                  </Link>
                </li>
              </ul>
            )}
          </li>

          {/* Các menu khác */}
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

        {/* User section */}
        <div className="flex space-x-4 items-center">
          

          {isLoggedIn ? (
            <div className="relative">
              <button
                onClick={() => toggleDropdown("user-menu")}
                className="text-purple-700 font-semibold text-sm hover:underline"
              >
                👤
              </button>
              {openDropdown === "user-menu" && (
                <ul className="absolute right-0 mt-2 w-44 bg-white border border-purple-200 rounded-md shadow-lg z-10 text-sm">
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

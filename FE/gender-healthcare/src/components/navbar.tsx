import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const toggleDropdown = (menu: string) =>
    setOpenDropdown(openDropdown === menu ? null : menu);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    navigate("/login");
  };

  return (
    <nav className="bg-purple-100 border-t border-b border-purple-200 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">
        <ul className="flex space-x-6 font-semibold text-purple-800 text-sm relative">
          <li><Link to="/" className="text-white bg-purple-600 px-4 py-1 rounded-md">Trang chủ</Link></li>
          <li><Link to="/gioi-thieu" className="hover:text-purple-600">Giới thiệu</Link></li>

          <li className="relative">
            <button
              onClick={() => toggleDropdown("dich-vu")}
              className="hover:text-purple-600 focus:outline-none"
            >
              Dịch vụ ▾
            </button>
            {openDropdown === "dich-vu" && (
              <ul className="absolute left-0 mt-2 w-56 bg-white border border-purple-200 rounded-md shadow-lg z-10">
                <li>
                  <Link
                    to="/cycle-tracking"
                    className="block px-4 py-2 text-sm text-purple-700 hover:bg-purple-100"
                    onClick={() => setOpenDropdown(null)}
                  >
                    Chu kỳ kinh nguyệt
                  </Link>
                </li>
              </ul>
            )}
          </li>

          <li><Link to="/cam-nang" className="hover:text-purple-600">Cẩm nang</Link></li>
          <li><Link to="/bang-gia" className="hover:text-purple-600">Bảng giá</Link></li>
          <li><Link to="/benh-hoc" className="hover:text-purple-600">Bệnh học</Link></li>
          <li><Link to="/tin-tuc" className="hover:text-purple-600">Tin tức</Link></li>
        </ul>

        <div className="flex space-x-4 items-center">
          <button title="Thông báo" className="text-purple-600 text-xl hover:text-purple-800">🔔</button>
          {isLoggedIn ? (
            <div className="relative">
              <button onClick={() => toggleDropdown("user-menu")} className="text-purple-700 font-semibold text-sm hover:underline">👤</button>
              {openDropdown === "user-menu" && (
                <ul className="absolute right-0 mt-2 w-40 bg-white border border-purple-200 rounded-md shadow-lg z-10 text-sm">
                  <li>
                    <Link to="/profile" className="block px-4 py-2 text-purple-700 hover:bg-purple-100">Profile</Link>
                  </li>
                  <li>
                    <Link to="/history" className="block px-4 py-2 text-purple-700 hover:bg-purple-100">Lịch sử</Link>
                  </li>
                  <li>
                    <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-red-600 hover:bg-purple-100">Logout</button>
                  </li>
                </ul>
              )}
            </div>
          ) : (
            <Link to="/login" className="text-red-600 font-bold text-sm hover:underline">Login</Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
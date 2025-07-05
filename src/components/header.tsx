const Header = ({
  logo = "⚥",
  title = "Gender",
  brand = "Care",
  subtitle = "Hệ thống chăm sóc sức khỏe giới tính cho trẻ em & người lớn",
  tagline = "An toàn – Uy tín – Chất lượng hàng đầu Việt Nam"
}) => {
  return (
    <header className="bg-white shadow py-6">
      <div className="max-w-7xl mx-auto flex flex-col items-center text-center space-y-2">
        <div className="flex items-center text-3xl font-bold text-purple-800">
          <span className="mr-2">{logo}</span>
          {title}<span className="text-green-600">{brand}</span>
        </div>
        <div className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
          {subtitle}
        </div>
        <div className="text-sm text-purple-600 font-medium">
          {tagline}
        </div>
      </div>
    </header>
  );
};

export default Header;

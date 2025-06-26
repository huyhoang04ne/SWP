const Footer = () => {
  return (
    <footer className="bg-white border-t py-6 text-sm text-gray-600">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="flex items-center space-x-2">
            <span className="text-xl text-purple-600">⚥</span>
            <span className="font-bold text-gray-800">Gender<span className="text-green-600">Care</span></span>
          </div>
          <div className="text-center md:text-right leading-relaxed">
            Địa chỉ: 123 Nguyễn Văn Cừ, Quận 5, TP.HCM <br />
            Hotline: 028 7102 6595 | Email: support@gendercare.vn
          </div>
        </div>
      </footer>
  );
};

export default Footer;

import React, { useState } from "react";
import dayjs from "dayjs";
import "dayjs/locale/vi";
import { bookConsultation } from "../../api/consultationApi";

dayjs.locale("vi");

const shifts = [
  { label: "Sáng", time: "08:00 - 12:00" },
  { label: "Trưa", time: "12:00 - 16:00" },
  { label: "Chiều", time: "16:00 - 20:00" },
];

const userBookedShifts: Record<string, string[]> = {
  "2025-07-13": ["Trưa"],
  "2025-07-14": [],
  "2025-07-15": ["Sáng", "Chiều"],
};

const experts = [
  {
    name: "ThS. Nguyễn Minh Thắng",
    title: "Tư vấn tâm lý & giới tính",
    image: "/Images/tuvanvien4.jpg",
    assignedShiftsByDate: {
      "2025-07-13": ["Sáng", "Chiều"],
      "2025-07-14": ["Sáng", "Chiều"],
      "2025-07-15": ["Chiều"],
      "2025-07-16": ["Sáng", "Chiều"],
    },
    profile: {
      introduction: "Chuyên gia tư vấn LGBTQ+ với hơn 10 năm kinh nghiệm.",
      experience: "- Tư vấn cấp cao từ 2015\n- Tư vấn cá nhân & nhóm",
      degrees: "- Thạc sĩ Tâm lý học\n- Chứng chỉ CBT",
    },
  },
  {
    name: "ThS. Nguyễn Tấn Phúc",
    title: "Tư vấn viên xét nghiệm STI",
    image: "/Images/tuvanvien2.jpg",
    assignedShiftsByDate: {
      "2025-07-13": ["Trưa"],
      "2025-07-14": ["Trưa"],
      "2025-07-15": ["Sáng", "Trưa"],
    },
    profile: {
      introduction: "Chuyên gia xét nghiệm và điều trị STIs.",
      experience: "- Tư vấn chính tại GenderCare\n- Cộng tác Trung tâm Xét nghiệm Quốc gia",
      degrees: "- Thạc sĩ Y tế công cộng\n- Chứng chỉ chuyên sâu về STIs",
    },
  },
];

const ConsultationPage = () => {
  const today = dayjs();
  const next3Days = [1, 2, 3].map((i) => today.add(i, "day"));
  const [expandedDays, setExpandedDays] = useState([false, false, false]);
  const [showForm, setShowForm] = useState(false);
  const [formDate, setFormDate] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "",
    email: "",
    phone: "",
    shift: "",
    note: "",
  });
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);

  const toggleExpand = (i: number) => {
    const copy = [...expandedDays];
    copy[i] = !copy[i];
    setExpandedDays(copy);
  };

  const getShiftStatus = (dateStr: string, shiftLabel: string): "available" | "full" => {
    const booked = (userBookedShifts as Record<string, string[]>)[dateStr];
    return booked?.includes(shiftLabel) ? "full" : "available";
  };

  const getStatusColor = (status: string) =>
    status === "full" ? "bg-red-500" : "bg-green-500";

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setFormError(null);
    setFormSuccess(null);

    const { name, age, gender, email, phone, shift } = formData;
    if (!name || !age || !gender || !email || !phone || !shift || !formDate) {
      setFormError("Bạn phải điền đầy đủ thông tin");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await bookConsultation(
        {
          ...formData,
          date: formDate,
        },
        token || ""
      );

      setFormSuccess("Đã đăng ký thành công");
      setFormData({
        name: "",
        age: "",
        gender: "",
        email: "",
        phone: "",
        shift: "",
        note: "",
      });
      setFormDate("");
    } catch (error: any) {
      setFormError(error.message || "Đăng ký không thành công");
    }
  };
   return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold text-purple-700 mb-4">Trang Tư Vấn</h1>
      <div className="w-[200px] h-[3px] bg-purple-800 mb-6"></div>
      {showForm && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
            <h2 className="text-lg font-semibold mb-2 text-purple-700">Đăng ký lịch tư vấn</h2>
            <input name="name" placeholder="Tên" value={formData.name} onChange={handleInputChange} className="w-full mb-2 border px-2 py-1 rounded" />
            <input name="age" placeholder="Tuổi" value={formData.age} onChange={handleInputChange} className="w-full mb-2 border px-2 py-1 rounded" />
            <select name="gender" value={formData.gender} onChange={handleInputChange} className="w-full mb-2 border px-2 py-1 rounded">
              <option value="">-- Chọn giới tính --</option>
              <option value="Nam">Nam</option>
              <option value="Nữ">Nữ</option>
              <option value="Khác">Khác</option>
            </select>
            <input name="email" placeholder="Email" value={formData.email} onChange={handleInputChange} className="w-full mb-2 border px-2 py-1 rounded" />
            <input name="phone" placeholder="Số điện thoại" value={formData.phone} onChange={handleInputChange} className="w-full mb-2 border px-2 py-1 rounded" />
            <select name="shift" value={formData.shift} onChange={handleInputChange} className="w-full mb-2 border px-2 py-1 rounded">
              <option value="">-- Chọn ca --</option>
              {shifts.map((sh) => (
                <option key={sh.label} value={sh.label}>{`${sh.label} (${sh.time})`}</option>
              ))}
            </select>
            <textarea name="note" placeholder="Ghi chú" value={formData.note} onChange={handleInputChange} className="w-full mb-2 border px-2 py-1 rounded" />
            {formError && <p className="text-red-600 text-sm mb-2">❌ {formError}</p>}
            {formSuccess && <p className="text-green-600 text-sm mb-2">✅ {formSuccess}</p>}
            <div className="flex justify-between mt-2">
              <button className="px-3 py-1 bg-gray-300 rounded" onClick={() => setShowForm(false)}>Đóng</button>
              <button className="px-4 py-1 bg-purple-600 text-white rounded" onClick={handleSubmit}>Đăng ký</button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {next3Days.map((date, idx) => {
          const dateStr = date.format("YYYY-MM-DD");

          return (
            <div key={idx} className="border rounded-lg p-4 shadow bg-white">
              <h2 className="text-center text-purple-700 font-semibold text-sm mb-2">
                {date.format("dddd, DD/MM")}
              </h2>
              <img src="/Images/tuvanvien.jpg" alt="TVV" className="w-full h-40 rounded object-cover mb-2" />
              <p className="text-center font-semibold text-sm">Hệ Thống Tư Vấn Viên GenderCare</p>
              <p className="text-center text-gray-600 text-xs mb-3">Là bạn đồng hành trên hành trình của bạn</p>

              <div className="space-y-1 mb-3">
                {shifts.map((sh) => {
                  const status = getShiftStatus(dateStr, sh.label);
                  return (
                    <div
                      key={sh.label}
                      className={`flex justify-between items-center px-2 py-1 rounded text-white text-xs font-medium ${getStatusColor(status)}`}
                    >
                      <span>{sh.label} ({sh.time})</span>
                      <span>{status === "available" ? "Còn trống" : "Đã đầy"}</span>
                    </div>
                  );
                })}
              </div>

              <div className="flex justify-between text-xs">
                <button onClick={() => setShowForm(true)} className="bg-purple-600 text-white px-3 py-1 rounded hover:bg-purple-700">Đặt ngay</button>
                <button onClick={() => toggleExpand(idx)} className="bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded">
                  {expandedDays[idx] ? "Ẩn chi tiết" : "Xem thêm"}
                </button>
              </div>

              {expandedDays[idx] && (
                <div className="mt-3 pt-2 border-t space-y-4 max-h-64 overflow-y-auto text-xs">
                  {experts
                    .filter((ex) => (ex.assignedShiftsByDate as Record<string, string[]>)[dateStr]?.length > 0)
                    .map((ex) => {
                      const assignedShifts = (ex.assignedShiftsByDate as Record<string, string[]>)[dateStr] || [];
                      return (
                        <div key={`${ex.name}-${dateStr}`} className="flex space-x-3 mb-3">
                          <img src={ex.image} alt={ex.name} className="w-16 h-20 rounded object-cover" />
                          <div>
                            <p className="font-semibold text-purple-700">{ex.name}</p>
                            <p className="italic text-gray-600">{ex.title}</p>
                            <p className="mt-1">{ex.profile.introduction}</p>
                            {assignedShifts.map((shLabel: string) => {
                              const sh = shifts.find((s) => s.label === shLabel);
                              const status = getShiftStatus(dateStr, shLabel);
                              return (
                                <p key={shLabel} className="text-[11px] mt-1">
                                  👉 Ca: <strong>{sh?.label}</strong> ({sh?.time}) –
                                  <span className={`ml-1 px-1 rounded ${getStatusColor(status)} text-white`}>
                                    {status === "full" ? "Đã đầy" : "Còn trống"}
                                  </span>
                                </p>
                              );
                            })}
                            <pre className="whitespace-pre-wrap mt-2">{ex.profile.experience}</pre>
                            <pre className="whitespace-pre-wrap">{ex.profile.degrees}</pre>
                          </div>
                        </div>
                      );
                    })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-8 flex justify-center gap-4">
        <button onClick={() => setShowForm(true)} className="bg-purple-700 text-white px-4 py-2 rounded hover:bg-purple-800">Đặt lịch mới</button>
        <button className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400">Xem lịch đã đặt</button>
      </div>
    </div>
  );
};

export default ConsultationPage;

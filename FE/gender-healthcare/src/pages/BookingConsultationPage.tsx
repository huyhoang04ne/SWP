import React, { useState, useEffect } from "react";
import { bookConsultation } from "../api/consultationApi";
import axios from "../api/axiosInstance";
import Header from "../components/header";
import Footer from "../components/Footer";
import Navbar from "../components/navbar";

const shifts = [
  { value: "morning", label: "Sáng" },
  { value: "afternoon", label: "Chiều" },
  { value: "evening", label: "Tối" },
];

const BookingConsultationPage: React.FC = () => {
  const [counselors, setCounselors] = useState<any[]>([]);
  const [counselorId, setCounselorId] = useState<string>("");
  const [date, setDate] = useState<string>("");
  const [shift, setShift] = useState<string>("");
  const [note, setNote] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    const fetchCounselors = async () => {
      try {
        const res = await axios.get("/counselors");
        setCounselors(res.data);
      } catch (err) {
        setMessage("Không lấy được danh sách tư vấn viên");
      }
    };
    fetchCounselors();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    if (!date || !shift) {
      setMessage("Vui lòng chọn đầy đủ ngày và ca làm việc.");
      return;
    }
    setLoading(true);
    try {
      await bookConsultation({
        counselorId: counselorId ? Number(counselorId) : undefined,
        date,
        shift,
        note: note.trim() || undefined,
      });
      setLoading(false);
      setMessage("Đặt lịch thành công! Vui lòng chờ xác nhận.");
    } catch (err: any) {
      setLoading(false);
      setMessage(err?.response?.data?.message || "Đặt lịch thất bại. Vui lòng thử lại.");
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col font-[Segoe_UI]">
      <Header />
      <Navbar />
      <main className="flex-grow flex items-center justify-center">
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-lg">
          <h1 className="text-2xl font-bold text-purple-700 mb-6 text-center">Đặt lịch tư vấn mới</h1>
          {/* Chọn tư vấn viên */}
          <label className="block mb-2 font-semibold">Chọn tư vấn viên</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
            {counselors.length > 0 ? counselors.map((c) => (
              <button
                type="button"
                key={c.id}
                className={`flex items-center gap-2 border rounded-lg px-3 py-2 transition ${counselorId === c.id ? "border-purple-600 bg-purple-50" : "border-gray-200"}`}
                onClick={() => setCounselorId(c.id)}
              >
                {c.avatar && <img src={c.avatar} alt={c.fullName || c.email} className="w-8 h-8 rounded-full" />}
                <div>
                  <div className="font-medium">{c.fullName || c.email}</div>
                  <div className="text-xs text-gray-500">{c.specialty || c.email}</div>
                </div>
              </button>
            )) : <div className="text-red-500">Không có tư vấn viên</div>}
          </div>
          {/* Chọn ngày */}
          <label className="block mb-2 font-semibold">Chọn ngày</label>
          <input
            type="date"
            className="w-full border rounded-lg px-3 py-2 mb-4"
            value={date}
            onChange={e => setDate(e.target.value)}
            min={new Date().toISOString().split("T")[0]}
            required
          />
          {/* Chọn ca làm việc */}
          <label className="block mb-2 font-semibold">Chọn ca làm việc</label>
          <div className="flex gap-2 mb-4">
            {shifts.map(s => (
              <button
                type="button"
                key={s.value}
                className={`px-4 py-2 rounded-lg border transition ${shift === s.value ? "bg-purple-600 text-white border-purple-600" : "bg-gray-100 border-gray-200"}`}
                onClick={() => setShift(s.value)}
              >
                {s.label}
              </button>
            ))}
          </div>
          {/* Ghi chú */}
          <label className="block mb-2 font-semibold">Ghi chú (nếu có)</label>
          <textarea
            className="w-full border rounded-lg px-3 py-2 mb-4"
            rows={2}
            value={note}
            onChange={e => setNote(e.target.value)}
            placeholder="Nhập ghi chú cho buổi tư vấn (nếu có)"
          />
          {/* Thông báo */}
          {message && <div className="text-center text-sm mb-2 text-pink-600">{message}</div>}
          {/* Nút gửi */}
          <button
            type="submit"
            className="w-full bg-purple-600 text-white rounded-lg py-2 font-semibold hover:bg-purple-700 disabled:opacity-60"
            disabled={loading}
          >
            {loading ? "Đang gửi..." : "Đặt lịch tư vấn"}
          </button>
        </form>
      </main>
      <Footer />
    </div>
  );
};

export default BookingConsultationPage; 
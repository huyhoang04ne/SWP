import React, { useState } from "react";
import axios from "../api/axiosInstance";

const shiftOptions = [
  { value: 0, label: "Sáng" },
  { value: 1, label: "Chiều" },
  { value: 2, label: "Tối" },
];

interface Counselor {
  id: string;
  fullName: string;
  email: string;
}

const AvailableCounselorsList = () => {
  const [date, setDate] = useState("");
  const [timeSlot, setTimeSlot] = useState(0);
  const [counselors, setCounselors] = useState<Counselor[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSearch = async () => {
    if (!date) {
      setMessage("Vui lòng chọn ngày");
      return;
    }
    setLoading(true);
    setMessage("");
    try {
      const res = await axios.get("/api/Schedule/available-counselors", {
        params: {
          date: date,
          timeSlot: timeSlot
        }
      });
      setCounselors(res.data);
      if (res.data.length === 0) setMessage("Không có tư vấn viên rảnh");
    } catch (err: any) {
      setMessage(err.response?.data?.message || "Lỗi khi lấy danh sách tư vấn viên rảnh");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-lg font-semibold mb-2">Danh sách tư vấn viên rảnh</h2>
      <div className="flex gap-2 mb-2">
        <input
          type="date"
          value={date}
          onChange={e => setDate(e.target.value)}
          className="border rounded px-2 py-1"
        />
        <select
          value={timeSlot}
          onChange={e => setTimeSlot(Number(e.target.value))}
          className="border rounded px-2 py-1"
        >
          {shiftOptions.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <button
          onClick={handleSearch}
          className="bg-green-600 text-white px-4 py-2 rounded"
          disabled={loading}
        >
          {loading ? "Đang tìm..." : "Tìm kiếm"}
        </button>
      </div>
      {message && <div className="text-sm text-red-600 mb-2">{message}</div>}
      <ul>
        {counselors.map(c => (
          <li key={c.id} className="border-b py-1">{c.fullName} ({c.email})</li>
        ))}
      </ul>
    </div>
  );
};

export default AvailableCounselorsList; 
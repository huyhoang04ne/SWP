import React, { useState, useEffect } from "react";
import axios from "../api/axiosInstance";

interface Counselor {
  id: string;
  fullName: string;
  email: string;
}

const shiftOptions = [
  { value: 0, label: "Sáng" },
  { value: 1, label: "Chiều" },
  { value: 2, label: "Tối" },
];

const AssignShiftForm = () => {
  const [counselors, setCounselors] = useState<Counselor[]>([]);
  const [counselorId, setCounselorId] = useState("");
  const [workDate, setWorkDate] = useState("");
  const [timeSlot, setTimeSlot] = useState(0);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Gọi API lấy danh sách tư vấn viên (giả định có endpoint /api/counselors)
    const fetchCounselors = async () => {
      try {
        const res = await axios.get("/api/counselors");
        setCounselors(res.data);
      } catch (err) {
        setMessage("Không lấy được danh sách tư vấn viên");
      }
    };
    fetchCounselors();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      await axios.post("/api/Schedule/assign", {
        CounselorId: counselorId,
        WorkDate: workDate,
        TimeSlot: timeSlot,
        IsAvailable: true,
        Notes: ""
      });
      setMessage("Phân ca thành công!");
    } catch (err: any) {
      setMessage(err.response?.data?.message || "Phân ca thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow mb-4">
      <h2 className="text-lg font-semibold mb-2">Phân ca cho tư vấn viên</h2>
      <div className="mb-2">
        <label className="block mb-1">Tư vấn viên</label>
        <select
          value={counselorId}
          onChange={e => setCounselorId(e.target.value)}
          className="border rounded px-2 py-1 w-full"
          required
        >
          <option value="">-- Chọn tư vấn viên --</option>
          {counselors.map(c => (
            <option key={c.id} value={c.id}>{c.fullName} ({c.email})</option>
          ))}
        </select>
      </div>
      <div className="mb-2">
        <label className="block mb-1">Ngày làm việc</label>
        <input
          type="date"
          value={workDate}
          onChange={e => setWorkDate(e.target.value)}
          className="border rounded px-2 py-1 w-full"
          required
        />
      </div>
      <div className="mb-2">
        <label className="block mb-1">Ca làm việc</label>
        <select
          value={timeSlot}
          onChange={e => setTimeSlot(Number(e.target.value))}
          className="border rounded px-2 py-1 w-full"
        >
          {shiftOptions.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded"
        disabled={loading}
      >
        {loading ? "Đang phân ca..." : "Phân ca"}
      </button>
      {message && <div className="mt-2 text-sm text-red-600">{message}</div>}
    </form>
  );
};

export default AssignShiftForm; 
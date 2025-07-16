import React, { useState, useEffect, useRef } from "react";
import { bookConsultation } from "../api/consultationApi";
import axios from "../api/axiosInstance";
import Header from "../components/header";
import Footer from "../components/Footer";
import Navbar from "../components/navbar";
import PaymentModal from "../components/PaymentModal";

const SHIFT_OPTIONS = [
  { id: 0, value: "morning", label: "Sáng", startTime: "08:00", endTime: "12:00" },
  { id: 1, value: "afternoon", label: "Chiều", startTime: "13:00", endTime: "17:00" },
  { id: 2, value: "evening", label: "Tối", startTime: "18:00", endTime: "22:00" },
];

const BookingConsultationPage: React.FC = () => {
  const [counselors, setCounselors] = useState<any[]>([]);
  const [counselorId, setCounselorId] = useState<string>("");
  const [date, setDate] = useState<string>("");
  const [shift, setShift] = useState<string>("");
  const [note, setNote] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string>("");
  const [availableSlots, setAvailableSlots] = useState<{ [date: string]: number[] }>({});
  const [counselorWorkingSlots, setCounselorWorkingSlots] = useState<{ [date: string]: { timeSlot: number, isAvailable: boolean, status: string }[] }>({});
  const [loadingWorkingSlots, setLoadingWorkingSlots] = useState(false);
  const [bookingResult, setBookingResult] = useState<{
    transferCode: string;
    appointmentInfo: {
      date: string;
      timeSlot: string;
      counselorName: string;
    };
  } | null>(null);
  const messageRef = useRef<HTMLDivElement>(null);

  // Lấy danh sách tư vấn viên
  useEffect(() => {
    const fetchCounselors = async () => {
      try {
        const res = await axios.get("/counselor");
        setCounselors(res.data);
      } catch (err) {
        setMessage("Không lấy được danh sách tư vấn viên");
      }
    };
    fetchCounselors();
  }, []);

  // Lấy available slots khi chọn tư vấn viên hoặc vào trang
  useEffect(() => {
    const fetchAvailableSlots = async () => {
      setLoading(true);
      setMessage("");
      try {
        const today = new Date();
        const fromDate = today.toISOString().split('T')[0];
        const toDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 30)
          .toISOString().split('T')[0];
        let url = `/schedule/available-slots?fromDate=${fromDate}&toDate=${toDate}`;
        if (counselorId) url += `&counselorId=${counselorId}`;
        const res = await axios.get(url);
        const slotMap: { [date: string]: number[] } = {};
        res.data.forEach((item: any) => {
          slotMap[item.date.split('T')[0]] = item.timeSlots;
        });
        setAvailableSlots(slotMap);
        // Reset ngày/ca nếu không còn hợp lệ
        if (date && !slotMap[date]) setDate("");
        if (date && shift) {
          const shiftOption = SHIFT_OPTIONS.find(s => s.value === shift);
          if (!slotMap[date] || !slotMap[date].includes(shiftOption?.id || 0)) setShift("");
        }
      } catch (err) {
        setMessage("Không lấy được lịch trống");
        setAvailableSlots({});
      } finally {
        setLoading(false);
      }
    };
    fetchAvailableSlots();
    // eslint-disable-next-line
  }, [counselorId]);

  // Lấy counselor working slots khi chọn counselor
  useEffect(() => {
    const fetchCounselorWorkingSlots = async () => {
      if (!counselorId) {
        setCounselorWorkingSlots({});
        return;
      }
      setLoadingWorkingSlots(true);
      try {
        const today = new Date();
        const fromDate = today.toISOString().split('T')[0];
        const toDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 30)
          .toISOString().split('T')[0];
        
        console.log('Fetching counselor working slots for:', counselorId, fromDate, toDate);
        
        const res = await axios.get(`/schedule/counselor-working-slots?counselorId=${counselorId}&fromDate=${fromDate}&toDate=${toDate}`);
        
        console.log('API Response:', res.data);
        
        const workingSlotMap: { [date: string]: { timeSlot: number, isAvailable: boolean, status: string }[] } = {};
        res.data.forEach((item: any) => {
          const dateKey = item.date.split('T')[0];
          workingSlotMap[dateKey] = item.workingSlots;
        });
        
        console.log('Parsed working slots:', workingSlotMap);
        setCounselorWorkingSlots(workingSlotMap);
      } catch (err) {
        console.error('Error fetching counselor working slots:', err);
        setCounselorWorkingSlots({});
      } finally {
        setLoadingWorkingSlots(false);
      }
    };
    fetchCounselorWorkingSlots();
    // eslint-disable-next-line
  }, [counselorId]);

  // Khi chọn ngày, reset ca nếu ca không còn hợp lệ
  useEffect(() => {
    if (date && shift) {
      const shiftOption = SHIFT_OPTIONS.find(s => s.value === shift);
      if (!availableSlots[date] || !availableSlots[date].includes(shiftOption?.id || 0)) setShift("");
    }
    // eslint-disable-next-line
  }, [date]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    if (!date || !shift) {
      setMessage("Vui lòng chọn đầy đủ ngày và ca làm việc.");
      setTimeout(() => {
        messageRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 100);
      return;
    }
    setLoading(true);
    try {
      const response = await bookConsultation({
        counselorId: counselorId ? counselorId : undefined,
        date,
        shift,
        note: note.trim() || undefined,
      });
      
      // Lấy thông tin từ response
      const transferCode = response.data?.transferCode;
      const counselorName = counselors.find(c => c.id === counselorId)?.fullName || 'Tư vấn viên';
      
      if (transferCode) {
        setBookingResult({
          transferCode,
          appointmentInfo: {
            date,
            timeSlot: shift,
            counselorName
          }
        });
      }
      
      setLoading(false);
      setMessage("Đặt lịch thành công! Vui lòng thanh toán để hoàn tất.");
      setDate(""); setShift(""); setNote(""); setCounselorId("");
    } catch (err: any) {
      setLoading(false);
      setMessage(err?.response?.data?.message || "Đặt lịch thất bại. Vui lòng thử lại.");
      setTimeout(() => {
        messageRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 100);
    }
  };

  // Kiểm tra ca có available không
  const isShiftAvailable = (shiftId: number) => {
    return date && availableSlots[date] && availableSlots[date].includes(shiftId);
  };

  // Kiểm tra counselor có ca làm việc không
  const hasWorkingShift = (shiftId: number) => {
    if (!counselorId || !date) return false;
    // Logic này cần được cải thiện - hiện tại chỉ dựa vào availableSlots
    // Trong thực tế, cần API riêng để lấy tất cả ca counselor có làm việc
    // Tạm thời dùng logic: nếu ca không có trong availableSlots và counselor đã chọn
    // thì có thể counselor chưa được phân ca hoặc ca đã bị book
    return true; // Tạm thời luôn true, sẽ cải thiện sau
  };

  // Lấy trạng thái ca
  const getShiftStatus = (shiftId: number) => {
    if (!date) return { available: false, text: "Chưa chọn ngày", color: "text-gray-400", reason: "" };
    
    // Debug: log dữ liệu
    console.log('Debug - counselorId:', counselorId);
    console.log('Debug - date:', date);
    console.log('Debug - counselorWorkingSlots:', counselorWorkingSlots);
    console.log('Debug - availableSlots:', availableSlots);
    
    // Nếu đã chọn counselor
    if (counselorId) {
      const workingSlots = counselorWorkingSlots[date] || [];
      const workingSlot = workingSlots.find(slot => slot.timeSlot === shiftId);
      
      console.log('Debug - workingSlots for date:', workingSlots);
      console.log('Debug - workingSlot for shiftId:', shiftId, workingSlot);
      
      if (!workingSlot) {
        // Counselor chưa được phân ca này
        return { available: false, text: "Không có ca làm việc", color: "text-orange-600", reason: "Counselor chưa được phân ca này" };
      } else if (workingSlot.isAvailable) {
        // Counselor có ca làm việc và ca rảnh
        return { available: true, text: "Rảnh", color: "text-green-600", reason: "Có thể đặt lịch" };
      } else {
        // Counselor có ca làm việc nhưng đã bị book
        return { available: false, text: "Đã book", color: "text-red-600", reason: "Ca đã có người khác đặt" };
      }
    } else {
      // Chưa chọn counselor, hiển thị trạng thái chung
      if (isShiftAvailable(shiftId)) {
        return { available: true, text: "Có counselor rảnh", color: "text-blue-600", reason: "Chọn counselor để đặt" };
      } else {
        return { available: false, text: "Tất cả đã book", color: "text-red-600", reason: "Tất cả counselor đều bận" };
      }
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col font-[Segoe_UI]">
      <Header />
      <Navbar />
      <main className="flex-grow flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-2xl">
          <h1 className="text-2xl font-bold text-purple-700 mb-8 text-center">Đặt lịch tư vấn mới</h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Thông báo lỗi/thành công */}
            {message && !bookingResult && (
              <div
                ref={messageRef}
                className={`flex items-center justify-between gap-2 px-4 py-3 mb-3 rounded-lg shadow animate-fade-in border text-base font-semibold ${
                  message.includes('thành công')
                    ? 'bg-green-50 border-green-400 text-green-700'
                    : 'bg-red-50 border-red-400 text-red-700'
                }`}
                role="alert"
              >
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{message.includes('thành công') ? '✅' : '❗'}</span>
                  <span>{message}</span>
                </div>
                <button
                  onClick={() => setMessage('')}
                  className="ml-2 text-lg font-bold focus:outline-none"
                  aria-label="Đóng thông báo"
                  type="button"
                >×</button>
              </div>
            )}

            {/* Chọn tư vấn viên */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">Chọn tư vấn viên</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {counselors.length > 0 ? counselors.map((c) => (
                  <button
                    type="button"
                    key={c.id}
                    className={`flex items-center gap-3 border rounded-lg px-4 py-3 transition-all duration-200 ${
                      counselorId === c.id 
                        ? "border-purple-600 bg-purple-50 shadow-md scale-105" 
                        : "border-gray-200 hover:border-purple-300 hover:bg-purple-25"
                    }`}
                    onClick={() => setCounselorId(c.id === counselorId ? "" : c.id)}
                  >
                    {c.avatar && <img src={c.avatar} alt={c.fullName || c.email} className="w-10 h-10 rounded-full" />}
                    <div className="text-left">
                      <div className="font-medium text-gray-900">{c.fullName || c.email}</div>
                      <div className="text-xs text-gray-500">{c.specialty || 'Tư vấn viên'}</div>
                    </div>
                  </button>
                )) : (
                  <div className="col-span-2 text-center py-4 text-red-500 bg-red-50 rounded-lg">
                    <span className="text-2xl">👥</span>
                    <div className="mt-2">Không có tư vấn viên</div>
                  </div>
                )}
              </div>
            </div>

            {/* Chọn ngày */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">Chọn ngày</label>
              <input
                type="date"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                value={date}
                onChange={e => setDate(e.target.value)}
                min={new Date().toISOString().split("T")[0]}
                required
                list="available-dates"
                disabled={Object.keys(availableSlots).length === 0 || loading}
              />
              <datalist id="available-dates">
                {Object.keys(availableSlots).map(d => (
                  <option key={d} value={d} />
                ))}
              </datalist>
              {date && (
                <div className="text-sm text-gray-600">
                  📅 {new Date(date).toLocaleDateString('vi-VN', {
                    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
                  })}
                </div>
              )}
            </div>

            {/* Chọn ca làm việc */}
            {date && (
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">
                  Chọn ca làm việc
                  {counselorId && loadingWorkingSlots && (
                    <span className="ml-2 text-xs text-gray-500">(Đang tải...)</span>
                  )}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {SHIFT_OPTIONS.map((shiftOption) => {
                    const status = getShiftStatus(shiftOption.id);
                    const isSelected = shift === shiftOption.value;
                    const isAvailable = status.available;
                    
                    return (
                      <button
                        type="button"
                        key={shiftOption.value}
                        className={`flex flex-col items-center p-4 rounded-lg border transition-all duration-200 ${
                          isSelected
                            ? "border-purple-600 bg-purple-600 text-white shadow-lg scale-105"
                            : isAvailable
                            ? "border-gray-300 bg-white hover:border-purple-400 hover:bg-purple-25"
                            : "border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed"
                        }`}
                        onClick={() => isAvailable && setShift(shiftOption.value)}
                        disabled={!isAvailable || loading || Boolean(counselorId && loadingWorkingSlots)}
                        title={status.reason}
                      >
                        <div className="text-lg font-semibold mb-1">{shiftOption.label}</div>
                        <div className="text-xs opacity-80">{shiftOption.startTime} - {shiftOption.endTime}</div>
                        <div className={`text-xs mt-2 ${isSelected ? 'text-purple-100' : status.color}`}>
                          {isSelected ? '✓ Đã chọn' : status.text}
                        </div>
                        {status.reason && !isSelected && (
                          <div className="text-xs mt-1 text-gray-500 max-w-full truncate">
                            {status.reason}
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Ghi chú */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">Ghi chú (nếu có)</label>
              <textarea
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors resize-none"
                rows={3}
                value={note}
                onChange={e => setNote(e.target.value)}
                placeholder="Nhập ghi chú cho buổi tư vấn (nếu có)..."
                disabled={loading}
              />
            </div>

            {/* Payment Success Message */}
            {bookingResult && (
              <div className="mb-4 p-6 bg-green-50 border border-green-200 rounded-lg">
                <div className="text-center">
                  <div className="text-4xl mb-3">🎉</div>
                  <h3 className="font-semibold text-green-800 mb-2 text-lg">Đặt lịch thành công!</h3>
                  <p className="text-sm text-green-700 mb-4">
                    Mã chuyển khoản của bạn: <strong className="font-mono text-lg">{bookingResult.transferCode}</strong>
                  </p>
                  <button
                    onClick={() => setBookingResult(null)}
                    className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
                  >
                    Thanh toán ngay
                  </button>
                </div>
              </div>
            )}
            
            {/* Nút gửi */}
            <button
              type="submit"
              disabled={loading || Object.keys(availableSlots).length === 0 || !date || !shift}
              className="w-full bg-purple-600 text-white rounded-lg py-4 font-semibold hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors text-lg shadow-lg"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Đang đặt lịch...
                </div>
              ) : (
                "Đặt lịch tư vấn"
              )}
            </button>
          </form>
        </div>
      </main>
      
      {/* Payment Modal */}
      {bookingResult && (
        <PaymentModal
          isOpen={true}
          onClose={() => setBookingResult(null)}
          transferCode={bookingResult.transferCode}
          amount={200000}
          appointmentInfo={bookingResult.appointmentInfo}
        />
      )}
      
      <Footer />
      
      <style>{`
@keyframes fade-in {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in {
  animation: fade-in 0.4s ease;
}
.bg-purple-25 {
  background-color: #faf5ff;
}
`}</style>
    </div>
  );
};

export default BookingConsultationPage; 
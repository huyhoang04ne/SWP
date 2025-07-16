import React, { useState, useEffect, useRef } from 'react';
import axiosInstance from '../api/axiosInstance';
import DatePicker from 'react-multi-date-picker';
import 'react-multi-date-picker/styles/backgrounds/bg-dark.css';
import Modal from 'react-modal';

interface Counselor {
  id: string;
  fullName: string;
}

interface Shift {
  id: number;
  name: string;
  startTime: string;
  endTime: string;
}

interface SelectedDate {
  date: string;
  shifts: number[];
  assignedShifts: number[]; // các ca đã được phân
}

const AssignShiftForm: React.FC = () => {
  const [counselors, setCounselors] = useState<Counselor[]>([]);
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [selectedCounselor, setSelectedCounselor] = useState<string>('');
  const [selectedDates, setSelectedDates] = useState<SelectedDate[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const messageRef = useRef<HTMLDivElement>(null);
  const [busyDates, setBusyDates] = useState<string[]>([]); // ngày đã có ca
  const [pendingDate, setPendingDate] = useState<any>(null); // ngày đang chờ xác nhận
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Fetch counselors & shifts
  useEffect(() => {
    fetchCounselors();
    fetchShifts();
  }, []);

  // Fetch lịch đã phân khi chọn counselor
  useEffect(() => {
    if (selectedCounselor) {
      fetchAssignedDays(selectedCounselor);
    } else {
      setBusyDates([]);
    }
    setSelectedDates([]);
    // eslint-disable-next-line
  }, [selectedCounselor]);

  // Fetch lịch đã phân khi chọn counselor hoặc ngày
  useEffect(() => {
    if (selectedCounselor && selectedDates.length > 0) {
      fetchAssignedShifts();
    }
    // eslint-disable-next-line
  }, [selectedCounselor, selectedDates.length]);

  const fetchCounselors = async () => {
    try {
      const response = await axiosInstance.get('/counselor');
      if (Array.isArray(response.data)) {
        setCounselors(response.data);
      } else {
        setCounselors([]);
      }
    } catch (error) {
      setCounselors([]);
    }
  };

  const fetchShifts = async () => {
    try {
      const response = await axiosInstance.get('/schedule/shifts');
      if (Array.isArray(response.data.data)) {
        setShifts(response.data.data);
      } else {
        setShifts([]);
      }
    } catch (error) {
      setShifts([]);
    }
  };

  // Fetch lịch đã phân cho counselor theo ngày
  const fetchAssignedShifts = async () => {
    if (!selectedCounselor || selectedDates.length === 0) return;
    try {
      const fromDate = selectedDates[0].date;
      const toDate = selectedDates[selectedDates.length - 1].date;
      const res = await axiosInstance.get('/schedule/counselor-schedule', {
        params: { counselorId: selectedCounselor, fromDate, toDate },
      });
      // res.data: [{ workDate: '2024-07-12', timeSlot: 0 }, ...]
      const assignedMap: Record<string, number[]> = {};
      if (Array.isArray(res.data)) {
        res.data.forEach((item: any) => {
          const d = item.workDate?.slice(0, 10);
          if (!assignedMap[d]) assignedMap[d] = [];
          assignedMap[d].push(item.timeSlot);
        });
      }
      setSelectedDates((prev) =>
        prev.map((d) => ({ ...d, assignedShifts: assignedMap[d.date] || [] }))
      );
    } catch {
      setSelectedDates((prev) => prev.map((d) => ({ ...d, assignedShifts: [] })));
    }
  };

  // Lấy danh sách ngày đã có ca
  const fetchAssignedDays = async (counselorId: string) => {
    try {
      const res = await axiosInstance.get('/schedule/counselor-schedule', {
        params: { counselorId }
      });
      if (Array.isArray(res.data)) {
        const days = res.data.map((item: any) => item.workDate?.slice(0, 10));
        setBusyDates(Array.from(new Set(days)));
      } else {
        setBusyDates([]);
      }
    } catch {
      setBusyDates([]);
    }
  };

  // Thêm hàm fetchAssignedShiftsForDate
  const fetchAssignedShiftsForDate = async (counselorId: string, date: string) => {
    try {
      const res = await axiosInstance.get('/schedule/counselor-schedule', {
        params: { counselorId }
      });
      if (Array.isArray(res.data)) {
        // Lọc các ca đã phân cho ngày này
        const assigned = res.data.filter((item: any) => item.workDate?.slice(0, 10) === date).map((item: any) => item.timeSlot);
        return assigned;
      }
      return [];
    } catch {
      return [];
    }
  };

  // Thay đổi: handleDateChange chỉ cập nhật selectedDates, fetch assignedShifts dùng useEffect
  const handleDateChange = (dates: any) => {
    const newDates: SelectedDate[] = [];
    let lastAdded: any = null;
    dates.forEach((date: any) => {
      const dateString = date.format('YYYY-MM-DD');
      const existing = selectedDates.find((d) => d.date === dateString);
      if (existing) {
        newDates.push(existing);
      } else {
        lastAdded = date;
      }
    });
    if (lastAdded) {
      const dateString = lastAdded.format('YYYY-MM-DD');
      if (busyDates.includes(dateString)) {
        setPendingDate(lastAdded);
        setShowConfirmModal(true);
        return;
      } else {
        newDates.push({ date: dateString, shifts: [], assignedShifts: [] });
      }
    }
    setSelectedDates(newDates);
  };

  // useEffect: mỗi khi selectedDates hoặc selectedCounselor thay đổi, fetch lại assignedShifts cho tất cả ngày
  useEffect(() => {
    if (!selectedCounselor || selectedDates.length === 0) return;
    fetchAssignedShifts();
    // eslint-disable-next-line
  }, [selectedCounselor, selectedDates.map(d => d.date).join(",")]);

  // Xác nhận thêm ngày đã có ca
  const handleConfirmAddBusyDate = async () => {
    if (pendingDate) {
      const dateString = pendingDate.format('YYYY-MM-DD');
      let assignedShifts: number[] = [];
      if (selectedCounselor) {
        assignedShifts = await fetchAssignedShiftsForDate(selectedCounselor, dateString);
      }
      setSelectedDates((prev) => ([...prev, { date: dateString, shifts: [], assignedShifts }]));
    }
    setShowConfirmModal(false);
    setPendingDate(null);
  };
  const handleCancelAddBusyDate = () => {
    setShowConfirmModal(false);
    setPendingDate(null);
  };

  // Toggle ca làm việc cho từng ngày
  const handleShiftToggle = (dateString: string, shiftId: number) => {
    setSelectedDates((prev) =>
      prev.map((d) => {
        if (d.date !== dateString) return d;
        const isChecked = d.shifts.includes(shiftId);
        return {
          ...d,
          shifts: isChecked
            ? d.shifts.filter((id) => id !== shiftId)
            : [...d.shifts, shiftId],
        };
      })
    );
  };

  // Xóa ngày khỏi danh sách
  const removeDate = (dateToRemove: string) => {
    setSelectedDates((prev) => prev.filter((d) => d.date !== dateToRemove));
  };

  // Submit phân ca
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    if (!selectedCounselor) {
      setMessage('Vui lòng chọn tư vấn viên');
      setTimeout(() => { messageRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }); }, 100);
      return;
    }
    if (selectedDates.length === 0) {
      setMessage('Vui lòng chọn ít nhất một ngày');
      setTimeout(() => { messageRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }); }, 100);
      return;
    }
    setLoading(true);
    try {
      // Chuẩn hóa request đúng format backend
      // Gửi ca cụ thể cho từng ngày thay vì tất cả ca cho tất cả ngày
      const assignments = selectedDates.map(dateData => ({
        date: dateData.date,
        shifts: dateData.shifts // Chỉ ca được tick cho ngày này
      }));
      
      const req = {
        CounselorIds: [selectedCounselor],
        Assignments: assignments, // Array với date và shifts cụ thể
        Notes: '',
        AssignedBy: undefined,
        IsAutoAssigned: false
      };
      
      // Debug: log request
      console.log('Assign shift request:', req);
      
      const response = await axiosInstance.post('/schedule/assign', req);
      if (response.data.success) {
        setMessage('Phân ca thành công!');
        setSelectedDates([]);
        setSelectedCounselor('');
      } else {
        setMessage('Có lỗi xảy ra khi phân ca');
      }
    } catch {
      setMessage('Có lỗi xảy ra khi phân ca');
    } finally {
      setLoading(false);
      setTimeout(() => { messageRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }); }, 100);
    }
  };

  // Lấy ngày cho calendar
  const getSelectedDatesForPicker = () => {
    return selectedDates.map((d) => new Date(d.date));
  };

  // Thêm constant cho các ca làm việc nếu chưa có
  const SHIFT_OPTIONS = [
    { id: 0, name: 'Sáng', startTime: '08:00', endTime: '12:00' },
    { id: 1, name: 'Chiều', startTime: '13:00', endTime: '17:00' },
    { id: 2, name: 'Tối', startTime: '18:00', endTime: '22:00' },
  ];

  return (
    <div className="max-w-3xl mx-auto p-8 bg-white rounded-lg shadow-lg mt-8">
      <h2 className="text-2xl font-bold mb-8 text-gray-800 text-center">Phân Ca Làm Việc</h2>
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Thông báo lỗi/thành công */}
        {message && (
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
        {/* Chọn counselor */}
        <div className="flex flex-col md:flex-row md:items-center md:gap-6 justify-center">
          <label className="block text-sm font-medium text-gray-700 mb-2 md:mb-0 md:mr-2 min-w-[120px]">Tư vấn viên</label>
          <select
            value={selectedCounselor}
            onChange={(e) => {
              setSelectedCounselor(e.target.value);
              setSelectedDates([]);
            }}
            className="w-full md:w-72 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="">Chọn tư vấn viên...</option>
            {counselors.map((c) => (
              <option key={c.id} value={c.id}>{c.fullName}</option>
            ))}
          </select>
        </div>
        {/* Calendar chọn nhiều ngày */}
        <div className="flex flex-col items-center">
          <label className="block text-sm font-medium text-gray-700 mb-2">Chọn ngày làm việc</label>
          <DatePicker
            multiple
            value={getSelectedDatesForPicker()}
            onChange={handleDateChange}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
            placeholder="Chọn các ngày..."
            format="DD/MM/YYYY"
            numberOfMonths={2}
            style={{ fontSize: '1.1rem' }}
            disabled={!selectedCounselor}
            minDate={new Date()} // Chặn chọn ngày trong quá khứ
            mapDays={({ date }) => {
              const d = date.format('YYYY-MM-DD');
              if (busyDates.includes(d)) {
                return {
                  style: { backgroundColor: '#fffbe6', color: '#d97706', border: '1px solid #facc15' },
                  title: 'Tư vấn viên đã có ca ngày này',
                };
              }
              return {};
            }}
          />
        </div>
        {/* Danh sách ngày + ca đã chọn */}
        {selectedDates.length > 0 && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-800">Ca làm việc theo ngày</h3>
            {selectedDates.map((dateData) => {
              const allFree = SHIFT_OPTIONS.every(shift => !dateData.assignedShifts.includes(shift.id));
              return (
                <div key={dateData.date} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="text-md font-medium text-gray-700">
                      {new Date(dateData.date).toLocaleDateString('vi-VN', {
                        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
                      })}
                    </h4>
                    <button
                      type="button"
                      onClick={() => removeDate(dateData.date)}
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      Xóa ngày
                    </button>
                  </div>
                  {allFree && (
                    <div className="mb-2 text-green-600 text-sm flex items-center gap-1"><span>✔️</span> Tư vấn viên này rảnh tất cả các ca trong ngày này</div>
                  )}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {SHIFT_OPTIONS.map((shift) => {
                      const isAssigned = dateData.assignedShifts.includes(shift.id);
                      const isChecked = dateData.shifts.includes(shift.id);
                      return (
                        <div key={shift.id} className="flex flex-col">
                          <label className={`flex items-center space-x-2 cursor-pointer ${isAssigned && !isChecked ? 'opacity-70' : ''}`} title={isAssigned && !isChecked ? 'Ca này đã được phân, tick để update/xóa' : ''}>
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => handleShiftToggle(dateData.date, shift.id)}
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-sm text-gray-700">
                              {shift.name} ({shift.startTime} - {shift.endTime})
                            </span>
                          </label>
                          {isAssigned && !isChecked && (
                            <span className="text-xs text-yellow-700 mt-1 flex items-center gap-1"><span>⚠️</span> Đã phân (tick để update/xóa)</span>
                          )}
                          {isAssigned && isChecked && (
                            <span className="text-xs text-blue-700 mt-1 flex items-center gap-1"><span>🔄</span> Sẽ update ca này</span>
                          )}
                          {!isAssigned && (
                            <span className="text-xs text-green-600 mt-1 flex items-center gap-1"><span>✔️</span> Rảnh</span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
        {/* Nút phân ca */}
        <button
          type="submit"
          disabled={loading}
          className="w-full md:w-1/2 bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors text-lg font-bold"
        >
          {loading ? 'Đang phân ca...' : 'Phân Ca'}
        </button>
      </form>
      {/* Modal xác nhận khi chọn ngày đã có ca */}
      <Modal
        isOpen={showConfirmModal}
        onRequestClose={handleCancelAddBusyDate}
        ariaHideApp={false}
        className="bg-white rounded-lg shadow-lg p-8 max-w-md mx-auto mt-32 border border-yellow-300"
        overlayClassName="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center"
      >
        <h2 className="text-xl font-bold mb-4 text-yellow-700 flex items-center gap-2"><span>⚠️</span> Xác nhận chỉnh sửa ca</h2>
        <p className="mb-6 text-gray-700">Tư vấn viên đã có ca vào ngày này. Bạn có muốn chỉnh sửa lại ca làm không?</p>
        <div className="flex justify-end gap-4">
          <button
            onClick={handleCancelAddBusyDate}
            className="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300"
          >Không</button>
          <button
            onClick={handleConfirmAddBusyDate}
            className="px-4 py-2 rounded bg-yellow-500 text-white hover:bg-yellow-600 font-semibold"
          >Có, chỉnh sửa</button>
        </div>
      </Modal>
      <style>{`
@keyframes fade-in {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in {
  animation: fade-in 0.4s ease;
}
`}</style>
    </div>
  );
};

export default AssignShiftForm; 
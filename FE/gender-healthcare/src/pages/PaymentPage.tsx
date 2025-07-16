import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../api/axiosInstance';
import PaymentInstructions from '../components/PaymentInstructions';
import PaymentModal from '../components/PaymentModal';
import Header from '../components/header';
import Footer from '../components/Footer';
import Navbar from '../components/navbar';

interface AppointmentInfo {
  id: number;
  scheduledDate: string;
  timeSlot: number;
  counselor: {
    fullName: string;
  };
  transferCode: string;
  paymentAmount: number;
  paymentStatus: string;
}

const PaymentPage: React.FC = () => {
  const { appointmentId } = useParams<{ appointmentId: string }>();
  const navigate = useNavigate();
  const [appointment, setAppointment] = useState<AppointmentInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  useEffect(() => {
    if (appointmentId) {
      fetchAppointmentDetails();
    }
  }, [appointmentId]);

  const fetchAppointmentDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/consultation/${appointmentId}`);
      setAppointment(response.data);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Không thể tải thông tin lịch hẹn');
    } finally {
      setLoading(false);
    }
  };

  const getTimeSlotName = (timeSlot: number): string => {
    switch (timeSlot) {
      case 0: return 'Sáng';
      case 1: return 'Chiều';
      case 2: return 'Tối';
      default: return 'Không xác định';
    }
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen flex flex-col font-[Segoe_UI]">
        <Header />
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Đang tải thông tin thanh toán...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !appointment) {
    return (
      <div className="bg-gray-50 min-h-screen flex flex-col font-[Segoe_UI]">
        <Header />
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="text-4xl mb-4">❌</div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Không tìm thấy lịch hẹn</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={() => navigate('/consultations')}
              className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
            >
              Quay lại danh sách
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col font-[Segoe_UI]">
      <Header />
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-6">
          <button
            onClick={() => navigate('/consultations')}
            className="flex items-center gap-2 text-purple-600 hover:text-purple-700 mb-4"
          >
            <span>←</span>
            Quay lại danh sách lịch hẹn
          </button>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Thanh toán lịch hẹn</h1>
          <p className="text-gray-600">Hoàn tất thanh toán để xác nhận lịch hẹn của bạn</p>
        </div>

        {/* Appointment Summary */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">📋 Thông tin lịch hẹn</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-600">Ngày hẹn:</label>
                <p className="font-semibold text-gray-900">{formatDate(appointment.scheduledDate)}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Ca làm việc:</label>
                <p className="font-semibold text-gray-900">{getTimeSlotName(appointment.timeSlot)}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Tư vấn viên:</label>
                <p className="font-semibold text-gray-900">{appointment.counselor.fullName}</p>
              </div>
            </div>
            
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-600">Mã chuyển khoản:</label>
                <p className="font-mono text-lg font-semibold text-purple-600 bg-purple-50 p-2 rounded border">
                  {appointment.transferCode}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Số tiền:</label>
                <p className="text-2xl font-bold text-green-600">
                  {appointment.paymentAmount.toLocaleString('vi-VN')} VNĐ
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Trạng thái:</label>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  appointment.paymentStatus === 'Pending' 
                    ? 'bg-yellow-100 text-yellow-800' 
                    : appointment.paymentStatus === 'Paid'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {appointment.paymentStatus === 'Pending' ? '⏳ Chờ thanh toán' :
                   appointment.paymentStatus === 'Paid' ? '✅ Đã thanh toán' :
                   '❓ Không xác định'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Instructions */}
        <PaymentInstructions 
          transferCode={appointment.transferCode}
          amount={appointment.paymentAmount}
        />

        {/* Action Buttons */}
        {appointment.paymentStatus === 'Pending' && (
          <div className="mt-6 flex justify-center">
            <button
              onClick={() => setShowPaymentModal(true)}
              className="px-8 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition flex items-center gap-2 text-lg font-semibold"
            >
              <span>💳</span>
              Thanh toán ngay
            </button>
          </div>
        )}

        {appointment.paymentStatus === 'Paid' && (
          <div className="mt-6 text-center">
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <div className="text-4xl mb-2">✅</div>
              <h3 className="text-lg font-semibold text-green-800 mb-2">Thanh toán thành công!</h3>
              <p className="text-green-700">Lịch hẹn của bạn đã được xác nhận. Vui lòng đến đúng giờ hẹn.</p>
            </div>
          </div>
        )}
      </main>

      {/* Payment Modal */}
      {showPaymentModal && appointment && (
        <PaymentModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          transferCode={appointment.transferCode}
          amount={appointment.paymentAmount}
          appointmentInfo={{
            date: appointment.scheduledDate,
            timeSlot: appointment.timeSlot.toString(),
            counselorName: appointment.counselor.fullName
          }}
        />
      )}
      
      <Footer />
    </div>
  );
};

export default PaymentPage; 
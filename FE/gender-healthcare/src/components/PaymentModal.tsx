import React, { useState } from 'react';
import { X, Copy, Check, Smartphone, CreditCard } from 'lucide-react';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  transferCode: string;
  amount: number;
  appointmentInfo: {
    date: string;
    timeSlot: string;
    counselorName: string;
  };
}

const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  transferCode,
  amount,
  appointmentInfo
}) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'qr' | 'manual'>('qr');

  const handleCopyTransferCode = async () => {
    try {
      await navigator.clipboard.writeText(transferCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
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

  const getTimeSlotName = (timeSlot: string): string => {
    switch (timeSlot) {
      case '0': return 'Sáng';
      case '1': return 'Chiều';
      case '2': return 'Tối';
      default: return timeSlot;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-bold text-gray-900">Thanh toán qua MoMo</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Appointment Info */}
          <div className="bg-purple-50 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-purple-900 mb-2">Thông tin lịch hẹn</h3>
            <div className="space-y-1 text-sm text-purple-800">
              <p><span className="font-medium">Ngày:</span> {formatDate(appointmentInfo.date)}</p>
              <p><span className="font-medium">Ca:</span> {getTimeSlotName(appointmentInfo.timeSlot)}</p>
              <p><span className="font-medium">Tư vấn viên:</span> {appointmentInfo.counselorName}</p>
            </div>
          </div>

          {/* Amount */}
          <div className="text-center mb-6">
            <p className="text-gray-600 text-sm">Số tiền cần thanh toán</p>
            <p className="text-3xl font-bold text-purple-600">
              {amount.toLocaleString('vi-VN')} VNĐ
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="flex bg-gray-100 rounded-lg p-1 mb-6">
            <button
              onClick={() => setActiveTab('qr')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md transition ${
                activeTab === 'qr' 
                  ? 'bg-white text-purple-600 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Smartphone size={16} />
              QR Code
            </button>
            <button
              onClick={() => setActiveTab('manual')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md transition ${
                activeTab === 'manual' 
                  ? 'bg-white text-purple-600 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <CreditCard size={16} />
              Chuyển khoản thủ công
            </button>
          </div>

          {/* QR Code Tab */}
          {activeTab === 'qr' && (
            <div className="text-center">
              <div className="bg-gray-100 rounded-lg p-6 mb-4">
                <div className="w-48 h-48 bg-white rounded-lg mx-auto flex items-center justify-center border-2 border-dashed border-gray-300">
                  <div className="text-center">
                    <div className="w-32 h-32 bg-purple-100 rounded-lg mx-auto mb-2 flex items-center justify-center">
                      <span className="text-2xl">📱</span>
                    </div>
                    <p className="text-sm text-gray-600">QR Code MoMo</p>
                    <p className="text-xs text-gray-500">Quét bằng ứng dụng MoMo</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <p className="text-sm text-gray-600">
                  <strong>Hướng dẫn:</strong>
                </p>
                <ol className="text-sm text-gray-600 text-left space-y-1">
                  <li>1. Mở ứng dụng MoMo</li>
                  <li>2. Chọn "Quét mã QR"</li>
                  <li>3. Quét mã QR bên trên</li>
                  <li>4. Nhập mã chuyển khoản: <strong className="text-purple-600">{transferCode}</strong></li>
                  <li>5. Xác nhận thanh toán</li>
                </ol>
              </div>
            </div>
          )}

          {/* Manual Transfer Tab */}
          {activeTab === 'manual' && (
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-3">Thông tin chuyển khoản</h4>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">Số tài khoản:</p>
                    <p className="font-mono text-lg font-semibold text-purple-600">0123456789</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Tên tài khoản:</p>
                    <p className="font-semibold text-gray-900">GHMS - PHÒNG KHÁM SỨC KHỎE GIỚI TÍNH</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Ngân hàng:</p>
                    <p className="font-semibold text-gray-900">MoMo</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Nội dung chuyển khoản:</p>
                    <div className="flex items-center gap-2">
                      <p className="font-mono text-lg font-semibold text-purple-600 flex-1 bg-white p-2 rounded border">
                        {transferCode}
                      </p>
                      <button
                        onClick={handleCopyTransferCode}
                        className="p-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition"
                      >
                        {copied ? <Check size={16} /> : <Copy size={16} />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 className="font-semibold text-yellow-800 mb-2">⚠️ Lưu ý quan trọng</h4>
                <ul className="text-sm text-yellow-700 space-y-1">
                  <li>• <strong>Bắt buộc</strong> nhập mã chuyển khoản: <strong>{transferCode}</strong></li>
                  <li>• Không nhập mã này sẽ không thể xác nhận thanh toán</li>
                  <li>• Sau khi chuyển khoản, vui lòng chờ admin xác nhận</li>
                  <li>• Liên hệ hỗ trợ nếu có vấn đề</li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t bg-gray-50">
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-2 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition"
            >
              Đóng
            </button>
            <button
              onClick={() => {
                // Có thể thêm logic để mở MoMo app
                window.open('https://momo.vn', '_blank');
              }}
              className="flex-1 py-2 px-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
            >
              Mở MoMo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal; 
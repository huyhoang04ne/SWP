import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ConsultationSchedule, ConsultationStatus, TimeSlot, PaymentStatus } from '../types/consultation';
import PaymentModal from './PaymentModal';
import PaymentStatusBadge from './PaymentStatusBadge';

interface ConsultationListProps {
  consultations: ConsultationSchedule[];
  userRole: 'Patient' | 'Counselor';
  onUpdateStatus?: (id: number, status: ConsultationStatus, reason?: string) => void;
  onMarkNoShow?: (id: number) => void;
  onCancel?: (id: number, reason?: string) => void;
  onProposeReschedule?: (id: number) => void;
}

const ConsultationList: React.FC<ConsultationListProps> = ({
  consultations,
  userRole,
  onUpdateStatus,
  onMarkNoShow,
  onCancel,
  onProposeReschedule
}) => {
  const [paymentModal, setPaymentModal] = useState<{
    isOpen: boolean;
    consultation: ConsultationSchedule | null;
  }>({
    isOpen: false,
    consultation: null
  });

  const [loadingActions, setLoadingActions] = useState<{ [key: number]: string }>({});

  const handlePaymentClick = (consultation: ConsultationSchedule) => {
    setPaymentModal({
      isOpen: true,
      consultation
    });
  };

  const closePaymentModal = () => {
    setPaymentModal({
      isOpen: false,
      consultation: null
    });
  };

  const handleAction = async (action: () => Promise<void> | void, consultationId: number, actionName: string) => {
    setLoadingActions(prev => ({ ...prev, [consultationId]: actionName }));
    try {
      await Promise.resolve(action());
    } finally {
      setLoadingActions(prev => {
        const newState = { ...prev };
        delete newState[consultationId];
        return newState;
      });
    }
  };

  const getTimeSlotName = (timeSlot: number): string => {
    switch (timeSlot) {
      case TimeSlot.Morning: return 'Sáng';
      case TimeSlot.Afternoon: return 'Chiều';
      case TimeSlot.Evening: return 'Tối';
      default: return 'Không xác định';
    }
  };

  const getStatusColor = (status: ConsultationStatus): string => {
    switch (status) {
      case ConsultationStatus.Pending: return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case ConsultationStatus.Confirmed: return 'bg-blue-100 text-blue-800 border-blue-200';
      case ConsultationStatus.Completed: return 'bg-green-100 text-green-800 border-green-200';
      case ConsultationStatus.Cancelled: return 'bg-red-100 text-red-800 border-red-200';
      case ConsultationStatus.NoShow: return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusName = (status: ConsultationStatus): string => {
    switch (status) {
      case ConsultationStatus.Pending: return 'Chờ xác nhận';
      case ConsultationStatus.Confirmed: return 'Đã xác nhận';
      case ConsultationStatus.Completed: return 'Đã hoàn thành';
      case ConsultationStatus.Cancelled: return 'Đã hủy';
      case ConsultationStatus.NoShow: return 'Vắng mặt';
      default: return 'Không xác định';
    }
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTimeSlotColor = (timeSlot: number): string => {
    switch (timeSlot) {
      case TimeSlot.Morning: return 'bg-orange-100 text-orange-800 border-orange-200';
      case TimeSlot.Afternoon: return 'bg-blue-100 text-blue-800 border-blue-200';
      case TimeSlot.Evening: return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-4">
      {consultations.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <span className="text-6xl mb-4 block">📭</span>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Không có lịch tư vấn nào</h3>
          <p className="text-gray-600">
            {userRole === 'Patient' 
              ? 'Bạn chưa có lịch tư vấn nào. Hãy đặt lịch tư vấn mới!'
              : 'Bạn chưa có lịch tư vấn nào được gán.'
            }
          </p>
          {userRole === 'Patient' && (
            <Link
              to="/booking-consultation"
              className="inline-block mt-4 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
            >
              Đặt lịch tư vấn mới
            </Link>
          )}
        </div>
      ) : (
        consultations.map((consultation) => (
          <div key={consultation.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <span className="text-purple-600 font-semibold text-lg">
                      {userRole === 'Patient' 
                        ? consultation.counselor.fullName.charAt(0).toUpperCase()
                        : consultation.patient.fullName.charAt(0).toUpperCase()
                      }
                    </span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {userRole === 'Patient' 
                        ? `Tư vấn viên: ${consultation.counselor.fullName}`
                        : `Bệnh nhân: ${consultation.patient.fullName}`
                      }
                    </h3>
                    <p className="text-gray-600">
                      {formatDate(consultation.scheduledDate)}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 mb-3">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getTimeSlotColor(consultation.timeSlot)}`}>
                    Ca {getTimeSlotName(consultation.timeSlot)}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(consultation.status)}`}>
                    {getStatusName(consultation.status)}
                  </span>
                </div>

                {consultation.notes && (
                  <div className="bg-gray-50 rounded-lg p-3 mb-3">
                    <p className="text-sm text-gray-700">
                      <span className="font-medium">Ghi chú:</span> {consultation.notes}
                    </p>
                  </div>
                )}
                
                {/* Payment Information */}
                {userRole === 'Patient' && consultation.transferCode && (
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-blue-700">Mã chuyển khoản:</span>
                      <span className="font-mono text-sm bg-white px-3 py-1 rounded border">
                        {consultation.transferCode}
                      </span>
                    </div>
                    {consultation.paymentStatus && (
                      <PaymentStatusBadge 
                        status={consultation.paymentStatus} 
                        amount={consultation.paymentAmount}
                      />
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Action buttons */}
            {userRole === 'Counselor' && consultation.status === ConsultationStatus.Confirmed && (
              <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-200">
                <button
                  onClick={() => handleAction(
                    () => onUpdateStatus?.(consultation.id, ConsultationStatus.Completed, 'Bệnh nhân đã tham gia'),
                    consultation.id,
                    'complete'
                  )}
                  disabled={loadingActions[consultation.id] === 'complete'}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center gap-2 disabled:opacity-50"
                >
                  {loadingActions[consultation.id] === 'complete' ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Đang xử lý...
                    </>
                  ) : (
                    <>
                      <span>✅</span>
                      Điểm danh
                    </>
                  )}
                </button>
                <button
                  onClick={() => handleAction(
                    () => onMarkNoShow?.(consultation.id),
                    consultation.id,
                    'noShow'
                  )}
                  disabled={loadingActions[consultation.id] === 'noShow'}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition flex items-center gap-2 disabled:opacity-50"
                >
                  {loadingActions[consultation.id] === 'noShow' ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Đang xử lý...
                    </>
                  ) : (
                    <>
                      <span>🚫</span>
                      Vắng mặt
                    </>
                  )}
                </button>
                <button
                  onClick={() => onProposeReschedule?.(consultation.id)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
                >
                  <span>🔄</span>
                  Đề xuất đổi lịch
                </button>
              </div>
            )}

            {userRole === 'Patient' && consultation.status === ConsultationStatus.Pending && (
              <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-200">
                {consultation.paymentStatus === PaymentStatus.Pending && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handlePaymentClick(consultation)}
                      className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition flex items-center gap-2"
                    >
                      <span>💳</span>
                      Thanh toán nhanh
                    </button>
                    <Link
                      to={`/payment/${consultation.id}`}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
                    >
                      <span>📋</span>
                      Chi tiết
                    </Link>
                  </div>
                )}
                <button
                  onClick={() => handleAction(
                    () => onCancel?.(consultation.id, 'Bệnh nhân hủy lịch'),
                    consultation.id,
                    'cancel'
                  )}
                  disabled={loadingActions[consultation.id] === 'cancel'}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition flex items-center gap-2 disabled:opacity-50"
                >
                  {loadingActions[consultation.id] === 'cancel' ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Đang xử lý...
                    </>
                  ) : (
                    <>
                      <span>❌</span>
                      Hủy lịch
                    </>
                  )}
                </button>
              </div>
            )}

            {userRole === 'Counselor' && consultation.status === ConsultationStatus.Pending && (
              <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-200">
                <button
                  onClick={() => handleAction(
                    () => onUpdateStatus?.(consultation.id, ConsultationStatus.Confirmed),
                    consultation.id,
                    'confirm'
                  )}
                  disabled={loadingActions[consultation.id] === 'confirm'}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center gap-2 disabled:opacity-50"
                >
                  {loadingActions[consultation.id] === 'confirm' ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Đang xử lý...
                    </>
                  ) : (
                    <>
                      <span>✅</span>
                      Xác nhận
                    </>
                  )}
                </button>
                <button
                  onClick={() => handleAction(
                    () => onCancel?.(consultation.id, 'Tư vấn viên hủy lịch'),
                    consultation.id,
                    'reject'
                  )}
                  disabled={loadingActions[consultation.id] === 'reject'}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition flex items-center gap-2 disabled:opacity-50"
                >
                  {loadingActions[consultation.id] === 'reject' ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Đang xử lý...
                    </>
                  ) : (
                    <>
                      <span>❌</span>
                      Từ chối
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        ))
      )}

      {/* Payment Modal */}
      {paymentModal.consultation && (
        <PaymentModal
          isOpen={paymentModal.isOpen}
          onClose={closePaymentModal}
          transferCode={paymentModal.consultation.transferCode || ''}
          amount={paymentModal.consultation.paymentAmount || 200000}
          appointmentInfo={{
            date: paymentModal.consultation.scheduledDate,
            timeSlot: paymentModal.consultation.timeSlot.toString(),
            counselorName: paymentModal.consultation.counselor.fullName
          }}
        />
      )}
    </div>
  );
};

export default ConsultationList; 
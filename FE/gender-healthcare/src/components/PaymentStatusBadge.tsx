import React from 'react';
import { PaymentStatus } from '../types/consultation';

interface PaymentStatusBadgeProps {
  status: PaymentStatus;
  amount?: number;
}

const PaymentStatusBadge: React.FC<PaymentStatusBadgeProps> = ({ status, amount }) => {
  const getStatusConfig = (status: PaymentStatus) => {
    switch (status) {
      case PaymentStatus.Pending:
        return {
          label: 'Chờ thanh toán',
          bgColor: 'bg-yellow-100',
          textColor: 'text-yellow-800',
          borderColor: 'border-yellow-200',
          icon: '⏳'
        };
      case PaymentStatus.Paid:
        return {
          label: 'Đã thanh toán',
          bgColor: 'bg-green-100',
          textColor: 'text-green-800',
          borderColor: 'border-green-200',
          icon: '✅'
        };
      case PaymentStatus.Failed:
        return {
          label: 'Thanh toán thất bại',
          bgColor: 'bg-red-100',
          textColor: 'text-red-800',
          borderColor: 'border-red-200',
          icon: '❌'
        };
      case PaymentStatus.Refunded:
        return {
          label: 'Đã hoàn tiền',
          bgColor: 'bg-blue-100',
          textColor: 'text-blue-800',
          borderColor: 'border-blue-200',
          icon: '💰'
        };
      default:
        return {
          label: 'Không xác định',
          bgColor: 'bg-gray-100',
          textColor: 'text-gray-800',
          borderColor: 'border-gray-200',
          icon: '❓'
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium border ${config.bgColor} ${config.textColor} ${config.borderColor}`}>
      <span className="text-base">{config.icon}</span>
      <span>{config.label}</span>
      {amount && status === PaymentStatus.Paid && (
        <span className="font-semibold">
          ({amount.toLocaleString('vi-VN')} VNĐ)
        </span>
      )}
    </div>
  );
};

export default PaymentStatusBadge; 
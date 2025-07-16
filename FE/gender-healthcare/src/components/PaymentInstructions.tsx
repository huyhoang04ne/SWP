import React from 'react';

interface PaymentInstructionsProps {
  transferCode: string;
  amount: number;
}

const PaymentInstructions: React.FC<PaymentInstructionsProps> = ({ transferCode, amount }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="text-center mb-6">
        <div className="text-4xl mb-2">💳</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Hướng dẫn thanh toán</h2>
        <p className="text-gray-600">Vui lòng làm theo các bước dưới đây để hoàn tất thanh toán</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* QR Code Method */}
        <div className="border border-gray-200 rounded-lg p-6">
          <div className="text-center mb-4">
            <div className="text-3xl mb-2">📱</div>
            <h3 className="text-lg font-semibold text-gray-900">Thanh toán qua QR Code</h3>
          </div>
          
          <div className="bg-gray-100 rounded-lg p-4 mb-4">
            <div className="w-32 h-32 bg-white rounded-lg mx-auto flex items-center justify-center border-2 border-dashed border-gray-300">
              <div className="text-center">
                <div className="w-20 h-20 bg-purple-100 rounded-lg mx-auto mb-2 flex items-center justify-center">
                  <span className="text-xl">📱</span>
                </div>
                <p className="text-xs text-gray-600">QR Code MoMo</p>
              </div>
            </div>
          </div>
          
          <ol className="text-sm text-gray-700 space-y-2">
            <li className="flex items-start gap-2">
              <span className="bg-purple-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">1</span>
              <span>Mở ứng dụng MoMo trên điện thoại</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="bg-purple-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">2</span>
              <span>Chọn "Quét mã QR"</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="bg-purple-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">3</span>
              <span>Quét mã QR bên trên</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="bg-purple-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">4</span>
              <span>Nhập mã: <strong className="text-purple-600">{transferCode}</strong></span>
            </li>
            <li className="flex items-start gap-2">
              <span className="bg-purple-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">5</span>
              <span>Xác nhận thanh toán</span>
            </li>
          </ol>
        </div>

        {/* Manual Transfer Method */}
        <div className="border border-gray-200 rounded-lg p-6">
          <div className="text-center mb-4">
            <div className="text-3xl mb-2">🏦</div>
            <h3 className="text-lg font-semibold text-gray-900">Chuyển khoản thủ công</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Số tài khoản:</label>
              <div className="font-mono text-lg font-semibold text-purple-600 bg-gray-50 p-2 rounded border">
                0123456789
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-700">Tên tài khoản:</label>
              <div className="font-semibold text-gray-900 bg-gray-50 p-2 rounded border">
                GHMS - PHÒNG KHÁM SỨC KHỎE GIỚI TÍNH
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-700">Ngân hàng:</label>
              <div className="font-semibold text-gray-900 bg-gray-50 p-2 rounded border">
                MoMo
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-700">Số tiền:</label>
              <div className="font-semibold text-green-600 bg-gray-50 p-2 rounded border">
                {amount.toLocaleString('vi-VN')} VNĐ
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-700">Nội dung chuyển khoản:</label>
              <div className="font-mono text-lg font-semibold text-purple-600 bg-gray-50 p-2 rounded border">
                {transferCode}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Important Notes */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h4 className="font-semibold text-yellow-800 mb-2 flex items-center gap-2">
          <span>⚠️</span>
          Lưu ý quan trọng
        </h4>
        <ul className="text-sm text-yellow-700 space-y-1">
          <li>• <strong>Bắt buộc</strong> nhập mã chuyển khoản: <strong className="font-mono">{transferCode}</strong></li>
          <li>• Không nhập mã này sẽ không thể xác nhận thanh toán</li>
          <li>• Sau khi chuyển khoản, vui lòng chờ admin xác nhận (tối đa 24h)</li>
          <li>• Liên hệ hỗ trợ qua email hoặc hotline nếu có vấn đề</li>
          <li>• Lịch hẹn sẽ được xác nhận sau khi thanh toán thành công</li>
        </ul>
      </div>

      {/* Contact Information */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
          <span>📞</span>
          Hỗ trợ thanh toán
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-700">
          <div>
            <strong>Hotline:</strong> 1900-xxxx
          </div>
          <div>
            <strong>Email:</strong> support@ghms.com
          </div>
          <div>
            <strong>Thời gian:</strong> 8:00 - 18:00 (T2-T7)
          </div>
          <div>
            <strong>Zalo:</strong> @ghms-support
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentInstructions; 
import React, { useState } from 'react';
import axios from '../api/axiosInstance';

interface ReconciliationResult {
  totalTransactions: number;
  matchedTransactions: number;
  unmatchedTransactions: number;
  updatedAppointments: number;
  errors: string[];
}

const AdminPaymentReconciliation: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ReconciliationResult | null>(null);
  const [message, setMessage] = useState<string>('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      // Kiểm tra định dạng file
      const allowedTypes = [
        'text/csv',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      ];
      
      if (!allowedTypes.includes(selectedFile.type)) {
        setMessage('Chỉ chấp nhận file CSV hoặc Excel (.xls, .xlsx)');
        setFile(null);
        return;
      }
      
      setFile(selectedFile);
      setMessage('');
      setResult(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage('Vui lòng chọn file sao kê MoMo');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await axios.post('/admin/reconcile-payments', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setResult(response.data);
      setMessage('Đối soát thanh toán thành công!');
    } catch (error: any) {
      setMessage(error?.response?.data?.message || 'Có lỗi xảy ra khi đối soát thanh toán');
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setResult(null);
    setMessage('');
    // Reset file input
    const fileInput = document.getElementById('file-input') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Đối soát thanh toán MoMo</h2>
        <p className="text-gray-600">
          Upload file sao kê MoMo để tự động đối soát và cập nhật trạng thái thanh toán
        </p>
      </div>

      {/* File Upload Section */}
      <div className="mb-6">
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <div className="mb-4">
            <span className="text-4xl">📄</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Chọn file sao kê MoMo
          </h3>
          <p className="text-gray-600 mb-4">
            Hỗ trợ file CSV hoặc Excel (.xls, .xlsx)
          </p>
          
          <input
            id="file-input"
            type="file"
            accept=".csv,.xls,.xlsx"
            onChange={handleFileChange}
            className="hidden"
          />
          
          <button
            onClick={() => document.getElementById('file-input')?.click()}
            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
          >
            Chọn file
          </button>
          
          {file && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-green-600">✅</span>
                  <span className="font-medium text-green-800">{file.name}</span>
                  <span className="text-sm text-green-600">
                    ({(file.size / 1024).toFixed(1)} KB)
                  </span>
                </div>
                <button
                  onClick={handleReset}
                  className="text-red-600 hover:text-red-800"
                >
                  ✕
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Instructions */}
      <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h4 className="font-semibold text-blue-900 mb-2">📋 Hướng dẫn sử dụng:</h4>
        <ol className="text-sm text-blue-800 space-y-1">
          <li>1. Tải file sao kê từ tài khoản MoMo (CSV hoặc Excel)</li>
          <li>2. File phải chứa cột "Nội dung chuyển khoản" hoặc "Mô tả"</li>
          <li>3. Hệ thống sẽ tự động tìm và khớp mã chuyển khoản</li>
          <li>4. Cập nhật trạng thái thanh toán cho các lịch hẹn tương ứng</li>
        </ol>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 mb-6">
        <button
          onClick={handleUpload}
          disabled={!file || loading}
          className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center gap-2"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Đang xử lý...
            </>
          ) : (
            <>
              <span>🔄</span>
              Bắt đầu đối soát
            </>
          )}
        </button>
        
        <button
          onClick={handleReset}
          className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
        >
          Làm mới
        </button>
      </div>

      {/* Message */}
      {message && (
        <div className={`mb-6 p-4 rounded-lg ${
          message.includes('thành công') 
            ? 'bg-green-100 border border-green-400 text-green-700'
            : 'bg-red-100 border border-red-400 text-red-700'
        }`}>
          {message}
        </div>
      )}

      {/* Results */}
      {result && (
        <div className="border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">📊 Kết quả đối soát</h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{result.totalTransactions}</div>
              <div className="text-sm text-blue-800">Tổng giao dịch</div>
            </div>
            
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{result.matchedTransactions}</div>
              <div className="text-sm text-green-800">Khớp mã</div>
            </div>
            
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">{result.unmatchedTransactions}</div>
              <div className="text-sm text-yellow-800">Không khớp</div>
            </div>
            
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{result.updatedAppointments}</div>
              <div className="text-sm text-purple-800">Đã cập nhật</div>
            </div>
          </div>

          {result.errors.length > 0 && (
            <div className="mt-4">
              <h4 className="font-semibold text-red-800 mb-2">⚠️ Lỗi phát sinh:</h4>
              <ul className="text-sm text-red-700 space-y-1">
                {result.errors.map((error, index) => (
                  <li key={index}>• {error}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminPaymentReconciliation; 
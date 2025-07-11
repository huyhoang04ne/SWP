import React from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

interface CyclePhasePieChartProps {
  prediction: any;
}

const CyclePhasePieChart: React.FC<CyclePhasePieChartProps> = ({ prediction }) => {
  const fertileStart = new Date(prediction?.fertileStart);
  const fertileEnd = new Date(prediction?.fertileEnd);
  const fertileDays = (fertileStart && fertileEnd && !isNaN(fertileStart.getTime()) && !isNaN(fertileEnd.getTime()))
    ? Math.round((fertileEnd.getTime() - fertileStart.getTime()) / (1000 * 60 * 60 * 24)) + 1
    : 7; // fallback nếu thiếu dữ liệu

  const periodDays = prediction?.periodLength;
  const ovulationDays = 1;
  const lutealDays = 6;
  const cycleLength = prediction?.cycleLength || 28;
  const follicularDays = Math.max(cycleLength - (periodDays + ovulationDays + fertileDays + lutealDays), 0);

  const data = {
    labels: [
      'Ngày có kinh (' + periodDays + ' ngày)',
      'Giai đoạn nang noãn (' + follicularDays + ' ngày)', 
      'Ngày rụng trứng (' + ovulationDays + ' ngày)',
      'Vùng màu mỡ (' + fertileDays + ' ngày)',
      'Giai đoạn hoàng thể (' + lutealDays + ' ngày)'
    ],
    datasets: [
      {
        data: [periodDays, follicularDays, ovulationDays, fertileDays, lutealDays],
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',    // Xanh dương - ngày có kinh
          'rgba(255, 182, 193, 0.8)',   // Hồng nhạt - giai đoạn nang noãn
          'rgba(0, 255, 127, 0.8)',     // Xanh lá - rụng trứng
          'rgba(255, 215, 0, 0.8)',     // Vàng - vùng màu mỡ
          'rgba(147, 112, 219, 0.8)',   // Tím - giai đoạn hoàng thể
        ],
        borderColor: [
          'rgba(59, 130, 246, 1)',
          'rgba(255, 182, 193, 1)',
          'rgba(0, 255, 127, 1)',
          'rgba(255, 215, 0, 1)',
          'rgba(147, 112, 219, 1)',
        ],
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12,
          },
        },
      },
      title: {
        display: true,
        text: `Tỷ lệ các giai đoạn trong chu kỳ ${cycleLength} ngày`,
        color: '#8B008B',
        font: {
          size: 16,
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        borderColor: '#FF69B4',
        borderWidth: 1,
        cornerRadius: 8,
        callbacks: {
          label: (context: any) => {
            const label = context.label || '';
            const value = context.parsed;
            const percentage = ((value / cycleLength) * 100).toFixed(1);
            return `${label}: ${value} ngày (${percentage}%)`;
          },
        },
      },
    },
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-purple-700 mb-2">
          Phân bố giai đoạn chu kỳ:
        </h3>
        <div className="text-sm text-gray-600 space-y-1">
          <p>• <strong>Ngày có kinh:</strong> Giai đoạn hành kinh ({periodDays} ngày)</p>
          <p>• <strong>Giai đoạn nang noãn:</strong> Phát triển nang trứng ({follicularDays} ngày)</p>
          <p>• <strong>Rụng trứng:</strong> Trứng được giải phóng ({ovulationDays} ngày)</p>
          <p>• <strong>Vùng màu mỡ:</strong> Thời điểm dễ thụ thai ({fertileDays} ngày)</p>
          <p>• <strong>Giai đoạn hoàng thể:</strong> Chuẩn bị cho chu kỳ tiếp theo ({lutealDays} ngày)</p>
        </div>
      </div>
      
      <div className="chart-container" style={{ position: 'relative', minHeight: '300px' }}>
        <Pie data={data} options={options} />
      </div>
    </div>
  );
};

export default CyclePhasePieChart; 
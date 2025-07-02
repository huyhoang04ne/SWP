import React, { useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface MenstrualCycleChartProps {
  predictions: any[];
}

const MenstrualCycleChart: React.FC<MenstrualCycleChartProps> = ({ predictions }) => {
  // Thêm state cho khoảng thời gian
  const today = new Date();
  const defaultStart = new Date(today);
  defaultStart.setMonth(today.getMonth() - 1);
  const defaultEnd = new Date(today);
  defaultEnd.setMonth(today.getMonth() + 2);

  const [startDate, setStartDate] = useState<string>(defaultStart.toISOString().slice(0, 10));
  const [endDate, setEndDate] = useState<string>(defaultEnd.toISOString().slice(0, 10));

  // Helper lấy max cycleLength từ predictions
  const maxCycleLength = predictions.length > 0 ? Math.max(...predictions.map(p => p.cycleLength || 0)) : 28;

  // Tạo dữ liệu cho khoảng thời gian tuỳ ý
  const generateChartData = () => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const labels = [];
    const cycleData = [];
    const periodData = [];
    const fertileData = [];
    const ovulationData = [];
    const totalDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;

    // Duyệt qua từng prediction (mỗi chu kỳ)
    const dayMap: Record<string, { cycleDay: number, period: number, fertile: number, ovulation: number }> = {};
    predictions.forEach(prediction => {
      if (!prediction.startDate || isNaN(new Date(prediction.startDate).getTime())) return;
      const periodLen = prediction.periodLength || prediction.periodDays || 5;
      for (let i = 0; i < prediction.cycleLength; i++) {
        const d = new Date(prediction.startDate);
        d.setDate(d.getDate() + i);
        if (isNaN(d.getTime())) continue;
        const key = d.toISOString().slice(0, 10);
        const cycleDay = i + 1;
        let period = 0, fertile = 0, ovulation = 0;
        if (cycleDay >= 1 && cycleDay <= periodLen) period = 100;
        // Nếu backend trả về fertileStart/fertileEnd/ovulationDate thì dùng luôn
        if (prediction.fertileStart && prediction.fertileEnd && !isNaN(new Date(prediction.fertileStart).getTime()) && !isNaN(new Date(prediction.fertileEnd).getTime())) {
          const fertileStart = new Date(prediction.fertileStart).toISOString().slice(0, 10);
          const fertileEnd = new Date(prediction.fertileEnd).toISOString().slice(0, 10);
          if (key >= fertileStart && key <= fertileEnd) fertile = 80;
        }
        if (prediction.ovulationDate && !isNaN(new Date(prediction.ovulationDate).getTime())) {
          const ovu = new Date(prediction.ovulationDate).toISOString().slice(0, 10);
          if (key === ovu) {
            fertile = 100;
            ovulation = cycleDay;
          }
        }
        dayMap[key] = { cycleDay, period, fertile, ovulation };
      }
    });

    for (let i = 0; i < totalDays; i++) {
      const date = new Date(start);
      date.setDate(start.getDate() + i);
      labels.push(date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' }));

      const key = date.toISOString().slice(0, 10);
      if (dayMap[key]) {
        cycleData.push(dayMap[key].cycleDay);
        periodData.push(dayMap[key].period);
        fertileData.push(dayMap[key].fertile);
        ovulationData.push(dayMap[key].ovulation);
        continue;
      }

      // Ngoài các chu kỳ thực tế đã nhập, không vẽ gì cả
      cycleData.push(null);
      periodData.push(0);
      fertileData.push(0);
      ovulationData.push(0);
    }

    return { labels, cycleData, periodData, fertileData, ovulationData };
  };

  const { labels, cycleData, periodData, fertileData, ovulationData } = generateChartData();

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Chu kỳ kinh nguyệt',
        data: cycleData,
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.1)',
        borderWidth: 2,
        fill: true,
        tension: 0.4,
        yAxisID: 'y',
      },
      {
        label: 'Ngày có kinh',
        data: periodData,
        borderColor: 'rgba(59, 130, 246, 0.8)',
        backgroundColor: 'rgba(59, 130, 246, 0.15)',
        borderWidth: 3,
        fill: 'origin',
        tension: 0.1,
        yAxisID: 'y',
        pointRadius: 0,
        pointHoverRadius: 4,
        order: 2,
      },
      {
        label: 'Vùng màu mỡ',
        data: fertileData,
        borderColor: 'rgba(255, 215, 0, 0.8)',
        backgroundColor: 'rgba(255, 215, 0, 0.10)',
        borderWidth: 2,
        fill: 'origin',
        tension: 0.3,
        yAxisID: 'y',
        pointRadius: 0,
        pointHoverRadius: 4,
        order: 3,
      },
      {
        label: 'Rụng trứng',
        data: ovulationData,
        borderColor: 'rgba(0, 255, 127, 1)',
        backgroundColor: 'rgba(0, 255, 127, 0.25)',
        borderWidth: 0,
        fill: false,
        tension: 0.1,
        yAxisID: 'y',
        pointRadius: ovulationData.map(val => val > 0 ? 9 : 0),
        pointBackgroundColor: ovulationData.map(val => val > 0 ? '#00ff7f' : 'rgba(0,0,0,0)'),
        pointBorderColor: ovulationData.map(val => val > 0 ? '#008000' : 'rgba(0,0,0,0)'),
        order: 4,
        pointStyle: 'circle',
        showLine: false,
      },
    ],
  };

  const options = {
    responsive: true,
    interaction: {
      mode: 'nearest' as const,
      intersect: true,
    },
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          usePointStyle: true,
          pointStyle: 'circle',
          padding: 20,
          generateLabels: (chart: any) => {
            const original = ChartJS.defaults.plugins.legend.labels.generateLabels;
            const labels = original(chart);
            return labels.map(label => {
              if (label.text === 'Rụng trứng') {
                return {
                  ...label,
                  fillStyle: '#b9ffe0',
                  strokeStyle: '#00ff7f',
                  pointStyle: 'circle' as const,
                  lineWidth: 3,
                };
              }
              return label;
            });
          },
        },
      },
      title: {
        display: true,
        text: 'Biểu đồ chu kỳ kinh nguyệt 90 ngày',
        color: '#8B008B',
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        borderColor: '#FF69B4',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true,
        callbacks: {
          title: (context: any) => {
            return `Ngày: ${context[0].label}`;
          },
          label: (context: any) => {
            const label = context.dataset.label || '';
            const value = context.parsed.y;
            
            if (label === 'Chu kỳ kinh nguyệt') {
              return `${label}: Ngày thứ ${value} của chu kỳ`;
            } else if (label === 'Ngày có kinh') {
              return value > 0 ? `${label}: Có kinh` : '';
            } else if (label === 'Vùng màu mỡ') {
              return value > 0 ? `${label}: Khả năng thụ thai cao` : '';
            } else if (label === 'Rụng trứng') {
              return value > 0 ? `${label}: Ngày rụng trứng` : '';
            }
            return `${label}: ${value}`;
          },
        },
      },
    },
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: 'Ngày',
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
      },
      y: {
        type: 'linear' as const,
        display: true,
        position: 'left' as const,
        title: {
          display: true,
          text: 'Ngày trong chu kỳ',
        },
        min: 1,
        max: maxCycleLength,
        ticks: {
          stepSize: 7,
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
      },
    },
  };

  // Lấy prediction hiện tại là prediction cuối cùng trong mảng
  const currentPrediction = predictions[predictions.length - 1];

  if (!predictions || predictions.length === 0 || !predictions[0] || !predictions[0].cycleLength) {
    return <div className="text-center text-gray-500 py-8">Không có dữ liệu chu kỳ để hiển thị.</div>;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      {/* Bộ chọn khoảng thời gian */}
      <div className="flex flex-col md:flex-row items-center gap-4 mb-4">
        <label className="font-medium">Từ ngày:
          <input type="date" value={startDate} max={endDate} onChange={e => setStartDate(e.target.value)} className="ml-2 border rounded px-2 py-1" />
        </label>
        <label className="font-medium">Đến ngày:
          <input type="date" value={endDate} min={startDate} onChange={e => setEndDate(e.target.value)} className="ml-2 border rounded px-2 py-1" />
        </label>
      </div>
      
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-purple-700 mb-2">
          Giải thích biểu đồ:
        </h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="space-y-1">
            <div className="flex items-center">
              <div className="w-4 h-4 bg-pink-500 rounded mr-2"></div>
              <span>Chu kỳ kinh nguyệt ({currentPrediction.cycleLength || 28} ngày)</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-blue-500 rounded mr-2"></div>
              <span>Ngày có kinh (5 ngày)</span>
            </div>
          </div>
          <div className="space-y-1">
            <div className="flex items-center">
              <div className="w-4 h-4 bg-yellow-500 rounded mr-2"></div>
              <span>Vùng màu mỡ (8 ngày)</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 mr-2 rounded" style={{ background: '#00e676' }}></div>
              <span>Ngày rụng trứng</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="chart-container" style={{ position: 'relative', height: '400px', marginBottom: '48px' }}>
        <Line data={chartData} options={options} style={{ margin: '0 auto', display: 'block', maxWidth: '1000px', width: '100%' }} />
      </div>
    </div>
  );
};

export default MenstrualCycleChart; 
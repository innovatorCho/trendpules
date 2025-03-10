'use client';

import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import { Chart as ChartJS, LineElement, PointElement, LinearScale, Title, Tooltip, Legend, CategoryScale } from 'chart.js';
import { Line } from 'react-chartjs-2';
import { Video } from '@/types/YoutubeContents';

ChartJS.register(LineElement, PointElement, LinearScale, Title, Tooltip, Legend, CategoryScale);

export default function Dashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [chartData, setChartData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  const fetchDailyData = async (date: string) => {
    try {
      const response = await fetch(`/api/getDailyVideos?date=${encodeURIComponent(date)}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.message || '데이터 조회 실패');
      }
      return result.data?.regulars || [];
    } catch (err) {
      console.warn('데이터 조회 실패:', err);
      return [];
    }
  };

  useEffect(() => {
    const loadChartData = async () => {
      setIsLoading(true);
      try {
        const today = new Date();
        const dates = Array.from({ length: 7 }, (_, i) => {
          const d = new Date(today);
          d.setDate(today.getDate() - i);
          return d.toISOString().split('T')[0];
        }).reverse();

        const dailyData: { [date: string]: Video[] } = {};
        for (const date of dates) {
          const videos = await fetchDailyData(date);
          // 조회수 기준으로 순위 부여
          dailyData[date] = videos.sort((a, b) => b.views - a.views).map((video, index) => ({
            ...video,
            rank: index + 1,
          }));
        }

        const topVideos = Object.values(dailyData)
          .flat()
          .sort((a, b) => b.views - a.views)
          .slice(0, 5)
          .map((v) => v.id);

        const datasets = topVideos.map((videoId) => {
          const video = dailyData[dates[0]].find((v) => v.id === videoId) || { title: 'Unknown' };
          return {
            label: video.title.slice(0, 20) + (video.title.length > 20 ? '...' : ''),
            data: dates.map((date) => {
              const videoData = dailyData[date].find((v) => v.id === videoId);
              return videoData ? videoData.rank : null; // 순위 데이터 사용
            }),
            borderColor: `hsl(${Math.random() * 360}, 70%, 50%)`,
            fill: false,
            stepped: 'before', // 순위 변화를 계단형으로 표시
          };
        });

        setChartData({
          labels: dates,
          datasets,
        });
      } catch (err) {
        setError('차트 데이터를 불러오지 못했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    loadChartData();
  }, []);

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' as const },
      title: { display: true, text: '일 단위 인기 영상 순위 변화' },
      tooltip: {
        callbacks: {
          label: (context: any) => `${context.dataset.label}: ${context.raw}위`,
        },
      },
    },
    scales: {
      y: {
        reverse: true, // 순위는 낮을수록 위로 (1위가 위)
        beginAtZero: false,
        min: 1,
        max: 15, // 상위 15위까지 표시
        title: { display: true, text: '순위' },
      },
      x: { title: { display: true, text: '날짜' } },
    },
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 text-gray-900">
      <div className="fixed top-0 left-0 right-0 h-16 z-50">
        <Header toggleSidebar={toggleSidebar} />
      </div>
      <div className="flex pt-16 h-[calc(100vh-4rem)]">
        <div
          className={`fixed top-16 bottom-0 w-64 bg-white transition-transform duration-300 transform ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } lg:translate-x-0 lg:static z-40`}
        >
          <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        </div>
        <div className="flex-1 w-full h-full overflow-y-auto p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">대시보드</h1>
          {isLoading ? (
            <div>로딩 중...</div>
          ) : error ? (
            <div className="text-red-500">{error}</div>
          ) : (
            chartData && (
              <div className="bg-white p-4 rounded-lg shadow-md">
                <Line data={chartData} options={options} />
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}
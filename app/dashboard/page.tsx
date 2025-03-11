'use client';

import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import { Video } from '@/types/YoutubeContents';
import PlayerModal from '@/components/PlayerModal';

export default function Dashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [dailyVideos, setDailyVideos] = useState<{ [date: string]: Video[] }>({});
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [rangeStart, setRangeStart] = useState<string>('');
  const [rangeEnd, setRangeEnd] = useState<string>('');

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  const fetchDailyDataRange = async (startDate: string, endDate: string) => {
    try {
      const response = await fetch(
        `/api/getDailyVideosRange?startDate=${encodeURIComponent(startDate)}&endDate=${encodeURIComponent(endDate)}`,
        { method: 'GET', headers: { 'Content-Type': 'application/json' } }
      );
      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.message || '데이터 조회 실패');
      }
      return result.data;
    } catch (err) {
      throw new Error((err as Error).message || '네트워크 오류로 데이터를 불러오지 못했습니다.');
    }
  };

  const loadDailyData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(today.getDate() - 1);

      const defaultStart = yesterday.toISOString().split('T')[0]; // 하루 전날
      const defaultEnd = today.toISOString().split('T')[0]; // 오늘
      const startDate = rangeStart || defaultStart;
      const endDate = rangeEnd || defaultEnd;

      const data = await fetchDailyDataRange(startDate, endDate);
      const rankedData: { [date: string]: Video[] } = {};
      for (const date in data) {
        const videos = Array.isArray(data[date]) ? data[date] : [];
        rankedData[date] = videos.length > 0
          ? videos.sort((a, b) => b.views - a.views).map((video, index) => ({ ...video, rank: index + 1 }))
          : [];
      }
      setDailyVideos(rankedData);
      setSelectedDate(endDate); // 기본적으로 오늘 선택
      if (!rangeStart) setRangeStart(defaultStart); // 초기값 설정
      if (!rangeEnd) setRangeEnd(defaultEnd);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDailyData();
  }, []);

  const handleRangeSubmit = () => {
    if (rangeStart && rangeEnd && new Date(rangeStart) <= new Date(rangeEnd)) {
      loadDailyData();
    } else {
      setError('유효한 날짜 범위를 선택해주세요.');
    }
  };

  const getRankChange = (video: Video, date: string) => {
    const prevDate = Object.keys(dailyVideos).sort().reverse().find((d) => d < date);
    if (!prevDate || !dailyVideos[prevDate].length) {
      return { change: 0, isNew: false };
    }
    const prevVideo = dailyVideos[prevDate].find((v) => v.id === video.id);
    if (!prevVideo) {
      return { change: 0, isNew: true };
    }
    return { change: prevVideo.rank - video.rank, isNew: false };
  };

  const currentVideos = selectedDate ? dailyVideos[selectedDate] || [] : [];

  if (isLoading) {
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
          <div className="flex-1 w-full h-full flex items-center justify-center p-6">
            <div className="text-gray-600">로딩 중...</div>
          </div>
        </div>
      </div>
    );
  }

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
          <h1 className="text-2xl font-bold text-gray-900 mb-2">유튜브 인기 순위 대시보드</h1>
          <p className="text-gray-600 mb-6">
            선택한 기간({rangeStart} ~ {rangeEnd})의 유튜브 인기 동영상 순위를 확인하고, 이전 날짜와의 순위 변화(▲/▼)를 통해 트렌드를 파악하세요.
          </p>
          {error ? (
            <div className="bg-red-100 p-4 rounded-lg text-red-700 mb-6">
              <p>{error}</p>
              <button
                onClick={loadDailyData}
                className="mt-2 p-2 bg-teal-500 hover:bg-teal-600 text-white rounded"
              >
                다시 시도
              </button>
            </div>
          ) : (
            <>
              <div className="mb-6 flex items-center space-x-4">
                <div>
                  <label htmlFor="range-start" className="mr-2 font-semibold">시작 날짜:</label>
                  <input
                    type="date"
                    id="range-start"
                    value={rangeStart}
                    onChange={(e) => setRangeStart(e.target.value)}
                    className="p-2 border rounded"
                    max={rangeEnd || new Date().toISOString().split('T')[0]}
                  />
                </div>
                <div>
                  <label htmlFor="range-end" className="mr-2 font-semibold">종료 날짜:</label>
                  <input
                    type="date"
                    id="range-end"
                    value={rangeEnd}
                    onChange={(e) => setRangeEnd(e.target.value)}
                    className="p-2 border rounded"
                    min={rangeStart}
                    max={new Date().toISOString().split('T')[0]}
                  />
                </div>
                <button
                  onClick={handleRangeSubmit}
                  className="p-2 bg-teal-500 hover:bg-teal-600 text-white rounded"
                >
                  조회
                </button>
                <button
                  onClick={loadDailyData}
                  className="ml-4 p-2 bg-teal-500 hover:bg-teal-600 text-white rounded"
                >
                  초기화
                </button>
              </div>
              <ul className="space-y-4">
                {currentVideos.length === 0 ? (
                  <p className="text-gray-600">선택한 날짜에 데이터가 없습니다.</p>
                ) : (
                  currentVideos.map((video) => {
                    const { change, isNew } = getRankChange(video, selectedDate);
                    return (
                      <li
                        key={video.id}
                        onClick={() => setSelectedVideo(video)}
                        className="flex items-center p-4 bg-white rounded-lg shadow-md hover:bg-gray-200 cursor-pointer transition-all duration-200"
                      >
                        <span className="w-12 text-lg font-bold text-teal-500">{video.rank}</span>
                        <div className="flex-1">
                          <h2 className="text-lg font-semibold text-gray-800">
                            {video.title.length > 50 ? `${video.title.slice(0, 50)}...` : video.title}
                          </h2>
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            {isNew ? (
                              <span className="text-green-500 font-bold animate-rank-change">신규</span>
                            ) : (
                              <span
                                className={`animate-rank-change ${
                                  change > 0 ? 'text-green-500' : change < 0 ? 'text-red-500' : 'text-gray-500'
                                }`}
                              >
                                {change > 0 ? `▲ ${change}` : change < 0 ? `▼ ${-change}` : '—'}
                              </span>
                            )}
                          </div>
                        </div>
                      </li>
                    );
                  })
                )}
              </ul>
            </>
          )}
        </div>
      </div>
      {selectedVideo && <PlayerModal video={selectedVideo} onClose={() => setSelectedVideo(null)} />}
    </div>
  );
}
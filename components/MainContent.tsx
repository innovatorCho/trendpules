'use client';

import { useEffect, useState } from 'react';
import { Video } from '@/types/YoutubeContents';
import { ChevronDownIcon } from '@heroicons/react/24/solid';

interface MainContentProps {
  setSelectedVideo: (video: Video) => void;
}

export default function MainContent({ setSelectedVideo }: MainContentProps) {
  const [popularVideos, setPopularVideos] = useState<Video[]>([]);
  const [displayCount, setDisplayCount] = useState(3);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeeklyPopularVideos = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        const publishedAfter = oneWeekAgo.toISOString();

        const searchParams = new URLSearchParams({
          part: 'snippet',
          type: 'video',
          regionCode: 'KR',
          order: 'viewCount',
          publishedAfter: publishedAfter,
          maxResults: '10',
          key: process.env.NEXT_PUBLIC_YOUTUBE_API_KEY || '',
        });

        const searchResponse = await fetch(
          `https://www.googleapis.com/youtube/v3/search?${searchParams.toString()}`
        );
        if (!searchResponse.ok) {
          const errorText = await searchResponse.text();
          throw new Error(`Search API 실패: ${searchResponse.status} - ${errorText}`);
        }
        const searchData = await searchResponse.json();
        const videoIds = searchData.items.map((item: any) => item.id.videoId).join(',');

        const videoParams = new URLSearchParams({
          part: 'snippet,statistics',
          id: videoIds,
          key: process.env.NEXT_PUBLIC_YOUTUBE_API_KEY || '',
        });

        const videoResponse = await fetch(
          `https://www.googleapis.com/youtube/v3/videos?${videoParams.toString()}`
        );
        if (!videoResponse.ok) {
          const errorText = await videoResponse.text();
          throw new Error(`Videos API 실패: ${videoResponse.status} - ${errorText}`);
        }
        const videoData = await videoResponse.json();

        const videos: Video[] = videoData.items.map((item: any) => ({
          id: item.id,
          title: item.snippet.title,
          uploader: item.snippet.channelTitle,
          views: parseInt(item.statistics.viewCount),
          thumbnail: item.snippet.thumbnails.medium.url,
        }));
        setPopularVideos(videos);
      } catch (error) {
        setError('주간 인기 영상을 불러오지 못했습니다.');
        console.error('주간 인기 영상 가져오기 실패:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchWeeklyPopularVideos();
  }, []);

  const handleLoadMore = () => {
    setDisplayCount((prev) => Math.min(prev + 3, 10));
  };

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-full">
        <div className="w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  if (error)
    return (
      <p className="p-4 sm:p-6 text-center text-red-500 bg-gray-800 rounded shadow-md">
        {error}
      </p>
    );

  return (
    <main className="flex-1 p-4 sm:p-6 overflow-y-auto">
      <section className="mb-8">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-4 text-white">
          이번 주 인기 영상
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {popularVideos.slice(0, displayCount).map((video) => (
            <div
              key={video.id}
              onClick={() => setSelectedVideo(video)}
              className="p-4 bg-gray-800 rounded-lg shadow-md hover:bg-gray-700 hover:shadow-lg transition-all duration-200 cursor-pointer"
            >
              <img
                src={video.thumbnail}
                alt={video.title}
                className="w-full h-40 object-cover rounded-md mb-2"
              />
              <h2 className="text-sm sm:text-base lg:text-lg font-semibold text-white truncate">
                {video.title}
              </h2>
              <p className="text-xs sm:text-sm text-gray-400">{video.uploader}</p>
              <p className="text-xs sm:text-sm text-gray-500">
                {video.views.toLocaleString()} views
              </p>
            </div>
          ))}
        </div>
        {displayCount < popularVideos.length && displayCount < 10 && (
          <button
            onClick={handleLoadMore}
            disabled={isLoading}
            className="mt-4 px-6 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md flex items-center space-x-2"
          >
            <span>더보기</span>
            <ChevronDownIcon className="w-5 h-5" />
          </button>
        )}
      </section>
    </main>
  );
}
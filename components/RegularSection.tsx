import { Video } from '@/types/YoutubeContents';
import Player from './Player';
import { useState, useEffect } from 'react';
import Image from 'next/image';

interface RegularSectionProps {
  regularVideos: Video[];
  setSelectedVideo: (video: Video | null) => void;
  selectedVideo: Video | null;
}

export default function RegularSection({ regularVideos, setSelectedVideo, selectedVideo }: RegularSectionProps) {
  const [isClosing, setIsClosing] = useState(false);

  const handleVideoClick = (video: Video) => {
    if (selectedVideo?.id === video.id) {
      setIsClosing(true); // 닫힘 애니메이션 시작
    } else {
      setSelectedVideo(video);
      setIsClosing(false);
    }
  };

  useEffect(() => {
    if (isClosing) {
      const timer = setTimeout(() => {
        setSelectedVideo(null);
        setIsClosing(false);
      }, 300); // 애니메이션 지속 시간 (0.3초)과 일치
      return () => clearTimeout(timer);
    }
  }, [isClosing, setSelectedVideo]);

  return (
    <section className="mb-6 w-full">
      <h1 className="text-lg sm:text-xl lg:text-3xl font-bold mb-3 sm:mb-4">
        이번 주 인기 일반 영상
      </h1>
      {regularVideos.length === 0 ? (
        <p className="text-gray-400 text-center">영상이 충분하지 않습니다.</p>
      ) : (
        <ul className="space-y-4 w-full">
          {regularVideos.map((video, index) => (
            <div key={video.id} className="w-full">
              <li
                onClick={() => handleVideoClick(video)}
                className="flex items-center p-2 sm:p-4 rounded-lg shadow-md hover:bg-gray-200 transition-all duration-200 cursor-pointer w-full"
              >
                <span className="text-lg sm:text-xl font-bold text-teal-500 mr-2 sm:mr-4 w-8 sm:w-10 flex-shrink-0">
                  {index + 1}
                </span>
                <Image
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-32 sm:w-40 lg:w-48 h-18 sm:h-24 lg:h-28 object-cover rounded-md mr-2 sm:mr-4 flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h2 className="text-sm sm:text-base lg:text-lg font-semibold text-gray-800">
                    {video.title.length > 50 ? `${video.title.slice(0, 50)}...` : video.title}
                  </h2>
                  <p className="text-xs sm:text-sm text-gray-600 truncate">{video.uploader}</p>
                  <p className="text-xs sm:text-sm font-semibold text-teal-500 pt-1 pb-1">
                    조회수: {video.views.toLocaleString()}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-800 line-clamp-2">
                    {video.description || '설명 없음 (렌더링 확인용)'}
                  </p>
                </div>
              </li>
              {selectedVideo?.id === video.id && (
                <div
                  className={`mt-2 w-full ${
                    isClosing ? 'animate-player-slide-up' : 'animate-player-slide-down'
                  }`}
                >
                  <Player selectedVideo={video} onClose={() => setIsClosing(true)} />
                </div>
              )}
            </div>
          ))}
        </ul>
      )}
    </section>
  );
}
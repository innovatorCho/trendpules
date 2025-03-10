'use client';

import { useState, useEffect } from 'react';
import { Video } from '@/types/YoutubeContents';
import { PlayIcon, PauseIcon, XMarkIcon } from '@heroicons/react/24/solid';
import Image from 'next/image';

interface PlayerProps {
  selectedVideo: Video | null;
  onClose: () => void;
}

export default function Player({ selectedVideo, onClose }: PlayerProps) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isEmbeddable, setIsEmbeddable] = useState(true);

  useEffect(() => {
    if (!selectedVideo) return;

    const checkEmbeddable = async () => {
      const params = new URLSearchParams({
        part: 'status',
        id: selectedVideo.id,
        key: process.env.NEXT_PUBLIC_YOUTUBE_API_KEY || '',
      });
      const response = await fetch(`https://www.googleapis.com/youtube/v3/videos?${params}`);
      const data = await response.json();
      setIsEmbeddable(data.items[0]?.status.embeddable ?? false);
    };
    checkEmbeddable();
  }, [selectedVideo]);

  return (
    <div className="p-2 sm:p-4 bg-gray-800 flex flex-col sm:flex-row items-center justify-between shadow-md w-full">
      {selectedVideo ? (
        <div className="flex flex-col sm:flex-row items-center w-full gap-2 sm:gap-4">
          <div className="w-full sm:w-[300px] md:w-[400px] lg:w-[500px] aspect-video rounded-md shadow-lg">
            {isEmbeddable ? (
              <iframe
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${selectedVideo.id}?autoplay=${isPlaying ? 1 : 0}`}
                title={selectedVideo.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="rounded-md"
              />
            ) : (
              <div className="relative w-full h-full">
                <Image
                  src={selectedVideo.thumbnail}
                  alt={selectedVideo.title}
                  className="w-full h-full object-cover rounded-md"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-md">
                  <a
                    href={`https://www.youtube.com/watch?v=${selectedVideo.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white bg-teal-600 px-3 sm:px-4 py-1 sm:py-2 rounded-full hover:bg-teal-700 transition-all text-sm sm:text-base"
                  >
                    YouTube에서 보기
                  </a>
                </div>
              </div>
            )}
          </div>
          <div className="flex-1 w-full sm:w-auto">
            <p className="font-bold text-sm sm:text-base lg:text-lg text-white truncate">
              {selectedVideo.title}
            </p>
            <p className="text-xs sm:text-sm text-gray-400 truncate">{selectedVideo.uploader}</p>
            <div className="mt-2 flex space-x-2">
              {isEmbeddable && (
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="px-2 sm:px-3 py-1 bg-teal-600 text-white rounded-full hover:bg-teal-700 transition-all duration-200 shadow-md flex items-center"
                >
                  {isPlaying ? <PauseIcon className="w-4 h-4 sm:w-5 sm:h-5" /> : <PlayIcon className="w-4 h-4 sm:w-5 sm:h-5" />}
                </button>
              )}
              <button
                onClick={onClose}
                className="px-2 sm:px-3 py-1 bg-gray-600 text-white rounded-full hover:bg-gray-700 transition-all duration-200 shadow-md flex items-center"
              >
                <XMarkIcon className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-gray-400 text-sm sm:text-base">영상을 선택하세요</p>
      )}
    </div>
  );
}
'use client';

import { useState } from 'react';
import { Video } from '@/types/YoutubeContents';
import { PlayIcon, PauseIcon, XMarkIcon } from '@heroicons/react/24/solid';

interface PlayerProps {
  selectedVideo: Video | null;
  onClose: () => void;
}

export default function Player({ selectedVideo, onClose }: PlayerProps) {
  const [isPlaying, setIsPlaying] = useState(true);

  return (
    <footer className="p-4 bg-gray-800 flex flex-col sm:flex-row items-center justify-between shadow-md">
      {selectedVideo ? (
        <div className="flex flex-col sm:flex-row items-center w-full gap-4">
          <iframe
            width="100%"
            height="auto"
            src={`https://www.youtube.com/embed/${selectedVideo.id}?autoplay=${isPlaying ? 1 : 0}`}
            title={selectedVideo.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="rounded-md w-full max-w-[300px] sm:max-w-[400px] lg:max-w-[500px] aspect-video shadow-lg"
          />
          <div className="flex-1">
            <p className="font-bold text-sm sm:text-base lg:text-lg text-white truncate">
              {selectedVideo.title}
            </p>
            <p className="text-xs sm:text-sm text-gray-400">{selectedVideo.uploader}</p>
            <div className="mt-2 flex space-x-2">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="px-3 py-1 bg-red-600 text-white rounded-full hover:bg-red-700 transition-all duration-200 shadow-md flex items-center"
              >
                {isPlaying ? (
                  <PauseIcon className="w-5 h-5" />
                ) : (
                  <PlayIcon className="w-5 h-5" />
                )}
              </button>
              <button
                onClick={onClose}
                className="px-3 py-1 bg-gray-600 text-white rounded-full hover:bg-gray-700 transition-all duration-200 shadow-md flex items-center"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-gray-400 text-sm sm:text-base">영상을 선택하세요</p>
      )}
    </footer>
  );
}
'use client';

import { Video } from '@/types/YoutubeContents';
import { useDailyPopularVideos } from '@/hooks/useDailyPopularVideos';
import RegularSection from './RegularSection';

interface MainContentProps {
  setSelectedVideo: (video: Video | null) => void;
  selectedVideo: Video | null;
}

export default function MainContent({ setSelectedVideo, selectedVideo }: MainContentProps) {
  const { regularVideos, isLoading, error } = useDailyPopularVideos();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full w-full">
        <div className="w-12 h-12 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <p className="p-4 text-center text-red-500 bg-white rounded shadow-md w-full">
        {error}
      </p>
    );
  }

  return (
    <main className="p-2 sm:p-4 lg:p-6 w-full min-h-full">
      <RegularSection
        regularVideos={regularVideos}
        setSelectedVideo={setSelectedVideo}
        selectedVideo={selectedVideo}
      />
    </main>
  );
}
'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import MainContent from '@/components/MainContent';
import { Video } from '@/types/YoutubeContents';

export default function YouTube() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

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
        <div className="flex-1 w-full h-full overflow-y-auto">
          <MainContent setSelectedVideo={setSelectedVideo} selectedVideo={selectedVideo} />
        </div>
      </div>
    </div>
  );
}
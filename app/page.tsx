'use client';

import { useState } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import MainContent from '../components/MainContent';
import Player from '../components/Player';
import { Video } from '@/types/YoutubeContents';

export default function Home() {
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleClose = () => setSelectedVideo(null);

  return (
    <div className="flex flex-col h-full">
      <Header toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(false)} />
        <MainContent setSelectedVideo={setSelectedVideo} />
      </div>
      <Player selectedVideo={selectedVideo} onClose={handleClose} />
    </div>
  );
}
'use client';

import { useEffect, useState } from 'react';
import { Video } from '@/types/YoutubeContents';

export const useDailyPopularVideos = () => {
  const [regularVideos, setRegularVideos] = useState<Video[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const parseDuration = (duration: string): number => {
    const regex = /PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/;
    const matches = duration.match(regex);
    const hours = parseInt(matches?.[1] || '0') * 3600;
    const minutes = parseInt(matches?.[2] || '0') * 60;
    const seconds = parseInt(matches?.[3] || '0');
    return hours + minutes + seconds;
  };

  const saveToServer = async (regulars: Video[]) => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const week = `week-${Math.floor(new Date(today).getTime() / (1000 * 60 * 60 * 24 * 7))}`;
      const month = today.slice(0, 7); // YYYY-MM
      const year = today.slice(0, 4); // YYYY

      const payload = { regulars, today, week, month, year };

      const response = await fetch('/api/saveDailyVideos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.message || '서버 저장 실패');
      }
    } catch (saveError) {
      console.warn('서버 저장 실패, API 데이터로 진행:', saveError);
    }
  };

  const getFromServer = async (date: string): Promise<{ regulars: Video[] } | null> => {
    try {
      const url = `/api/getDailyVideos?date=${encodeURIComponent(date)}`;
      const response = await fetch(url, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.message || '서버 조회 실패');
      }

      return result.data || null;
    } catch (fetchError) {
      console.warn('서버 조회 실패:', fetchError);
      return null;
    }
  };

  useEffect(() => {
    const fetchDailyPopularVideos = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const today = new Date().toISOString().split('T')[0];
        const cachedData = await getFromServer(today);

        if (cachedData) {
          setRegularVideos(cachedData.regulars);
          setIsLoading(false);
          return;
        }

        if (!process.env.NEXT_PUBLIC_YOUTUBE_API_KEY) {
          throw new Error('YouTube API 키가 설정되지 않았습니다.');
        }

        const videoParams = new URLSearchParams({
          part: 'snippet,statistics,contentDetails',
          chart: 'mostPopular',
          regionCode: 'KR',
          maxResults: '50',
          key: process.env.NEXT_PUBLIC_YOUTUBE_API_KEY,
        });

        const videoUrl = `https://www.googleapis.com/youtube/v3/videos?${videoParams.toString()} `;
        const videoResponse = await fetch(videoUrl);
        if (!videoResponse.ok) {
          throw new Error(`Videos API 실패: ${videoResponse.status}`);
        }

        const videoData = await videoResponse.json();
        const allVideos: Video[] = videoData.items.map((item: any) => ({
          id: item.id,
          title: item.snippet.title,
          uploader: item.snippet.channelTitle,
          views: parseInt(item.statistics.viewCount) || 0,
          thumbnail: item.snippet.thumbnails.medium.url,
          duration: parseDuration(item.contentDetails.duration),
          isShort: parseDuration(item.contentDetails.duration) <= 60,
          description: item.snippet.description || '설명 없음',
          tags: item.snippet.tags || [],
        }));

        const regulars = allVideos.sort((a, b) => b.views - a.views).slice(0, 15);

        setRegularVideos(regulars);
        await saveToServer(regulars);
      } catch (error: any) {
        setError(`일일 인기 영상을 불러오지 못했습니다: ${error.message}`);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDailyPopularVideos();
  }, []);

  return { regularVideos, isLoading, error };
};
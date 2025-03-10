import { Video } from '@/types/YoutubeContents';
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.NEXT_PUBLIC_UPSTASH_REDIS_REST_URL || '',
  token: process.env.NEXT_PUBLIC_UPSTASH_REDIS_REST_TOKEN || '',
});

export async function saveDailyVideos(shorts: Video[], regulars: Video[]) {
  const today = new Date().toISOString().split('T')[0];
  const cacheKey = `most-popular-videos-${today}`;

  console.log('Redis 환경 변수:', {
    url: process.env.NEXT_PUBLIC_UPSTASH_REDIS_REST_URL,
    token: process.env.NEXT_PUBLIC_UPSTASH_REDIS_REST_TOKEN,
  });
  console.log('저장할 데이터:', { shortsCount: shorts.length, regularsCount: regulars.length });

  if (!process.env.NEXT_PUBLIC_UPSTASH_REDIS_REST_URL || !process.env.NEXT_PUBLIC_UPSTASH_REDIS_REST_TOKEN) {
    console.warn('Upstash Redis 환경 변수가 설정되지 않았습니다. 저장 생략.');
    return;
  }

  try {
    console.log('Redis 저장 요청:', cacheKey);
    await redis.set(cacheKey, { shorts, regulars }, { ex: 24 * 60 * 60 });
    console.log('데이터 저장 완료:', cacheKey);

    // 저장 후 즉시 확인
    const savedData = await redis.get(cacheKey);
    console.log('저장된 데이터 확인:', savedData);
  } catch (error) {
    console.error('Redis 저장 실패 상세:', error);
  }
}

export async function getDailyVideos(date: string): Promise<{ shorts: Video[]; regulars: Video[] } | null> {
  try {
    const cacheKey = `most-popular-videos-${date}`;
    const data = await redis.get(cacheKey);
    if (!data) {
      console.log('캐시 데이터 없음:', cacheKey);
      return null;
    }
    console.log('캐시 데이터 조회:', cacheKey, data);
    return data as { shorts: Video[]; regulars: Video[] };
  } catch (error) {
    console.error('Redis 조회 실패:', error);
    return null;
  }
}
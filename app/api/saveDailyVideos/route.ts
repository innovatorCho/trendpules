import { NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';
import { Video } from '@/types/YoutubeContents';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || '',
  token: process.env.UPSTASH_REDIS_REST_TOKEN || '',
});

export async function POST(request: Request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: '잘못된 요청 본문', success: false }, { status: 400 });
  }

  const { regulars, today, week, month, year } = body as {
    regulars: Video[];
    today: string;
    week: string;
    month: string;
    year: string;
  };

  if (!regulars || !today || !week || !month || !year) {
    return NextResponse.json({ message: '필수 파라미터 누락', success: false }, { status: 400 });
  }

  const cacheKey = `most-popular-videos-${today}`;
  const weekKey = `weekly-videos-${week}`;
  const monthKey = `monthly-videos-${month}`;
  const yearKey = `yearly-videos-${year}`;

  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
    return NextResponse.json({ message: 'Redis 환경 변수 누락', success: false }, { status: 500 });
  }

  try {
    await redis.set(cacheKey, { regulars }, { ex: 24 * 60 * 60 });
    await redis.lpush(weekKey, JSON.stringify(regulars));
    await redis.lpush(monthKey, JSON.stringify(regulars));
    await redis.lpush(yearKey, JSON.stringify(regulars));

    const savedDailyData = await redis.get(cacheKey);
    if (!savedDailyData) {
      throw new Error('Redis에 일일 데이터 저장 실패');
    }

    return NextResponse.json({ message: '저장 성공', success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: '저장 실패', success: false, error: (error as Error).message }, { status: 500 });
  }
}
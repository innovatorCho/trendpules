import { NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || '',
  token: process.env.UPSTASH_REDIS_REST_TOKEN || '',
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get('date');

  if (!date) {
    return NextResponse.json({ message: '날짜 파라미터가 필요합니다.', success: false }, { status: 400 });
  }

  const cacheKey = `most-popular-videos-${date}`;

  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
    return NextResponse.json({ message: 'Redis 환경 변수 누락', success: false }, { status: 500 });
  }

  try {
    const data = await redis.get(cacheKey);
    if (!data) {
      return NextResponse.json({ message: '저장된 데이터 없음', data: null, success: true }, { status: 200 });
    }
    return NextResponse.json({ message: '조회 성공', data, success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: '조회 실패', success: false, error: (error as Error).message }, { status: 500 });
  }
}
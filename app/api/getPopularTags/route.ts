import { NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || '',
  token: process.env.UPSTASH_REDIS_REST_TOKEN || '',
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get('date') || new Date().toISOString().split('T')[0];

  const tagKey = `tags-${date}`;

  try {
    const tags = await redis.zrange(tagKey, 0, 9, { withScores: true, rev: true }); // 상위 10개 태그
    console.log('서버: 태그 조회 성공:', tags);
    return NextResponse.json({ message: '조회 성공', tags }, { status: 200 });
  } catch (error) {
    console.error('서버: 태그 조회 실패:', error);
    return NextResponse.json({ message: '조회 실패', error: (error as Error).message }, { status: 500 });
  }
}
import { NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';
import { Video } from '@/types/YoutubeContents';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || '',
  token: process.env.UPSTASH_REDIS_REST_TOKEN || '',
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');
  console.log('[GET DEBUG] 요청 파라미터:', { startDate, endDate });

  if (!startDate || !endDate) {
    console.log('[GET DEBUG] 파라미터 누락');
    return NextResponse.json({ message: '시작 날짜와 종료 날짜가 필요합니다.', success: false }, { status: 400 });
  }

  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
    console.log('[GET DEBUG] Redis 환경 변수 누락');
    return NextResponse.json({ message: 'Redis 환경 변수가 설정되지 않았습니다.', success: false }, { status: 500 });
  }

  const start = new Date(startDate);
  const end = new Date(endDate);
  if (isNaN(start.getTime()) || isNaN(end.getTime()) || start > end) {
    console.log('[GET DEBUG] 유효하지 않은 날짜 범위');
    return NextResponse.json({ message: '유효하지 않은 날짜 범위입니다.', success: false }, { status: 400 });
  }

  try {
    const dates: string[] = [];
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      dates.push(d.toISOString().split('T')[0]);
    }
    console.log('[GET DEBUG] 조회 날짜 목록:', dates);

    const data: { [date: string]: Video[] } = {};
    for (const date of dates) {
      const cacheKey = `most-popular-videos-${date}`;
      const rawVideos = await redis.get(cacheKey);
      console.log(`[GET DEBUG] ${cacheKey} raw 데이터:`, rawVideos);

      let videos: Video[] = [];
      if (!rawVideos) {
        console.log(`[GET DEBUG] ${cacheKey} 데이터 없음`);
        videos = [];
      } else if (typeof rawVideos === 'string') {
        try {
          videos = JSON.parse(rawVideos);
          console.log(`[GET DEBUG] ${cacheKey} 파싱 후:`, videos);
          if (!Array.isArray(videos)) {
            console.warn(`[GET WARN] ${cacheKey} 배열 아님:`, videos);
            videos = [];
          }
        } catch (e) {
          console.error(`[GET ERROR] ${cacheKey} JSON 파싱 실패:`, e);
          videos = [];
        }
      } else if (typeof rawVideos === 'object') {
        // 기존 object 데이터 처리
        const obj = rawVideos as any;
        if ('regulars' in obj && Array.isArray(obj.regulars)) {
          videos = obj.regulars as Video[];
          console.log(`[GET DEBUG] ${cacheKey} regulars 추출:`, videos);
        } else {
          console.warn(`[GET WARN] ${cacheKey} regulars 배열 없음:`, rawVideos);
          videos = [];
        }
      } else {
        console.warn(`[GET WARN] ${cacheKey} 예상 외 타입:`, rawVideos);
        videos = [];
      }
      data[date] = videos;
    }

    console.log('[GET DEBUG] 최종 데이터:', data);
    return NextResponse.json({ message: '조회 성공', data, success: true }, { status: 200 });
  } catch (error) {
    console.error('[GET ERROR] 데이터 조회 실패:', error);
    return NextResponse.json(
      { message: '데이터 조회 중 오류 발생', success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
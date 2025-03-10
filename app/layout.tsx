import type { Metadata } from 'next';
import './globals.css';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'TrendPulse - 트렌드 영상 플랫폼',
    description: '최신 유튜브 쇼츠와 인기 영상을 확인하세요. TrendPulse에서 주간 트렌드를 만나보세요!',
    keywords: 'TrendPulse, 유튜브, 쇼츠, 인기 영상, 트렌드, 한국 영상',
    openGraph: {
      title: 'TrendPulse - 트렌드 영상 플랫폼',
      description: '최신 유튜브 쇼츠와 인기 영상을 확인하세요.',
      url: 'https://trendpulse.dinokit.net', // 실제 도메인으로 변경
      siteName: 'TrendPulse',
      type: 'website',
      locale: 'ko_KR',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'TrendPulse - 트렌드 영상 플랫폼',
      description: '최신 유튜브 쇼츠와 인기 영상을 확인하세요.',
    },
  };
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className="bg-gray-900 text-white min-h-screen w-full">
        {children}
      </body>
    </html>
  );
}
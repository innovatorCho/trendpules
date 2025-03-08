import type { Metadata } from 'next';
import './globals.css';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'YouTube Music Clone',
    description: 'A YouTube Music clone built with Next.js',
  };
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className="bg-gray-900 text-white min-h-screen">
        <div className="flex flex-col h-screen lg:flex-row">{children}</div>
      </body>
    </html>
  );
}
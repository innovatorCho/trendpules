'use client';
import Link from 'next/link';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

export default function Sidebar({ isOpen, toggleSidebar }: SidebarProps) {
  return (
    <aside className="w-full h-full flex flex-col p-4">
      <button onClick={toggleSidebar} className="lg:hidden mb-4 text-gray-900">
        {isOpen ? '닫기' : '열기'}
      </button>
      <nav className="flex flex-col space-y-4">
        <Link href="/dashboard">
          <button className="p-2 rounded bg-teal-500 hover:bg-teal-600 text-white w-full font-bold">대시보드</button>
        </Link>
        <Link href="/youtube">
          <button className="p-2 rounded bg-teal-500 hover:bg-teal-600 text-white w-full font-bold">유튜브</button>
        </Link>
      </nav>
    </aside>
  );
}
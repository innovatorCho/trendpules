'use client';

import { Bars3Icon } from '@heroicons/react/24/solid';

interface HeaderProps {
  toggleSidebar: () => void;
}

export default function Header({ toggleSidebar }: HeaderProps) {
  return (
    <header className="h-16 flex items-center justify-between px-4 bg-white shadow-md">
      <div className="flex items-center">
        <button
          className="lg:hidden mr-2 sm:mr-4 text-gray-300 hover:text-white transition"
          onClick={toggleSidebar}
        >
          <Bars3Icon className="w-6 h-6 sm:w-8 sm:h-8" />
        </button>
        <div className="text-xl sm:text-xl lg:text-2xl font-bold text-teal-500">TrendPulse</div>
      </div>
      <input
        type="text"
        placeholder="검색..."
        className="w-full sm:w-3/4 md:w-1/2 lg:w-2/3 p-2 rounded bg-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
      />
      <div className="w-8 sm:w-10 h-8 sm:h-10 rounded-full bg-gray-600 ml-2 sm:ml-4 hover:bg-gray-500 transition" />
    </header>
  );
}
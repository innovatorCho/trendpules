'use client';

import { XMarkIcon } from '@heroicons/react/24/solid';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

export default function Sidebar({ isOpen, toggleSidebar }: SidebarProps) {
  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 lg:hidden z-10 transition-opacity duration-300"
          onClick={toggleSidebar}
        />
      )}
      <aside
        className={`fixed inset-y-0 left-0 w-64 p-4 bg-gray-800 shadow-lg transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:static lg:translate-x-0 transition-transform duration-300 ease-in-out z-20`}
      >
        <button
          className="lg:hidden mb-4 text-gray-300 hover:text-white transition"
          onClick={toggleSidebar}
        >
          <XMarkIcon className="w-6 h-6" />
        </button>
        <ul className="space-y-4 text-sm lg:text-base">
          <li className="hover:text-red-500 cursor-pointer transition-colors duration-200">홈</li>
          <li className="hover:text-red-500 cursor-pointer transition-colors duration-200">탐색</li>
          <li className="hover:text-red-500 cursor-pointer transition-colors duration-200">라이브러리</li>
        </ul>
      </aside>
    </>
  );
}
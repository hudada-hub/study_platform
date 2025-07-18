'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaUser, FaBook, FaCog } from 'react-icons/fa';

const menuItems = [
  {
    label: '个人资料',
    href: '/user/profile',
    icon: FaUser
  },
  {
    label: '我的Wiki',
    href: '/user/wikis',
    icon: FaBook
  },
  {
    label: '账号设置',
    href: '/user/settings',
    icon: FaCog
  }
];

export default function LeftSide() {
  const pathname = usePathname();

  return (
    <aside className="lg:col-span-3">
      <nav className="space-y-1 bg-white  rounded-lg p-4">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors ${
                isActive
                  ? ' bg-primary text-white'
                  : 'text-gray-900 hover:bg-gray-50'
              }`}
            >
              <Icon
                className={`mr-3 h-5 w-5 ${
                  isActive ? 'text-blue-500' : 'text-gray-400'
                }`}
              />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
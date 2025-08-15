'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaUser, FaBook, FaComments, FaTasks, FaHeart, FaShoppingCart, FaCog } from 'react-icons/fa';
import { getUserAuth } from '@/utils/client-auth';
import { useEffect, useState } from 'react';

export default function LeftSide() {
  const pathname = usePathname();
  const [userInfo, setUserInfo] = useState<any>(null);

  useEffect(() => {
    const {userInfo} = getUserAuth();
    setUserInfo(userInfo);
  }, []);

  const menuItems = [
    {
      label: '我的课程',
      href: '/user/courses',
      icon: <FaBook className="mr-2" />,
    },
    {
      label: '论坛管理',
      href: '/user/forum',
      icon: <FaComments className="mr-2" />,
    },
    {
      label: '接单管理',
      href: '/user/tasks',
      icon: <FaTasks className="mr-2" />,
    },
    {
      label: '我的收藏',
      href: '/user/favorites',
      icon: <FaHeart className="mr-2" />,
    },
    {
      label: '我的订单',
      href: '/user/orders',
      icon: <FaShoppingCart className="mr-2" />,
    },
    {
      label: '个人资料',
      href: `/profile/${userInfo?.id}`,
      icon: <FaUser className="mr-2" />,
    },
    {
      label: '账号设置',
      href: '/user/settings',
      icon: <FaCog className="mr-2" />,
    },
  ];

  return (
    <div className="w-64 bg-white shadow-sm min-h-screen p-4">
      <div className="space-y-2">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center px-4 py-3 text-gray-700 rounded-lg transition-colors ${
              pathname === item.href
                ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-500'
                : 'hover:bg-gray-50'
            }`}
          >
            {item.icon}
            {item.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
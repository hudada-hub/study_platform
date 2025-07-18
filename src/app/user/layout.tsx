'use client'
import { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaUser, FaCog, FaBookOpen, FaHeart, FaShoppingCart, FaTasks, FaComments } from 'react-icons/fa';



export default function UserLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  
    const tabs = [
      { label: '个人资料', path: '/user/profile', icon: <FaUser className="mr-2" /> },
      { label: '账号设置', path: '/user/settings', icon: <FaCog className="mr-2" /> },
      { label: '我的订单', path: '/user/orders', icon: <FaShoppingCart className="mr-2" /> },
      { label: '我的收藏', path: '/user/favorites', icon: <FaHeart className="mr-2" /> },
      { label: '课程管理', path: '/user/courses', icon: <FaBookOpen className="mr-2" /> },
      { label: '接单管理', path: '/user/tasks', icon: <FaTasks className="mr-2" /> },
      { label: '论坛管理', path: '/user/forum', icon: <FaComments className="mr-2" /> },
];

  return (
    <div className="w-[1680px] mx-auto  py-4">
      <div className="flex flex-col md:flex-row gap-8">
        {/* 左侧选项卡导航 */}
        <div className="w-full md:w-64 flex-shrink-0  hidden md:block" >
          <div className="bg-white rounded-lg  p-4 sticky top-4">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">用户中心</h2>
            <nav className="space-y-1">
              {tabs.map((tab) => (
                <Link
                  key={tab.path}
                  href={tab.path}
                  className={`flex items-center px-4 py-3 rounded-md transition-colors w-full ${
                    pathname === tab.path
                      ? 'bg-primary text-white font-medium'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>

        {/* 主内容区域 */}
        <div className="flex-1 bg-white rounded-lg  p-6 min-h-[calc(100vh-8rem)]">
          {children}
        </div>
      </div>
    </div>
  );
}
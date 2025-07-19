'use client'
import { ReactNode, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaUser, FaCog, FaBookOpen, FaHeart, FaShoppingCart, FaTasks, FaComments, FaBars } from 'react-icons/fa';

export default function UserLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const tabs = [
    { label: '个人资料', path: '/user/profile', icon: <FaUser className="mr-2" /> },
    { label: '账号设置', path: '/user/settings', icon: <FaCog className="mr-2" /> },
    { label: '我的订单', path: '/user/orders', icon: <FaShoppingCart className="mr-2" /> },
    { label: '我的收藏', path: '/user/favorites', icon: <FaHeart className="mr-2" /> },
    { label: '课程管理', path: '/user/courses', icon: <FaBookOpen className="mr-2" /> },
    { label: '接单管理', path: '/user/tasks', icon: <FaTasks className="mr-2" /> },
    { label: '论坛管理', path: '/user/forum', icon: <FaComments className="mr-2" /> },
  ];

  // 获取当前页面标题
  const currentTab = tabs.find(tab => tab.path === pathname);

  return (
    <div className="mx-auto py-4">
      {/* 移动端顶部标题栏 */}
      <div className="md:hidden flex items-center justify-between px-4 py-2 bg-white mb-4">
        <h1 className="text-lg font-medium">{currentTab?.label || '用户中心'}</h1>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 hover:bg-gray-100 rounded-lg"
        >
          <FaBars className="text-gray-600" />
        </button>
      </div>

      {/* 移动端菜单抽屉 */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-black-50 " onClick={() => setIsMobileMenuOpen(false)}>
          <div className="absolute right-0 top-0 h-full w-64 bg-white shadow-lg" onClick={e => e.stopPropagation()}>
            <div className="p-4">
              <h2 className="text-lg font-semibold mb-4 text-gray-800">用户中心</h2>
              <nav className="space-y-1">
                {tabs.map((tab) => (
                  <Link
                    key={tab.path}
                    href={tab.path}
                    onClick={() => setIsMobileMenuOpen(false)}
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
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-8">
        {/* 左侧选项卡导航 - 桌面端 */}
        <div className="w-full md:w-64 flex-shrink-0 hidden md:block">
          <div className="bg-white rounded-lg p-4 sticky top-4">
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
        <div className="flex-1 bg-white rounded-lg p-6 min-h-[calc(100vh-8rem)]">
          {children}
        </div>

        {/* 移动端底部导航栏 */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40">
          <div className="grid grid-cols-4 gap-1 p-2">
            {tabs.slice(0, 4).map((tab) => (
              <Link
                key={tab.path}
                href={tab.path}
                className={`flex flex-col items-center justify-center p-2 ${
                  pathname === tab.path
                    ? 'text-primary'
                    : 'text-gray-600'
                }`}
              >
                {tab.icon}
                <span className="text-xs mt-1">{tab.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
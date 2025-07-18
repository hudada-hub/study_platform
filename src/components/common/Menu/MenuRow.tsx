'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { FiBook, FiHome, FiMessageSquare, FiShoppingBag } from 'react-icons/fi';

// 菜单项接口定义
export interface MenuItem {
  key: string;
  label: string;
  href: string;
  icon?: React.ReactNode;
}

interface MenuRowProps {
  className?: string;
  activeClassName?: string;
  itemClassName?: string;
}
const menuItems: MenuItem[] = [
  {
    key: 'home',
    label: '首页',
    href: '/',
    icon: <FiHome className="w-5 h-5" />,
  },
  {
    key: 'courses',
    label: '课程',
    href: '/courses',
    icon: <FiBook className="w-5 h-5" />,
  },
  {
    key: 'forum',
    label: '论坛',
    href: '/forum',
    icon: <FiMessageSquare className="w-5 h-5" />,
  },
  {
    key: 'tasks',
    label: '接单',
    href: '/tasks',
    icon: <FiShoppingBag className="w-5 h-5" />,
  },
];
const MenuRow: React.FC<MenuRowProps> = ({

  className,
  activeClassName = 'text-primary border-b-2 border-primary',
  itemClassName = 'px-4 py-2 hover:text-primary transition-colors duration-200',
}) => {
  const pathname = usePathname();

  return (
    <nav className={cn('flex items-center space-x-1', className)}>
      {menuItems.map((item) => {
        const isActive = pathname === item.href;
        
        return (
          <Link
            key={item.key}
            href={item.href}
            className={cn(
              'flex items-center text-base font-medium',
              itemClassName,
              isActive && activeClassName
            )}
          >
            {item.icon && <span className="mr-2">{item.icon}</span>}
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
};

export default MenuRow; 
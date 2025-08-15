'use client';

import React from 'react';
import Link from 'next/link';
import { FiChevronRight, FiHome } from 'react-icons/fi';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface ForumBreadcrumbProps {
  items: BreadcrumbItem[];
}

const ForumBreadcrumb: React.FC<ForumBreadcrumbProps> = ({ items }) => {
  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
      <Link 
        href="/forum" 
        className="flex items-center space-x-1 hover:text-blue-600 transition-colors duration-200"
      >
        <FiHome className="w-4 h-4" />
        <span>论坛首页</span>
      </Link>
      
      {items.map((item, index) => (
        <React.Fragment key={index}>
          <FiChevronRight className="w-4 h-4 text-gray-400" />
          {item.href ? (
            <Link 
              href={item.href}
              className="hover:text-blue-600 transition-colors duration-200"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-gray-900 font-medium">{item.label}</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

export default ForumBreadcrumb; 
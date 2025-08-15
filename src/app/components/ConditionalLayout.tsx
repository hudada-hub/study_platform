'use client';

import { usePathname } from 'next/navigation';
import FrontLayout from './FrontLayout';

interface ConditionalLayoutProps {
  children: React.ReactNode;
}

const ConditionalLayout: React.FC<ConditionalLayoutProps> = ({ children }) => {
  const pathname = usePathname();
  
  // 如果路径包含 /protocol/ 则不使用FrontLayout
  if (pathname.includes('/protocol/')) {
    return <>{children}</>;
  }
  
  // 其他路径使用FrontLayout
  return <FrontLayout>{children}</FrontLayout>;
};

export default ConditionalLayout; 
'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useTheme } from '@/providers/theme-provider';

const Footer = () => {
  const { theme } = useTheme();
  const year = new Date().getFullYear();


  return (
    <footer className="bg-white dark:bg-gray-900">
      <div className="mx-auto max-w-7xl overflow-hidden px-6 py-2">
        


        {/* 版权和备案信息 */}
        <div className=" border-t border-gray-900/10 dark:border-white/10 ">
          <p className="text-center text-xs leading-5 text-gray-500 dark:text-gray-400">
            &copy; {year} Your Company Name. All rights reserved.
          </p>
          <p className="mt-2 text-center text-xs leading-5 text-gray-500 dark:text-gray-400">
            <Link href="https://beian.miit.gov.cn/" target="_blank" className="hover:underline">
              京ICP证150695号 京ICP备15029557号-1 京网文（2018）11175-1016号
            </Link>
            {' | '}
            <Link href="http://www.beian.gov.cn/portal/registerSystemInfo" target="_blank" className="hover:underline inline-flex items-center">
              <Image
                src="/kr.png"
                alt="公安备案图标"
                width={16}
                height={16}
                className="mr-1"
              />
              京公网安备110108020277486号
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 
'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from 'antd';
import { HomeOutlined } from '@ant-design/icons';

interface NotFoundProps {
  title?: string;
  description?: string;
}

export function NotFound({
  title = '页面不存在',
  description = '抱歉，您访问的页面不存在或已被删除。'
}: NotFoundProps) {
  const router = useRouter();

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center">
        {/* 404数字动画 */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="relative"
        >
          <div className="text-9xl font-bold text-gray-200 select-none">404</div>
          <motion.div
            initial={{ y: 0 }}
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
          >
            <div className="text-9xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text select-none">
              404
            </div>
          </motion.div>
        </motion.div>

        {/* 错误信息 */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2 className="mt-8 text-2xl font-semibold text-gray-800">{title}</h2>
          <p className="mt-4 text-gray-600">{description}</p>
        </motion.div>

        {/* 返回按钮 */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-8"
        >
          <Button
            type="primary"
            size="large"
            icon={<HomeOutlined />}
            onClick={() => router.push('/')}
            className="hover:scale-105 transition-transform"
          >
            返回首页
          </Button>
        </motion.div>
      </div>
    </div>
  );
} 
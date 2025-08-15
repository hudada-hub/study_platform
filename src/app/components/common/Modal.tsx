import React, { ReactNode, useEffect } from 'react';
import { CloseOutlined } from '@ant-design/icons';
import { motion, AnimatePresence } from 'framer-motion';

interface DrawerProps {
  title: string;
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  width?: string | number;
  placement?: 'left' | 'right';  // 添加弹出方向控制
}

const Drawer: React.FC<DrawerProps> = ({
  title,
  open,
  onClose,
  children,
  width = '400px',
  placement = 'right'  // 默认从右侧弹出
}) => {
  // 根据方向设置初始位置和动画
  const slideAnimation = {
    right: {
      initial: { x: '100%' },
      animate: { x: 0 },
      exit: { x: '100%' }
    },
    left: {
      initial: { x: '-100%' },
      animate: { x: 0 },
      exit: { x: '-100%' }
    }
  }[placement];

  useEffect(()=>{
    if(open){
      document.body.style.overflow = 'hidden';
    }else{
      document.body.style.overflow = 'auto';
    }
  },[open])

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* 遮罩层 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50"
            onClick={onClose}
          />
          
          {/* 抽屉内容 */}
          <motion.div
            initial={slideAnimation.initial}
            animate={slideAnimation.animate}
            exit={slideAnimation.exit}
            transition={{ type: 'tween', duration: 0.3 }}
            className={`fixed ${placement}-0 top-0 h-full z-50 bg-white `}
            style={{ width }}
          >
            {/* 标题栏 */}
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h3 className="text-lg font-medium">{title}</h3>
              <button
                onClick={onClose}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <CloseOutlined className="text-gray-500" />
              </button>
            </div>
            
            {/* 内容区域 - 添加滚动条 */}
            <div className="p-6 h-[calc(100vh-64px)] overflow-y-auto">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Drawer;
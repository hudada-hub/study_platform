import React, { ReactNode, useEffect } from 'react';
import { CloseOutlined } from '@ant-design/icons';
import { motion, AnimatePresence } from 'framer-motion';

interface CustomModalProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
  width?: string | number;
  height?: string | number;
  showClose?: boolean;
  maskClosable?: boolean;
  className?: string;
  bodyStyle?: React.CSSProperties;
}

const CustomModal: React.FC<CustomModalProps> = ({
  open,
  onClose,
  children,
  title,
  width = '500px',
  height = 'auto',
  showClose = true,
  maskClosable = true,
  className = '',
  bodyStyle = {}
}) => {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [open]);

  const handleMaskClick = () => {
    if (maskClosable) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* 遮罩层 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 w-[100vw] h-[100vh] z-5660 bg-black/50"
            onClick={handleMaskClick}
          />
          
          {/* Modal内容 */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: 'spring', duration: 0.3 }}
            className={`fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-white rounded-lg shadow-xl ${className}`}
            style={{ 
              width,
              height,
              maxHeight: '90vh',
              maxWidth: '90vw',
              ...bodyStyle
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* 标题栏 */}
            {(title || showClose) && (
              <div className="flex items-center justify-between px-6 py-4 border-b">
                {title && <h3 className="text-lg font-medium">{title}</h3>}
                {showClose && (
                  <button
                    onClick={onClose}
                    className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <CloseOutlined className="text-gray-500" />
                  </button>
                )}
              </div>
            )}
            
            {/* 内容区域 */}
            <div className="relative" style={{ height: title ? 'calc(100% - 60px)' : '100%' }}>
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CustomModal; 
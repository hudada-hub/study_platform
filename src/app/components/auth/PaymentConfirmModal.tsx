import React from 'react';
import Image from 'next/image';
import { FiCheck } from 'react-icons/fi';

interface PaymentConfirmModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading?: boolean;
}

export default function PaymentConfirmModal({
  visible,
  onClose,
  onConfirm,
  loading = false
}: PaymentConfirmModalProps) {
  if (!visible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg w-[800px] overflow-hidden">
        <div className="flex">
          {/* 左侧图片 */}
          <div className="relative w-1/2 h-[500px]">
            <Image
              src="/background.jpg"
              alt="注册会员"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
              <div className="text-white text-center">
                <h2 className="text-3xl font-medium mb-4">加入我们</h2>
                <p className="text-lg">开启您的学习之旅</p>
              </div>
            </div>
          </div>

          {/* 右侧内容 */}
          <div className="w-1/2 p-8">
            <h3 className="text-2xl font-medium mb-6 dark:text-white">注册会员</h3>
            <div className="space-y-6 mb-8">
              <div className="flex items-start gap-3">
                <div className="mt-1">
                  <FiCheck className="w-5 h-5 text-green-500" />
                </div>
                <div>
                  <h4 className="text-lg font-medium mb-1 dark:text-white">海量优质课程</h4>
                  <p className="text-gray-600 dark:text-gray-400">
                    独家精品课程内容，涵盖多个领域的专业知识
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="mt-1">
                  <FiCheck className="w-5 h-5 text-green-500" />
                </div>
                <div>
                  <h4 className="text-lg font-medium mb-1 dark:text-white">专业社区交流</h4>
                  <p className="text-gray-600 dark:text-gray-400">
                    与行业专家和学习伙伴交流互动，分享经验
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="mt-1">
                  <FiCheck className="w-5 h-5 text-green-500" />
                </div>
                <div>
                  <h4 className="text-lg font-medium mb-1 dark:text-white">任务接单系统</h4>
                  <p className="text-gray-600 dark:text-gray-400">
                    参与实战项目，获得实践机会和额外收入
                  </p>
                </div>
              </div>
            </div>

            <div className="text-center mb-6">
              <div className="text-3xl font-medium text-cyan-500 mb-2">¥299</div>
              <div className="text-gray-500 dark:text-gray-400">终身会员 · 一次付费</div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={onClose}
                className="flex-1 px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                取消
              </button>
              <button
                onClick={onConfirm}
                disabled={loading}
                className="flex-1 px-6 py-3 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? '处理中...' : '确认支付'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 
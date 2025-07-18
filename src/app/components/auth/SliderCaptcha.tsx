'use client';
import React, { useState } from 'react';
import SliderCaptcha from 'rc-slider-captcha';
import type { SliderCaptchaProps } from 'rc-slider-captcha';
import { request } from '@/utils/request';

interface CaptchaResponse {
  bgUrl: string;
  puzzleUrl: string;
  x: number;
  y: number;
}

interface CustomSliderCaptchaProps {
  onSuccess: () => void;
  onFail?: () => void;
  visible: boolean;
  onClose: () => void;
}

export const CustomSliderCaptcha: React.FC<CustomSliderCaptchaProps> = ({
  onSuccess,
  onFail,
  visible,
  onClose,
}) => {
  const [targetX, setTargetX] = useState<number>(0);

  // 请求背景图和拼图
  const fetchCaptcha = async () => {
    try {
      const response = await request<CaptchaResponse>('/auth/captcha');
      if (response.data) {
        setTargetX(response.data.x); // 保存正确的x坐标
        return {
          bgUrl: response.data.bgUrl,
          puzzleUrl: response.data.puzzleUrl,
        };
      }
      throw new Error('获取验证码失败');
    } catch (error) {
      console.error('获取验证码失败:', error);
      throw error;
    }
  };

  // 验证滑动结果
  const verify = async (data: Parameters<Required<SliderCaptchaProps>['onVerify']>[0]) => {
    try {
      // 验证滑动距离是否在可接受范围内（允许5像素的误差）
      const isValid = Math.abs(data.x - targetX) <= 5 && data.duration > 100;
      
      if (isValid) {
        onSuccess();
        onClose(); // 验证成功后关闭验证码
        return Promise.resolve();
      } else {
        onFail?.();
        return Promise.reject();
      }
    } catch (error) {
      onFail?.();
      return Promise.reject();
    }
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white p-6 rounded-lg shadow-xl">
        <SliderCaptcha
          showRefreshIcon
          request={fetchCaptcha}
          onVerify={verify}
          bgSize={{ width: 320, height: 160 }}
          puzzleSize={{ width: 60, height: 160 }}
          tipText={{
            default: '向右滑动完成拼图',
            loading: '加载中...',
            moving: '拖动滑块完成拼图',
            success: '验证成功',
            error: '验证失败',
            loadFailed: '加载失败',
          }}
          style={{ margin: '10px 0' }}
        />
        <button
          onClick={onClose}
          className="mt-4 w-full px-4 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
        >
          关闭
        </button>
      </div>
    </div>
  );
};

export default CustomSliderCaptcha; 
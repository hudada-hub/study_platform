'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/providers/theme-provider';

interface LoginButtonProps {
  isMobile?: boolean;
  onAfterClick?: () => void;
}

const LoginButton: React.FC<LoginButtonProps> = ({ 
  isMobile = false,
  onAfterClick
}) => {
  const router = useRouter();
  const { theme } = useTheme();

  const handleClick = (type: 'login' | 'register') => {
    if (onAfterClick) {
      onAfterClick();
    }
    if (type === 'login') {
      router.push('/login');
    } else {
      router.push('/register');
    }
  };

  if (isMobile) {
    return (
      <button
        onClick={() => handleClick('login')}
        style={{ backgroundColor: theme.textColor.primary }}
        className="w-full px-4 py-2 text-white rounded-lg text-center"
      >
        登录/注册
      </button>
    );
  }

  return (
    <>
    <button
      onClick={() => handleClick('login')}
      style={{ backgroundColor: theme.textColor.primary }}
      className="px-4 py-1.5 text-white rounded-full text-sm font-medium hover:opacity-90 transition-opacity"
    >
      登录
    </button>
    <button
      onClick={() => handleClick('register')}
      style={{ backgroundColor: theme.textColor.primary }}
      className="px-4 py-1.5 text-white rounded-full text-sm font-medium hover:opacity-90 transition-opacity"
    >
      注册
    </button>
    </>
  );
};

export default LoginButton; 
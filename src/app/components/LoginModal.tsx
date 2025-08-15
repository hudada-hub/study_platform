// src/app/components/LoginModal.tsx
'use client';
import React from 'react';
import { useRouter } from 'next/navigation';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const router = useRouter();

  if (!isOpen) return null;

  // 重定向到登录页面
  router.push('/login');
  onClose();
  
  return null;
};

export default LoginModal;
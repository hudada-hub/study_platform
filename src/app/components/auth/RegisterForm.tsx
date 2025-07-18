'use client';
import React, { useState, useEffect } from 'react';
import { request } from '@/utils/request';
import { ResponseCode } from '@/utils/response';
import { useTheme } from '@/providers/theme-provider';
import { showSuccess, showError } from '@/utils/toast';
import SliderCaptcha from './SliderCaptcha';
import Link from 'next/link';
import PaymentConfirmModal from './PaymentConfirmModal';
import { AlipayRegisterResponse } from '@/types/payment';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

interface RegisterFormProps {
  onSuccess: (token: string, user: any) => void;
  onSwitchMode: () => void;
}

function getRandomPhone() {
  // 中国大陆手机号: 1[3-9]开头，后面9位随机
  const prefix = '1' + Math.floor(Math.random() * 7 + 3); // 1[3-9]
  const suffix = Math.floor(Math.random() * 1e9).toString().padStart(9, '0');
  return prefix + suffix;
}

export default function RegisterForm({ onSuccess, onSwitchMode }: RegisterFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    phone: getRandomPhone(),
    code: '123456',
    password: 'test1234',
    confirmPassword: 'test1234',
    nickname: '测试用户',
  });

  const [countdown, setCountdown] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [showCaptcha, setShowCaptcha] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [countdown]);

  // 点击获取验证码按钮
  const handleGetCodeClick = () => {
    if (!formData.phone) {
      showError('请输入手机号');
      return;
    }

    if (!/^1[3-9]\d{9}$/.test(formData.phone)) {
      showError('请输入正确的手机号');
      return;
    }

    setShowCaptcha(true);
  };

  // 获取验证码
  const handleGetCode = async () => {
    try {
      const response = await request('/auth/send-code', {
        method: 'POST',
        body: JSON.stringify({
          phone: formData.phone,
        }),
      });

      if (response.code === ResponseCode.SUCCESS) {
        showSuccess('验证码已发送');
        setCountdown(60); // 开始60秒倒计时
        setIsVerified(false); // 重置验证状态
      } else {
        showError(response.message || '发送失败');
      }
    } catch (error) {
      showError('发送验证码失败');
    }
  };

  // 处理注册表单提交
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!agreedToTerms) {
      showError('请阅读并同意相关协议');
      return;
    }

    if (!formData.phone || !formData.code || !formData.password || !formData.confirmPassword || !formData.nickname) {
      showError('请填写完整信息');
      return;
    }

    if (!/^1[3-9]\d{9}$/.test(formData.phone)) {
      showError('请输入正确的手机号');
      return;
    }

    if (formData.nickname.length < 2 || formData.nickname.length > 20) {
      showError('昵称长度需在2-20个字符之间');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      showError('两次输入的密码不一致');
      return;
    }

    if (formData.password.length < 6) {
      showError('密码长度不能小于6位');
      return;
    }

    // 显示支付确认弹窗
    setShowPaymentModal(true);
  };

  // 处理支付确认
  const handlePaymentConfirm = async () => {
    setLoading(true);
    try {
      // 1. 创建订单
      const createOrderRes = await request<AlipayRegisterResponse>('/payment/alipay/register', {
        method: 'POST',
        body: JSON.stringify({
          amount: 299,
          type: 'REGISTER',
          title: '注册会员',
          phone: formData.phone,
          code: formData.code,
          password: formData.password,
          nickname: formData.nickname,
        }),
      });

      if (createOrderRes.code === ResponseCode.SUCCESS && createOrderRes.data) {
        console.log(createOrderRes.data);
        // 2. 将支付表单存储到cookie
        Cookies.set('payment_form', createOrderRes.data.paymentForm);
        // 3. 跳转到支付页面
       window.open('/payment', '_blank');
      } else {
        showError(createOrderRes.message || '创建订单失败');
      }
    } catch (error: any) {
      showError(error.message || '支付失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          昵称
        </label>
        <input
          type="text"
          value={formData.nickname}
          onChange={(e) => setFormData({ ...formData, nickname: e.target.value })}
          className="mt-1 w-full px-3 py-2 border rounded-md bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all dark:bg-gray-800 dark:border-gray-600 dark:text-white"
          placeholder="请输入昵称（2-20个字符）"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          手机号
        </label>
        <div className="mt-1 flex gap-2">
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="flex-1 px-3 py-2 border rounded-md bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            placeholder="请输入手机号"
            required
          />
          <button
            type="button"
            onClick={handleGetCodeClick}
            disabled={countdown > 0 || loading}
            style={{ backgroundColor: theme.textColor.primary }}
            className={`px-4 py-2 text-white rounded-md text-sm font-medium transition-opacity ${
              (countdown > 0 || loading) ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'
            }`}
          >
            {countdown > 0 ? `${countdown}秒后重试` : '获取验证码'}
          </button>
        </div>
      </div>

      {/* 滑块验证码 */}
      <SliderCaptcha 
        visible={showCaptcha}
        onSuccess={() => {
          setIsVerified(true);
          handleGetCode();
        }}
        onFail={() => {
          showError('验证失败，请重试');
        }}
        onClose={() => setShowCaptcha(false)}
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          验证码
        </label>
        <input
          type="text"
          value={formData.code}
          onChange={(e) => setFormData({ ...formData, code: e.target.value })}
          className="mt-1 w-full px-3 py-2 border rounded-md bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all dark:bg-gray-800 dark:border-gray-600 dark:text-white"
          placeholder="请输入验证码"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          密码
        </label>
        <input
          type="password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          className="mt-1 w-full px-3 py-2 border rounded-md bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all dark:bg-gray-800 dark:border-gray-600 dark:text-white"
          placeholder="请设置密码"
          required
          autoComplete="new-password"
          data-lpignore="true"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          确认密码
        </label>
        <input
          type="password"
          value={formData.confirmPassword}
          onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
          className="mt-1 w-full px-3 py-2 border rounded-md bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all dark:bg-gray-800 dark:border-gray-600 dark:text-white"
          placeholder="请再次输入密码"
          required
          autoComplete="new-password"
          data-lpignore="true"
        />
      </div>

      <div className="flex items-start">
        <div className="flex items-center h-5">
          <input
            id="terms"
            name="terms"
            type="checkbox"
            checked={agreedToTerms}
            onChange={(e) => setAgreedToTerms(e.target.checked)}
            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
        </div>
        <div className="ml-3 text-sm">
          <label htmlFor="terms" className="text-gray-700 dark:text-gray-300">
            我已查阅并同意
            <Link href="/agreements?type=user" target="_blank" className="text-blue-600 hover:text-blue-500 mx-1">《用户协议》</Link>
            <Link href="/agreements?type=copyright" target="_blank" className="text-blue-600 hover:text-blue-500 mx-1">《版权与免责声明》</Link>
            <Link href="/agreements?type=privacy" target="_blank" className="text-blue-600 hover:text-blue-500 mx-1">《用户隐私协议》</Link>
            <Link href="/agreements?type=payment" target="_blank" className="text-blue-600 hover:text-blue-500 mx-1">《用户付费协议》</Link>
          </label>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        style={{ backgroundColor: theme.textColor.primary }}
        className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 ${
          loading ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'
        }`}
      >
          {loading ? '处理中...' : '立即注册'}
      </button>

      <div className="text-center">
        <button
          type="button"
          onClick={onSwitchMode}
          style={{ color: theme.textColor.primary }}
          className="text-sm font-medium hover:opacity-80 transition-opacity"
        >
          已有账号？立即登录
        </button>
      </div>
    </form>

      {/* 支付确认弹窗 */}
      <PaymentConfirmModal
        visible={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        onConfirm={handlePaymentConfirm}
        loading={loading}
      />
    </>
  );
} 
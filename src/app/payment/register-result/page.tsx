'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { request } from '@/utils/request';
import { FiCheckCircle, FiXCircle } from 'react-icons/fi';

export default function PaymentResult() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<'success' | 'failed' | 'loading'>('loading');
  const [message, setMessage] = useState('正在查询支付结果...');

  useEffect(() => {
    const orderNo = searchParams.get('out_trade_no');
    if (!orderNo) {
      setStatus('failed');
      setMessage('订单号不存在');
      return;
    }

    const checkPaymentStatus = async () => {
      try {
        const response = await request(`/payment/alipay/register-query?orderNo=${orderNo}`);
        // 明确类型
        const data = response.data as {
          status?: string;
          type?: string;
          phone?: string;
          password?: string;
        };
        if (response.code === 0 && data?.status === 'SUCCESS') {
          setStatus('success');
          setMessage('支付成功');
          // 如果是注册订单，自动登录
          if (data.type === 'REGISTER' && data.phone && data.password) {
            const loginResponse = await request('/auth/login', {
              method: 'POST',
              body: JSON.stringify({
                account: data.phone,
                password: data.password,
              }),
            });
            if (loginResponse.code === 0) {
              setTimeout(() => {
                router.push('/');
              }, 2000);
            }
          }
        } else {
          setStatus('failed');
          setMessage(response.message || '支付失败');
        }
      } catch (error) {
        setStatus('failed');
        setMessage('查询支付结果失败');
      }
    };
    checkPaymentStatus();
  }, [searchParams, router]);

  return (
    <div className="min-h-screen bg-[#1a1b1c] flex items-center justify-center">
      <div className="bg-[#2a2b2c] p-8 rounded-lg w-[400px] text-center">
        {status === 'loading' && (
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-cyan-500 border-t-transparent mx-auto mb-4"></div>
        )}
        {status === 'success' && (
          <FiCheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
        )}
        {status === 'failed' && (
          <FiXCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        )}
        
        <h2 className="text-xl text-white mb-4">{message}</h2>
        
        <div className="space-x-4">
          <button
            onClick={() => router.push('/')}
            className="px-6 py-2 bg-cyan-500 text-white rounded hover:bg-cyan-600 transition-colors"
          >
            返回首页
          </button>
        </div>
      </div>
    </div>
  );
} 
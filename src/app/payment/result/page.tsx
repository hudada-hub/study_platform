'use client';
import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { request } from '@/utils/request';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';
import { showError, showSuccess } from '@/utils/toast';

export default function PaymentResultPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<'success' | 'error' | 'loading'>('loading');
  const [orderInfo, setOrderInfo] = useState<{
    orderNo?: string;
    amount?: string;
    title?: string;
  }>({});

  useEffect(() => {
    const outTradeNo = searchParams.get('out_trade_no');
    const tradeNo = searchParams.get('trade_no');

    if (!outTradeNo) {
      setStatus('error');
      return;
    }

    // 查询订单状态
    const checkOrderStatus = async () => {
      try {
        const response = await request(
          `/payment/alipay/query?outTradeNo=${outTradeNo}`,
          { method: 'GET' }
        );

        if (response.code === 0 && response.data) {
          const { status: tradeStatus, amount, title, orderNo } = response.data as { status: string, amount: number, title: string, orderNo: string };
          setOrderInfo({
            orderNo,
            amount: amount?.toString(),
            title,
          });



          if (tradeStatus === 'TRADE_SUCCESS') {
            setStatus('success');
            showSuccess('支付成功！');
          } else {
            setStatus('error');
            showError('支付失败或未完成');
          }
        } else {
          setStatus('error');
          showError(response.message || '查询订单状态失败');
        }
      } catch (error) {
        setStatus('error');
        showError('查询订单状态失败');
      }
    };

    checkOrderStatus();
  }, [searchParams]);

  const handleBackToHome = () => {
    router.push('/');
  };

  const handleRetry = () => {
    router.push('/payment/test');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {status === 'loading' ? (
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
              <h2 className="mt-4 text-xl font-medium text-gray-900">正在查询支付结果...</h2>
            </div>
          ) : status === 'success' ? (
            <div className="text-center">
              <CheckCircleIcon className="mx-auto h-12 w-12 text-green-500" />
              <h2 className="mt-4 text-xl font-medium text-gray-900">支付成功</h2>
              <div className="mt-4 space-y-2 text-sm text-gray-600">
                {orderInfo.orderNo && <p>订单号：{orderInfo.orderNo}</p>}
                {orderInfo.amount && <p>支付金额：¥{orderInfo.amount}</p>}
                {orderInfo.title && <p>商品名称：{orderInfo.title}</p>}
              </div>
              <button
                onClick={handleBackToHome}
                className="mt-6 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                返回首页
              </button>
            </div>
          ) : (
            <div className="text-center">
              <XCircleIcon className="mx-auto h-12 w-12 text-red-500" />
              <h2 className="mt-4 text-xl font-medium text-gray-900">支付失败</h2>
              <p className="mt-2 text-sm text-gray-600">
                抱歉，您的支付未能完成，请重试
              </p>
              <div className="mt-6 space-y-3">
                <button
                  onClick={handleRetry}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  重新支付
                </button>
                <button
                  onClick={handleBackToHome}
                  className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  返回首页
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 
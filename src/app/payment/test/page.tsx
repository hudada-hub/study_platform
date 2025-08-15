'use client';
import { useState } from 'react';
import { request } from '@/utils/request';
import { showError } from '@/utils/toast';

export default function AlipayTestPage() {
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState('0.01');

  const handlePayment = async () => {
    setLoading(true);
    try {
      const response = await request<{ formHtml: string }>(
        '/payment/alipay/create',
        {
          method: 'POST',
          body: JSON.stringify({
            productId: '1',
            totalAmount: parseFloat(amount),
            subject: '测试商品',
            body: '这是一个测试商品的详细描述',
          }),
        }
      );

      if (response.code === 0 && response.data) {
        // 创建一个临时的 div 元素来放置支付表单
        const div = document.createElement('div');
        div.innerHTML = response.data.formHtml;
        document.body.appendChild(div);
        
        // 提交表单
        const form = div.querySelector('form');
        if (form) {
          form.submit();
        }
        
        // 清理临时元素
        setTimeout(() => {
          document.body.removeChild(div);
        }, 100);
      } else {
        showError(response.message || '创建支付失败');
      }
    } catch (error) {
      showError('支付请求失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900">支付宝沙盒测试</h2>
          <p className="mt-2 text-sm text-gray-600">
            这是一个测试环境，不会产生真实交易
          </p>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              支付金额 (元)
            </label>
            <div className="mt-1">
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min="0.01"
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <p className="mt-1 text-sm text-gray-500">
              建议测试时使用小额支付，如 0.01 元
            </p>
          </div>

          <button
            onClick={handlePayment}
            disabled={loading}
            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {loading ? '正在创建支付...' : '立即支付'}
          </button>

          <div className="mt-4 text-sm text-gray-500">
            <h3 className="font-medium text-gray-900">测试说明：</h3>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>这是支付宝沙盒环境的测试页面</li>
              <li>需要使用沙盒账号进行测试</li>
              <li>交易金额不会产生真实扣款</li>
              <li>建议使用支付宝沙盒 App 扫码测试</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
} 
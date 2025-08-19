'use client';
import React, { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import RechargeTab from './components/RechargeTab';
import OrderListTab from './components/OrderListTab';
import WithdrawPage from './components/WithdrawTab';

const OrdersPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeTab = searchParams.get('tab') || 'recharge';

  // 切换tab
  const handleTabChange = (tab: string) => {
    router.push(`/user/orders?tab=${tab}`);
  };

  // 根据URL参数设置默认tab
  useEffect(() => {
    const tabFromUrl = searchParams.get('tab');
    if (tabFromUrl && ['recharge', 'withdraw', 'records'].includes(tabFromUrl)) {
      // URL参数有效，不需要额外处理
    } else {
      // 如果没有有效的tab参数，默认跳转到充值积分
      router.replace('/user/orders?tab=recharge');
    }
  }, [searchParams, router]);

  return (
    <div className="p-4 sm:p-6">
      {/* 自定义tab导航 */}
      <div className="flex border-b border-gray-200 mb-6 overflow-x-auto">
        <button
          onClick={() => handleTabChange('recharge')}
          className={`px-6 py-3 text-sm transition-colors relative whitespace-nowrap ${
            activeTab === 'recharge'
              ? 'text-cyan-500'
              : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          充值积分
          {activeTab === 'recharge' && (
            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-cyan-500"></div>
          )}
        </button>
        <button
          onClick={() => handleTabChange('withdraw')}
          className={`px-6 py-3 text-sm transition-colors relative whitespace-nowrap ${
            activeTab === 'withdraw'
              ? 'text-cyan-500'
              : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          提现积分
          {activeTab === 'withdraw' && (
            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-cyan-500"></div>
          )}
        </button>
        <button
          onClick={() => handleTabChange('records')}
          className={`px-6 py-3 text-sm transition-colors relative whitespace-nowrap ${
            activeTab === 'records'
              ? 'text-cyan-500'
              : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          充值记录
          {activeTab === 'records' && (
            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-cyan-500"></div>
          )}
        </button>
      </div>

      {/* Tab内容区域 */}
      <div className="mb-4 sm:mb-6">
        {activeTab === 'recharge' && (
          <div className="bg-white rounded p-4 sm:p-6 shadow-sm">
            <RechargeTab />
          </div>
        )}
        {activeTab === 'withdraw' && (
          <div className="bg-white rounded p-4 sm:p-6 shadow-sm">
            <WithdrawPage />
          </div>
        )}
        {activeTab === 'records' && (
          <div className="bg-white rounded p-4 sm:p-6 shadow-sm">
            <OrderListTab />
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage; 
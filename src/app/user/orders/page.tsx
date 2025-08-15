import React from 'react';
import { Tabs } from 'antd';
import RechargeTab from './components/RechargeTab';
import OrderListTab from './components/OrderListTab';

const OrdersPage = () => {
  const items = [
    {
      key: '1',
      label: '充值积分',
      children: <RechargeTab />,
    },
    {
      key: '2',
      label: '充值记录',
      children: <OrderListTab />,
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl mb-6">我的订单</h1>
      <Tabs defaultActiveKey="1" items={items} />
    </div>
  );
};

export default OrdersPage; 
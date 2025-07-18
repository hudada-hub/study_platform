'use client'
import React, { useEffect, useState } from 'react';
import { Table, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { request } from '@/utils/request';

interface OrderRecord {
  id: string;
  orderNo: string;
  type: string;
  title: string;
  amount: number;
  status: string;
  paymentMethod: string;
  createdAt: string;
  paymentTime: string | null;
}

interface OrderResponse {
  success: boolean;
  data: OrderRecord[];
  message?: string;
}

const OrderListTab = () => {
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState<OrderRecord[]>([]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await request<OrderResponse>('/payment/orders');
      if (res.code === 0) {
        setOrders(res.data.data);
      }
    } catch (error) {
      console.error('获取订单列表失败:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const getStatusTag = (status: string) => {
    const statusMap: Record<string, { color: string; text: string }> = {
      PENDING: { color: 'orange', text: '待支付' },
      PAID: { color: 'green', text: '已支付' },
      CANCELLED: { color: 'red', text: '已取消' },
      REFUNDED: { color: 'gray', text: '已退款' },
    };

    const statusInfo = statusMap[status] || { color: 'default', text: status };
    return <Tag color={statusInfo.color}>{statusInfo.text}</Tag>;
  };

  const columns: ColumnsType<OrderRecord> = [
    {
      title: '订单号',
      dataIndex: 'orderNo',
      key: 'orderNo',
      width: 200,
    },
    {
      title: '订单类型',
      dataIndex: 'type',
      key: 'type',
      width: 100,
      render: (type: string) => {
        const typeMap: Record<string, string> = {
          RECHARGE: '充值',
          COURSE: '课程',
          TASK: '任务',
        };
        return typeMap[type] || type;
      },
    },
    {
      title: '订单标题',
      dataIndex: 'title',
      key: 'title',
      ellipsis: true,
    },
    {
      title: '金额',
      dataIndex: 'amount',
      key: 'amount',
      width: 100,
      render: (amount: number) => `¥${(amount/100).toFixed(2)}`,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: getStatusTag,
    },
    {
      title: '支付方式',
      dataIndex: 'paymentMethod',
      key: 'paymentMethod',
      width: 100,
      render: (method: string) => method === 'ALIPAY' ? '支付宝' : method,
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 180,
      render: (date: string) => new Date(date).toLocaleString(),
    },
    {
      title: '支付时间',
      dataIndex: 'paymentTime',
      key: 'paymentTime',
      width: 180,
      render: (date: string | null) => date ? new Date(date).toLocaleString() : '-',
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={orders}
      rowKey="id"
      loading={loading}
      pagination={{
        pageSize: 10,
        showSizeChanger: false,
      }}
    />
  );
};

export default OrderListTab; 
'use client';

import React, { useState, useEffect } from 'react';
import { Table, Tag, Card, message } from 'antd';
import { request } from '@/utils/request';

// 格式化日期函数
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
};

interface Order {
  id: string;
  orderNo: string;
  type: string;
  amount: string;
  status: string;
  createdAt: string;
  paymentTime?: string;
}

const OrderListPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });

  // 获取订单列表
  const fetchOrders = async (page = 1, pageSize = 10) => {
    try {
      setLoading(true);
      const response = await request(`/payment/orders?page=${page}&pageSize=${pageSize}`, {
        method: 'GET'
      });

      if (response.code === 0 && response.data) {
        const data = response.data as any;
        setOrders(data.data || []);
        setPagination({
          current: page,
          pageSize,
          total: data.total || 0
        });
      }
    } catch (error) {
      console.error('获取订单列表失败:', error);
      message.error('获取订单列表失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // 处理分页变化
  const handleTableChange = (pagination: any) => {
    fetchOrders(pagination.current, pagination.pageSize);
  };

  // 订单状态配置
  const statusConfig = {
    PENDING: { text: '待支付', color: 'orange' },
    PAID: { text: '已支付', color: 'green' },
    CANCELLED: { text: '已取消', color: 'red' },
    REFUNDED: { text: '已退款', color: 'blue' }
  };

  // 订单类型配置
  const typeConfig = {
    RECHARGE: { text: '充值积分', color: 'cyan' },
    COURSE: { text: '购买课程', color: 'blue' },
    TASK: { text: '发布任务', color: 'purple' }
  };

  const columns = [
    {
      title: '订单号',
      dataIndex: 'orderNo',
      key: 'orderNo',
      width: 200,
      render: (text: string) => (
        <span className="font-mono text-sm">{text}</span>
      )
    },
    {
      title: '订单类型',
      dataIndex: 'type',
      key: 'type',
      width: 120,
      render: (type: string) => {
        const config = typeConfig[type as keyof typeof typeConfig];
        return config ? (
          <Tag color={config.color}>{config.text}</Tag>
        ) : (
          <Tag>{type}</Tag>
        );
      }
    },
    {
      title: '金额',
      dataIndex: 'amount',
      key: 'amount',
      width: 100,
      render: (amount: string) => {
        // 将积分转换为元数显示（1元 = 100积分）
        const yuan = Number(amount) / 100;
        return (
          <span className="text-red-500 font-medium">¥{yuan.toFixed(2)}</span>
        );
      }
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => {
        const config = statusConfig[status as keyof typeof statusConfig];
        return config ? (
          <Tag color={config.color}>{config.text}</Tag>
        ) : (
          <Tag>{status}</Tag>
        );
      }
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 180,
      render: (date: string) => formatDate(date)
    },
    {
      title: '支付时间',
      dataIndex: 'paymentTime',
      key: 'paymentTime',
      width: 180,
      render: (date: string) => date ? formatDate(date) : '-'
    }
  ];

  return (
    <div>
      <Card title="充值记录" className="shadow-sm">
        <Table
          columns={columns}
          dataSource={orders}
          rowKey="id"
          loading={loading}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => 
              `第 ${range[0]}-${range[1]} 条，共 ${total} 条`
          }}
          onChange={handleTableChange}
          scroll={{ x: 800 }}
        />
      </Card>
    </div>
  );
};

export default OrderListPage; 
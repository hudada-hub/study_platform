'use client';

import React, { useState, useEffect } from 'react';
import { Table, Tag, Card, Button, Modal, Form, Input, InputNumber, message, Alert } from 'antd';
import { request } from '@/utils/request';
import Swal from 'sweetalert2';
import { PlusOutlined } from '@ant-design/icons';

interface UserInfo {
  id: number;
  nickname: string;
  phone: string;
  email?: string;
  avatar?: string;
  points: number;
  withDrawPoints: number; // 可提现积分
}

interface WithdrawRecord {
  id: number;
  withdrawNo: string;
  amount: number;
  accountInfo: any;
  status: string;
  createdAt: string;
  processedAt?: string;
  completedAt?: string;
}

interface WithdrawForm {
  amount: number;
  alipayAccount: string;
  realName: string;
}

const WithdrawPage = () => {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [records, setRecords] = useState<WithdrawRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [withdrawModalVisible, setWithdrawModalVisible] = useState(false);
  const [withdrawLoading, setWithdrawLoading] = useState(false);
  const [form] = Form.useForm();
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });

  // 获取用户信息
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await request('/user/current', {
          method: 'GET'
        });

        if (response.code === 0 && response.data) {
          setUserInfo(response.data as UserInfo);
        }
      } catch (error) {
        console.error('获取用户信息失败:', error);
      }
    };

    fetchUserInfo();
  }, []);

  // 获取提现记录
  const fetchRecords = async (page = 1, pageSize = 10) => {
    try {
      setLoading(true);
      const response = await request(`/user/withdraw-records?page=${page}&pageSize=${pageSize}`, {
        method: 'GET'
      });

      if (response.code === 0 && response.data) {
        const data = response.data as any;
        setRecords(data.data || []);
        setPagination({
          current: page,
          pageSize,
          total: data.total || 0
        });
      }
    } catch (error) {
      console.error('获取提现记录失败:', error);
      message.error('获取提现记录失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  // 处理分页变化
  const handleTableChange = (pagination: any) => {
    fetchRecords(pagination.current, pagination.pageSize);
  };

  // 处理提现提交
  const handleWithdraw = async (values: WithdrawForm) => {
    if (!userInfo) {
      message.error('用户信息获取失败');
      return;
    }

    if (values.amount > userInfo.withDrawPoints) {
      message.error('提现金额不能超过可提现积分');
      return;
    }

    try {
      setWithdrawLoading(true);

      // 调用提现API
      const response = await request('/payment/alipay/withdraw', {
        method: 'POST',
        body: JSON.stringify({
          taskId: 0, // 这里需要根据实际情况传入任务ID
          amount: values.amount,
          accountType: 'alipay',
          accountInfo: {
            account: values.alipayAccount,
            realName: values.realName
          }
        })
      });

      if (response.code === 0) {
        Swal.fire({
          title: '提现申请提交成功！',
          text: '您的提现申请已提交，我们将在1-3个工作日内处理完成。',
          icon: 'success',
          confirmButtonText: '确定'
        });
        
        // 刷新用户信息和提现记录
        const userResponse = await request('/user/current', {
          method: 'GET'
        });
        if (userResponse.code === 0 && userResponse.data) {
          setUserInfo(userResponse.data as UserInfo);
        }
        
        fetchRecords(); // 刷新提现记录
        form.resetFields();
        setWithdrawModalVisible(false);
      } else {
        message.error(response.message || '提现申请提交失败');
      }
    } catch (error) {
      console.error('提现失败:', error);
      message.error('提现申请提交失败，请稍后重试');
    } finally {
      setWithdrawLoading(false);
    }
  };

  // 状态配置
  const statusConfig = {
    PENDING: { text: '待处理', color: 'processing' },
    PROCESSING: { text: '处理中', color: 'processing' },
    SUCCESS: { text: '成功', color: 'success' },
    FAILED: { text: '失败', color: 'error' },
    CANCELLED: { text: '已取消', color: 'default' }
  };

  // 表格列定义
  const columns = [
    {
      title: '提现单号',
      dataIndex: 'withdrawNo',
      key: 'withdrawNo',
      width: 200,
      render: (withdrawNo: string) => (
        <span className="font-mono text-sm">{withdrawNo}</span>
      )
    },
    {
      title: '提现金额',
      dataIndex: 'amount',
      key: 'amount',
      width: 120,
      render: (amount: number) => (
        <span className="font-medium text-cyan-600">{amount} 积分</span>
      )
    },
    {
      title: '支付宝账号',
      dataIndex: 'accountInfo',
      key: 'accountInfo',
      width: 150,
      render: (accountInfo: any) => {
        try {
          const info = typeof accountInfo === 'string' ? JSON.parse(accountInfo) : accountInfo;
          return info?.account || '-';
        } catch {
          return '-';
        }
      }
    },
    {
      title: '真实姓名',
      dataIndex: 'accountInfo',
      key: 'realName',
      width: 120,
      render: (accountInfo: any) => {
        try {
          const info = typeof accountInfo === 'string' ? JSON.parse(accountInfo) : accountInfo;
          return info?.realName || '-';
        } catch {
          return '-';
        }
      }
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => {
        const config = statusConfig[status as keyof typeof statusConfig] || { text: status, color: 'default' };
        return <Tag color={config.color}>{config.text}</Tag>;
      }
    },
    {
      title: '申请时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 180,
      render: (createdAt: string) => {
        const date = new Date(createdAt);
        return date.toLocaleString('zh-CN', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit'
        });
      }
    }
  ];

  return (
    <div>
      {/* 页面标题和提现按钮 */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">提现积分</h2>
          <p className="text-gray-600">管理您的积分提现申请</p>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setWithdrawModalVisible(true)}
          disabled={!userInfo?.withDrawPoints || userInfo.withDrawPoints < 100}
          className="h-10 px-6"
        >
          申请提现
        </Button>
      </div>

      {/* 用户积分信息 */}
      <Card className="mb-6">
        <div className="text-center">
          <div className="text-3xl font-bold text-cyan-600 mb-2">
            {userInfo?.withDrawPoints || 0}
          </div>
          <div className="text-gray-600">可提现积分</div>
        </div>
      </Card>

      {/* 提现记录表格 */}
      <Card>
        <Table
          columns={columns}
          dataSource={records}
          rowKey="id"
          loading={loading}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条，共 ${total} 条记录`
          }}
          onChange={handleTableChange}
          scroll={{ x: 1000 }}
        />
      </Card>

      {/* 提现申请弹窗 */}
      <Modal
        title="申请提现"
        open={withdrawModalVisible}
        onCancel={() => {
          setWithdrawModalVisible(false);
          form.resetFields();
        }}
        footer={null}
        width={500}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleWithdraw}
          initialValues={{
            amount: 100
          }}
        >
          <Form.Item
            label="提现金额（积分）"
            name="amount"
            rules={[
              { required: true, message: '请输入提现金额' },
              { type: 'number', min: 100, message: '最低提现100积分' },
              {
                validator: (_, value) => {
                  if (userInfo && value > userInfo.withDrawPoints) {
                    return Promise.reject('提现金额不能超过可提现积分');
                  }
                  return Promise.resolve();
                }
              }
            ]}
          >
            <InputNumber
              className="w-full"
              min={100}
              max={userInfo?.withDrawPoints || 100}
              precision={0}
              placeholder="请输入提现金额"
            />
          </Form.Item>

          <Form.Item
            label="支付宝账号"
            name="alipayAccount"
            rules={[
              { required: true, message: '请输入支付宝账号' },
              { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号格式' }
            ]}
          >
            <Input placeholder="请输入支付宝绑定的手机号" />
          </Form.Item>

          <Form.Item
            label="真实姓名"
            name="realName"
            rules={[
              { required: true, message: '请输入真实姓名' },
              { min: 2, max: 20, message: '姓名长度在2-20个字符之间' }
            ]}
          >
            <Input placeholder="请输入您的真实姓名" />
          </Form.Item>

          {/* 费用计算显示 */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600">提现金额：</span>
              <span className="font-medium">{form.getFieldValue('amount') || 0} 积分</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600">手续费（10%）：</span>
              <span className="text-red-500">-{Math.floor((form.getFieldValue('amount') || 0) * 0.1)} 积分</span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-gray-200">
              <span className="text-gray-800 font-medium">实际到账：</span>
              <span className="text-cyan-600 font-bold text-lg">
                {Math.floor((form.getFieldValue('amount') || 0) * 0.9)} 积分
              </span>
            </div>
          </div>

          <Form.Item>
            <div className="flex justify-end space-x-3">
              <Button onClick={() => {
                setWithdrawModalVisible(false);
                form.resetFields();
              }}>
                取消
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={withdrawLoading}
                disabled={!userInfo?.withDrawPoints || userInfo.withDrawPoints < 100}
              >
                {withdrawLoading ? '提交中...' : '确认提现'}
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default WithdrawPage; 
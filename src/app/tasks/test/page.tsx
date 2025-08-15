'use client';

import React, { useState } from 'react';
import { Button, Card, Input, Form } from 'antd';
import Swal from 'sweetalert2';
import { request } from '@/utils/request';
import { ResponseUtil } from '@/utils/response';
import qs from 'qs';

const { TextArea } = Input;

const TestPage: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleTestQs = async (values: any) => {
    setLoading(true);
    try {
      // 测试qs.stringify
      const queryString = qs.stringify(values, { skipNulls: true });
      console.log('Query string:', queryString);

      // 测试POST请求
      const response = await request('/tasks', {
        method: 'POST',
        body: qs.stringify(values),
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      if (ResponseUtil.success(response)) {
        Swal.fire({
          icon: 'success',
          title: '测试成功！',
          text: 'QS功能测试通过',
        });
        console.log('Response:', response);
      }
    } catch (error) {
      console.error('测试失败:', error);
      Swal.fire({
        icon: 'error',
        title: '测试失败',
        text: '请检查网络连接',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <Card title="QS插件测试">
          <Form form={form} onFinish={handleTestQs} layout="vertical">
            <Form.Item
              label="任务标题"
              name="title"
              rules={[{ required: true, message: '请输入标题' }]}
            >
              <Input placeholder="测试标题" />
            </Form.Item>

            <Form.Item
              label="任务内容"
              name="content"
              rules={[{ required: true, message: '请输入内容' }]}
            >
              <TextArea rows={4} placeholder="测试内容" />
            </Form.Item>

            <Form.Item
              label="分类ID"
              name="categoryId"
              rules={[{ required: true, message: '请输入分类ID' }]}
            >
              <Input type="number" placeholder="1" />
            </Form.Item>

            <Form.Item
              label="积分"
              name="points"
              rules={[{ required: true, message: '请输入积分' }]}
            >
              <Input type="number" placeholder="100" />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" loading={loading}>
                测试QS功能
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </div>
  );
};

export default TestPage; 
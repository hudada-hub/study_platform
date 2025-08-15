'use client';

import React from 'react';
import { useUser } from '@/providers/user-provider';
import { Button, Card, Space, Divider } from 'antd';
import { ReloadOutlined, UserOutlined } from '@ant-design/icons';

const TestUserInfoPage: React.FC = () => {
  const { userInfo, loading, error, fetchUserInfo, refreshUserInfo, clearUser } = useUser();

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-normal text-gray-900 mb-8">全局用户信息测试页面</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 用户信息显示 */}
          <Card title="当前用户信息" className="h-fit">
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500 mx-auto"></div>
                <p className="mt-2 text-gray-500">加载中...</p>
              </div>
            ) : userInfo ? (
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <UserOutlined className="text-2xl text-blue-500" />
                  <div>
                    <div className="font-medium text-gray-900">{userInfo.nickname}</div>
                    <div className="text-sm text-gray-500">ID: {userInfo.id}</div>
                  </div>
                </div>
                <Divider />
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">邮箱:</span>
                    <div className="font-medium">{userInfo.email || '未设置'}</div>
                  </div>
                  <div>
                    <span className="text-gray-500">手机:</span>
                    <div className="font-medium">{userInfo.phone}</div>
                  </div>
                  <div>
                    <span className="text-gray-500">积分:</span>
                    <div className="font-medium text-orange-500">{userInfo.points}</div>
                  </div>
                  <div>
                    <span className="text-gray-500">学习时长:</span>
                    <div className="font-medium">{userInfo.studyTime} 分钟</div>
                  </div>
                  <div>
                    <span className="text-gray-500">角色:</span>
                    <div className="font-medium">{userInfo.role}</div>
                  </div>
                  <div>
                    <span className="text-gray-500">状态:</span>
                    <div className="font-medium">{userInfo.status}</div>
                  </div>
                </div>
                <Divider />
                <div className="text-xs text-gray-500">
                  <div>创建时间: {new Date(userInfo.createdAt).toLocaleString()}</div>
                  <div>最后登录: {new Date(userInfo.lastLoginAt).toLocaleString()}</div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <UserOutlined className="text-4xl mb-2" />
                <p>未登录</p>
              </div>
            )}
          </Card>

          {/* 操作按钮 */}
          <Card title="操作面板" className="h-fit">
            <Space direction="vertical" className="w-full">
              <Button 
                type="primary" 
                icon={<ReloadOutlined />}
                onClick={fetchUserInfo}
                loading={loading}
                block
              >
                获取用户信息
              </Button>
              
              <Button 
                icon={<ReloadOutlined />}
                onClick={refreshUserInfo}
                loading={loading}
                block
              >
                刷新用户信息
              </Button>
              
              <Button 
                danger
                onClick={clearUser}
                block
              >
                清除用户信息
              </Button>
            </Space>

            {error && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded text-red-600 text-sm">
                错误: {error}
              </div>
            )}

            <Divider />

            <div className="text-sm text-gray-600">
              <h4 className="font-medium mb-2">功能说明:</h4>
              <ul className="space-y-1">
                <li>• 页面加载时自动获取用户信息</li>
                <li>• 支持手动刷新用户信息</li>
                <li>• 用户信息存储在cookie中</li>
                <li>• 页面刷新后自动更新最新信息</li>
              </ul>
            </div>
          </Card>
        </div>

        {/* 调试信息 */}
        <Card title="调试信息" className="mt-6">
          <pre className="bg-gray-100 p-4 rounded text-xs overflow-auto">
            {JSON.stringify({ userInfo, loading, error }, null, 2)}
          </pre>
        </Card>
      </div>
    </div>
  );
};

export default TestUserInfoPage; 
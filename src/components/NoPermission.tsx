import React from 'react';
import { Result, Button } from 'antd';
import { LockOutlined } from '@ant-design/icons';
import Link from 'next/link';

interface NoPermissionProps {
  title?: string;
  subTitle?: string;
  showLoginButton?: boolean;
  showBackButton?: boolean;
  backPath?: string;
  customActions?: React.ReactNode;
}

/**
 * 无权限访问提示组件
 * 
 * @param props 组件属性
 * @returns 组件
 */
const NoPermission: React.FC<NoPermissionProps> = ({
  title = '暂无权限',
  subTitle = '您暂时没有权限执行此操作，请联系管理员或登录后重试',
  showLoginButton = true,
  showBackButton = true,
  backPath = '/',
  customActions,
}) => {
  return (
    <div className="flex justify-center items-center py-10 w-full">
      <Result
        status="403"
        title={title}
        subTitle={subTitle}
        icon={<LockOutlined className="text-yellow-500" />}
        extra
      />
    </div>
  );
};

export default NoPermission; 
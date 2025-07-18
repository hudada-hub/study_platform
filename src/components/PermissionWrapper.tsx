import React, { ReactNode } from 'react';
import NoPermission from './NoPermission';

interface PermissionWrapperProps {
  /**
   * 是否有权限
   */
  hasPermission: boolean;
  /**
   * 子组件
   */
  children: ReactNode;
  /**
   * 无权限时显示的标题
   */
  title?: string;
  /**
   * 无权限时显示的副标题
   */
  subTitle?: string;
  /**
   * 是否显示登录按钮
   */
  showLoginButton?: boolean;
  /**
   * 是否显示返回按钮
   */
  showBackButton?: boolean;
  /**
   * 返回路径
   */
  backPath?: string;
  /**
   * 自定义操作按钮
   */
  customActions?: ReactNode;
}

/**
 * 权限包装组件
 * 根据权限条件渲染子组件或无权限提示
 */
const PermissionWrapper: React.FC<PermissionWrapperProps> = ({
  hasPermission,
  children,
  title,
  subTitle,
  showLoginButton,
  showBackButton,
  backPath, 
}) => {
  if (!hasPermission) {
    return (
      <NoPermission
        title={title}
        subTitle={subTitle}
        showLoginButton={showLoginButton}
        showBackButton={showBackButton}
        backPath={backPath}
      />
    );
  }

  return <>{children}</>;
};

export default PermissionWrapper; 
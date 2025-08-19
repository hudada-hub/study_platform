# 用户订单页面重构说明

## 重构内容

将用户订单页面的tab选项卡改为页面路由的方式，参考课程管理的实现模式。

## 主要修改

### 1. 组件重构
- `RechargeTab.tsx` → `RechargePage` - 充值积分页面
- `OrderListTab.tsx` → `OrderListPage` - 充值记录页面  
- 新增 `WithdrawTab.tsx` - 提现积分页面

### 2. 主页面修改
- 移除 `antd` 的 `Tabs` 组件
- 使用自定义的tab导航按钮
- 通过URL参数控制当前显示的tab内容
- 添加提现功能tab

### 3. 实现方式
- 使用 `useSearchParams` 获取当前tab参数
- 使用 `useRouter` 进行页面导航
- 自定义tab样式，保持与课程管理页面一致
- 每个tab内容独立渲染，提高性能

## 新增功能

### 提现积分功能
- 显示用户总积分和可提现积分
- 支持输入提现金额、支付宝账号、真实姓名
- 提现需收取10%手续费
- 表单验证和错误处理

## 技术特点

- 响应式设计，支持移动端
- 极简风格，无阴影，无粗体
- 使用Tailwind CSS进行样式管理
- 遵循项目代码规范，添加中文注释

## 路由结构

- `/user/orders?tab=recharge` - 充值积分
- `/user/orders?tab=withdraw` - 提现积分  
- `/user/orders?tab=records` - 充值记录

## 兼容性

- 保持原有功能不变
- 向后兼容现有的API接口
- 支持浏览器前进后退操作 
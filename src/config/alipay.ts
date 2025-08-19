import { AlipaySandboxConfig, AlipayProdConfig } from '@/types/payment';

// // 支付宝沙箱环境配置
// export const alipaySandboxConfig = {
//   appId: process.env.NEXT_PUBLIC_ALIPAY_SANDBOX_APP_ID || '',
//   privateKey: process.env.ALIPAY_SANDBOX_PRIVATE_KEY || '',
//   publicKey: process.env.ALIPAY_SANDBOX_PUBLIC_KEY || '',
//   gateway: 'https://openapi-sandbox.dl.alipaydev.com/gateway.do',
//   returnUrl: 'http://localhost:3001/payment/result', // 支付结果页面
//   notifyUrl: 'http://localhost:3001/api/payment/alipay/notify', // 异步通知接口
//   registerNotifyUrl: 'http://localhost:3001/api/payment/register-notify', // 注册订单异步通知接口
//   registerReturnUrl: 'http://localhost:3001/payment/register-result', // 注册订单支付结果页面
// };

// // 支付宝正式环境配置
// export const alipayProdConfig = {
//   appId: process.env.NEXT_PUBLIC_ALIPAY_SANDBOX_APP_ID || '',
//   privateKey: process.env.ALIPAY_SANDBOX_PRIVATE_KEY || '',
//   publicKey: process.env.ALIPAY_SANDBOX_PUBLIC_KEY || '',
//   gateway: 'https://openapi.alipay.com/gateway.do',
//   returnUrl: 'https://你的域名/payment/result', // 支付结果页面
//   notifyUrl: 'https://你的域名/api/payment/alipay/notify', // 异步通知接口
//   registerNotifyUrl: 'https://你的域名/api/payment/alipay/register/notify', // 注册订单异步通知接口
//   registerReturnUrl: 'https://你的域名/payment/result', // 注册订单支付结果页面
// }; 


// 支付宝沙箱环境配置
export const alipaySandboxConfig = {
  appId: process.env.NEXT_PUBLIC_ALIPAY_SANDBOX_APP_ID || '',
  privateKey: process.env.ALIPAY_SANDBOX_PRIVATE_KEY || '',
  publicKey: process.env.ALIPAY_SANDBOX_PUBLIC_KEY || '',
  gateway: 'https://openapi-sandbox.dl.alipaydev.com/gateway.do',
  returnUrl: 'http://154.201.73.21:3001/payment/result', // 支付结果页面
  notifyUrl: 'http://154.201.73.21:3001/api/payment/alipay/notify', // 异步通知接口
  registerNotifyUrl: 'http://154.201.73.21:3001/api/payment/alipay/register-notify', // 注册订单异步通知接口
  registerReturnUrl: 'http://154.201.73.21:3001/payment/register-result', // 注册订单支付结果页面
    // 提现接口配置
  withdrawUrl: 'https://openapi-sandbox.dl.alipaydev.com/gateway.do', // 提现网关
  withdrawNotifyUrl: 'http://154.201.73.21:3100/api/payment/alipay/withdraw-notify', // 提现异步通知接口
};

// 支付宝正式环境配置
export const alipayProdConfig = {
  appId: process.env.NEXT_PUBLIC_ALIPAY_SANDBOX_APP_ID || '',
  privateKey: process.env.ALIPAY_SANDBOX_PRIVATE_KEY || '',
  publicKey: process.env.ALIPAY_SANDBOX_PUBLIC_KEY || '',
  gateway: 'https://openapi-sandbox.dl.alipaydev.com/gateway.do',
  returnUrl: 'http://154.201.73.21:3001/payment/result', // 支付结果页面
  notifyUrl: 'http://154.201.73.21:3001/api/payment/alipay/notify', // 异步通知接口
  registerNotifyUrl: 'http://154.201.73.21:3001/api/payment/alipay/register-notify',// 注册订单异步通知接口
  registerReturnUrl: 'http://154.201.73.21:3001/payment/result', // 注册订单支付结果页面
    // 提现接口配置
  withdrawUrl: 'https://openapi-sandbox.dl.alipaydev.com/gateway.do', // 提现网关
  withdrawNotifyUrl: 'http://154.201.73.21:3100/api/payment/alipay/withdraw-notify', // 提现异步通知接口
}; 






// 支付宝提现接口方法
export const alipayWithdrawMethods = {
  // 单笔转账到支付宝账户
  TRANSFER_TO_ACCOUNT: 'alipay.fund.trans.uni.transfer',
  // 单笔转账到银行卡
  TRANSFER_TO_BANK: 'alipay.fund.trans.uni.transfer',
  // 批量转账到支付宝账户
  BATCH_TRANSFER_TO_ACCOUNT: 'alipay.fund.trans.common.query',
  // 批量转账到银行卡
  BATCH_TRANSFER_TO_BANK: 'alipay.fund.trans.common.query',
};

// 提现状态枚举
export const withdrawStatus = {
  PROCESSING: 'PROCESSING', // 处理中
  SUCCESS: 'SUCCESS', // 成功
  FAILED: 'FAILED', // 失败
  CLOSED: 'CLOSED', // 已关闭
}; 
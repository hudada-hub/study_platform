import { AlipaySandboxConfig, AlipayProdConfig } from '@/types/payment';

// // 支付宝沙箱环境配置
// export const alipaySandboxConfig = {
//   appId: process.env.NEXT_PUBLIC_ALIPAY_SANDBOX_APP_ID || '',
//   privateKey: process.env.ALIPAY_SANDBOX_PRIVATE_KEY || '',
//   publicKey: process.env.ALIPAY_SANDBOX_PUBLIC_KEY || '',
//   gateway: 'https://openapi-sandbox.dl.alipaydev.com/gateway.do',
//   returnUrl: 'http://localhost:3000/payment/result', // 支付结果页面
//   notifyUrl: 'http://localhost:3000/api/payment/alipay/notify', // 异步通知接口
//   registerNotifyUrl: 'http://localhost:3000/api/payment/register-notify', // 注册订单异步通知接口
//   registerReturnUrl: 'http://localhost:3000/payment/register-result', // 注册订单支付结果页面
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
  returnUrl: 'https://study-platform-five.vercel.app/payment/result', // 支付结果页面
  notifyUrl: 'https://study-platform-five.vercel.app/api/payment/alipay/notify', // 异步通知接口
  registerNotifyUrl: 'https://study-platform-five.vercel.app/api/payment/register-notify', // 注册订单异步通知接口
  registerReturnUrl: 'https://study-platform-five.vercel.app/payment/register-result', // 注册订单支付结果页面
};

// 支付宝正式环境配置
export const alipayProdConfig = {
  appId: process.env.NEXT_PUBLIC_ALIPAY_SANDBOX_APP_ID || '',
  privateKey: process.env.ALIPAY_SANDBOX_PRIVATE_KEY || '',
  publicKey: process.env.ALIPAY_SANDBOX_PUBLIC_KEY || '',
  gateway: 'https://openapi.alipay.com/gateway.do',
  returnUrl: 'https://study-platform-five.vercel.app/payment/result', // 支付结果页面
  notifyUrl: 'https://study-platform-five.vercel.app/api/payment/alipay/notify', // 异步通知接口
  registerNotifyUrl: 'https://study-platform-five.vercel.app/api/payment/register-notify',// 注册订单异步通知接口
  registerReturnUrl: 'https://study-platform-five.vercel.app/payment/result', // 注册订单支付结果页面
}; 
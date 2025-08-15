// 支付宝配置接口
export interface AlipayBaseConfig {
  appId: string;
  privateKey: string;
  publicKey: string;
  gateway: string;
  notifyUrl: string;
  returnUrl: string;
}

export interface AlipaySandboxConfig extends AlipayBaseConfig {}
export interface AlipayProdConfig extends AlipayBaseConfig {}

// 支付宝支付请求参数
export interface AlipayTradeParams {
  outTradeNo: string;
  totalAmount: number;
  subject: string;
  body?: string;
}

export interface AlipayNotifyParams {
  out_trade_no: string;
  trade_no: string;
  trade_status: string;
  total_amount: string;
  [key: string]: string;
}

// 支付宝同步返回参数
export interface AlipayReturnParams {
  outTradeNo: string; // 商户订单号
  tradeNo: string; // 支付宝交易号
  totalAmount: string; // 订单金额
} 

export interface AlipayRegisterResponse {
  orderNo: string;
  paymentForm: string;
} 
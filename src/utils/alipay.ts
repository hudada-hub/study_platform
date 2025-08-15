import {AlipaySdk} from 'alipay-sdk';
import { alipaySandboxConfig } from '@/config/alipay';

// 创建支付宝SDK实例
const alipaySdk = new AlipaySdk({
  appId: alipaySandboxConfig.appId,
  privateKey: alipaySandboxConfig.privateKey,
  alipayPublicKey: alipaySandboxConfig.publicKey,
  gateway: alipaySandboxConfig.gateway,
});

/**
 * 验证支付宝异步通知签名
 * @param params 通知参数
 * @returns 验证结果
 */
export const verifyNotify = async (params: Record<string, string>) => {
  try {
    // 从参数中提取签名
    const sign = params.sign;
    
    // 移除 sign 和 sign_type 参数
    const { sign: _, sign_type: __, ...signParams } = params;
    
    // 按字母序重新排序参数
    const sortedParams = Object.keys(signParams)
      .sort()
      .reduce((result, key) => {
        result[key] = signParams[key];
        return result;
      }, {} as Record<string, string>);

    // 将参数转换为字符串
    const signContent = Object.entries(sortedParams)
      .map(([key, value]) => `${key}=${value}`)
      .join('&');

    // 验证签名
    const verify = alipaySdk.checkNotifySign(signContent);
    return verify;
  } catch (error) {
    console.error('验证支付宝通知签名失败:', error);
    return false;
  }
};

/**
 * 查询支付宝订单状态
 * @param outTradeNo 商户订单号
 */
export const queryOrder = async (outTradeNo: string) => {
  try {
    const result = await alipaySdk.exec('alipay.trade.query', {
      bizContent: {
        out_trade_no: outTradeNo,
      },
    });
    return result;
  } catch (error) {
    console.error('查询支付宝订单失败:', error);
    throw error;
  }
};

/**
 * 关闭支付宝订单
 * @param outTradeNo 商户订单号
 */
export const closeOrder = async (outTradeNo: string) => {
  try {
    const result = await alipaySdk.exec('alipay.trade.close', {
      bizContent: {
        out_trade_no: outTradeNo,
      },
    });
    return result;
  } catch (error) {
    console.error('关闭支付宝订单失败:', error);
    throw error;
  }
};

/**
 * 申请退款
 * @param outTradeNo 商户订单号
 * @param refundAmount 退款金额
 */
export const refundOrder = async (outTradeNo: string, refundAmount: number) => {
  try {
    const result = await alipaySdk.exec('alipay.trade.refund', {
      bizContent: {
        out_trade_no: outTradeNo,
        refund_amount: refundAmount,
      },
    });
    return result;
  } catch (error) {
    console.error('申请支付宝退款失败:', error);
    throw error;
  }
}; 
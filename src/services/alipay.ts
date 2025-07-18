import { AlipaySdk } from 'alipay-sdk';
import { alipaySandboxConfig } from '@/config/alipay';

class AlipayService {
  private sdk: AlipaySdk;

  constructor(isProd: boolean = false) {
    this.sdk = new AlipaySdk({
      appId: alipaySandboxConfig.appId,
      privateKey: alipaySandboxConfig.privateKey,
      alipayPublicKey: alipaySandboxConfig.publicKey,
      gateway: alipaySandboxConfig.gateway,
    });
  }

  /**
   * 创建支付表单
   */
  async createPaymentForm(params: {
    outTradeNo: string;
    totalAmount: number;
    subject: string;
    body: string;
  }) {
    const { outTradeNo, totalAmount, subject, body } = params;

    const result = await this.sdk.pageExec('alipay.trade.page.pay', {
      notify_url:subject=='注册会员'?alipaySandboxConfig.registerNotifyUrl:alipaySandboxConfig.notifyUrl,
      return_url: subject=='注册会员'?alipaySandboxConfig.registerReturnUrl:alipaySandboxConfig.returnUrl,
      bizContent: {
        out_trade_no: outTradeNo,
        total_amount: totalAmount,
        subject,
        body,
        product_code: 'FAST_INSTANT_TRADE_PAY',
      },
    });

    return result;
  }

  /**
   * 验证支付宝异步通知签名
   */
  verifyNotify(params: Record<string, string>) {
    return this.sdk.checkNotifySign(params);
  }

  /**
   * 查询订单状态
   */
  async queryOrder(outTradeNo: string) {
    const result = await this.sdk.exec('alipay.trade.query', {
      bizContent: {
        out_trade_no: outTradeNo,
      },
    });
    return result;
  }

  /**
   * 关闭订单
   */
  async closeOrder(outTradeNo: string) {
    const result = await this.sdk.exec('alipay.trade.close', {
      bizContent: {
        out_trade_no: outTradeNo,
      },
    });
    return result;
  }

  /**
   * 申请退款
   */
  async refundOrder(outTradeNo: string, refundAmount: number) {
    const result = await this.sdk.exec('alipay.trade.refund', {
      bizContent: {
        out_trade_no: outTradeNo,
        refund_amount: refundAmount,
      },
    });
    return result;
  }
}

// 创建一个单例实例
export const alipayService = new AlipayService(); 

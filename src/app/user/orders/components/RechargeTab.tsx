'use client'
import React, { useState, useRef } from 'react';
import { Card, Button, message, Input, InputNumber } from 'antd';
import { request } from '@/utils/request';
import Swal from 'sweetalert2';
import { ResponseCode } from '@/types/response';
import type { ApiResponse } from '@/types/response';
import { SiAlipay } from 'react-icons/si';

// 充值选项配置
const RECHARGE_OPTIONS = [
  { amount: 10, points: 100, label: '充值10元 = 100积分' },
  { amount: 50, points: 500, label: '充值50元 = 500积分' },
  { amount: 100, points: 1000, label: '充值100元 = 1000积分' },
  { amount: 500, points: 5000, label: '充值500元 = 5000积分' },
];

interface AlipayCreateResponse {
  formHtml: string;
}

interface CreateOrderResponse {
  orderNo: string;
  id: string;
}

interface AlipayQueryResponse {
  code: string;
  msg: string;
  tradeStatus: 'WAIT_BUYER_PAY' | 'TRADE_CLOSED' | 'TRADE_SUCCESS' | 'TRADE_FINISHED';
  totalAmount: string;
  outTradeNo: string;
}

const RechargeTab = () => {
  const [loading, setLoading] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState<number | null>(null);
  const pollingTimerRef = useRef<NodeJS.Timeout>();
  const currentOrderRef = useRef<string>();

  // 计算积分
  const calculatePoints = (amount: number) => {
    return amount * 10; // 1元 = 10积分
  };

  // 验证金额
  const validateAmount = (amount: number | null) => {
    if (!amount) return false;
    return amount >= 1 && Number.isInteger(amount);
  };

  // 查询支付状态
  const queryPaymentStatus = async (orderNo: string) => {
    try {
      const res = await request<AlipayQueryResponse>('/payment/alipay/query', {
        method: 'POST',
        body: JSON.stringify({ orderNo }),
      });

      if (res.code === 0) {
        const { tradeStatus } = res.data;
        
        // 如果支付成功
        if (tradeStatus === 'TRADE_SUCCESS' || tradeStatus === 'TRADE_FINISHED') {
          // 清除轮询
          if (pollingTimerRef.current) {
            clearInterval(pollingTimerRef.current);
            pollingTimerRef.current = undefined;
          }
          
          // 显示成功提示
          await Swal.fire({
            title: '充值成功',
            text: '您的积分已到账',
            icon: 'success',
            confirmButtonText: '确定'
          });
          
          // 刷新页面
          window.location.reload();
        }
        // 如果订单关闭
        else if (tradeStatus === 'TRADE_CLOSED') {
          // 清除轮询
          if (pollingTimerRef.current) {
            clearInterval(pollingTimerRef.current);
            pollingTimerRef.current = undefined;
          }
          
          Swal.fire({
            title: '支付已取消',
            text: '如需重新支付，请重新发起充值',
            icon: 'warning',
            confirmButtonText: '确定'
          });
        }
      }
    } catch (error) {
      console.error('查询支付状态失败:', error);
    }
  };

  // 开始轮询支付状态
  const startPolling = (orderNo: string) => {
    // 先清除可能存在的轮询
    if (pollingTimerRef.current) {
      clearInterval(pollingTimerRef.current);
    }

    // 保存当前订单号
    currentOrderRef.current = orderNo;

    // 设置轮询间隔为3秒
    pollingTimerRef.current = setInterval(() => {
      // 确保是当前订单的轮询
      if (currentOrderRef.current === orderNo) {
        queryPaymentStatus(orderNo);
      }
    }, 3000);

    // 5分钟后自动停止轮询
    setTimeout(() => {
      if (pollingTimerRef.current) {
        clearInterval(pollingTimerRef.current);
        pollingTimerRef.current = undefined;
      }
    }, 5 * 60 * 1000);
  };

  // 创建充值订单
  const createOrder = async (amount: number, points: number) => {
    try {
      const res = await request<CreateOrderResponse>('/payment/orders', {
        method: 'POST',
        body: JSON.stringify({
          type: 'RECHARGE',
          amount: amount,
          points: points,
          title: `充值${amount}元`,
          paymentMethod: 'ALIPAY'
        }),
      });

      if (res.code === 0) {
        return res.data;
      }
      throw new Error(res.message || '创建订单失败');
    } catch (error) {
      console.error('创建订单失败:', error);
      throw error;
    }
  };

  const handleRecharge = async (amount: number, points: number) => {
    try {
      setLoading(true);
      
      // 1. 先创建订单
      const order = await createOrder(amount, points);
      
      // 2. 创建支付宝订单
      const res = await request<AlipayCreateResponse>('/payment/alipay/create', {
        method: 'POST',
        body: JSON.stringify({
          orderNo: order.orderNo,
          totalAmount: amount,
          subject: `充值${amount}元`,
          body: `充值${amount}元获得${points}积分`,
        }),
      });

          if (res.code === 0) {
      // 创建一个临时的隐藏表单
      const div = document.createElement('div');
      div.style.display = 'none';
      div.innerHTML = res.data.formHtml;
      document.body.appendChild(div);
      
      // 获取表单并设置 target 为新窗口
      const form = div.querySelector('form');
      if (form) {
        form.target = '_blank';  // 在新标签页中打开
        form.submit();
          
          // 开始轮询支付状态
          startPolling(order.orderNo);
          
          // 弹出提示
          Swal.fire({
            title: '支付提示',
            text: '请在新打开的页面完成支付',
            icon: 'info',
            confirmButtonText: '我知道了'
          });
      }
      
      // 清理临时div
      setTimeout(() => {
        document.body.removeChild(div);
      }, 100);
      }
    } catch (error) {
      console.error('充值请求失败:', error);
      Swal.fire({
        title: '充值失败',
        text: error instanceof Error ? error.message : '请稍后重试',
        icon: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  // 组件卸载时清理轮询
  React.useEffect(() => {
    return () => {
      if (pollingTimerRef.current) {
        clearInterval(pollingTimerRef.current);
      }
    };
  }, []);

  const confirmRecharge = (amount: number, points: number) => {
    if (!validateAmount(amount)) {
      Swal.fire({
        title: '金额无效',
        text: '请输入大于等于1元的整数金额',
        icon: 'error',
        confirmButtonText: '确定'
      });
      return;
    }

    Swal.fire({
      title: '确认充值',
      text: `确定要充值${amount}元获得${points}积分吗？`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: '确定',
      cancelButtonText: '取消'
    }).then((result) => {
      if (result.isConfirmed) {
        handleRecharge(amount, points);
      }
    });
  };

  return (
    <div className="space-y-8">
      {/* 固定金额选项 */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {RECHARGE_OPTIONS.map((option, index) => (
        <Card
          key={index}
          className={`cursor-pointer transition-all duration-300 ${
            selectedOption === index ? 'border-blue-500' : ''
          }`}
            onClick={() => {
              setSelectedOption(index);
              setCustomAmount(null);
            }}
        >
          <div className="text-center">
            <div className="text-lg mb-2">{option.label}</div>
            <div className="text-gray-500 mb-4">优惠价 ¥{option.amount}</div>
            <Button
              type="primary"
              loading={loading && selectedOption === index}
              onClick={(e) => {
                e.stopPropagation();
                  confirmRecharge(option.amount, option.points);
              }}
                icon={<SiAlipay className="mr-2" />}
              block
            >
              立即充值
            </Button>
          </div>
        </Card>
      ))}
      </div>

      {/* 自定义金额 */}
      <Card className="mt-4">
        <div className="flex flex-col items-center space-y-4">
          <div className="text-lg font-medium">自定义金额</div>
          <div className="flex items-center space-x-4 w-full max-w-md">
            <InputNumber
              className="flex-1"
              min={1}
              precision={0}
              value={customAmount}
              onChange={(value) => {
                setCustomAmount(value);
                setSelectedOption(null);
              }}
              placeholder="请输入充值金额（最小1元）"
              addonBefore="¥"
            />
            <Button
              type="primary"
              loading={loading && selectedOption === null}
              disabled={!validateAmount(customAmount)}
              onClick={() => {
                if (customAmount) {
                  confirmRecharge(customAmount, calculatePoints(customAmount));
                }
              }}
              icon={<SiAlipay className="mr-2" />}
            >
              立即充值
            </Button>
          </div>
          <div className="text-gray-500">
            {customAmount && customAmount >= 1
              ? `充值${customAmount}元可获得${calculatePoints(customAmount)}积分`
              : '请输入大于等于1元的整数金额'}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default RechargeTab; 
import { NextRequest } from 'next/server';
import { ResponseUtil, ResponseCode } from '@/utils/response';
import { SmsService } from '@/services/sms';

// 从环境变量获取是否使用模拟验证码模式
const isMock = process.env.IS_MOCK === 'true';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { phone } = body;

    // 验证手机号格式
    if (!phone || !/^1[3-9]\d{9}$/.test(phone)) {
      return ResponseUtil.error('请输入正确的手机号');
    }

    if (isMock) {
      // 模拟模式，直接返回固定验证码
      console.log('模拟验证码：666666');
      return ResponseUtil.success({ code: '666666' }, '验证码发送成功');
    }

    // 正常发送验证码
    const result = await SmsService.sendVerificationCode(phone);
    
    if (result.code === ResponseCode.SUCCESS) {
      return ResponseUtil.success(null, '验证码发送成功');
    } else {
      return ResponseUtil.error(result.message);
    }
  } catch (error) {
    console.error('发送验证码失败:', error);
    return ResponseUtil.error('发送验证码失败');
  }
} 
import * as tencentcloud from 'tencentcloud-sdk-nodejs';
import { tencentCloudConfig } from '@/config/tencentcloud';
import prisma from '@/lib/prisma';
import { ResponseCode } from '@/utils/response';

// 短信客户端
const SmsClient = tencentcloud.sms.v20210111.Client;

// 创建短信客户端实例
const client = new SmsClient({
  credential: {
    secretId: tencentCloudConfig.secretId,
    secretKey: tencentCloudConfig.secretKey,
  },
  region: tencentCloudConfig.region,
  profile: {
    signMethod: "TC3-HMAC-SHA256",
    httpProfile: {
      reqMethod: "POST",
      reqTimeout: 30,
      endpoint: "sms.tencentcloudapi.com",
    },
  },
});

// 生成随机验证码
const generateVerificationCode = (length: number = 6): string => {
  return Math.random().toString().slice(2, 2 + length);
};

// 验证码有效期（分钟）
const CODE_EXPIRE_MINUTES = 5;

export class SmsService {
  /**
   * 发送验证码短信
   * @param phone 手机号
   * @returns 发送结果
   */
  static async sendVerificationCode(phone: string) {
    try {
      // 检查是否存在未过期的验证码
      const existingCode = await prisma.verificationCode.findFirst({
        where: {
          phone,
          expiresAt: {
            gt: new Date(),
          },
          isUsed: false,
        },
      });

      if (existingCode) {
        return {
          code: ResponseCode.ERROR,
          message: `请${Math.ceil((existingCode.expiresAt.getTime() - Date.now()) / 1000)}秒后重试`,
        };
      }

      // 生成新的验证码
      const code = generateVerificationCode();
      const expiresAt = new Date(Date.now() + CODE_EXPIRE_MINUTES * 60 * 1000);

      // 发送短信
      const params = {
        PhoneNumberSet: [`+86${phone}`],
        SmsSdkAppId: tencentCloudConfig.smsConfig.sdkAppId,
        SignName: tencentCloudConfig.smsConfig.signName,
        TemplateId: tencentCloudConfig.smsConfig.templateId,
        TemplateParamSet: [code, `${CODE_EXPIRE_MINUTES}`],
      };

      const result = await client.SendSms(params);

      // 检查发送结果
      if (result.SendStatusSet?.[0]?.Code === 'Ok') {
        // 保存验证码到数据库
        await prisma.verificationCode.create({
          data: {
            phone,
            code,
            type: 'REGISTER',
            expiresAt,
            isUsed: false,
          },
        });

        return {
          code: ResponseCode.SUCCESS,
          message: '验证码发送成功',
        };
      } else {
        return {
          code: ResponseCode.ERROR,
          message: '验证码发送失败',
        };
      }
    } catch (error) {
      console.error('发送验证码失败:', error);
      return {
        code: ResponseCode.ERROR,
        message: '验证码发送失败',
      };
    }
  }

  /**
   * 验证验证码
   * @param phone 手机号
   * @param code 验证码
   * @returns 验证结果
   */
  static async verifyCode(phone: string, code: string) {
    try {
      const verificationCode = await prisma.verificationCode.findFirst({
        where: {
          phone,
          code,
          expiresAt: {
            gt: new Date(),
          },
          isUsed: false,
        },
      });

      if (!verificationCode) {
        return {
          code: ResponseCode.ERROR,
          message: '验证码无效或已过期',
        };
      }

      // 标记验证码为已使用
      await prisma.verificationCode.update({
        where: {
          id: verificationCode.id,
        },
        data: {
          isUsed: true,
        },
      });

      return {
        code: ResponseCode.SUCCESS,
        message: '验证成功',
      };
    } catch (error) {
      console.error('验证码验证失败:', error);
      return {
        code: ResponseCode.ERROR,
        message: '验证失败',
      };
    }
  }
} 
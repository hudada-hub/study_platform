import { NextRequest, NextResponse } from 'next/server';
import { ResponseUtil } from '@/utils/response';
import { tencentCloudConfig } from '@/config/tencentcloud';

// 腾讯云TMS服务配置
const tencentcloud = require("tencentcloud-sdk-nodejs-tms");
const TmsClient = tencentcloud.tms.v20201229.Client;

// 实例化客户端
const clientConfig = {
  credential: {
    secretId: tencentCloudConfig.secretId,
    secretKey: tencentCloudConfig.secretKey,
  },
  region: tencentCloudConfig.region,
  profile: {
    httpProfile: {
      endpoint: "tms.tencentcloudapi.com",
    },
  },
};

const client = new TmsClient(clientConfig);

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json();

    // 验证输入
    if (!text || typeof text !== 'string') {
      return ResponseUtil.error('文本内容不能为空');
    }

    // 如果文本为空，直接返回安全
    if (!text.trim()) {
      return ResponseUtil.success({
        isSafe: true,
        message: '文本为空',
        details: null
      });
    }

        // 调用腾讯云TMS服务进行文本审核
    // 将文本转换为UTF-8编码的Base64格式
    const contentBuffer = Buffer.from(text.trim(), 'utf8');
    const contentBase64 = contentBuffer.toString('base64');
    
    const params = {
      Content: contentBase64,
      BizType: "comment", // 业务类型，可以根据需要调整
      DataId: `text_${Date.now()}`, // 数据ID，用于标识请求
    };

    const result = await client.TextModeration(params);
    
    
    // 解析审核结果
    const { Suggestion, DetailResults } = result;
    
    // 判断是否安全
    // Suggestion: Pass(通过), Review(建议人工复审), Block(违规)
    const isSafe = Suggestion === 'Pass';
    
    let message = '文本内容正常';
    if (Suggestion === 'Review') {
      message = '文本内容需要人工审核';
    } else if (Suggestion === 'Block') {
      message = '文本内容包含违规信息';
    }

    return ResponseUtil.success({
      isSafe,
      message,
      details: {
        suggestion: Suggestion,
        detailResults: DetailResults
      }
    });

  } catch (error) {
    console.error('文字内容审核失败:', error);
    return ResponseUtil.error('审核服务异常，请稍后重试');
  }
} 
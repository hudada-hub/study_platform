import { NextRequest, NextResponse } from 'next/server';
import { ResponseUtil } from '@/utils/response';
import { tencentCloudConfig } from '@/config/tencentcloud';

// 腾讯云IMS服务配置
const tencentcloud = require("tencentcloud-sdk-nodejs-ims");
const ImsClient = tencentcloud.ims.v20201229.Client;

// 实例化客户端
const clientConfig = {
  credential: {
    secretId: tencentCloudConfig.secretId,
    secretKey: tencentCloudConfig.secretKey,
  },
  region: tencentCloudConfig.region,
  profile: {
    httpProfile: {
      endpoint: "ims.tencentcloudapi.com",
    },
  },
};

const client = new ImsClient(clientConfig);

export async function POST(request: NextRequest) {
  try {
    const { imageUrl, isBase64 } = await request.json();

    // 验证输入
    if (!imageUrl || typeof imageUrl !== 'string') {
      return ResponseUtil.error('图片内容不能为空');
    }

    // 如果图片URL为空，直接返回安全
    if (!imageUrl.trim()) {
      return ResponseUtil.success({
        isSafe: true,
        message: '图片为空',
        details: null,
        labels: [],
        confidence: 0
      });
    }

    // 调用腾讯云IMS服务进行图片审核
    const params = {
      BizType: "comment_pic", // 业务类型，可以根据需要调整
      DataId: `image_${Date.now()}`, // 数据ID，用于标识请求
      ...(isBase64 ? {
        FileContent: imageUrl.trim() // Base64编码的图片内容
      } : {
        FileUrl: imageUrl.trim() // 图片URL
      })
    };

    const result = await client.ImageModeration(params);
    
    // 解析审核结果
    const { Suggestion, Label, Confidence, DetailResults } = result;
    
    // 判断是否安全
    // Suggestion: Pass(通过), Review(建议人工复审), Block(违规)
    const isSafe = Suggestion === 'Pass';
    
    let message = '图片内容正常';
    if (Suggestion === 'Review') {
      message = '图片内容需要人工审核';
    } else if (Suggestion === 'Block') {
      message = '图片内容包含违规信息';
    }

    // 提取标签信息
    const labels = Label ? [Label] : [];
    const confidence = Confidence || 0;

    return ResponseUtil.success({
      isSafe,
      message,
      details: {
        suggestion: Suggestion,
        label: Label,
        confidence: Confidence,
        detailResults: DetailResults
      },
      labels,
      confidence
    });

  } catch (error) {
    console.error('图片内容审核失败:', error);
    return ResponseUtil.error('审核服务异常，请稍后重试');
  }
} 
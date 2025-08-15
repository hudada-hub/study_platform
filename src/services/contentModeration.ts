// 内容审核服务
// 使用腾讯云TMS服务进行文本审核
// 使用腾讯云IMS服务进行图片审核

interface ModerationResult {
  success: boolean;
  isSafe: boolean;
  message: string;
  details?: any;
}

interface ImageModerationResult {
  success: boolean;
  isSafe: boolean;
  message: string;
  details?: any;
  labels?: string[];
  confidence?: number;
}

/**
 * 文字内容审核
 * @param text 需要审核的文本内容
 * @returns 审核结果
 */
export const moderateText = async (text: string): Promise<ModerationResult> => {
  try {
    // 如果文本为空，直接返回安全
    if (!text || !text.trim()) {
      return {
        success: true,
        isSafe: true,
        message: '文本为空'
      };
    }

    // 调用后端API进行审核
    const response = await fetch('/api/common/text-moderation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text: text.trim() }),
    });

    const result = await response.json();

    if (result.code === 0) {
      return {
        success: true,
        isSafe: result.data.isSafe,
        message: result.data.message,
        details: result.data.details
      };
    } else {
      return {
        success: false,
        isSafe: false,
        message: result.message || '审核服务异常'
      };
    }
  } catch (error) {
    console.error('文字内容审核失败:', error);
    return {
      success: false,
      isSafe: false,
      message: '审核服务连接失败'
    };
  }
};

/**
 * 检查文本是否安全
 * @param text 需要检查的文本
 * @returns 是否安全
 */
export const isTextSafe = async (text: string): Promise<boolean> => {
  const result = await moderateText(text);
  return result.success && result.isSafe;
};

/**
 * 图片内容审核
 * @param imageUrl 图片URL或Base64编码
 * @param isBase64 是否为Base64编码，默认为false
 * @returns 审核结果
 */
export const moderateImage = async (imageUrl: string, isBase64: boolean = false): Promise<ImageModerationResult> => {
  try {
    // 如果图片URL为空，直接返回安全
    if (!imageUrl || !imageUrl.trim()) {
      return {
        success: true,
        isSafe: true,
        message: '图片为空'
      };
    }

    // 调用后端API进行图片审核
    const response = await fetch('/api/common/image-moderation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        imageUrl: imageUrl.trim(),
        isBase64 
      }),
    });

    const result = await response.json();

    if (result.code === 0) {
      return {
        success: true,
        isSafe: result.data.isSafe,
        message: result.data.message,
        details: result.data.details,
        labels: result.data.labels,
        confidence: result.data.confidence
      };
    } else {
      return {
        success: false,
        isSafe: false,
        message: result.message || '图片审核服务异常'
      };
    }
  } catch (error) {
    console.error('图片内容审核失败:', error);
    return {
      success: false,
      isSafe: false,
      message: '图片审核服务连接失败'
    };
  }
};

/**
 * 检查图片是否安全
 * @param imageUrl 图片URL或Base64编码
 * @param isBase64 是否为Base64编码，默认为false
 * @returns 是否安全
 */
export const isImageSafe = async (imageUrl: string, isBase64: boolean = false): Promise<boolean> => {
  const result = await moderateImage(imageUrl, isBase64);
  return result.success && result.isSafe;
};

/**
 * 批量审核图片
 * @param imageUrls 图片URL数组
 * @param isBase64 是否为Base64编码，默认为false
 * @returns 审核结果数组
 */
export const moderateImages = async (imageUrls: string[], isBase64: boolean = false): Promise<ImageModerationResult[]> => {
  const results: ImageModerationResult[] = [];
  
  for (const imageUrl of imageUrls) {
    const result = await moderateImage(imageUrl, isBase64);
    results.push(result);
  }
  
  return results;
};

/**
 * 检查多张图片是否都安全
 * @param imageUrls 图片URL数组
 * @param isBase64 是否为Base64编码，默认为false
 * @returns 是否所有图片都安全
 */
export const areImagesSafe = async (imageUrls: string[], isBase64: boolean = false): Promise<boolean> => {
  const results = await moderateImages(imageUrls, isBase64);
  return results.every(result => result.success && result.isSafe);
}; 
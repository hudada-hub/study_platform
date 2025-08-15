# 文字内容审核功能

## 功能概述

本项目集成了腾讯云TMS（文本内容安全）服务，用于对用户提交的文本内容进行安全审核，防止违规内容发布。

## 功能特性

- ✅ 自动文本内容审核
- ✅ 自动图片内容审核
- ✅ 支持多种违规类型检测（政治、色情、暴力、违法等）
- ✅ 实时审核反馈
- ✅ 可配置的审核策略
- ✅ 详细的审核结果
- ✅ 批量图片审核

## 环境配置

### 1. 腾讯云配置

确保在环境变量中配置了腾讯云的密钥：

```bash
# 腾讯云账户密钥
TENCENT_CLOUD_SECRET_ID=your_secret_id_here
TENCENT_CLOUD_SECRET_KEY=your_secret_key_here
```

### 2. 依赖安装

项目已安装必要的依赖：

```bash
npm install tencentcloud-sdk-nodejs-tms
npm install tencentcloud-sdk-nodejs-ims
```

## 使用方法

### 1. 前端使用

在需要审核文本的组件中导入并使用：

```typescript
import { moderateText, isTextSafe, moderateImage, moderateImages } from '@/services/contentModeration';

// 文本审核
const result = await moderateText(text);
if (result.success && result.isSafe) {
  // 内容安全，可以提交
} else {
  // 内容不安全，显示错误信息
  console.log(result.message);
}

// 图片审核
const imageResult = await moderateImage(imageUrl);
if (imageResult.success && imageResult.isSafe) {
  // 图片安全
} else {
  // 图片不安全
}

// 批量图片审核
const batchResults = await moderateImages(imageUrls);
const allSafe = batchResults.every(result => result.isSafe);

// 简单检查
const isTextSafe = await isTextSafe(text);
const isImageSafe = await isImageSafe(imageUrl);
```

### 2. 在CommentInput组件中的集成

CommentInput组件已集成内容审核功能，用户提交评论时会自动进行审核：

- 如果内容安全，正常提交
- 如果内容不安全，显示错误提示并阻止提交

### 3. API接口

#### POST /api/common/text-moderation

**请求参数：**
```json
{
  "text": "需要审核的文本内容"
}
```

**响应格式：**
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "isSafe": true,
    "message": "文本内容正常",
    "details": {
      "suggestion": "Pass",
      "detailResults": [...]
    }
  }
}
```

#### POST /api/common/image-moderation

**请求参数：**
```json
{
  "imageUrl": "图片URL或Base64编码",
  "isBase64": false
}
```

**响应格式：**
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "isSafe": true,
    "message": "图片内容正常",
    "details": {
      "suggestion": "Pass",
      "label": "Normal",
      "confidence": 0.95,
      "detailResults": [...]
    },
    "labels": ["Normal"],
    "confidence": 0.95
  }
}
```

## 审核结果说明

### 审核建议 (Suggestion)

- `Pass`: 内容安全，可以发布
- `Review`: 建议人工复审
- `Block`: 内容违规，禁止发布

### 违规类型

腾讯云TMS服务可以检测以下类型的违规内容：

- 政治敏感内容
- 色情内容
- 暴力内容
- 违法内容
- 其他违规内容

## 测试页面

- 访问 `/test-content-moderation` 页面可以测试文字内容审核功能
- 访问 `/test-image-moderation` 页面可以测试图片内容审核功能

## 注意事项

1. **密钥安全**: 请确保腾讯云密钥的安全性，不要泄露到代码仓库中
2. **审核延迟**: 审核服务可能有轻微延迟，建议在UI中显示加载状态
3. **错误处理**: 审核服务可能因网络问题失败，需要做好错误处理
4. **成本控制**: 腾讯云TMS服务按调用次数计费，请注意控制使用量
5. **编码要求**: 腾讯云TMS服务要求文本内容必须是UTF-8编码的Base64格式，系统会自动进行转换

## 扩展功能

### 1. 自定义审核策略

可以在API中修改 `BizType` 参数来使用不同的审核策略：

```typescript
const params = {
  Content: text,
  BizType: "custom", // 使用自定义策略
  // ...其他参数
};
```

### 2. 批量审核

对于大量文本，可以考虑批量审核以提高效率。

### 3. 审核日志

可以添加审核日志记录功能，便于后续分析和优化。

## 故障排除

### 常见问题

1. **审核服务连接失败**
   - 检查网络连接
   - 验证腾讯云密钥是否正确
   - 确认服务是否在可用区域

2. **审核结果异常**
   - 检查文本内容是否为空
   - 验证API参数格式
   - 查看腾讯云控制台日志
   - 确认文本编码格式（系统会自动转换为UTF-8 Base64）

3. **性能问题**
   - 考虑添加缓存机制
   - 优化审核频率
   - 使用异步处理

## 更新日志

- v1.0.0: 初始版本，集成腾讯云TMS服务
- 支持基本的文本内容审核
- 集成到CommentInput组件
- v1.1.0: 新增图片内容审核功能
- 集成腾讯云IMS服务
- 支持单张和批量图片审核
- 在CommentInput组件中集成图片审核
- v1.2.0: 优化WangEditor组件
- 添加动态加载和NoSSR支持，避免页面闪烁
- 在WangEditor中集成图片内容审核
- 添加图片上传时的审核状态提示
- v1.3.0: 进一步优化WangEditor性能
- 添加防抖机制，避免频繁的内容更新
- 使用React.memo优化组件重新渲染
- 创建OptimizedWangEditor包装器 
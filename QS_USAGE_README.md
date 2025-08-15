# QS插件使用说明

## 概述
QS是一个用于处理查询字符串的JavaScript库，可以方便地将对象转换为查询字符串，以及将查询字符串解析为对象。

## 安装
```bash
npm install qs @types/qs
```

## 主要功能

### 1. 对象转查询字符串 (stringify)
```javascript
import qs from 'qs';

const params = {
  page: 1,
  pageSize: 10,
  keyword: '搜索关键词',
  categoryId: 1,
  sortBy: 'createdAt',
  sortOrder: 'desc'
};

// 基本用法
const queryString = qs.stringify(params);
// 结果: "page=1&pageSize=10&keyword=搜索关键词&categoryId=1&sortBy=createdAt&sortOrder=desc"

// 跳过null值
const queryString2 = qs.stringify(params, { skipNulls: true });

// 数组格式
const queryString3 = qs.stringify(params, { arrayFormat: 'brackets' });
```

### 2. 查询字符串转对象 (parse)
```javascript
const queryString = "page=1&pageSize=10&keyword=搜索关键词";
const params = qs.parse(queryString);
// 结果: { page: '1', pageSize: '10', keyword: '搜索关键词' }
```

## 在项目中的使用

### 1. 前端请求参数处理
```javascript
// 任务列表请求
const fetchTasks = async () => {
  const params = {
    page: currentPage,
    pageSize,
    keyword: searchKeyword,
    categoryId: selectedCategory,
    sortBy,
    sortOrder,
  };
  
  const queryStr = qs.stringify(params, { skipNulls: true });
  const response = await request(`/tasks?${queryStr}`, {
    method: 'GET',
  });
};
```

### 2. POST请求体处理
```javascript
// 发布任务
const handleSubmit = async (values) => {
  const response = await request('/tasks', {
    method: 'POST',
    body: qs.stringify(values),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
};
```

### 3. 报名任务
```javascript
// 报名任务
const handleApply = async () => {
  const response = await request(`/tasks/${taskId}/apply`, {
    method: 'POST',
    body: qs.stringify({ reason: applyReason }),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
};
```

## API接口适配

### 1. 支持多种Content-Type
```javascript
// 在API接口中处理不同的请求格式
const contentType = request.headers.get('content-type') || '';

if (contentType.includes('application/x-www-form-urlencoded')) {
  // 处理qs格式的请求体
  const formData = await request.formData();
  const title = formData.get('title') as string;
  const content = formData.get('content') as string;
  const categoryId = parseInt(formData.get('categoryId') as string);
  const points = parseInt(formData.get('points') as string);
} else {
  // 处理JSON格式的请求体
  const body = await request.json();
  const { title, content, categoryId, points } = body;
}
```

## 配置选项

### stringify选项
- `skipNulls`: 跳过null值
- `arrayFormat`: 数组格式 ('indices' | 'brackets' | 'repeat' | 'comma')
- `encode`: 是否编码
- `delimiter`: 分隔符

### parse选项
- `ignoreQueryPrefix`: 忽略查询前缀
- `delimiter`: 分隔符
- `depth`: 解析深度

## 优势

1. **灵活性**: 支持多种数据格式
2. **兼容性**: 与现有API接口兼容
3. **类型安全**: 提供完整的TypeScript类型定义
4. **性能**: 轻量级，性能优秀
5. **标准化**: 遵循URL编码标准

## 注意事项

1. 确保在API接口中正确处理不同的Content-Type
2. 使用skipNulls选项避免发送空值
3. 对于复杂对象，考虑使用JSON格式而不是qs
4. 注意URL长度限制，避免查询字符串过长

## 测试

访问 `/tasks/test` 页面可以测试qs功能是否正常工作。 
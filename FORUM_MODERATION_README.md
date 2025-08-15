# 论坛版主功能使用说明

## 功能概述

为论坛版主和超级管理员添加了帖子管理功能，包括：
- 帖子状态审核（通过/拒绝/待审核）
- 帖子属性设置（置顶/精华/热门）
- 帖子删除功能

## 权限控制

### 超级管理员 (SUPER_ADMIN)
- 可以管理所有板块的帖子
- 拥有所有管理权限

### 版主 (MODERATOR)
- 只能管理自己负责板块的帖子
- 拥有帖子审核和属性设置权限

### 普通用户 (USER)
- 无法看到管理菜单
- 只能查看帖子内容

## API接口

### 帖子管理接口
```
PUT /api/forum/posts/[id]/manage
```

**请求参数：**
```json
{
  "status": "PUBLISHED" | "REJECTED" | "PENDING",
  "isTop": true | false,
  "isEssence": true | false,
  "isHot": true | false
}
```

**响应：**
```json
{
  "code": 0,
  "message": "success",
  "data": {
    // 更新后的帖子信息
  }
}
```

### 删除帖子接口
```
DELETE /api/forum/posts/[id]/manage
```

## 使用方法

### 1. 在论坛页面中传递用户信息

```tsx
import { getCurrentUser } from '@/utils/client-auth';

export default function ForumPage() {
  const currentUser = getCurrentUser();
  
  return (
    <ForumPostsList
      posts={posts}
      currentUser={currentUser}
      // ... 其他属性
    />
  );
}
```

### 2. 管理菜单功能

版主和超级管理员在每个帖子右下角会看到三个点的管理菜单，包含：

#### 状态管理
- **通过审核**: 将帖子状态设置为已发布
- **拒绝**: 将帖子状态设置为已拒绝  
- **待审核**: 将帖子状态设置为待审核

#### 属性设置
- **置顶**: 设置/取消帖子置顶状态
- **精华**: 设置/取消帖子精华状态
- **热门**: 设置/取消帖子热门状态

#### 删除操作
- **删除帖子**: 软删除帖子（设置isDeleted为true）

### 3. 状态显示

每个帖子左上角会显示状态标签：
- 🟢 已发布 (绿色)
- 🟡 待审核 (黄色)
- 🔴 已拒绝 (红色)
- ⚪ 草稿 (灰色)

## 数据库字段

### ForumPost 模型
```prisma
model ForumPost {
  id            Int         @id @default(autoincrement())
  title         String      @db.VarChar(200)
  content       String      @db.Text
  status        PostStatus  @default(PENDING)  // 帖子状态
  isTop         Boolean     @default(false)     // 是否置顶
  isEssence     Boolean     @default(false)     // 是否精华
  isHot         Boolean     @default(false)     // 是否热门
  isDeleted     Boolean     @default(false)     // 是否删除
  // ... 其他字段
}
```

### PostStatus 枚举
```prisma
enum PostStatus {
  PENDING    // 待审核
  PUBLISHED  // 已发布
  REJECTED   // 已拒绝
  DRAFT      // 草稿
  DELETED    // 已删除
}
```

## 注意事项

1. **权限检查**: 所有管理操作都会进行权限验证
2. **软删除**: 删除操作采用软删除，不会物理删除数据
3. **状态同步**: 操作成功后会自动刷新页面显示最新状态
4. **错误处理**: 所有操作都有完整的错误处理和用户提示

## 扩展功能

未来可以考虑添加：
- 批量操作功能
- 操作日志记录
- 审核意见填写
- 自动审核规则
- 版主权限管理 
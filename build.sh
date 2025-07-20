#!/bin/bash

# 设置Node.js内存限制
export NODE_OPTIONS="--max-old-space-size=4096"

# 清理缓存
echo "清理缓存..."
rm -rf .next
rm -rf node_modules/.cache

# 安装依赖
echo "安装依赖..."
npm install

# 生成Prisma客户端
echo "生成Prisma客户端..."
npx prisma generate

# 构建项目
echo "开始构建..."
npm run build

echo "构建完成！" 
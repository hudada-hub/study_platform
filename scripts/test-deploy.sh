#!/bin/bash

# 部署测试脚本
# 用于测试部署流程是否正常

echo "🧪 开始部署测试..."

# 检查必要文件
echo "📁 检查必要文件..."
if [ ! -f "ecosystem.config.js" ]; then
    echo "❌ 缺少 ecosystem.config.js 文件"
    exit 1
fi

if [ ! -f "package.json" ]; then
    echo "❌ 缺少 package.json 文件"
    exit 1
fi

echo "✅ 必要文件检查通过"

# 检查Node.js环境
echo "🔧 检查Node.js环境..."
if ! command -v node &> /dev/null; then
    echo "❌ Node.js未安装"
    exit 1
fi

if ! command -v npm &> /dev/null; then
    echo "❌ npm未安装"
    exit 1
fi

echo "✅ Node.js环境检查通过"

# 检查PM2
echo "🔧 检查PM2..."
if ! command -v pm2 &> /dev/null; then
    echo "⚠️ PM2未安装，正在安装..."
    npm install -g pm2
fi

echo "✅ PM2检查通过"

# 模拟部署流程
echo "🚀 模拟部署流程..."

# 1. 安装依赖
echo "1. 安装依赖..."
npm ci

# 2. 构建项目
echo "2. 构建项目..."
npm run build

# 3. 测试PM2配置
echo "3. 测试PM2配置..."
pm2 start ecosystem.config.js --env production

# 4. 检查应用状态
echo "4. 检查应用状态..."
pm2 status

# 5. 显示日志
echo "5. 显示应用日志..."
pm2 logs frontend-huhu --lines 5

# 6. 停止测试应用
echo "6. 停止测试应用..."
pm2 stop frontend-huhu
pm2 delete frontend-huhu

echo "✅ 部署测试完成！"
echo "📋 如果所有步骤都成功，说明部署配置正确" 
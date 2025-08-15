#!/bin/bash

# 服务器环境准备脚本
# 在服务器上运行此脚本来准备部署环境

echo "🚀 开始准备服务器环境..."

# 检查是否为root用户
if [ "$EUID" -eq 0 ]; then
    echo "❌ 请不要使用root用户运行此脚本"
    exit 1
fi

# 更新系统包
echo "📦 更新系统包..."
sudo apt-get update

# 安装Node.js和npm
echo "📦 安装Node.js..."
if ! command -v node &> /dev/null; then
    curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
    sudo apt-get install -y nodejs
else
    echo "✅ Node.js已安装: $(node --version)"
fi

# 安装PM2
echo "📦 安装PM2..."
if ! command -v pm2 &> /dev/null; then
    sudo npm install -g pm2
else
    echo "✅ PM2已安装: $(pm2 --version)"
fi

# 安装Git
echo "📦 安装Git..."
if ! command -v git &> /dev/null; then
    sudo apt-get install -y git
else
    echo "✅ Git已安装: $(git --version)"
fi

# 创建部署目录
echo "📁 创建部署目录..."
DEPLOY_PATH="/home/$(whoami)/deploy"
mkdir -p $DEPLOY_PATH
cd $DEPLOY_PATH

# 创建日志目录
mkdir -p logs

# 设置PM2开机自启
echo "🔧 设置PM2开机自启..."
pm2 startup
echo "请运行上面显示的命令来设置PM2开机自启"

echo "✅ 服务器环境准备完成！"
echo "📁 部署目录: $DEPLOY_PATH"
echo "📋 下一步: 配置GitHub Actions部署" 
#!/bin/bash

# 服务器配置
SERVER_USER="root"
SERVER_HOST="118.31.175.234"
SERVER_PASS="Fgd0272550102!"
REPO_URL="https://gitee.com/wzqwzq1012/star_graph"
APP_PATH="/root/star_graph"

# 颜色输出函数
print_green() {
    echo -e "\033[32m$1\033[0m"
}

print_red() {
    echo -e "\033[31m$1\033[0m"
}

# 在服务器上执行部署
print_green "开始部署..."
ssh -o StrictHostKeyChecking=no $SERVER_USER@$SERVER_HOST << ENDSSH
    cd /root

    # 如果目录已存在，删除它
    if [ -d "$APP_PATH" ]; then
        echo "删除已存在的目录..."
        rm -rf "$APP_PATH"
    fi

    # 克隆仓库
    echo "克隆代码仓库..."
    git clone $REPO_URL
    
    if [ $? -ne 0 ]; then
        echo "克隆仓库失败！"
        exit 1
    fi

    # 进入项目目录
    cd star_graph

    # 安装依赖
    echo "安装依赖..."
    npm install

    if [ $? -ne 0 ]; then
        echo "安装依赖失败！"
        exit 1
    fi

    # 构建项目
    echo "构建项目..."
    npm run build

    if [ $? -ne 0 ]; then
        echo "构建项目失败！"
        exit 1
    fi

    # 尝试删除旧的PM2实例（忽略错误）
    echo "尝试删除旧的PM2实例..."
    pm2 delete next-app 2>/dev/null || true

    # 启动新的PM2实例
    echo "启动新的PM2实例..."
    pm2 start ecosystem.config.js

    # 保存PM2配置
    echo "保存PM2配置..."
    pm2 save

    echo "部署完成！"
ENDSSH

print_green "部署脚本执行完成！"
#!/bin/bash

# 快速 Docker 部署脚本
# 一键清理、重建、运行

CONTAINER_NAME="frontend-huhu"
IMAGE_NAME="frontend-huhu"
PORT="3000"

echo "�� 开始 Docker 部署..."

# 停止并删除容器
echo "�� 停止并删除容器..."
docker stop $CONTAINER_NAME 2>/dev/null || true
docker rm $CONTAINER_NAME 2>/dev/null || true

# 删除镜像
echo "��️  删除旧镜像..."
docker rmi $IMAGE_NAME:latest 2>/dev/null || true
docker image prune -f

# 构建新镜像
echo "🔨 构建新镜像..."
docker build -t $IMAGE_NAME:latest .

# 后台运行
echo "🚀 启动容器..."
docker run -d \
    --name $CONTAINER_NAME \
    --restart unless-stopped \
    -p $PORT:3000 \
    -e NODE_ENV=production \
    $IMAGE_NAME:latest

echo "✅ 部署完成！"
echo "🌐 访问地址: http://localhost:$PORT"
echo "📊 容器状态:"
docker ps --filter "name=$CONTAINER_NAME"

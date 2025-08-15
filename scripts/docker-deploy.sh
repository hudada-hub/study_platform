#!/bin/bash

# Docker 部署脚本
# 流程：停止容器 -> 删除容器 -> 删除镜像 -> 重新构建 -> 后台运行

# 配置变量
CONTAINER_NAME="frontend-huhu"
IMAGE_NAME="frontend-huhu"
IMAGE_TAG="latest"
PORT="3000"

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 日志函数
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 检查 Docker 是否运行
check_docker() {
    log_info "检查 Docker 环境..."
    
    if ! docker info >/dev/null 2>&1; then
        log_error "Docker 未运行或未安装"
        exit 1
    fi
    
    log_success "Docker 环境检查通过"
}

# 停止并删除容器
stop_and_remove_container() {
    log_info "停止并删除容器..."
    
    # 检查容器是否存在
    if docker ps -a --format "table {{.Names}}" | grep -q "^${CONTAINER_NAME}$"; then
        log_info "停止容器: ${CONTAINER_NAME}"
        docker stop "${CONTAINER_NAME}" 2>/dev/null || true
        
        log_info "删除容器: ${CONTAINER_NAME}"
        docker rm "${CONTAINER_NAME}" 2>/dev/null || true
        
        log_success "容器删除完成"
    else
        log_warning "容器 ${CONTAINER_NAME} 不存在，跳过删除"
    fi
}

# 删除镜像
remove_image() {
    log_info "删除旧镜像..."
    
    # 检查镜像是否存在
    if docker images --format "table {{.Repository}}:{{.Tag}}" | grep -q "^${IMAGE_NAME}:${IMAGE_TAG}$"; then
        log_info "删除镜像: ${IMAGE_NAME}:${IMAGE_TAG}"
        docker rmi "${IMAGE_NAME}:${IMAGE_TAG}" 2>/dev/null || true
        
        log_success "镜像删除完成"
    else
        log_warning "镜像 ${IMAGE_NAME}:${IMAGE_TAG} 不存在，跳过删除"
    fi
    
    # 清理悬空镜像
    log_info "清理悬空镜像..."
    docker image prune -f
}

# 构建新镜像
build_image() {
    log_info "开始构建新镜像..."
    
    # 检查 Dockerfile 是否存在
    if [ ! -f "Dockerfile" ]; then
        log_error "Dockerfile 不存在"
        exit 1
    fi
    
    log_info "构建镜像: ${IMAGE_NAME}:${IMAGE_TAG}"
    docker build -t "${IMAGE_NAME}:${IMAGE_TAG}" .
    
    if [ $? -eq 0 ]; then
        log_success "镜像构建完成"
    else
        log_error "镜像构建失败"
        exit 1
    fi
}

# 后台运行容器
run_container() {
    log_info "启动容器..."
    
    # 检查端口是否被占用
    if lsof -Pi :${PORT} -sTCP:LISTEN -t >/dev/null 2>&1; then
        log_warning "端口 ${PORT} 已被占用，请检查是否有其他服务运行"
    fi
    
    log_info "启动容器: ${CONTAINER_NAME}"
    docker run -d \
        --name "${CONTAINER_NAME}" \
        --restart unless-stopped \
        -p "${PORT}:3000" \
        -e NODE_ENV=production \
        "${IMAGE_NAME}:${IMAGE_TAG}"
    
    if [ $? -eq 0 ]; then
        log_success "容器启动成功"
        log_info "容器信息:"
        docker ps --filter "name=${CONTAINER_NAME}" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
    else
        log_error "容器启动失败"
        exit 1
    fi
}

# 显示容器状态
show_status() {
    log_info "容器状态:"
    docker ps -a --filter "name=${CONTAINER_NAME}" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}\t{{.Image}}"
    
    log_info "镜像信息:"
    docker images "${IMAGE_NAME}:${IMAGE_TAG}" --format "table {{.Repository}}\t{{.Tag}}\t{{.Size}}\t{{.CreatedAt}}"
}

# 主函数
main() {
    log_info "开始 Docker 部署流程..."
    
    # 检查 Docker 环境
    check_docker
    
    # 停止并删除容器
    stop_and_remove_container
    
    # 删除镜像
    remove_image
    
    # 构建新镜像
    build_image
    
    # 后台运行容器
    run_container
    
    # 显示状态
    show_status
    
    log_success "Docker 部署完成！"
    log_info "应用访问地址: http://localhost:${PORT}"
}

# 错误处理
trap 'log_error "脚本执行失败，退出码: $?"' ERR

# 执行主函数
main "$@"

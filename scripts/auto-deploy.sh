#!/bin/bash

# 自动部署脚本
# 流程：连接服务器 -> 打包传输 -> 删除旧文件 -> 解压 -> npm install -> npm run build -> PM2部署

# 配置变量
SERVER_HOST="8.138.207.23"
SERVER_USER="root"
SERVER_PATH="/root/frontend-huhu/deploy"
PROJECT_NAME="frontend-huhu"
BACKUP_NAME="${PROJECT_NAME}-backup-$(date +%Y%m%d-%H%M%S)"

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

# 检查必要工具
check_requirements() {
    log_info "检查部署环境..."
    
    # 检查tar命令
    if ! command -v tar &> /dev/null; then
        log_error "tar命令未找到"
        exit 1
    fi
    
    # 检查scp命令
    if ! command -v scp &> /dev/null; then
        log_error "scp命令未找到"
        exit 1
    fi
    
    # 检查ssh命令
    if ! command -v ssh &> /dev/null; then
        log_error "ssh命令未找到"
        exit 1
    fi
    
    log_success "环境检查通过"
}

# 打包项目
package_project() {
    log_info "开始打包项目..."
    
    # 创建临时目录
    TEMP_DIR=$(mktemp -d)
    PACKAGE_NAME="${PROJECT_NAME}-$(date +%Y%m%d-%H%M%S).tar.gz"
    
    # 复制项目文件到临时目录
    log_info "复制项目文件..."
    cp -r . "$TEMP_DIR/$PROJECT_NAME"
    
    # 删除不需要的文件
    cd "$TEMP_DIR/$PROJECT_NAME"
    rm -rf node_modules .next .git .github/workflows .husky
    
    # 打包
    cd "$TEMP_DIR"
    tar -czf "$PACKAGE_NAME" "$PROJECT_NAME"
    
    # 移动打包文件到当前目录
    mv "$PACKAGE_NAME" "$OLDPWD/"
    
    # 清理临时目录
    rm -rf "$TEMP_DIR"
    
    log_success "项目打包完成: $PACKAGE_NAME"
}

# 连接服务器并执行部署
deploy_to_server() {
    log_info "开始连接服务器..."
    
    # 测试SSH连接
    if ! ssh -o ConnectTimeout=10 "$SERVER_USER@$SERVER_HOST" "echo 'SSH连接测试成功'" 2>/dev/null; then
        log_error "无法连接到服务器 $SERVER_HOST"
        exit 1
    fi
    
    log_success "SSH连接成功"
    
    # 在服务器上执行部署命令
    log_info "开始服务器端部署..."
    
    ssh "$SERVER_USER@$SERVER_HOST" << 'EOF'
        # 设置变量
        SERVER_PATH="/root/frontend-huhu/deploy"
        PROJECT_NAME="frontend-huhu"
        BACKUP_NAME="${PROJECT_NAME}-backup-$(date +%Y%m%d-%H%M%S)"
        PACKAGE_NAME="frontend-huhu-$(date +%Y%m%d-%H%M%S).tar.gz"
        
        echo "=== 开始部署流程 ==="
        
        # 1. 创建部署目录
        echo "1. 创建部署目录..."
        mkdir -p "$SERVER_PATH"
        cd "$SERVER_PATH"
        
        # 2. 停止现有应用
        echo "2. 停止现有应用..."
        pm2 stop "$PROJECT_NAME" 2>/dev/null || echo "应用未运行"
        
        # 3. 备份现有代码
        echo "3. 备份现有代码..."
        if [ -d "$PROJECT_NAME" ]; then
            mv "$PROJECT_NAME" "$BACKUP_NAME"
            echo "已备份到: $BACKUP_NAME"
        else
            echo "没有现有代码需要备份"
        fi
        
        # 4. 删除旧备份（保留最近3个）
        echo "4. 清理旧备份..."
        ls -dt ${PROJECT_NAME}-backup-* | tail -n +4 | xargs -r rm -rf
        
        echo "=== 部署流程完成 ==="
EOF
    
    # 传输打包文件
    log_info "传输项目文件到服务器..."
    if scp "$PACKAGE_NAME" "$SERVER_USER@$SERVER_HOST:$SERVER_PATH/"; then
        log_success "文件传输成功"
    else
        log_error "文件传输失败"
        exit 1
    fi
    
    # 在服务器上解压和部署
    log_info "在服务器上解压和部署..."
    ssh "$SERVER_USER@$SERVER_HOST" << 'EOF'
        cd "$SERVER_PATH"
        
        # 5. 解压项目文件
        echo "5. 解压项目文件..."
        tar -xzf "$PACKAGE_NAME"
        rm -f "$PACKAGE_NAME"  # 删除压缩包
        
        # 6. 进入项目目录
        cd "$PROJECT_NAME"
        
        # 7. 安装依赖
        echo "6. 安装依赖..."
        npm ci --production=false
        
        # 8. 构建项目
        echo "7. 构建项目..."
        npm run build
        
        # 9. 启动PM2应用
        echo "8. 启动PM2应用..."
        cd ..
        pm2 start ecosystem.config.js --env production
        
        # 10. 保存PM2配置
        echo "9. 保存PM2配置..."
        pm2 save
        
        # 11. 显示部署结果
        echo "10. 显示部署结果..."
        pm2 status
        pm2 logs "$PROJECT_NAME" --lines 10
        
        echo "=== 部署完成 ==="
EOF
    
    # 清理本地打包文件
    rm -f "$PACKAGE_NAME"
    
    log_success "自动部署完成！"
}

# 回滚功能
rollback() {
    log_warning "开始回滚操作..."
    
    ssh "$SERVER_USER@$SERVER_HOST" << 'EOF'
        cd "$SERVER_PATH"
        
        # 停止当前应用
        pm2 stop "$PROJECT_NAME"
        
        # 查找最新的备份
        LATEST_BACKUP=$(ls -dt ${PROJECT_NAME}-backup-* | head -n 1)
        
        if [ -n "$LATEST_BACKUP" ]; then
            echo "回滚到: $LATEST_BACKUP"
            
            # 删除当前代码
            rm -rf "$PROJECT_NAME"
            
            # 恢复备份
            mv "$LATEST_BACKUP" "$PROJECT_NAME"
            
            # 重新启动应用
            cd "$PROJECT_NAME"
            npm ci --production=false
            npm run build
            cd ..
            pm2 start ecosystem.config.js --env production
            pm2 save
            
            echo "回滚完成"
        else
            echo "没有找到可用的备份"
        fi
EOF
}

# 显示帮助信息
show_help() {
    echo "自动部署脚本"
    echo ""
    echo "用法: $0 [选项]"
    echo ""
    echo "选项:"
    echo "  deploy    执行部署（默认）"
    echo "  rollback  回滚到上一个版本"
    echo "  help      显示此帮助信息"
    echo ""
    echo "配置:"
    echo "  请编辑脚本开头的配置变量："
    echo "  - SERVER_HOST: 服务器地址"
    echo "  - SERVER_USER: 服务器用户名"
    echo "  - SERVER_PATH: 服务器部署路径"
    echo "  - PROJECT_NAME: 项目名称"
}

# 主函数
main() {
    case "${1:-deploy}" in
        "deploy")
            check_requirements
            package_project
            deploy_to_server
            ;;
        "rollback")
            rollback
            ;;
        "help"|"-h"|"--help")
            show_help
            ;;
        *)
            log_error "未知选项: $1"
            show_help
            exit 1
            ;;
    esac
}

# 执行主函数
main "$@" 
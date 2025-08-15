#!/bin/bash

# 部署配置文件
# 请根据你的服务器信息修改以下配置

# 服务器配置
export SERVER_HOST="your-server-host"        # 服务器IP地址或域名
export SERVER_USER="your-server-user"        # 服务器用户名
export SERVER_PATH="/home/your-server-user/deploy"  # 服务器部署路径

# 项目配置
export PROJECT_NAME="frontend-huhu"          # 项目名称

# SSH配置
export SSH_PORT="22"                         # SSH端口（默认22）
export SSH_KEY_PATH="~/.ssh/id_rsa"         # SSH私钥路径

# 部署配置
export NODE_ENV="production"                 # 环境变量
export PM2_INSTANCES="1"                     # PM2实例数量
export PM2_MAX_MEMORY="1G"                   # PM2最大内存限制

# 备份配置
export BACKUP_COUNT="3"                      # 保留的备份数量

# 示例配置（请根据实际情况修改）：
# export SERVER_HOST="192.168.1.100"
# export SERVER_USER="ubuntu"
# export SERVER_PATH="/home/ubuntu/deploy" 
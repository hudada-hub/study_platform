# 构建阶段
FROM node:20-alpine

WORKDIR /app

# 复制项目文件
COPY . .

# 安装依赖并构建
RUN npm install && npm run build

# 暴露端口
EXPOSE 3000

# 启动应用
CMD ["npm", "start"]
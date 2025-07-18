#!/bin/bash

# 确保在脚本中使用的分支名称
BRANCH_NAME="dev/wangzhiqiang"

# 检查当前分支
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)

# 提交更改
git add .
git commit -m "自动提交到 $BRANCH_NAME"

# 推送到第二个远程仓库
git push origin2 $CURRENT_BRANCH:$BRANCH_NAME

# 输出推送结果
if [ $? -eq 0 ]; then
  echo "成功推送到 origin2 的 $BRANCH_NAME 分支"
else
  echo "推送失败"
fi
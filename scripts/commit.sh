#!/bin/bash

# Git提交脚本
# 使用方法: ./scripts/commit.sh "提交信息"

# 检查是否提供了提交信息
if [ $# -eq 0 ]; then
    echo "❌ 错误: 请提供提交信息"
    echo "使用方法: ./scripts/commit.sh \"提交信息\""
    echo "示例: ./scripts/commit.sh \"feat: 添加新功能\""
    exit 1
fi

# 获取提交信息
COMMIT_MESSAGE="$1"

echo "🚀 开始Git提交流程..."

# 检查是否有未暂存的文件
if [ -z "$(git status --porcelain)" ]; then
    echo "📝 没有需要提交的文件"
    exit 0
fi

echo "📁 添加所有文件到暂存区..."
git add .

echo "🔍 显示暂存的文件..."
git status --short

echo "💾 提交代码..."
echo "提交信息: $COMMIT_MESSAGE"

# 执行提交
if git commit -m "$COMMIT_MESSAGE"; then
    echo "✅ 提交成功!"
    
    # 获取当前分支名
    CURRENT_BRANCH=$(git branch --show-current)
    echo "🌿 当前分支: $CURRENT_BRANCH"
    
    # 推送到远程仓库
    echo "🚀 推送到远程仓库..."
    if git push origin "$CURRENT_BRANCH"; then
        echo "✅ 推送成功!"
    else
        echo "⚠️ 推送失败，可能需要手动推送:"
        echo "git push origin $CURRENT_BRANCH"
        echo "或者如果是新分支，可能需要设置上游分支:"
        echo "git push -u origin $CURRENT_BRANCH"
    fi
    
    echo "📊 最近提交记录:"
    git log --oneline -3
else
    echo "❌ 提交失败，请检查错误信息"
    exit 1
fi 
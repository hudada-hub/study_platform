#!/usr/bin/env node

import { execSync } from 'child_process';
import fs from 'fs';

// 获取提交信息
const commitMessage = process.argv[2];

if (!commitMessage) {
  console.log('❌ 错误: 请提供提交信息');
  console.log('使用方法: node scripts/quick-commit.js "提交信息"');
  console.log('示例: node scripts/quick-commit.js "feat: 添加新功能"');
  process.exit(1);
}

try {
  console.log('🚀 开始Git提交流程...');

  // 检查是否有未暂存的文件
  const status = execSync('git status --porcelain', { encoding: 'utf8' });
  if (!status.trim()) {
    console.log('📝 没有需要提交的文件');
    process.exit(0);
  }

  console.log('📁 添加所有文件到暂存区...');
  execSync('git add .', { stdio: 'inherit' });

  console.log('🔍 显示暂存的文件...');
  execSync('git status --short', { stdio: 'inherit' });

  console.log('💾 提交代码...');
  console.log(`提交信息: ${commitMessage}`);

  execSync(`git commit -m "${commitMessage}"`, { stdio: 'inherit' });

  console.log('✅ 提交成功!');

  // 获取当前分支名
  const currentBranch = execSync('git branch --show-current', {
    encoding: 'utf8',
  }).trim();
  console.log(`🌿 当前分支: ${currentBranch}`);

  // 推送到远程仓库
  console.log('🚀 推送到远程仓库...');
  try {
    execSync(`git push origin ${currentBranch}`, { stdio: 'inherit' });
    console.log('✅ 推送成功!');
  } catch (pushError) {
    console.log('⚠️ 推送失败，可能需要手动推送:');
    console.log(`git push origin ${currentBranch}`);
    console.log('或者如果是新分支，可能需要设置上游分支:');
    console.log(`git push -u origin ${currentBranch}`);
  }

  console.log('📊 最近提交记录:');
  execSync('git log --oneline -3', { stdio: 'inherit' });
} catch (error) {
  console.error('❌ 提交失败:', error.message);
  process.exit(1);
}

import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { ResponseUtil } from '@/utils/response';
import { verifyAuth, hashPassword, verifyPassword } from '@/utils/auth';

/**
 * 修改用户密码
 * POST /api/user/change-password
 * 请求体: { currentPassword: string, newPassword: string }
 */
export async function POST(req: NextRequest) {
  try {
    // 验证用户身份
    const authResult = await verifyAuth(req);
    if (!authResult?.user) {
      return ResponseUtil.unauthorized('未登录或登录已过期');
    }

    // 解析请求体
    const { currentPassword, newPassword } = await req.json();

    // 验证请求参数
    if (!currentPassword || !newPassword) {
      return ResponseUtil.error('当前密码和新密码不能为空');
    }

    // 验证新密码长度
    if (newPassword.length < 3 || newPassword.length > 20) {
      return ResponseUtil.error('新密码长度应在3-20个字符之间');
    }

    const user = authResult.user;

    // 验证当前密码是否正确
    const isPasswordValid = await verifyPassword(currentPassword, user.password);
    if (!isPasswordValid) {
      return ResponseUtil.error('当前密码不正确');
    }

    // 如果新密码与当前密码相同，无需更新
    if (currentPassword === newPassword) {
      return ResponseUtil.error('新密码不能与当前密码相同');
    }

    // 对新密码进行加密
    const hashedPassword = await hashPassword(newPassword);

    // 更新用户密码
    await prisma.user.update({
      where: { id: user.id },
      data: { 
        password: hashedPassword,
        updatedAt: new Date()
      }
    });

    return ResponseUtil.success(null, '密码修改成功');
  } catch (error) {
    console.error('修改密码失败:', error);
    return ResponseUtil.serverError('修改密码失败，请稍后重试');
  }
} 
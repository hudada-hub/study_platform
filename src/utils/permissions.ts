import { User } from '@prisma/client';
import { ClientUser } from './client-auth';

// 检查用户是否为超级管理员
export function isSuperAdmin(user: ClientUser | null): boolean {
  return user?.role === 'SUPER_ADMIN';
}

// 检查用户是否为管理员
export function isAdmin(user: ClientUser | null): boolean {
  return user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN';
}

// 检查用户是否为版主
export function isModerator(user: ClientUser | null, sectionModeratorId?: number): boolean {
  if (!user) return false;
  return user.role === 'SUPER_ADMIN' || user.role === 'ADMIN' || user.id === sectionModeratorId;
}

// 检查用户是否有帖子管理权限
export function canManagePost(user: ClientUser | null, sectionModeratorId?: number): boolean {
  return isSuperAdmin(user) || isModerator(user, sectionModeratorId);
}

// 检查用户是否有内容审核权限
export function canModerateContent(user: ClientUser| null, sectionModeratorId?: number): boolean {
  return isSuperAdmin(user) || isModerator(user, sectionModeratorId);
} 
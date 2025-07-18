import { getServerSession as getNextAuthServerSession } from 'next-auth';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import prisma from './prisma';

// 从cookie中获取token
const getToken = () => {
  const cookieStore = cookies();
  return cookieStore.get('token')?.value;
};

// 验证token并获取用户信息
const verifyToken = async (token: string) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || '') as { id: number };
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        username: true,
        email: true,
        points: true,
      },
    });
    return user;
  } catch (error) {
    return null;
  }
};

// 获取服务端session
export const getServerSession = async () => {
  const token = getToken();
  if (!token) return null;

  const user = await verifyToken(token);
  if (!user) return null;

  return {
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      points: user.points,
    },
  };
}; 
import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';
import prisma from '@/lib/prisma';
import { User } from '@prisma/client';
import * as argon2 from 'argon2';
import { jwtVerify } from 'jose';

interface AuthResult {
  user: User | null;
}

// 从请求中验证用户身份并返回用户信息
export async function verifyAuth(req: NextRequest): Promise<AuthResult> {
  try {
 
    // 从cookie中获取token
    let token = req.cookies.get('token')?.value || req.headers.get('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return { user: null };
    }

    jwt.verify(token, process.env.JWT_SECRET!,(err,data)=>{
      console.log(err,data,'err,data')
    })    
    const decoded :{
      id: number;
      username: string;
      email: string;
      avatar: string;
      role: string;
      status: string;
      createdAt: string;
    } = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: number;
      username: string;
      email: string;
      avatar: string;
      role: string;
      status: string;
      createdAt: string;
    };
  
    // 获取用户信息
    const user = await prisma.user.findUnique({
      where: { id: decoded.id }
    });
    
    return { user: user || null };
  } catch (error) {
    console.log(error);
    return { user: null };
  }
}

export async function hashPassword(password: string): Promise<string> {
  return await argon2.hash(password);
}



export async function verifyPassword(
  candidatePassword: string,
  hashedPassword: string
): Promise<boolean> {
  return await argon2.verify(hashedPassword, candidatePassword);
}
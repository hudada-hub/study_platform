import { ConfigType as PrismaConfigType } from '@prisma/client';

// 使用 Prisma 生成的 ConfigType
export type ConfigType = PrismaConfigType;

// 基础配置值类型
export interface ConfigValue {
  key: string;
  title: string;
  titleEn?: string;
  type: ConfigType;
  value: TextValue | ImageValue | MultiImageValue[] | MultiTextValue[] | MultiContentValue[] | null;
}

// 文本类型值
export interface TextValue {
  id: number;
  configId: number;
  value: string;
  valueEn?: string;
  updatedAt: Date;
}

// 图片类型值
export interface ImageValue {
  id: number;
  configId: number;
  url: string;
  link?: string;
  alt?: string;
  updatedAt: Date;
}

// 多图片类型值
export interface MultiImageValue {
  id: number;
  configId?: number;
  imageUrl?: string;
  link?: string;
  title?: string;
  sort: number;
  updatedAt: Date;
}

// 多文本类型值
export interface MultiTextValue {
  id: number;
  configId: number;
  title: string;
  titleEn?: string;
  content: string;
  contentEn?: string;
  link?: string;
  sort: number;
  updatedAt: Date;
}

// 多文本图片混合类型值
export interface MultiContentValue {
  id: number;
  configId: number;
  title: string;
  titleEn?: string;
  content: string;
  contentEn?: string;
  imageUrl?: string;
  link?: string;
  alt?: string;
  sort: number;
  updatedAt: Date;
} 
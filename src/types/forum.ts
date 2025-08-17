import { PostStatus } from '@prisma/client';

// 论坛用户类型定义
export interface ForumUser {
  id: number;
  nickname: string;
  avatar?: string;
  email?: string;
  postCount?: number;
  commentCount?: number;
  viewCount?: number;
  createdAt?: string;
}

// 论坛分类类型定义
export interface ForumCategory {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
  sections: ForumSection[];
}

// 论坛板块类型定义
export interface ForumSection {
  id: number;
  name: string;
  description: string;
  coverUrl?: string;
  categoryId: number;
  category: {
    id: number;
    name: string;
  };
  moderatorId: number;
  moderator: ForumUser;
  createdAt: string;
  lastPostAt: string;
  postCount: number;
  sort: number;
  parentId?: number;
  parent?: {
    id: number;
    name: string;
  };
  children: {
    id: number;
    name: string;
  }[];
  announcement?: string;
  favoriteCount: number;
  updatedAt: string;
}

// 论坛帖子类型定义
export interface ForumPost {
  id: number;
  title: string;
  content: string;
  authorId: number;
  author: ForumUser;
  sectionId: number;
  section: ForumSection;
  viewCount: number;
  commentCount: number;
  likeCount: number;
  isSticky: boolean;
  isTop: boolean;
  isEssence: boolean;
  isHot: boolean;
  status: PostStatus;
  isFavorited?: boolean; // 当前用户是否已收藏
  createdAt: string;
  updatedAt: string;
  imageUrl?: string;
}

// 论坛评论类型定义
export interface ForumComment {
  id: number;
  content: string;
  authorId: number;
  author: ForumUser;
  postId: number;
  post: ForumPost;
  parentId?: number;
  parent?: ForumComment;
  replies?: ForumComment[]; // 二级回复列表
  likeCount: number;
  dislikeCount: number;
  isLiked?: boolean;
  isDisliked?: boolean;
  createdAt: string;
  updatedAt: string;
} 
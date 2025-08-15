// API响应类型定义

export interface ApiResponse<T = any> {
  code: number;
  message: string;
  data: T;
}

export interface PaginatedResponse<T> {
  items?: T[];
  list: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages?: number;
}

// 课程相关类型
export interface Course {
  id: number;
  title: string;
  coverUrl: string;
  summary: string;
  instructor: string;
  viewCount: number;
  studentCount: number;
  level: string;
  category: {
    id: number;
    name: string;
  };
  direction: {
    id: number;
    name: string;
  };
  createdAt: string;
}

// 论坛帖子相关类型
export interface ForumPost {
  id: number;
  title: string;
  content: string;
  viewCount: number;
  commentCount: number;
  likeCount: number;
  createdAt: string;
  author: {
    id: number;
    nickname: string;
    avatar: string;
  };
  section: {
    id: number;
    name: string;
  };
  isTop: boolean;
  isEssence: boolean;
  isHot: boolean;
}

// 任务相关类型
export interface Task {
  id: number;
  title: string;
  content: string;
  points: number;
  viewCount: number;
  applicationCount: number;
  createdAt: string;
  status: string;
  category: {
    id: number;
    name: string;
  };
  author: {
    id: number;
    nickname: string;
    avatar: string;
  };
}

// 游戏相关类型
export interface Game {
  id: number;
  title: string;
  description: string;
  coverUrl: string;
  downloadCount: number;
  rating: number;
  category: string;
  size: string;
  isNew: boolean;
  isHot: boolean;
} 
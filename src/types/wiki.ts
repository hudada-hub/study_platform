// Wiki状态枚举
export enum WikiStatus {
  PENDING = 'pending',
  ACTIVE = 'active',
  REJECTED = 'rejected',
  DRAFT = 'draft',
  PUBLISHED = 'published'
}

// Wiki列表项类型
export type WikiListItem = {
  id: number;
  name: string;
  subdomain: string;
  title: string;
  description: string;
  status: 'pending' | 'rejected' | 'draft' | 'published';
  pageCount: number;
  contributorCount: number;
  viewCount: number;
  creatorId: number;
  createdAt: Date;
  approvedAt: Date | null;
  approvedById: number | null;
}

// Wiki详情类型
export type WikiDetail = {
  id: number;
  name: string;
  subdomain: string;
  title: string;
  description: string;
  keywords?: string;
  metaDescription?: string;
  backgroundImage?: string;
  logo?: string;
  primaryColor: string;
  allowComments?: boolean;
  enableSearch?: boolean;
  status: 'pending' | 'rejected' | 'draft' | 'published';
  pageCount: number;
  contributorCount: number;
  viewCount: number;
  creatorId: number;
  createdAt: Date;
  approvedAt: Date | null;
  approvedById: number | null;
  tags: string[];
  customDomain?: string;
  contactInfo?: string;
  applyReason?: string;
  license: string;
}

// 创建Wiki请求类型
export type CreateWikiRequest = {
  name: string;
  subdomain: string;
  title: string;
  description: string;
  keywords?: string;
  metaDescription?: string;
  backgroundImage?: string;
  logo?: string;
  primaryColor?: string;
  allowComments?: boolean;
  enableSearch?: boolean;
  tags?: string[];
  customDomain?: string;
  contactInfo?: string;
  applyReason?: string;
  license?: string;
}

// 更新Wiki请求类型
export type UpdateWikiRequest = {
  title?: string;
  description?: string;
  keywords?: string;
  metaDescription?: string;
  backgroundImage?: string;
  logo?: string;
  primaryColor?: string;
  allowComments?: boolean;
  enableSearch?: boolean;
  status?: WikiStatus;
  tags?: string[];
  customDomain?: string;
  contactInfo?: string;
  license?: string;
}

export interface Wiki {
  id: number;
  name: string;
  title: string;
  description: string;
  logo: string | null;
  status: WikiStatus;
  createdAt: Date;
  updatedAt: Date;
  slogan: string | null;
  hot: number;
  textColor: string;
  keywords: string | null;
  menuBgImage: string | null;
} 
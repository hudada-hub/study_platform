import { DetailComponentType } from '@/app/[wikiName]/[moduleName]/[detailName]/detailComponents/types';
import { User, Wiki } from '@prisma/client';

// 首页组件类型定义
export type IndexComponentType = 'carousel' | 'announcement' | 'characterList';

// 组件类型定义
export type ComponentType = IndexComponentType | DetailComponentType;

// 组件基本属性
export interface BaseComponentProps {
  id: string;
  type: ComponentType;
}

// 组件列表项类型
export interface ComponentListItem {
  type: ComponentType;
  name: string;
  description: string;
  icon?: string;
}

// 编辑区域组件类型
export interface EditableComponent {
  id: string;
  type: ComponentType;
  props: Record<string, any>;
  name: string;
  order: number;
  isEnabled: boolean;
  wikiId: number;
  wikiTemplateId?: number;
  moduleNameUuid?: string;
}

// 页面类型
export type PageType = 'INDEX' | 'MODULE' | 'DETAIL';

// Wiki响应数据类型
export interface WikiResponse {
  id: number;
  creatorId: number;
  templateId?: number;
  components?: EditableComponent[];
  wikiId:number;
  editor:User;
  status: 'DRAFT' | 'PUBLISHED' | 'PENDING' | 'REJECTED';
  viewCount:number;
  lastSaved:string;
  moduleName:string;
  detailName:string;
  likeCount:number;
  isLiked:boolean;
  type: 'INDEX' | 'MODULE' | 'DETAIL';
}

// API响应类型
export interface ApiResponse<T = any> {
  code: number;
  message: string;
  data: T;
}

// Wiki类型扩展
export interface WikiExtended extends Wiki {
  templateId?: number;
}

// 默认属性记录类型
export type DefaultPropsMap = Record<ComponentType, Record<string, any>>;

// 页面类型映射
export const PAGE_TYPE_MAP = {
  INDEX: 'index',
  MODULE: 'module',
  DETAIL: 'detail'
} as const; 

export interface EditAreaProps {
  wiki: Wiki | null;
  components: EditableComponent[];
  selectedComponent: string | null;
  onSelectComponent: (id: string | null) => void;
  onUpdateComponents: (components: EditableComponent[]) => void;
  isPreviewMode?: boolean;
  type: 'INDEX' | 'MODULE' | 'DETAIL';
  onEditComponent?: (id:string) => void;
  onApproveComponent?: (components: HistoryResponse) => void;
  pageInfo?:WikiResponse;
  isNotTemplate?:boolean;
}

export interface HistoryResponse {
  history: {
    id: number;
    componentId: number;
    wikiId: number;
    editorId: number;
    editType: 'CREATE' | 'UPDATE' | 'DELETE';
    status: 'PENDING' | 'REJECTED' | 'ACCEPTED';
    props: any;
    updateTime: string;
    moduleName: string | null;
    detailName: string | null;
  };
  component: {
    id: number;
    type: string;
    wikiTemplateId: number;
    name: string;
    props: any;
    order: number;
    isEnabled: boolean;
    wikiId: number;
    editorId: number;
    createdAt: string;
    updatedAt: string;
    status: 'CREATE' | 'DRAFT';
  };
}

// 目录项的类型定义
export interface MenuItem {
  id: string;
  name: string;
  level: number;
  children?: MenuItem[];
  isActive?: boolean;
}

// 目录组件的props类型
export interface MenuProps {
  menuData: MenuItem[];
  onSelect?: (id: string) => void;
  activeId?: string;
}
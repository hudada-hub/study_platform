export interface Category {
  id: number;
  name: string;
  isEnabled: boolean;
  children: {
    id: number;
    name: string;
    isEnabled: boolean;
  }[];
} 
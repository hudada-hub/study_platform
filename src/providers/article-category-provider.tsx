'use client';

import React, { createContext, useContext } from 'react';
import { Category } from '@/types/article';

interface CategoryContextType {
  categories: Category[];
}

const CategoryContext = createContext<CategoryContextType>({
  categories: [],
});

export const useArticleCategory = () => useContext(CategoryContext);

interface CategoryProviderProps {
  children: React.ReactNode;
  categories: Category[];
}

export function ArticleCategoryProvider({ children, categories }: CategoryProviderProps) {
  return (
    <CategoryContext.Provider value={{ categories }}>
      {children}
    </CategoryContext.Provider>
  );
} 
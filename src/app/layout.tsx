import "./globals.css";
import { getConfigs } from '@/services/config';
import { ConfigProvider as AppConfigProvider } from '../providers/config-provider';
import { ConfigProvider } from 'antd';

import { ArticleCategoryProvider } from '../providers/article-category-provider';
import prisma from '@/lib/prisma';
import { ThemeProvider, useTheme } from '@/providers/theme-provider';

import FrontLayout from './components/FrontLayout';
import { ConfigValue } from '@/types/config';
import {defaultTheme} from '@/theme/theme.config'
import zhCN from 'antd/locale/zh_CN';
// 生成元数据
export const generateMetadata = async ({ params }: { params: Promise<{ wikiName: string }> }) => {
 
  
  return {
    title: "CTF论坛-你的专属CTF论坛",
    description: "CTF论坛-你的专属CTF论坛",
    keywords: "CTF论坛,CTF,论坛",
   
  };
};


// 获取静态配置数据
async function getStaticConfig() {
  const configs = await getConfigs();
  return { configs };
}

// 获取静态分类数据
async function getStaticCategories() {
  const categories = await prisma.articleCategory.findMany({
    where: {
      parentId: null // 只获取顶级分类
    },
    include: {
      children: true // 包含子分类
    },
    orderBy: {
      sort: 'desc' // 按照排序字段排序
    }
  });
  return { categories };
}



// 根布局不应该接收动态路由参数
export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ wikiName: string,moduleName:string,detailName:string }>;
}) {
  const { configs } = await getStaticConfig();
  const { categories } = await getStaticCategories();
  


 
  return (
    <html lang="zh-CN">
      <body>
      <ConfigProvider 
      locale={zhCN}
          theme={{
            token: {
              // Seed Token，影响范围大
              colorPrimary: defaultTheme.textColor.primary,
              borderRadius: 2,
              
      
            },
          }}
      >
        <ThemeProvider>
          <AppConfigProvider configs={configs as ConfigValue[]}  >
            <ArticleCategoryProvider categories={categories}>
            
              <FrontLayout>
                {children}
              </FrontLayout>
              
             
        
            </ArticleCategoryProvider>
          </AppConfigProvider>
        </ThemeProvider>
        </ConfigProvider>
      </body>
    </html>
  );
}

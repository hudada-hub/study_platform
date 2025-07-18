import { ResponseUtil } from '@/utils/response';
import prisma from '@/lib/prisma';

// 获取所有启用的配置
export async function GET() {
  try {
    // 获取所有启用的配置
    const configs = await prisma.config.findMany({
      where: {
        isEnabled: true,
      },
      orderBy: {
        sort: 'asc',
      },
      include: {
        textValue: true,
        imageValue: true,
        multiImageValues: {
          orderBy: {
            sort: 'asc',
          },
        },
        multiTextValues: {
          orderBy: {
            sort: 'asc',
          },
        },
        multiContentValues: {
          orderBy: {
            sort: 'asc',
          },
        },
      },
    });

    // 处理配置数据，根据type返回对应的值
    const processedConfigs = configs.map(config => {
      const { type } = config;
      let value = null;

      switch (type) {
        case 'TEXT':
        case 'TEXTAREA':
        case 'RICH_TEXT':
          value = config.textValue;
          break;
        case 'IMAGE':
          value = config.imageValue;
          break;
        case 'MULTI_IMAGE':
          value = config.multiImageValues;
          break;
        case 'MULTI_TEXT':
          value = config.multiTextValues;
          break;
        case 'MULTI_CONTENT':
          value = config.multiContentValues;
          break;
      }

      return {
        key: config.key,
        title: config.title,
        type: config.type,
        value,
      };
    });

    return ResponseUtil.success(processedConfigs);
  } catch (error) {
    console.error('获取配置失败:', error);
    return ResponseUtil.error('获取配置失败');
  }
} 
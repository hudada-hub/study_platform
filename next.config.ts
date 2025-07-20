// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {

  experimental: {
    // 减少内存使用
    optimizeCss: true,
    optimizePackageImports: ['antd', 'react-icons'],
  },
  // 图片配置
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'study-platform-1258739349.cos.ap-guangzhou.myqcloud.com',
        pathname: '/**',
      }
    ],
    // 优化图片处理
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  // 减少构建时的内存使用
  webpack: (config, { dev, isServer }) => {
    if (!dev && !isServer) {
      // 生产环境优化
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              chunks: 'all',
            },
          },
        },
      };
    }
    return config;
  },
};

export default nextConfig;
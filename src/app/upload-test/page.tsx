'use client';

import { useState } from 'react';
import { message } from 'antd';
import { UploadOutlined, ReloadOutlined } from '@ant-design/icons';
import { Button, Card, Space, Tabs } from 'antd';
import type { TabsProps } from 'antd';

interface UploadResult {
  url: string;
  filename: string;
  originalName: string;
  size: number;
  type: string;
  path: string; // 添加path字段
}

export default function UploadTestPage() {
  const [imageResult, setImageResult] = useState<UploadResult | null>(null);
  const [videoResult, setVideoResult] = useState<UploadResult | null>(null);
  const [audioResult, setAudioResult] = useState<UploadResult | null>(null);
  const [uploading, setUploading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // 处理文件上传
  const handleUpload = async (file: File, type: 'image' | 'video' | 'audio') => {
    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/common/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (result.code === 0) {
        message.success('上传成功');
        switch (type) {
          case 'image':
            setImageResult(result.data);
            break;
          case 'video':
            setVideoResult(result.data);
            break;
          case 'audio':
            setAudioResult(result.data);
            break;
        }
      } else {
        message.error(result.message || '上传失败');
      }
    } catch (error) {
      console.error('上传失败:', error);
      message.error('上传失败，请重试');
    } finally {
      setUploading(false);
    }
  };

  // 刷新文件URL
  const handleRefreshUrl = async (result: UploadResult, type: 'image' | 'video' | 'audio') => {
    try {
      setRefreshing(true);
      const response = await fetch('/api/common/upload/refresh-url', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ path: result.path }),
      });

      const data = await response.json();

      if (data.code === 0) {
        const newResult = { ...result, url: data.data.url };
        switch (type) {
          case 'image':
            setImageResult(newResult);
            break;
          case 'video':
            setVideoResult(newResult);
            break;
          case 'audio':
            setAudioResult(newResult);
            break;
        }
        message.success('URL已更新');
      } else {
        message.error(data.message || 'URL更新失败');
      }
    } catch (error) {
      console.error('URL更新失败:', error);
      message.error('URL更新失败，请重试');
    } finally {
      setRefreshing(false);
    }
  };

  // 处理文件选择
  const handleFileSelect = (type: 'image' | 'video' | 'audio') => {
    const input = document.createElement('input');
    input.type = 'file';
    
    // 设置接受的文件类型
    switch (type) {
      case 'image':
        input.accept = 'image/jpeg,image/png,image/gif,image/webp';
        break;
      case 'video':
        input.accept = 'video/mp4,video/webm,video/ogg';
        break;
      case 'audio':
        input.accept = 'audio/mpeg,audio/mp3,audio/wav,audio/ogg,audio/m4a';
        break;
    }

    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        handleUpload(file, type);
      }
    };

    input.click();
  };

  // 格式化文件大小
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  };

  // 渲染上传结果
  const renderUploadResult = (result: UploadResult | null, type: 'image' | 'video' | 'audio') => {
    if (!result) return null;

    return (
      <Card size="small" title="上传结果" className="mt-4" extra={
        <Button
          icon={<ReloadOutlined />}
          onClick={() => handleRefreshUrl(result, type)}
          loading={refreshing}
          size="small"
        >
          刷新URL
        </Button>
      }>
        <div className="space-y-2">
          <p>文件名：{result.originalName}</p>
          <p>大小：{formatFileSize(result.size)}</p>
          <p>类型：{result.type}</p>
          <p className="break-all">
            URL：<a href={result.url} target="_blank" rel="noopener noreferrer">{result.url}</a>
          </p>
          {type === 'image' && (
            <img src={result.url} alt={result.filename} className="max-w-full h-auto max-h-[200px] mt-2" />
          )}
          {type === 'video' && (
            <video src={result.url} controls className="max-w-full h-auto max-h-[200px] mt-2">
              您的浏览器不支持视频播放
            </video>
          )}
          {type === 'audio' && (
            <audio src={result.url} controls className="w-full mt-2">
              您的浏览器不支持音频播放
            </audio>
          )}
        </div>
      </Card>
    );
  };

  const items: TabsProps['items'] = [
    {
      key: 'image',
      label: '图片上传',
      children: (
        <div>
          <Button
            icon={<UploadOutlined />}
            onClick={() => handleFileSelect('image')}
            loading={uploading}
          >
            选择图片
          </Button>
          {renderUploadResult(imageResult, 'image')}
        </div>
      ),
    },
    {
      key: 'video',
      label: '视频上传',
      children: (
        <div>
          <Button
            icon={<UploadOutlined />}
            onClick={() => handleFileSelect('video')}
            loading={uploading}
          >
            选择视频
          </Button>
          {renderUploadResult(videoResult, 'video')}
        </div>
      ),
    },
    {
      key: 'audio',
      label: '音频上传',
      children: (
        <div>
          <Button
            icon={<UploadOutlined />}
            onClick={() => handleFileSelect('audio')}
            loading={uploading}
          >
            选择音频
          </Button>
          {renderUploadResult(audioResult, 'audio')}
        </div>
      ),
    },
  ];

  return (
    <div className="container mx-auto p-4 max-w-3xl">
      <Card title="文件上传测试" className="shadow-md">
        <Tabs items={items} />
      </Card>
    </div>
  );
} 
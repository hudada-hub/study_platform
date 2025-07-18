'use client'
import React, { useRef, useState } from 'react';
import { Upload, Button, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import NoSSRWrapper from './NoSSRWrapper';
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile, toBlobURL } from "@ffmpeg/util";

interface VideoUploadWithWatermarkProps {
  value?: string;
  onChange?: (url: string) => void;
  watermarkFile?: File; // 可选，图片水印
  uploadAction: string; // 上传接口地址
}

const VideoUploadWithWatermark: React.FC<VideoUploadWithWatermarkProps> = ({ value, onChange, watermarkFile, uploadAction }) => {
  const [uploading, setUploading] = useState(false);
  const messageRef = useRef<HTMLParagraphElement | null>(null);

  const uploadProps = {
    showUploadList: false,
    beforeUpload: async (file: File) => {
      setUploading(true);
      try {
        // 直接上传原始视频文件，不做水印处理
        const formData = new FormData();
        formData.append('file', file);
        const resp = await fetch(uploadAction, {
          method: 'POST',
          body: formData,
        });
        const data = await resp.json();
        if (data.code === 0 && data.data?.url) {
          onChange?.(data.data.url);
          message.success('上传成功');
        } else {
          message.error(data.message || '上传失败');
        }
      } catch (e: any) {
        message.error(e.message || '处理失败');
      } finally {
        setUploading(false);
      }
      // 阻止 antd 自动上传
      return false;
    },
  };

  return (
    <NoSSRWrapper>
      <div ref={messageRef}></div>
      <Upload {...uploadProps}>
        <Button icon={<UploadOutlined />} loading={uploading} disabled={uploading}>
          {uploading ? '处理中...' : '上传视频'}
        </Button>
      </Upload>
      {value && (
        <div className="mt-4">
          <video src={value} controls className="w-full rounded-lg" />
        </div>
      )}
    </NoSSRWrapper>
  );
};

export default VideoUploadWithWatermark; 
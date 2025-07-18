'use client';

import React, { useState, useEffect, useRef, forwardRef } from 'react';
import { FaPlay, FaPause, FaVolumeUp, FaVolumeMute, FaExpand, FaCompress } from 'react-icons/fa';
import { MdPictureInPicture } from 'react-icons/md';

interface CosVideoWatermarkProps extends React.VideoHTMLAttributes<HTMLVideoElement> {
  path: string;
}

/**
 * 带全屏水印的视频组件，水印内容和样式参考1.html
 */
export const CosVideoWatermark = forwardRef<HTMLVideoElement, CosVideoWatermarkProps>(({ path, ...props }, ref) => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [watermarkVisible, setWatermarkVisible] = useState(true);
  


  // 获取签名URL
  const refreshUrl = async () => {
    try {
      const response = await fetch('/api/common/upload/refresh-url', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ path }),
      });
      const data = await response.json();
      if (data.code === 0) {
        setUrl(data.data.url);
        setError(null);
      } else {
        setError(data.message || '获取视频URL失败');
      }
    } catch (err) {
      setError('获取视频URL失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshUrl();
    const timer = setInterval(refreshUrl, 60 * 60 * 1000);
    return () => clearInterval(timer);
  }, [path]);



  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    function forceContainerFullscreen() {
      const container = containerRef.current;
      if (!container) return;
     
      // 标准
      if (document.fullscreenElement === video) {
        // document.exitFullscreen();
        container.requestFullscreen();
      }
      // firefox
    }
    video.addEventListener('webkitfullscreenchange', forceContainerFullscreen);
    video.addEventListener('fullscreenchange', forceContainerFullscreen);
    video.addEventListener('mozfullscreenchange', forceContainerFullscreen);
    video.addEventListener('MSFullscreenChange', forceContainerFullscreen);
    return () => {
      video.removeEventListener('webkitfullscreenchange', forceContainerFullscreen);
      video.removeEventListener('fullscreenchange', forceContainerFullscreen);
      video.removeEventListener('mozfullscreenchange', forceContainerFullscreen);
      video.removeEventListener('MSFullscreenChange', forceContainerFullscreen);
    };
  }, []);


 
  // 隐藏video原生全屏按钮
  const style = `
video::-webkit-media-controls-fullscreen-button { display: none !important; }
video::-webkit-media-controls-enclosure { overflow: hidden; }
`;

  if (loading) {
    return <div className="text-gray-500">加载中...</div>;
  }
  if (error) {
    return <div className="text-red-500">加载失败: {error}</div>;
  }

  // 水印样式
  const watermarkStyle: React.CSSProperties = {
    position: 'absolute',
    pointerEvents: 'none',
    zIndex: 100,
    color: 'rgba(255,255,255,0.6)',
    fontSize: 24,
    fontWeight: 'bold',
    textShadow: '1px 1px 3px rgba(0,0,0,0.8)',
    opacity: 0.7,
    transform: 'rotate(-20deg)',
    userSelect: 'none',
  };

  return (
    <div
      ref={containerRef}
      style={{ position: 'relative', width: '100%', height: '100%', background: '#000', borderRadius: 10, overflow: 'hidden' }}
    >
      {/* 隐藏video原生全屏按钮的样式 */}
      <style>{style}</style>
      <video
        ref={ref || videoRef}
        className="w-full h-full rounded-lg"
        src={url}
        {...props}
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
        controls
      >
        您的浏览器不支持 HTML5 视频播放
      </video>
      {/* 多组水印 */}
     
      {/* 右上角固定水印 */}
      {watermarkVisible && (
        <div
          className="watermark"
          style={{
            ...watermarkStyle,
            left: 'auto',
            right: 16,
            top: 16,
            transform: 'none',
            fontSize: 20,
            opacity: 0.8,
            color: 'rgba(255,255,255,0.85)',
            fontWeight: 'bold',
            textShadow: '1px 1px 3px rgba(0,0,0,0.8)',
          }}
        >
          不可外传
        </div>
      )}
     
    </div>
  );
}); 
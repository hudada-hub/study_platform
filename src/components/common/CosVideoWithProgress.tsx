'use client';

import React, { useState, useEffect, useRef, forwardRef, useCallback } from 'react';
import { request } from '@/utils/request';
import { learningAnalytics, LearningEventType } from '@/utils/analytics';

interface CosVideoWithProgressProps extends React.VideoHTMLAttributes<HTMLVideoElement> {
  path: string;
  courseId: number;
  chapterId: number;
  userId: number;
  onProgressUpdate?: (progress: number) => void;
  initialProgress?: number;
}

export const CosVideoWithProgress = forwardRef<HTMLVideoElement, CosVideoWithProgressProps>(
  ({ path, courseId, chapterId, userId, onProgressUpdate, initialProgress = 0, ...props }, ref) => {
    const [url, setUrl] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [currentProgress, setCurrentProgress] = useState(initialProgress);
    const [isTracking, setIsTracking] = useState(false);
    const progressUpdateTimer = useRef<NodeJS.Timeout | null>(null);

    // 获取签名URL
    const refreshUrl = async () => {
      try {
        const response = await fetch('/api/common/upload/refresh-url', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
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

    // 更新学习进度到服务器
    const updateProgress = useCallback(async (progress: number) => {
      try {
        await request(`/courses/${courseId}/chapters/${chapterId}/progress`, {
          method: 'POST',
          body: JSON.stringify({ progress }),
        });
      } catch (error) {
        console.error('更新学习进度失败:', error);
      }
    }, [courseId, chapterId]);

    // 防抖更新进度
    const debouncedUpdateProgress = useCallback((progress: number) => {
      if (progressUpdateTimer.current) {
        clearTimeout(progressUpdateTimer.current);
      }
      
      progressUpdateTimer.current = setTimeout(() => {
        updateProgress(progress);
      }, 1000*60*5); // 5分钟更新一次
    }, [updateProgress]);

    // 处理视频播放事件
    const handleTimeUpdate = useCallback(() => {
      const video = videoRef.current;
      if (!video || video.duration === 0) return;

      const progress = (video.currentTime / video.duration) * 100;
      setCurrentProgress(progress);
      
      // 通知父组件
      onProgressUpdate?.(progress);
      
      // 防抖更新到服务器
      debouncedUpdateProgress(progress);
      
      // 记录进度更新事件（每10%记录一次）
      const progressRounded = Math.floor(progress / 10) * 10;
      if (progressRounded > 0 && progressRounded % 10 === 0) {
        learningAnalytics.trackProgressUpdate(courseId, chapterId, userId, progress, {
          currentTime: video.currentTime,
          duration: video.duration,
          deviceInfo: learningAnalytics.getDeviceInfo(),
          userAgent: navigator.userAgent,
        });
      }
    }, [courseId, chapterId, userId, onProgressUpdate, debouncedUpdateProgress]);

    // 处理视频播放开始
    const handlePlay = useCallback(() => {
      setIsTracking(true);
      
      // 记录播放事件
      const video = videoRef.current;
      if (video) {
        learningAnalytics.trackVideoPlay(courseId, chapterId, userId, {
          currentTime: video.currentTime,
          duration: video.duration,
          deviceInfo: learningAnalytics.getDeviceInfo(),
          userAgent: navigator.userAgent,
        });
      }
    }, [courseId, chapterId, userId]);

    // 处理视频暂停
    const handlePause = useCallback(() => {
      setIsTracking(false);
      
      // 记录暂停事件
      const video = videoRef.current;
      if (video) {
        learningAnalytics.trackVideoPause(courseId, chapterId, userId, {
          currentTime: video.currentTime,
          duration: video.duration,
          deviceInfo: learningAnalytics.getDeviceInfo(),
          userAgent: navigator.userAgent,
        });
        
        // 暂停时立即更新进度
        if (video.duration > 0) {
          const progress = (video.currentTime / video.duration) * 100;
          updateProgress(progress);
        }
      }
    }, [courseId, chapterId, userId, updateProgress]);

    // 处理视频结束
    const handleEnded = useCallback(() => {
      setIsTracking(false);
      setCurrentProgress(100);
      updateProgress(100);
      onProgressUpdate?.(100);
      
      // 记录视频结束事件
      const video = videoRef.current;
      if (video) {
        learningAnalytics.trackVideoEnd(courseId, chapterId, userId, {
          currentTime: video.currentTime,
          duration: video.duration,
          deviceInfo: learningAnalytics.getDeviceInfo(),
          userAgent: navigator.userAgent,
        });
      }
    }, [courseId, chapterId, userId, updateProgress, onProgressUpdate]);

    // 设置视频事件监听器
    useEffect(() => {
      const video = videoRef.current;
      if (!video) return;

      video.addEventListener('timeupdate', handleTimeUpdate);
      video.addEventListener('play', handlePlay);
      video.addEventListener('pause', handlePause);
      video.addEventListener('ended', handleEnded);

      return () => {
        video.removeEventListener('timeupdate', handleTimeUpdate);
        video.removeEventListener('play', handlePlay);
        video.removeEventListener('pause', handlePause);
        video.removeEventListener('ended', handleEnded);
      };
    }, [handleTimeUpdate, handlePlay, handlePause, handleEnded]);

    // 设置初始进度
    useEffect(() => {
      const video = videoRef.current;
      if (video && initialProgress > 0) {
        // 根据进度设置播放位置
        video.addEventListener('loadedmetadata', () => {
          if (video.duration > 0) {
            video.currentTime = (initialProgress / 100) * video.duration;
          }
        }, { once: true });
      }
    }, [initialProgress]);

    useEffect(() => {
      refreshUrl();
      const timer = setInterval(refreshUrl, 60 * 60 * 1000);
      return () => clearInterval(timer);
    }, [path]);

    // 清理定时器
    useEffect(() => {
      return () => {
        if (progressUpdateTimer.current) {
          clearTimeout(progressUpdateTimer.current);
        }
      };
    }, []);

    // 监听全屏事件
    useEffect(() => {
      const video = videoRef.current;
      const container = containerRef.current;
      if (!video || !container) return;
    
      function forceContainerFullscreen() {
        if ((document as any).webkitFullscreenElement === video) {
          (document as any).webkitExitFullscreen();
          if ((container as any).webkitRequestFullscreen) {
            (container as any).webkitRequestFullscreen();
          }
        }
        if ((document as any).mozFullScreenElement === video) {
          (document as any).mozCancelFullScreen();
          if ((container as any).mozRequestFullScreen) {
            (container as any).mozRequestFullScreen();
          }
        }
        if ((document as any).msFullscreenElement === video) {
          (document as any).msExitFullscreen();
          if ((container as any).msRequestFullscreen) {
            (container as any).msRequestFullscreen();
          }
        }
      }
    
      video.addEventListener('fullscreenchange', forceContainerFullscreen);
      video.addEventListener('webkitfullscreenchange', forceContainerFullscreen);
      video.addEventListener('mozfullscreenchange', forceContainerFullscreen);
      video.addEventListener('MSFullscreenChange', forceContainerFullscreen);
    
      return () => {
        video.removeEventListener('fullscreenchange', forceContainerFullscreen);
        video.removeEventListener('webkitfullscreenchange', forceContainerFullscreen);
        video.removeEventListener('mozfullscreenchange', forceContainerFullscreen);
        video.removeEventListener('MSFullscreenChange', forceContainerFullscreen);
      };
    }, []);

    // 自定义全屏按钮
    const handleFullscreen = () => {
      const container = containerRef.current;
      if (!container) return;
      const isFull =
        document.fullscreenElement === container ||
        (document as any).webkitFullscreenElement === container ||
        (document as any).mozFullScreenElement === container ||
        (document as any).msFullscreenElement === container;
      if (isFull) {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if ((document as any).webkitExitFullscreen) {
          (document as any).webkitExitFullscreen();
        } else if ((document as any).mozCancelFullScreen) {
          (document as any).mozCancelFullScreen();
        } else if ((document as any).msExitFullscreen) {
          (document as any).msExitFullscreen();
        }
      } else {
        if (container.requestFullscreen) {
          container.requestFullscreen();
        } else if ((container as any).webkitRequestFullscreen) {
          (container as any).webkitRequestFullscreen();
        } else if ((container as any).mozRequestFullScreen) {
          (container as any).mozRequestFullScreen();
        } else if ((container as any).msRequestFullscreen) {
          (container as any).msRequestFullscreen();
        }
      }
    };

    if (loading) return <div className="text-gray-500">加载中...</div>;
    if (error) return <div className="text-red-500">加载失败: {error}</div>;

    // 隐藏video原生全屏按钮
    const hideFullscreenStyle = `
      video::-webkit-media-controls-fullscreen-button { display: none !important; }
      video::-webkit-media-controls-enclosure { overflow: hidden; }
    `;

    // 水印样式
    const watermarkStyle: React.CSSProperties = {
      position: 'absolute',
      pointerEvents: 'none',
      zIndex: 100,
      color: isFullscreen ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.6)',
      fontSize: isFullscreen ? 20 : 24,
      fontWeight: 'bold',
      textShadow: '1px 1px 3px rgba(0,0,0,0.8)',
      opacity: isFullscreen ? 0.8 : 0.7,
      right: 16,
      top: 16,
      userSelect: 'none',
      transform: isFullscreen ? 'none' : 'rotate(-20deg)',
    };

    return (
      <div
        ref={containerRef}
        className="player-container"
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          background: '#000',
          borderRadius: 10,
          overflow: 'hidden',
        }}
      >
        {/* 隐藏video原生全屏按钮的样式 */}
        <style>{hideFullscreenStyle}</style>
        <video
          ref={ref || videoRef}
          id="videoPlayer"
          className="w-full h-full rounded-lg"
          src={url}
          {...props}
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
          controls
        />
        
        {/* 学习进度指示器 */}
        {isTracking && (
          <div className="absolute top-4 left-4 z-50 bg-black/70 text-white px-3 py-1 rounded text-sm">
            学习进度: {Math.round(currentProgress)}%
          </div>
        )}
        
        {/* 自定义全屏按钮 */}
        <button
          type="button"
          onClick={handleFullscreen}
          style={{
            position: 'absolute',
            right: 16,
            bottom: 16,
            zIndex: 200,
            background: 'rgba(0,0,0,0.4)',
            color: '#fff',
            border: 'none',
            borderRadius: 4,
            padding: '6px 12px',
            cursor: 'pointer',
          }}
        >
          全屏
        </button>
        
        {/* 右上角水印 */}
        <div className="watermark" style={watermarkStyle}>
          不可外传
        </div>
      </div>
    );
  }
);

CosVideoWithProgress.displayName = 'CosVideoWithProgress'; 
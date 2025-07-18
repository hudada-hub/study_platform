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
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [rate, setRate] = useState(1);
  const [fullscreen, setFullscreen] = useState(false);
  // 新增：进度条拖动状态
  const [seeking, setSeeking] = useState(false);
  const [seekValue, setSeekValue] = useState(0);
  const clickTimer = useRef<NodeJS.Timeout | null>(null);

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

  // 监听全屏变化，兼容原有isFullscreen逻辑
  useEffect(() => {
    const handleFullscreenChange = () => {
      const el = containerRef.current;
      if (!el) return;
      const isFull =
        document.fullscreenElement === el ||
        (document as any).webkitFullscreenElement === el ||
        (document as any).mozFullScreenElement === el ||
        (document as any).msFullscreenElement === el;
      setFullscreen(isFull);
      setIsFullscreen(isFull);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
    };
  }, []);

  // 控制播放/暂停
  const handlePlayPause = () => {
    const v = (ref && 'current' in ref && ref.current) ? ref.current : videoRef.current;
    if (!v) return;
    if (playing) {
      v.pause();
    } else {
      v.play();
    }
  };
  // 控制音量
  const handleVolume = (v: number) => {
    const video = (ref && 'current' in ref && ref.current) ? ref.current : videoRef.current;
    if (!video) return;
    video.volume = v;
    setVolume(v);
  };
  // 控制进度
  const handleSeekChange = (v: number) => {
    setSeekValue(v);
    setCurrent(v);
    if (!seeking) {
      const video = (ref && 'current' in ref && ref.current) ? ref.current : videoRef.current;
      if (video) video.currentTime = v;
    }
  };
  const handleSeekMouseDown = () => setSeeking(true);
  const handleSeekMouseUp = (v: number) => {
    setSeeking(false);
    const video = (ref && 'current' in ref && ref.current) ? ref.current : videoRef.current;
    if (!video) return;
    video.currentTime = v;
    setCurrent(v);
  };
  // 控制全屏
  const handleFullscreen = () => {
    const el = containerRef.current;
    if (!el) return;
    if (!fullscreen) {
      if (el.requestFullscreen) {
        el.requestFullscreen();
      } else if ((el as any).webkitRequestFullscreen) {
        (el as any).webkitRequestFullscreen();
      } else if ((el as any).mozRequestFullScreen) {
        (el as any).mozRequestFullScreen();
      } else if ((el as any).msRequestFullscreen) {
        (el as any).msRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if ((document as any).webkitExitFullscreen) {
        (document as any).webkitExitFullscreen();
      } else if ((document as any).mozCancelFullScreen) {
        (document as any).mozCancelFullScreen();
      } else if ((document as any).msExitFullscreen) {
        (document as any).msExitFullscreen();
      }
    }
  };
  // 控制画中画
  const handlePIP = async () => {
    const video = (ref && 'current' in ref && ref.current) ? ref.current : videoRef.current;
    if (!video) return;
    if ((document as any).pictureInPictureElement) {
      (document as any).exitPictureInPicture();
    } else if ((video as any).requestPictureInPicture) {
      (video as any).requestPictureInPicture();
    }
  };
  // 控制播放速率
  const handleRate = (v: number) => {
    const video = (ref && 'current' in ref && ref.current) ? ref.current : videoRef.current;
    if (!video) return;
    video.playbackRate = v;
    setRate(v);
  };

  // 监听video事件
  useEffect(() => {
    const video = (ref && 'current' in ref && ref.current) ? ref.current : videoRef.current;
    if (!video) return;
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    const onTimeUpdate = () => {
      if (!seeking) setCurrent(video.currentTime);
    };
    const onLoadedMetadata = () => {
      setDuration(video.duration);
      setCurrent(video.currentTime);
      setVolume(video.volume);
      setRate(video.playbackRate);
    };
    video.addEventListener('play', onPlay);
    video.addEventListener('pause', onPause);
    video.addEventListener('timeupdate', onTimeUpdate);
    video.addEventListener('loadedmetadata', onLoadedMetadata);
    return () => {
      video.removeEventListener('play', onPlay);
      video.removeEventListener('pause', onPause);
      video.removeEventListener('timeupdate', onTimeUpdate);
      video.removeEventListener('loadedmetadata', onLoadedMetadata);
    };
  }, [ref, seeking]);

  // 格式化时间
  const formatTime = (s: number) => {
    if (!s || isNaN(s)) return '00:00';
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  // 切换水印显示
  const handleToggleWatermark = () => {
    setWatermarkVisible(v => !v);
  };

  const handleVideoClick = () => {
    if (clickTimer.current) {
      clearTimeout(clickTimer.current);
      clickTimer.current = null;
    }
    clickTimer.current = setTimeout(() => {
      handlePlayPause();
      clickTimer.current = null;
    }, 200);
  };
  const handleVideoDoubleClick = () => {
    if (clickTimer.current) {
      clearTimeout(clickTimer.current);
      clickTimer.current = null;
    }
    handleFullscreen();
  };

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
      <video
        ref={ref || videoRef}
        className="w-full h-full rounded-lg"
        src={url}
        {...props}
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
        controls={false}
        onClick={handleVideoClick}
        onDoubleClick={handleVideoDoubleClick}
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
      {/* 自定义控制条 */}
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, zIndex: 300, background: 'rgba(0,0,0,0.5)', padding: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
        <button onClick={handlePlayPause} style={{ background: 'none', border: 'none', color: '#fff', fontSize: 20, cursor: 'pointer' }}>
          {playing ? <FaPause /> : <FaPlay />}
        </button>
        <span style={{ color: '#fff', fontSize: 12 }}>{formatTime(current)}</span>
        <input
          type="range"
          min={0}
          max={duration || 0}
          step={0.1}
          value={seeking ? seekValue : current}
          onChange={e => handleSeekChange(Number(e.target.value))}
          onMouseDown={handleSeekMouseDown}
          onMouseUp={e => handleSeekMouseUp(Number((e.target as HTMLInputElement).value))}
          style={{ flex: 1 }}
        />
        <span style={{ color: '#fff', fontSize: 12 }}>{formatTime(duration)}</span>
        <button onClick={() => handleVolume(volume === 0 ? 1 : 0)} style={{ background: 'none', border: 'none', color: '#fff', fontSize: 20, cursor: 'pointer' }}>
          {volume > 0 ? <FaVolumeUp /> : <FaVolumeMute />}
        </button>
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={volume}
          onChange={e => handleVolume(Number(e.target.value))}
          style={{ width: 60 }}
        />
        <button onClick={handlePIP} style={{ background: 'none', border: 'none', color: '#fff', fontSize: 20, cursor: 'pointer' }}>
          <MdPictureInPicture />
        </button>
        <select value={rate} onChange={e => handleRate(Number(e.target.value))} style={{ borderRadius: 4, padding: '2px 6px', fontSize: 14 }}>
          <option value={0.5}>0.5x</option>
          <option value={1}>1x</option>
          <option value={1.5}>1.5x</option>
          <option value={2}>2x</option>
        </select>
        <button onClick={handleFullscreen} style={{ background: 'none', border: 'none', color: '#fff', fontSize: 20, cursor: 'pointer' }}>
          {fullscreen ? <FaCompress /> : <FaExpand />}
        </button>
      </div>
     
    </div>
  );
}); 
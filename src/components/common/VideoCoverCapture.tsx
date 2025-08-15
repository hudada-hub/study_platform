import React, { useRef, useImperativeHandle, forwardRef } from 'react';

interface VideoCoverCaptureProps {
  videoUrl: string;
  onCapture: (blob: Blob, dataUrl: string) => void;
  width?: number;
  height?: number;
  captureTime?: number; // 秒，默认随机
  children?: React.ReactNode;
}

/**
 * 用于抓取视频帧作为封面的组件
 * - videoUrl: 视频地址
 * - onCapture: 抓帧成功回调(blob, dataUrl)
 * - width/height: 封面宽高（可选，默认视频尺寸）
 * - captureTime: 指定抓帧时间（秒，可选，默认随机）
 * - children: 可自定义触发按钮
 */
const VideoCoverCapture = forwardRef<any, VideoCoverCaptureProps>(
  ({ videoUrl, onCapture, width, height, captureTime, children }, ref) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // 抓取封面
  const handleCapture = async () => {
    return new Promise<{ blob: Blob; dataUrl: string }>((resolve, reject) => {
      const video = videoRef.current;
      if (!video) return reject('video ref not ready');
      // 随机时间
      const duration = video.duration;
      let targetTime = typeof captureTime === 'number' ? captureTime : Math.random() * duration * 0.8;
      // 避免seek到最后黑帧
      if (targetTime > duration - 1) targetTime = duration - 1;
      video.currentTime = targetTime;
      video.onseeked = () => {
        const w = width || video.videoWidth;
        const h = height || video.videoHeight;
        const canvas = canvasRef.current;
        if (!canvas) return reject('canvas ref not ready');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        if (!ctx) return reject('canvas ctx error');
        ctx.drawImage(video, 0, 0, w, h);
        canvas.toBlob((blob) => {
          if (blob) {
            const dataUrl = canvas.toDataURL('image/jpeg');
            onCapture(blob, dataUrl);
            resolve({ blob, dataUrl });
          } else {
            reject('toBlob failed');
          }
        }, 'image/jpeg', 0.92);
      };
      video.onerror = (e) => {
        reject('视频加载失败');
      };
    });
  };

  useImperativeHandle(ref, () => ({ handleCapture }), [videoUrl]);

  return (
    <div style={{ display: 'none' }}>
      <video ref={videoRef} src={videoUrl} crossOrigin="anonymous" preload="auto" />
      <canvas ref={canvasRef} />
    </div>
  );
});

export default VideoCoverCapture;

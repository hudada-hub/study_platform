'use client';
import React, { useRef, useEffect, useState } from 'react';
import { getUserAuth } from '@/utils/client-auth';
import { showSuccess, showError } from '@/utils/toast';

export default function VideoWatermarkDemo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [watermarkText, setWatermarkText] = useState('');
  const [isConverting, setIsConverting] = useState(false);
  const [convertedVideo, setConvertedVideo] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const { userInfo } = getUserAuth();
    if (userInfo?.phone) {
      setWatermarkText(userInfo.phone);
    }
  }, []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setVideoFile(file);
      setConvertedVideo(null);
      setProgress(0);
      const videoUrl = URL.createObjectURL(file);
      if (videoRef.current) {
        videoRef.current.src = videoUrl;
      }
    }
  };

  const drawWatermark = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.save();
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.font = '20px Arial';
    
    const text = watermarkText || '示例水印';
    const metrics = ctx.measureText(text);
    const textWidth = metrics.width;
    
    for (let x = 0; x < width; x += textWidth + 100) {
      for (let y = 0; y < height; y += 30) {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(-Math.PI / 12);
        ctx.fillText(text, 0, 0);
        ctx.restore();
      }
    }
    
    ctx.restore();
  };

  const getSupportedMimeType = () => {
    const types = [
      'video/webm;codecs=h264',
      'video/webm;codecs=vp9',
      'video/webm;codecs=vp8',
      'video/webm'
    ];
    
    return types.find(type => MediaRecorder.isTypeSupported(type)) || 'video/webm';
  };

  const startConverting = async () => {
    if (!videoRef.current || !canvasRef.current) {
      showError('请先选择视频文件');
      return;
    }

    try {
      setIsConverting(true);
      setProgress(0);
      chunksRef.current = [];
      
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      // 重置视频到开始位置并暂停
      video.currentTime = 0;
      video.pause();
      
      // 设置画布尺寸
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      // 创建 MediaRecorder
      const stream = canvas.captureStream(30); // 指定帧率为30fps
      const mimeType = getSupportedMimeType();
      
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType,
        videoBitsPerSecond: 8000000 // 8Mbps
      });
      mediaRecorderRef.current = mediaRecorder;

      // 收集数据
      mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          chunksRef.current.push(event.data);
          // 更新进度
          setProgress(Math.min((video.currentTime / video.duration) * 100, 99));
        }
      };
      
      mediaRecorder.onstop = () => {
        if (chunksRef.current.length === 0) {
          showError('视频转换失败，未收集到数据');
          setIsConverting(false);
          return;
        }

        const blob = new Blob(chunksRef.current, { type: mimeType });
        if (blob.size === 0) {
          showError('视频转换失败，输出文件大小为0');
          setIsConverting(false);
          return;
        }

        const url = URL.createObjectURL(blob);
        setConvertedVideo(url);
        setIsConverting(false);
        setProgress(100);
        showSuccess('视频转换完成');
      };

      // 开始录制，每50ms收集一次数据
      mediaRecorder.start(50);
      
      // 创建渲染上下文
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        showError('无法获取Canvas上下文');
        return;
      }

      // 渲染函数
      const renderFrame = () => {
        if (video.ended || !isConverting) {
          video.pause();
          if (mediaRecorder.state === 'recording') {
            mediaRecorder.stop();
          }
          return;
        }
        
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        drawWatermark(ctx, canvas.width, canvas.height);
        requestAnimationFrame(renderFrame);
      };

      // 确保在开始播放前已经准备好录制
      video.addEventListener('canplay', async () => {
        try {
          await video.play();
          renderFrame();
        } catch (error) {
          console.error('播放失败:', error);
          showError('视频播放失败，请重试');
          setIsConverting(false);
          if (mediaRecorder.state === 'recording') {
            mediaRecorder.stop();
          }
        }
      }, { once: true });

      // 监听视频结束事件
      const handleEnded = () => {
        if (mediaRecorder.state === 'recording') {
          mediaRecorder.stop();
        }
      };

      video.addEventListener('ended', handleEnded);
      
      // 清理函数
      return () => {
        video.removeEventListener('ended', handleEnded);
        if (mediaRecorder.state === 'recording') {
          mediaRecorder.stop();
        }
      };
    } catch (error) {
      console.error('转换失败:', error);
      setIsConverting(false);
      setProgress(0);
      showError('视频转换失败，请重试');
    }
  };

  const downloadVideo = () => {
    if (!convertedVideo) return;
    
    const a = document.createElement('a');
    a.href = convertedVideo;
    a.download = `watermarked_${videoFile?.name?.replace(/\.[^/.]+$/, '') || 'video'}.webm`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    let animationFrameId: number;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const render = () => {
      if (video.paused || video.ended || isConverting) return;

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      drawWatermark(ctx, canvas.width, canvas.height);
      animationFrameId = requestAnimationFrame(render);
    };

    const handlePlay = () => {
      setIsPlaying(true);
      render();
    };

    const handlePause = () => {
      setIsPlaying(false);
      cancelAnimationFrame(animationFrameId);
    };

    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);

    return () => {
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      cancelAnimationFrame(animationFrameId);
    };
  }, [watermarkText, isConverting]);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          视频水印 Demo
        </h1>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              选择视频文件
            </label>
            <input
              type="file"
              accept="video/*"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500 dark:text-gray-400
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100
                dark:file:bg-gray-700 dark:file:text-gray-200"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              水印文本
            </label>
            <input
              type="text"
              value={watermarkText}
              onChange={(e) => setWatermarkText(e.target.value)}
              placeholder="输入水印文本"
              className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>

          <div className="flex space-x-4">
            <button
              onClick={startConverting}
              disabled={isConverting || !videoFile}
              className={`px-4 py-2 rounded-md text-white ${
                isConverting || !videoFile
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {isConverting ? '转换中...' : '开始转换'}
            </button>

            <button
              onClick={downloadVideo}
              disabled={!convertedVideo}
              className={`px-4 py-2 rounded-md text-white ${
                !convertedVideo
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-green-600 hover:bg-green-700'
              }`}
            >
              下载视频
            </button>
          </div>

          {isConverting && (
            <div className="mt-4">
              <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                <div 
                  className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                转换进度: {Math.round(progress)}%
              </div>
            </div>
          )}
        </div>

        <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
          <video
            ref={videoRef}
            className="hidden"
            onLoadedMetadata={() => {
              if (canvasRef.current && videoRef.current) {
                canvasRef.current.width = videoRef.current.videoWidth;
                canvasRef.current.height = videoRef.current.videoHeight;
              }
            }}
          />
          
          <canvas
            ref={canvasRef}
            className="w-full h-full"
            onClick={() => {
              if (!isConverting && videoRef.current) {
                if (videoRef.current.paused) {
                  videoRef.current.play();
                } else {
                  videoRef.current.pause();
                }
              }
            }}
          />

          {!isPlaying && !videoFile && (
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-white text-lg">
                请选择视频文件
              </p>
            </div>
          )}
          
          {!isConverting && videoFile && (
            <button
              onClick={() => {
                if (videoRef.current) {
                  if (videoRef.current.paused) {
                    videoRef.current.play();
                  } else {
                    videoRef.current.pause();
                  }
                }
              }}
              className="absolute bottom-4 left-4 bg-black/50 text-white p-2 rounded-full hover:bg-black/70"
            >
              {isPlaying ? '暂停' : '播放'}
            </button>
          )}

          {isConverting && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <div className="text-white text-center">
                <div className="mb-2">正在转换视频...</div>
                <div className="text-sm">进度: {Math.round(progress)}%</div>
                <div className="text-xs mt-1">请勿关闭页面</div>
              </div>
            </div>
          )}
        </div>

        <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
          <p>说明：</p>
          <ul className="list-disc list-inside mt-2">
            <li>支持任意视频格式（浏览器支持的格式）</li>
            <li>水印使用半透明效果，不影响视频观看</li>
            <li>使用 Canvas 实现，性能优良</li>
            <li>水印文本支持自定义</li>
            <li>默认使用用户手机号作为水印</li>
            <li>转换后的视频格式为 WebM（兼容性最好）</li>
            <li>转换过程中请勿关闭页面</li>
            <li>视频质量设置为 8Mbps，可保证较好的画质</li>
          </ul>
        </div>
      </div>
    </div>
  );
} 
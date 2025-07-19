import { request } from './request';

// 学习行为类型枚举
export enum LearningEventType {
  VIDEO_PLAY = 'video_play',           // 视频开始播放
  VIDEO_PAUSE = 'video_pause',         // 视频暂停
  VIDEO_END = 'video_end',             // 视频播放结束
  VIDEO_SEEK = 'video_seek',           // 视频跳转
  PROGRESS_UPDATE = 'progress_update', // 进度更新
  CHAPTER_SELECT = 'chapter_select',   // 章节选择
  COURSE_ENTER = 'course_enter',       // 进入课程
  COURSE_LEAVE = 'course_leave',       // 离开课程
}

// 学习行为数据接口
export interface LearningEvent {
  type: LearningEventType;
  courseId: number;
  chapterId: number;
  userId: number;
  timestamp: number;
  data?: {
    progress?: number;        // 学习进度
    duration?: number;        // 视频总时长
    currentTime?: number;     // 当前播放时间
    seekTime?: number;        // 跳转时间
    playTime?: number;        // 播放时长
    deviceInfo?: string;      // 设备信息
    userAgent?: string;       // 用户代理
  };
}

// 学习行为埋点类
class LearningAnalytics {
  private static instance: LearningAnalytics;
  private events: LearningEvent[] = [];
  private batchSize = 10; // 批量发送大小
  private flushInterval = 30000; // 30秒自动发送
  private flushTimer: NodeJS.Timeout | null = null;

  private constructor() {
    this.startAutoFlush();
  }

  public static getInstance(): LearningAnalytics {
    if (!LearningAnalytics.instance) {
      LearningAnalytics.instance = new LearningAnalytics();
    }
    return LearningAnalytics.instance;
  }

  // 记录学习行为
  public track(event: Omit<LearningEvent, 'timestamp'>): void {
    const learningEvent: LearningEvent = {
      ...event,
      timestamp: Date.now(),
    };

    this.events.push(learningEvent);

    // 达到批量大小时立即发送
    if (this.events.length >= this.batchSize) {
      this.flush();
    }
  }

  // 记录视频播放事件
  public trackVideoPlay(courseId: number, chapterId: number, userId: number, data?: LearningEvent['data']): void {
    this.track({
      type: LearningEventType.VIDEO_PLAY,
      courseId,
      chapterId,
      userId,
      data,
    });
  }

  // 记录视频暂停事件
  public trackVideoPause(courseId: number, chapterId: number, userId: number, data?: LearningEvent['data']): void {
    this.track({
      type: LearningEventType.VIDEO_PAUSE,
      courseId,
      chapterId,
      userId,
      data,
    });
  }

  // 记录视频结束事件
  public trackVideoEnd(courseId: number, chapterId: number, userId: number, data?: LearningEvent['data']): void {
    this.track({
      type: LearningEventType.VIDEO_END,
      courseId,
      chapterId,
      userId,
      data,
    });
  }

  // 记录进度更新事件
  public trackProgressUpdate(courseId: number, chapterId: number, userId: number, progress: number, data?: LearningEvent['data']): void {
    this.track({
      type: LearningEventType.PROGRESS_UPDATE,
      courseId,
      chapterId,
      userId,
      data: {
        ...data,
        progress,
      },
    });
  }

  // 记录章节选择事件
  public trackChapterSelect(courseId: number, chapterId: number, userId: number, data?: LearningEvent['data']): void {
    this.track({
      type: LearningEventType.CHAPTER_SELECT,
      courseId,
      chapterId,
      userId,
      data,
    });
  }

  // 记录进入课程事件
  public trackCourseEnter(courseId: number, userId: number, data?: LearningEvent['data']): void {
    this.track({
      type: LearningEventType.COURSE_ENTER,
      courseId,
      chapterId: 0, // 进入课程时章节ID为0
      userId,
      data,
    });
  }

  // 记录离开课程事件
  public trackCourseLeave(courseId: number, userId: number, data?: LearningEvent['data']): void {
    this.track({
      type: LearningEventType.COURSE_LEAVE,
      courseId,
      chapterId: 0, // 离开课程时章节ID为0
      userId,
      data,
    });
  }

  // 批量发送数据
  private async flush(): Promise<void> {
    if (this.events.length === 0) return;

    const eventsToSend = [...this.events];
    this.events = [];

    try {
      await request('/analytics/learning-events', {
        method: 'POST',
        body: JSON.stringify({ events: eventsToSend }),
      });
    } catch (error) {
      console.error('发送学习行为数据失败:', error);
      // 发送失败时，将事件重新加入队列
      this.events.unshift(...eventsToSend);
    }
  }

  // 启动自动发送定时器
  private startAutoFlush(): void {
    this.flushTimer = setInterval(() => {
      this.flush();
    }, this.flushInterval);
  }

  // 停止自动发送
  public stopAutoFlush(): void {
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
      this.flushTimer = null;
    }
  }

  // 手动发送所有数据
  public async sendAll(): Promise<void> {
    await this.flush();
  }

  // 获取设备信息
  public getDeviceInfo(): string {
    const screen = window.screen;
    const navigator = window.navigator;
    
    return JSON.stringify({
      screenWidth: screen.width,
      screenHeight: screen.height,
      userAgent: navigator.userAgent,
      language: navigator.language,
      platform: navigator.platform,
      cookieEnabled: navigator.cookieEnabled,
      onLine: navigator.onLine,
    });
  }
}

// 导出单例实例
export const learningAnalytics = LearningAnalytics.getInstance();

// 页面可见性变化监听
export const setupPageVisibilityTracking = (courseId: number, userId: number) => {
  let enterTime = Date.now();

  const handleVisibilityChange = () => {
    if (document.hidden) {
      // 页面隐藏，记录离开事件
      const leaveTime = Date.now();
      const playTime = leaveTime - enterTime;
      
      learningAnalytics.trackCourseLeave(courseId, userId, {
        playTime,
        deviceInfo: learningAnalytics.getDeviceInfo(),
        userAgent: navigator.userAgent,
      });
    } else {
      // 页面显示，记录进入事件
      enterTime = Date.now();
      learningAnalytics.trackCourseEnter(courseId, userId, {
        deviceInfo: learningAnalytics.getDeviceInfo(),
        userAgent: navigator.userAgent,
      });
    }
  };

  document.addEventListener('visibilitychange', handleVisibilityChange);

  // 页面卸载时发送数据
  const handleBeforeUnload = () => {
    learningAnalytics.sendAll();
  };

  window.addEventListener('beforeunload', handleBeforeUnload);

  // 返回清理函数
  return () => {
    document.removeEventListener('visibilitychange', handleVisibilityChange);
    window.removeEventListener('beforeunload', handleBeforeUnload);
  };
}; 
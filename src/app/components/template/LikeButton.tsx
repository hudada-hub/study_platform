import React, { useState } from 'react';
import { LikeOutlined, LikeFilled } from '@ant-design/icons';
import { Tooltip } from 'antd';
import { request } from '@/utils/request';
import Swal from 'sweetalert2';
import Cookies from 'js-cookie';

interface LikeButtonProps {
  templateId: number;
  initialLikeCount: number;
  initialIsLiked: boolean;
}

const LikeButton: React.FC<LikeButtonProps> = ({
  templateId,
  initialLikeCount,
  initialIsLiked
}) => {
  const [isLiked, setIsLiked] = useState(initialIsLiked);
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const [isLoading, setIsLoading] = useState(false);

  const handleLike = async () => {
    if (!Cookies.get('token')) {
      await Swal.fire({
        title: '请先登录',
        text: '登录后才能点赞',
        icon: 'warning',
        confirmButtonText: '确定'
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await request(`/detailTemplate/${templateId}/like`, {
        method: isLiked ? 'DELETE' : 'POST'
      });

      if (response.code === 0) {
        setIsLiked(!isLiked);
        setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
      }
    } catch (error) {
      console.error('点赞失败:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-3 mx-auto">
      <Tooltip title={isLiked ? '取消点赞' : '点赞'}>
        <button
          onClick={handleLike}
          disabled={isLoading}
          className={`
            relative
            flex items-center gap-2
            px-6 py-3
            text-lg font-medium
            rounded-full
            transition-all duration-200
            
            ${isLiked 
              ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 hover:scale-105 active:scale-95' 
              : 'bg-white hover:bg-gray-50 text-gray-700 hover:scale-105 active:scale-95'
            }
            disabled:opacity-50 disabled:cursor-not-allowed
            backdrop-blur-sm
            border border-gray-100
          `}
        >
          <span className={`
            text-2xl
            transition-transform duration-200
            ${isLiked ? 'scale-110' : 'scale-100'}
          `}>
            {isLiked ? <LikeFilled /> : <LikeOutlined />}
          </span>
          <span className="min-w-[2ch] text-base">
            {likeCount}
          </span>
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/10 rounded-full">
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            </div>
          )}
        </button>
      </Tooltip>
    </div>
  );
};

export default LikeButton; 
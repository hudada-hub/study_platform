'use client';

import { useState, useEffect } from 'react';
import { request } from '@/utils/request';
import { FiStar } from 'react-icons/fi';
import Swal from 'sweetalert2';

interface RatingFormProps {
  courseId: number;
  onSuccess?: () => void;
}

interface Rating {
  descriptionRating: number;
  valueRating: number;
  teachingRating: number;
  isAnonymous: boolean;
}

export const RatingForm = ({ courseId, onSuccess }: RatingFormProps) => {
  const [rating, setRating] = useState<Rating>({
    descriptionRating: 5,
    valueRating: 5,
    teachingRating: 5,
    isAnonymous: false
  });
  const [loading, setLoading] = useState(false);
  const [existingRating, setExistingRating] = useState<Rating | null>(null);
  const [hasRated, setHasRated] = useState(false);

  // 获取已有评价
  useEffect(() => {
    const fetchRating = async () => {
      try {
        const res = await request<Rating>(`/courses/${courseId}/rating`);
        if (res.code === 0 && res.data) {
          setExistingRating(res.data);
          setRating(res.data);
          setHasRated(true); // 用户已经评价过
        }
      } catch (error) {
        console.error('获取评价失败:', error);
      }
    };
    fetchRating();
  }, [courseId]);

  // 提交评价
  const handleSubmit = async () => {
    try {
      setLoading(true);
      const res = await request(`/courses/${courseId}/rating`, {
        method: 'POST',
        body: JSON.stringify(rating)
      });

      if (res.code === 0) {
        setHasRated(true);
        setExistingRating(rating);
        Swal.fire({
          title: '评价已提交',
          icon: 'success',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          position: 'top-end',
          toast: true
        });
        onSuccess?.();
      }
    } catch (error) {
      console.error('提交评价失败:', error);
      Swal.fire({
        title: '评价失败',
        text: '请稍后重试',
        icon: 'error',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        position: 'top-end',
        toast: true
      });
    } finally {
      setLoading(false);
    }
  };

  // 渲染星级评分
  const renderStars = (name: keyof Rating, label: string, value: number, readonly: boolean = false) => {
    if (typeof value !== 'number') return null;

    return (
      <div className="mb-4">
        <label className="block text-sm text-gray-700 mb-2">{label}</label>
        <div className="flex items-center gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              disabled={readonly}
              onClick={() => !readonly && setRating(prev => ({ ...prev, [name]: star }))}
              className={`text-2xl transition-colors ${
                star <= value ? 'text-cyan-500' : 'text-gray-400'
              } ${readonly ? 'cursor-default' : 'cursor-pointer'}`}
            >
              <FiStar className={star <= value ? 'fill-current' : ''} />
            </button>
          ))}
          {readonly && (
            <span className="ml-2 text-sm text-gray-500">({value}分)</span>
          )}
        </div>
      </div>
    );
  };

  // 如果用户已经评价过，显示评分结果
  if (hasRated && existingRating) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-medium text-gray-900 mb-6">我的课程评价</h3>
        
        {renderStars('descriptionRating', '课程与描述相符程度', existingRating.descriptionRating, true)}
        {renderStars('valueRating', '课程内容的价值', existingRating.valueRating, true)}
        {renderStars('teachingRating', '老师讲解与表达', existingRating.teachingRating, true)}

        <div className="mb-6">
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <span>评价方式：</span>
            <span className={existingRating.isAnonymous ? 'text-cyan-600' : 'text-gray-600'}>
              {existingRating.isAnonymous ? '匿名评价' : '实名评价'}
            </span>
          </div>
        </div>

        <div className="p-4 bg-cyan-50 rounded-lg">
          <p className="text-sm text-cyan-700">
            您已经评价过这门课程，感谢您的反馈！
          </p>
        </div>
      </div>
    );
  }

  // 显示评分表单
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h3 className="text-lg font-medium text-gray-900 mb-6">评价课程</h3>
      
      {renderStars('descriptionRating', '课程与描述相符程度', rating.descriptionRating)}
      {renderStars('valueRating', '课程内容的价值', rating.valueRating)}
      {renderStars('teachingRating', '老师讲解与表达', rating.teachingRating)}

      <div className="mb-6">
        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input
            type="checkbox"
            checked={rating.isAnonymous}
            onChange={(e) => setRating(prev => ({ ...prev, isAnonymous: e.target.checked }))}
            className="rounded bg-gray-100 border-gray-300 text-cyan-500 focus:ring-cyan-500"
          />
          匿名评价
        </label>
      </div>

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full px-4 py-2 bg-cyan-500 text-white rounded hover:bg-cyan-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? '提交中...' : '提交评价'}
      </button>
    </div>
  );
}; 
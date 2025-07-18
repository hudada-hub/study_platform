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

  // 获取已有评价
  useEffect(() => {
    const fetchRating = async () => {
      try {
        const res = await request<Rating>(`/courses/${courseId}/rating`);
        if (res.code === 0 && res.data) {
          setExistingRating(res.data);
          setRating(res.data);
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
        Swal.fire({
          title: existingRating ? '评价已更新' : '评价已提交',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false
        });
        onSuccess?.();
      }
    } catch (error) {
      console.error('提交评价失败:', error);
      Swal.fire({
        title: '评价失败',
        text: '请稍后重试',
        icon: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  // 渲染星级评分
  const renderStars = (name: keyof Rating, label: string) => {
    if (typeof rating[name] !== 'number') return null;

    return (
      <div className="mb-4">
        <label className="block text-sm text-gray-700 mb-2">{label}</label>
        <div className="flex items-center gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(prev => ({ ...prev, [name]: star }))}
              className={`text-2xl transition-colors ${
                star <= (rating[name] as number) ? 'text-orange-500' : 'text-gray-400'
              }`}
            >
              <FiStar className={star <= (rating[name] as number) ? 'fill-current' : ''} />
            </button>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h3 className="text-lg font-medium text-gray-900 mb-6">
        {existingRating ? '修改课程评价' : '评价课程'}
      </h3>
      
      {renderStars('descriptionRating', '课程与描述相符程度')}
      {renderStars('valueRating', '课程内容的价值')}
      {renderStars('teachingRating', '老师讲解与表达')}

      <div className="mb-6">
        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input
            type="checkbox"
            checked={rating.isAnonymous}
            onChange={(e) => setRating(prev => ({ ...prev, isAnonymous: e.target.checked }))}
            className="rounded bg-gray-100 border-gray-300 text-orange-500 focus:ring-orange-500"
          />
          匿名评价
        </label>
      </div>

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? '提交中...' : (existingRating ? '更新评价' : '提交评价')}
      </button>
    </div>
  );
}; 
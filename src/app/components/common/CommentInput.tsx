'use client';

import { useState, useRef, useEffect } from 'react';
import EmojiPicker, { EmojiClickData, Theme } from 'emoji-picker-react';
import { FaceSmileIcon } from '@heroicons/react/24/outline';
import UserAvatar from './UserAvatar';
import { useTheme } from '@/providers/theme-provider';

interface CommentInputProps {
  onSubmit: (content: string) => void;
  placeholder?: string;
  replyingTo?: {
    username: string;
  };
  onCancelReply?: () => void;
  avatarUrl?: string;
}

export const CommentInput = ({
  onSubmit,
  placeholder = '发表你的评论...',
  replyingTo,
  onCancelReply,
  avatarUrl = '/default-avatar.png'
}: CommentInputProps) => {
  const { theme } = useTheme();
  const [content, setContent] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const emojiButtonRef = useRef<HTMLButtonElement>(null);
  const emojiPickerRef = useRef<HTMLDivElement>(null);

  // 处理表情选择
  const handleEmojiSelect = (emojiData: EmojiClickData) => {
    setContent(prev => prev + emojiData.emoji);
    setShowEmojiPicker(false);
  };

  // 处理评论提交
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    
    onSubmit(content);
    setContent('');
  };

  // 点击外部关闭表情选择器
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        showEmojiPicker &&
        emojiPickerRef.current &&
        emojiButtonRef.current &&
        !emojiPickerRef.current.contains(event.target as Node) &&
        !emojiButtonRef.current.contains(event.target as Node)
      ) {
        setShowEmojiPicker(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showEmojiPicker]);

  return (
    <form onSubmit={handleSubmit} className="rounded-lg">
      <div className="flex items-start gap-3">
        <UserAvatar avatarUrl={avatarUrl} size="md" />
        <div className="flex-1">
          <div className="relative">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={replyingTo ? `回复 ${replyingTo.username}...` : placeholder}
              className="w-full p-3 bg-white border border-gray-200 rounded-lg resize-none min-h-[80px] focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-900 placeholder-gray-400"
            />
            <button
              type="button"
              ref={emojiButtonRef}
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="absolute bottom-2 right-2 p-2 text-gray-400 hover:text-cyan-500 rounded-full hover:bg-gray-100 transition-colors"
            >
              <FaceSmileIcon className="w-5 h-5" />
            </button>
          </div>
          {/* 表情选择器 */}
          {showEmojiPicker && (
            <div 
              ref={emojiPickerRef}
              className="absolute z-50 mt-2"
              style={{ transform: 'scale(0.8)', transformOrigin: 'bottom right' }}
            >
              <EmojiPicker
                onEmojiClick={handleEmojiSelect}
                autoFocusSearch={false}
                lazyLoadEmojis={true}
                searchPlaceHolder="搜索表情..."
                theme={Theme.LIGHT}
              />
            </div>
          )}
          <div className="mt-2 text-right">
            <button
              type="submit"
              className="px-4 py-2 bg-cyan-500 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-cyan-600 transition-colors"
              disabled={!content.trim()}
            >
              {replyingTo ? '回复' : '评论'}
            </button>
            {replyingTo && onCancelReply && (
              <button
                type="button"
                onClick={onCancelReply}
                className="ml-2 px-4 py-2 bg-gray-100 text-gray-500 rounded-lg hover:bg-gray-200 transition-colors"
              >
                取消
              </button>
            )}
          </div>
        </div>
      </div>
    </form>
  );
}; 
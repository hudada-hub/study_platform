'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { Button } from 'antd';
import Swal from 'sweetalert2';
import WangEditor from '@/app/components/template/WangEditor';
import { request } from '@/utils/request';
import { ForumSection } from '@/types/forum';

export default function CreatePostPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const sectionId = params.id as string;
  const editPostId = searchParams.get('edit');
  
  const [section, setSection] = useState<ForumSection | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedSubsection, setSelectedSubsection] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [sectionLoading, setSectionLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (sectionId) {
      fetchSectionData();
      if (editPostId) {
        fetchPostData();
      }
    }
  }, [sectionId, editPostId]);

  const fetchSectionData = async () => {
    try {
      setSectionLoading(true);
      const response = await request(`/forum/sections/${sectionId}`, {
        method: 'GET',
      });
      setSection((response.data as ForumSection));
    } catch (error) {
      console.error('获取板块信息失败:', error);
      Swal.fire({
        icon: 'error',
        title: '获取板块信息失败',
        text: '请稍后重试',
      });
    } finally {
      setSectionLoading(false);
    }
  };

  const fetchPostData = async () => {
    try {
      const response = await request(`/forum/posts/${editPostId}`, {
        method: 'GET',
      });
      const post = response.data as { title: string; content: string };
      setTitle(post.title);
      setContent(post.content);
      setIsEditing(true);
    } catch (error) {
      console.error('获取帖子信息失败:', error);
      Swal.fire({
        icon: 'error',
        title: '获取帖子信息失败',
        text: '请稍后重试',
      });
    }
  };

  // 当content变化时，确保WangEditor能正确显示
  useEffect(() => {
    if (isEditing && content) {
      // 强制重新渲染WangEditor
      const timer = setTimeout(() => {
        // 这里可以添加一些逻辑来确保内容被正确设置
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isEditing, content]);

  const handleSubmit = async () => {
    if (!title.trim()) {
      Swal.fire({
        icon: 'warning',
        title: '请输入标题',
        text: '请填写帖子标题',
      });
      return;
    }
    
    if (!content.trim()) {
      Swal.fire({
        icon: 'warning',
        title: '请输入内容',
        text: '请填写帖子内容',
      });
      return;
    }

    try {
      setLoading(true);
      
      if (isEditing) {
        // 编辑帖子
        await request(`/forum/posts/${editPostId}`, {
          method: 'PUT',
          body: JSON.stringify({
            title: title.trim(),
            content: content.trim(),
          }),
        });
        Swal.fire({
          icon: 'success',
          title: '编辑成功',
          text: '帖子已成功更新',
        });
      } else {
        // 发布新帖
        await request('/forum/posts', {
          method: 'POST',
          body: JSON.stringify({
            title: title.trim(),
            content: content.trim(),
            sectionId: selectedSubsection ? parseInt(selectedSubsection) : parseInt(sectionId),
          }),
        });
        Swal.fire({
          icon: 'success',
          title: '发帖成功',
          text: '帖子已成功发布',
          showCancelButton: true,
          confirmButtonText: '查看我的帖子',
          cancelButtonText: '返回板块',
        }).then((result) => {
          if (result.isConfirmed) {
            // 跳转到我的帖子页面
            router.push('/user/forum/posts');
          } else {
            // 跳转到板块详情页面
            router.push(`/forum/sections/${sectionId}`);
          }
        });
        return; // 提前返回，避免执行后面的跳转
      }
      
      // 编辑成功后跳转到板块详情页面
      router.push(`/forum/sections/${sectionId}`);
    } catch (error) {
      console.error(isEditing ? '编辑失败' : '发帖失败', error);
      Swal.fire({
        icon: 'error',
        title: isEditing ? '编辑失败' : '发帖失败',
        text: '请稍后重试',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  if (sectionLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-8xl mx-auto px-4 py-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="text-center text-gray-500">加载中...</div>
          </div>
        </div>
      </div>
    );
  }

  if (!section) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-8xl mx-auto px-4 py-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="text-center text-gray-500">板块不存在</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-8xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm">
          {/* 页面头部 */}
          <div className="border-b border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-medium text-gray-900">
                  {isEditing ? '编辑帖子' : '发布新帖'}
                </h1>
                <p className="text-gray-600 mt-1">
                  板块：{section.name}
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <Button onClick={handleCancel}>
                  取消
                </Button>
                <Button 
                  type="primary" 
                  onClick={handleSubmit}
                  loading={loading}
                  disabled={!title.trim() || !content.trim()}
                >
                  {isEditing ? '保存' : '发布'}
                </Button>
              </div>
            </div>
          </div>

          {/* 发帖表单 */}
          <div className="p-6">
            {/* 子版块选择 */}
            {section?.children && section.children.length > 0 && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  选择子版块
                </label>
                <select
                  value={selectedSubsection}
                  onChange={(e) => setSelectedSubsection(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-cyan-500"
                >
                  <option value="">{section.name} (父板块)</option>
                  {section.children.map((child) => (
                    <option key={child.id} value={child.id.toString()}>
                      {child.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* 标题输入 */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                标题 *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="请输入帖子标题"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-cyan-500"
                maxLength={200}
              />
              <div className="text-xs text-gray-500 mt-1">
                {title.length}/200
              </div>
            </div>

            {/* 内容编辑器 */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                内容 *
              </label>
              <WangEditor
                key={isEditing ? editPostId : 'new'}
                content={content}
                defaultContent={isEditing ? content : ''}
                onChange={setContent}
                placeholder="请输入帖子内容..."
                height={400}
                maxImageSize={10 * 1024 * 1024} // 10MB
                maxVideoSize={50 * 1024 * 1024} // 50MB
                maxImageNumber={10}
                maxVideoNumber={3}
                uploadUrl="/api/common/upload"
              />
            </div>

            {/* 发帖提示 */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="text-sm font-medium text-blue-900 mb-2">
                {isEditing ? '编辑须知：' : '发帖须知：'}
              </h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• 请遵守社区规范，文明发帖</li>
                <li>• 支持图片和视频上传，图片最大10MB，视频最大50MB</li>
                <li>• 标题不能超过200字符</li>
                <li>• {isEditing ? '编辑前请仔细检查内容' : '发布前请仔细检查内容'}</li>
                {isEditing && (
                  <li>• 编辑后帖子将重新进入审核状态</li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 
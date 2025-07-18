'use client';

import React, { useEffect, useState } from 'react';
import { request } from '@/utils/request';
import { ResponseCode } from '@/utils/response';
import { FaUser, FaLock, FaEnvelope } from 'react-icons/fa';
import { showSuccess, showError, showWarning } from '@/utils/toast';
import { useRouter } from 'next/navigation';

interface UserProfile {
  nickname: string;
  email: string;
  avatar: string;
  bio: string;
}

interface PasswordForm {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export default function UserSettings() {
  const [profile, setProfile] = useState<UserProfile>({
    nickname: '',
    email: '',
    avatar: '',
    bio: ''
  });

  const [passwordForm, setPasswordForm] = useState<PasswordForm>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const router = useRouter();

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      setIsLoading(true);
      const response = await request<UserProfile>('/user/profile',{
        method:'GET'
      });
      if (response.code === ResponseCode.SUCCESS && response.data) {
        setProfile(response.data);
        setPreviewUrl(response.data.avatar || '');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        // 显示本地预览
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviewUrl(reader.result as string);
        };
        reader.readAsDataURL(file);
        
        // 立即上传文件
        const formData = new FormData();
        formData.append('file', file);
        
        // 显示上传中状态
        setIsSaving(true);
        
        const uploadResponse = await request<{ url: string }>('/common/upload', {
          method: 'POST',
          body: formData,
        });
        
        if (uploadResponse.code === ResponseCode.SUCCESS && uploadResponse.data?.url) {
          const avatarUrl = uploadResponse.data.url;
          // 更新头像URL
          setProfile(prev => ({
            ...prev,
            avatar: avatarUrl
          }));
          showSuccess('头像上传成功');
        }
      } catch (error) {
        showError('头像上传失败', '请重试');
        // 上传失败时，恢复原来的头像
        setPreviewUrl(profile.avatar || '');
      } finally {
        setIsSaving(false);
        setSelectedImage(null);
      }
    }
  };

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSaving(true);
     
      // 保存个人信息
      const response = await request<UserProfile>('/user/profile', {
        method: 'PUT',
        body: JSON.stringify(profile)
      });

      if (response.code === ResponseCode.SUCCESS) {
        showSuccess('保存成功');
        router.refresh();
      }
    } catch (error) {
      showError('保存失败', '请重试');
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      showWarning('两次输入的新密码不一致');
      return;
    }

    try {
      setIsChangingPassword(true);
      const response = await request('/user/change-password', {
        method: 'POST',
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword
        })
      });

      if (response.code === ResponseCode.SUCCESS) {
        showSuccess('密码修改成功');
        setPasswordForm({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
        router.refresh();
      }
    } catch (error) {
      showError('密码修改失败', '请重试');
    } finally {
      setIsChangingPassword(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 p-4">
      <h1 className="text-2xl font-bold text-gray-900">个人设置</h1>

      {/* 基本信息设置 */}
      <div className="bg-white rounded-lg  p-6">
        <h2 className="text-xl font-semibold mb-6 flex items-center">
          <FaUser className="mr-2" />
          基本信息
        </h2>
        <form onSubmit={handleSaveProfile} className="space-y-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  用户名
                </label>
                <input
                  type="text"
                  name="nickname"
                  value={profile.nickname}
                  onChange={handleProfileChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <FaEnvelope className="inline mr-1" />
                  电子邮箱
                </label>
                <input
                  type="email"
                  name="email"
                  value={profile.email}
                  onChange={handleProfileChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  个人简介
                </label>
                <textarea
                  name="bio"
                  value={profile.bio}
                  onChange={handleProfileChange}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="w-full md:w-48">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                头像
              </label>
              <div className="flex flex-col items-center">
                <div className="w-48 h-48 relative rounded-lg overflow-hidden mb-4">
                  <img
                    src={previewUrl || '/default-avatar.png'}
                    alt="头像预览"
                    className="w-full h-full object-cover"
                  />
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  id="avatar-upload"
                />
                <label
                  htmlFor="avatar-upload"
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md cursor-pointer hover:bg-gray-200 transition-colors"
                >
                  更换头像
                </label>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {isSaving ? '保存中...' : '保存修改'}
            </button>
          </div>
        </form>
      </div>

      {/* 密码修改 */}
      <div className="bg-white rounded-lg  p-6">
        <h2 className="text-xl font-semibold mb-6 flex items-center">
          <FaLock className="mr-2" />
          修改密码
        </h2>
        <form onSubmit={handleChangePassword} className="max-w-md space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              当前密码
            </label>
            <input
              type="password"
              name="currentPassword"
              value={passwordForm.currentPassword}
              onChange={handlePasswordChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              新密码
            </label>
            <input
              type="password"
              name="newPassword"
              value={passwordForm.newPassword}
              onChange={handlePasswordChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              确认新密码
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={passwordForm.confirmPassword}
              onChange={handlePasswordChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isChangingPassword}
              className="px-6 py-2 bg-primary text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {isChangingPassword ? '修改中...' : '修改密码'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

'use client';

import React, { useEffect, useState } from 'react';
import { request } from '@/utils/request';
import { ResponseCode } from '@/utils/response';
import { FaUser, FaLock, FaEnvelope, FaPhone } from 'react-icons/fa';
import { showSuccess, showError, showWarning } from '@/utils/toast';
import { useRouter } from 'next/navigation';
import { setUserInfo } from '@/utils/client-auth';

interface UserProfile {
  id: number;
  nickname: string;
  email: string;
  avatar: string;
  bio: string;
  phone: string;
  role: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  lastLoginAt: string;
  points: number;
  studyTime: number;
}

interface PasswordForm {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export default function UserSettings() {
  const [profile, setProfile] = useState<UserProfile>({
    id: 0,
    nickname: '',
    email: '',
    avatar: '',
    bio: '',
    phone: '',
    role: '',
    status: '',
    createdAt: '',
    updatedAt: '',
    lastLoginAt: '',
    points: 0,
    studyTime: 0
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
  const [showChangePhone, setShowChangePhone] = useState(false);
  const [newPhone, setNewPhone] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [isSendingCode, setIsSendingCode] = useState(false);
  const [isChangingPhone, setIsChangingPhone] = useState(false);
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
        handleSaveProfile();
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

  const handleSaveProfile = async () => {
    
    try {
      setIsSaving(true);
     
      // 保存个人信息
      const response = await request<UserProfile>('/user/profile', {
        method: 'PUT',
        body: JSON.stringify(profile)
      });

      if (response.code === ResponseCode.SUCCESS) {
        // 更新cookie中的用户信息
        if (response.data) {
          setUserInfo({
            id: response.data.id,
            username: response.data.nickname,
            email: response.data.email,
            phone: response.data.phone,
            role: response.data.role,
            status: response.data.status,
            avatar: response.data.avatar,
            bio: response.data.bio,
            createdAt: response.data.createdAt,
            updatedAt: response.data.updatedAt,
            lastLoginAt: response.data.lastLoginAt,
            points: response.data.points,
            studyTime: response.data.studyTime
          });
        }
        
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

  const handleSendVerificationCode = async () => {
    if (!newPhone) {
      showWarning('请输入新手机号');
      return;
    }

    try {
      setIsSendingCode(true);
      const response = await request('/auth/send-code', {
        method: 'POST',
        body: JSON.stringify({
          phone: newPhone,
          type: 'change_phone'
        })
      });

      if (response.code === ResponseCode.SUCCESS) {
        showSuccess('验证码已发送');
      }
    } catch (error) {
      showError('验证码发送失败', '请重试');
    } finally {
      setIsSendingCode(false);
    }
  };

  const handleChangePhone = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPhone || !verificationCode) {
      showWarning('请填写完整信息');
      return;
    }

    try {
      setIsChangingPhone(true);
      const response = await request('/user/change-phone', {
        method: 'POST',
        body: JSON.stringify({
          newPhone,
          verificationCode
        })
      });

      if (response.code === ResponseCode.SUCCESS) {
        showSuccess('手机号修改成功');
        setProfile(prev => ({ ...prev, phone: newPhone }));
        setShowChangePhone(false);
        setNewPhone('');
        setVerificationCode('');
        router.refresh();
      }
    } catch (error) {
      showError('手机号修改失败', '请重试');
    } finally {
      setIsChangingPhone(false);
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
                  <FaPhone className="inline mr-1" />
                  手机号
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={profile.phone}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                    readOnly
                  />
                  <button
                    type="button"
                    onClick={() => setShowChangePhone(true)}
                    className="px-4 py-2 whitespace-nowrap text-sm border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                  >
                    更换手机号
                  </button>
                </div>
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

      {/* 更换手机号弹窗 */}
      {showChangePhone && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-4">更换手机号</h3>
            <form onSubmit={handleChangePhone} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  新手机号
                </label>
                <input
                  type="text"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="请输入新手机号"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  验证码
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="请输入验证码"
                    required
                  />
                  <button
                    type="button"
                    onClick={handleSendVerificationCode}
                    disabled={isSendingCode || !newPhone}
                    className="px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50"
                  >
                    {isSendingCode ? '发送中...' : '发送验证码'}
                  </button>
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowChangePhone(false);
                    setNewPhone('');
                    setVerificationCode('');
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                >
                  取消
                </button>
                <button
                  type="submit"
                  disabled={isChangingPhone}
                  className="flex-1 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  {isChangingPhone ? '修改中...' : '确认修改'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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

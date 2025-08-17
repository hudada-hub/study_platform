'use client';

import { useState } from 'react';
import { Button, Input, Card, Upload } from 'antd';
import { moderateImage, moderateImages } from '@/services/contentModeration';
import Swal from 'sweetalert2';
import { UploadOutlined } from '@ant-design/icons';

const { TextArea } = Input;

const TestImageModerationPage = () => {
  const [imageUrl, setImageUrl] = useState('');
  const [isBase64, setIsBase64] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);

  const handleTest = async () => {
    if (!imageUrl.trim()) {
      Swal.fire({
        icon: 'warning',
        title: '提示',
        text: '请输入图片URL或Base64编码',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        position: 'top-end',
        toast: true
      });
      return;
    }

    setLoading(true);
    try {
      const moderationResult = await moderateImage(imageUrl, isBase64);
      setResult(moderationResult);
      
      if (moderationResult.success) {
        if (moderationResult.isSafe) {
          Swal.fire({
            icon: 'success',
            title: '审核通过',
            text: '图片内容安全',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            position: 'top-end',
            toast: true
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: '审核未通过',
            text: `图片内容不安全：${moderationResult.message}`,
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            position: 'top-end',
            toast: true
          });
        }
      } else {
        Swal.fire({
          icon: 'error',
          title: '审核失败',
          text: `审核失败：${moderationResult.message}`,
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          position: 'top-end',
          toast: true
        });
      }
    } catch (error) {
      console.error('测试失败:', error);
      Swal.fire({
        icon: 'error',
        title: '测试失败',
        text: '测试失败，请稍后重试',
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

  const handleBatchTest = async () => {
    if (uploadedImages.length === 0) {
      Swal.fire({
        icon: 'warning',
        title: '提示',
        text: '请先上传图片',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        position: 'top-end',
        toast: true
      });
      return;
    }

    setLoading(true);
    try {
      const results = await moderateImages(uploadedImages);
      setResult({ batchResults: results });
      
      const unsafeCount = results.filter(r => !r.isSafe).length;
      const totalCount = results.length;
      
      if (unsafeCount === 0) {
        Swal.fire({
          icon: 'success',
          title: '批量审核完成',
          text: `所有图片(${totalCount}张)都通过审核`,
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          position: 'top-end',
          toast: true
        });
      } else {
        Swal.fire({
          icon: 'warning',
          title: '批量审核完成',
          text: `${totalCount}张图片中有${unsafeCount}张未通过审核`,
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          position: 'top-end',
          toast: true
        });
      }
    } catch (error) {
      console.error('批量测试失败:', error);
      Swal.fire({
        icon: 'error',
        title: '批量测试失败',
        text: '批量测试失败，请稍后重试',
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

  const handleUpload = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/common/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      if (result.code === 0) {
        setUploadedImages(prev => [...prev, result.data.url]);
        Swal.fire({
          icon: 'success',
          title: '图片上传成功',
          text: '图片已成功上传',
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: '图片上传失败',
          text: '请重试',
        });
      }
    } catch (error) {
      console.error('上传失败:', error);
      Swal.fire({
        icon: 'error',
        title: '图片上传失败',
        text: '请重试',
      });
    }
  };

  const uploadProps = {
    beforeUpload: (file: File) => {
      handleUpload(file);
      return false; // 阻止默认上传行为
    },
    showUploadList: false,
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <Card title="图片内容审核测试" className="mb-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                图片URL或Base64编码:
              </label>
              <TextArea
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="请输入图片URL或Base64编码..."
                rows={4}
                className="w-full"
              />
            </div>
            
            <div className="flex items-center space-x-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={isBase64}
                  onChange={(e) => setIsBase64(e.target.checked)}
                  className="mr-2"
                />
                Base64编码
              </label>
            </div>
            
            <Button 
              type="primary" 
              onClick={handleTest}
              loading={loading}
              disabled={!imageUrl.trim()}
            >
              开始审核
            </Button>
          </div>
        </Card>

        <Card title="批量图片审核测试" className="mb-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                上传图片进行批量审核:
              </label>
              <Upload {...uploadProps}>
                <Button icon={<UploadOutlined />}>上传图片</Button>
              </Upload>
            </div>
            
            {uploadedImages.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  已上传的图片 ({uploadedImages.length}张):
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {uploadedImages.map((url, index) => (
                    <div key={index} className="relative">
                      <img
                        src={url}
                        alt={`图片 ${index + 1}`}
                        className="w-full h-20 object-cover rounded border"
                      />
                      <button
                        onClick={() => setUploadedImages(prev => prev.filter((_, i) => i !== index))}
                        className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <Button 
              type="primary" 
              onClick={handleBatchTest}
              loading={loading}
              disabled={uploadedImages.length === 0}
            >
              批量审核 ({uploadedImages.length}张)
            </Button>
          </div>
        </Card>

        {result && (
          <Card title="审核结果">
            <div className="space-y-2">
              <div>
                <strong>审核状态:</strong> {result.success ? '成功' : '失败'}
              </div>
              <div>
                <strong>是否安全:</strong> {result.isSafe ? '是' : '否'}
              </div>
              <div>
                <strong>消息:</strong> {result.message}
              </div>
              {result.labels && result.labels.length > 0 && (
                <div>
                  <strong>检测标签:</strong> {result.labels.join(', ')}
                </div>
              )}
              {result.confidence !== undefined && (
                <div>
                  <strong>置信度:</strong> {(result.confidence * 100).toFixed(2)}%
                </div>
              )}
              {result.batchResults && (
                <div>
                  <strong>批量审核结果:</strong>
                  <div className="mt-2 space-y-1">
                    {result.batchResults.map((batchResult: any, index: number) => (
                      <div key={index} className="text-sm">
                        图片 {index + 1}: {batchResult.isSafe ? '安全' : '不安全'} - {batchResult.message}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {result.details && (
                <div>
                  <strong>详细信息:</strong>
                  <pre className="mt-2 p-2 bg-gray-100 rounded text-sm overflow-auto">
                    {JSON.stringify(result.details, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default TestImageModerationPage; 
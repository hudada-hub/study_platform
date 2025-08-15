'use client';

import { useState } from 'react';
import { Button, Input, Card } from 'antd';
import { moderateText } from '@/services/contentModeration';
import Swal from 'sweetalert2';

const { TextArea } = Input;

const TestContentModerationPage = () => {
  const [text, setText] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleTest = async () => {
    if (!text.trim()) {
      Swal.fire({
        icon: 'warning',
        title: '提示',
        text: '请输入要测试的文本',
        confirmButtonText: '确定'
      });
      return;
    }

    setLoading(true);
    try {
      const moderationResult = await moderateText(text);
      setResult(moderationResult);
      
      if (moderationResult.success) {
        if (moderationResult.isSafe) {
          Swal.fire({
            icon: 'success',
            title: '审核通过',
            text: '文本内容安全',
            confirmButtonText: '确定'
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: '审核未通过',
            text: `文本内容不安全：${moderationResult.message}`,
            confirmButtonText: '确定'
          });
        }
      } else {
        Swal.fire({
          icon: 'error',
          title: '审核失败',
          text: `审核失败：${moderationResult.message}`,
          confirmButtonText: '确定'
        });
      }
    } catch (error) {
      console.error('测试失败:', error);
      Swal.fire({
        icon: 'error',
        title: '测试失败',
        text: '测试失败，请稍后重试',
        confirmButtonText: '确定'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <Card title="文字内容审核测试" className="mb-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                测试文本:
              </label>
              <TextArea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="请输入要测试的文本内容..."
                rows={6}
                className="w-full"
              />
            </div>
            
            <Button 
              type="primary" 
              onClick={handleTest}
              loading={loading}
              disabled={!text.trim()}
            >
              开始审核
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

export default TestContentModerationPage; 
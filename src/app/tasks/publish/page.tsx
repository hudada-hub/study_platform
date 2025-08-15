'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Form, 
  Input, 
  Select, 
  Button, 
  Card, 
  message, 
  InputNumber,
  Upload,
  Space,
  Divider,
  DatePicker
} from 'antd';
import { 
  PlusOutlined, 
  UploadOutlined,
  ExclamationCircleOutlined 
} from '@ant-design/icons';
import { getToken, request } from '@/utils/request';
import { ResponseUtil } from '@/utils/response';
import qs from 'qs';
import WangEditor from '@/app/components/wangEditor';
import Swal from 'sweetalert2';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import locale from 'antd/es/date-picker/locale/zh_CN';

// 设置dayjs为中文
dayjs.locale('zh-cn');

const { Option } = Select;

interface TaskCategory {
  id: number;
  name: string;
  imageUrl: string;
  description: string;
}

interface TaskFormData {
  title: string;
  content: string;
  categoryId: number;
  points: number;
  completedAt?: string;
  attachments?: any[];
}

const PublishTaskPage: React.FC = () => {
  const router = useRouter();
  const [form] = Form.useForm();
  const [categories, setCategories] = useState<TaskCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [taskId, setTaskId] = useState<number | null>(null);
  const [taskData, setTaskData] = useState<TaskFormData | null>(null);
  const [editorContent, setEditorContent] = useState<string>('');
  const [fileList, setFileList] = useState<any[]>([]);

  // 获取任务分类
  const fetchCategories = async () => {
    try {
      const response = await request('/tasks/categories',{
        method:"GET"
      });
      console.log(response,'response')
      if (ResponseUtil.success(response)) {
        setCategories(response.data as TaskCategory[]);
      }
    } catch (error) {
      console.error('获取任务分类失败:', error);
      Swal.fire({
        icon: 'error',
        title: '获取任务分类失败',
        text: '请稍后重试',
      });
    }
  };

  useEffect(() => {
    checkAuth();
    fetchCategories();
    checkEditMode();
  }, []);

  // 监控fileList变化，确保编辑模式下附件数据不丢失
  useEffect(() => {
    if (isEdit && fileList.length > 0) {
      console.log('编辑模式下的fileList:', fileList);
    }
  }, [fileList, isEdit]);

  // 检查登录状态
  const checkAuth = () => {
    const token = getToken();
    if (!token) {
      Swal.fire({
        icon: 'warning',
        title: '请先登录',
        text: '登录后才能发布任务',
      });
      router.push('/login');
      return;
    }
  };

  // 检查是否为编辑模式
  const checkEditMode = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const editId = urlParams.get('edit');
    if (editId) {
      setIsEdit(true);
      setTaskId(parseInt(editId));
      fetchTaskData(parseInt(editId));
    }
  };

  // 获取任务数据用于编辑
  const fetchTaskData = async (id: number) => {
    try {
      setLoading(true);
      const response = await request(`/tasks/${id}`, {
        method: 'GET'
      });
      
      if (ResponseUtil.success(response)) {
        const task = response.data as any;
        setTaskData(task);
        
        // 检查权限：只有任务发布者才能编辑
        const { userInfo } = await import('@/utils/client-auth').then(m => m.getUserAuth());
        if (userInfo?.id !== task.author?.id) {
          Swal.fire({
            icon: 'error',
            title: '权限不足',
            text: '您没有权限编辑此任务',
          });
          router.push('/tasks');
          return;
        }
        
        // 设置表单数据
        form.setFieldsValue({
          title: task.title,
          categoryId: task.category?.id || task.categoryId,
          points: task.points,
          completedAt: task.completedAt ? dayjs(task.completedAt) : null,
        });
        
        console.log('设置表单数据:', {
          title: task.title,
          categoryId: task.category?.id || task.categoryId,
          points: task.points,
          task: task
        });
        
        // 调试附件数据
        console.log('原始attachments数据:', task.attachments);
        console.log('attachments类型:', typeof task.attachments);
        console.log('attachments是否为数组:', Array.isArray(task.attachments));
        
        // 设置编辑器内容
        setEditorContent(task.content);
        
        // 设置文件列表
        if (task.attachments && Array.isArray(task.attachments)) {
          const files = task.attachments.map((attachment: any, index: number) => ({
            uid: `-${index}`,
            name: attachment.name || `附件${index + 1}`,
            status: 'done',
            url: attachment.url || attachment,
          }));
          setFileList(files);
        } else if (task.attachments && typeof task.attachments === 'string') {
          // 如果attachments是JSON字符串，需要解析
          try {
            const parsedAttachments = JSON.parse(task.attachments);
            if (Array.isArray(parsedAttachments)) {
              const files = parsedAttachments.map((attachment: any, index: number) => ({
                uid: `-${index}`,
                name: attachment.name || `附件${index + 1}`,
                status: 'done',
                url: attachment.url || attachment,
              }));
              setFileList(files);
            }
          } catch (error) {
            console.error('解析附件数据失败:', error);
          }
        }
      } else {
        Swal.fire({
          icon: 'error',
          title: '获取任务数据失败',
          text: '请稍后重试',
        });
        router.push('/tasks');
      }
    } catch (error) {
      console.error('获取任务数据失败:', error);
      Swal.fire({
        icon: 'error',
        title: '获取任务数据失败',
        text: '请稍后重试',
      });
      router.push('/tasks');
    } finally {
      setLoading(false);
    }
  };

  // 提交表单
  const handleSubmit = async (values: TaskFormData) => {
    setSubmitting(true);
    try {
      const url = isEdit ? `/tasks/${taskId}` : '/tasks';
      const method = isEdit ? 'PUT' : 'POST';

      console.log('提交时的fileList:', fileList);
      
      // 准备附件数据 - 格式为 [{name:'文件名',url:'附件地址'}]
      const attachmentUrls = fileList
        .filter(file => file.status === 'done' && file.response?.url)
        .map(file => ({
          name: file.name,
          url: file.response?.url
        }));
      
      console.log('处理后的attachmentUrls:', attachmentUrls);
      
      // 格式化截止日期为时间戳
      const completedAtTimestamp = values.completedAt ? dayjs(values.completedAt).valueOf() : null;
      
      // 确保attachments字段始终有值，即使为空数组
      const submitData = isEdit ? { 
        ...values, 
        completedAt: completedAtTimestamp,
        status: 'PENDING',
        attachments: JSON.stringify(attachmentUrls || [])
      } : {
        ...values,
        completedAt: completedAtTimestamp,
        attachments: JSON.stringify(attachmentUrls || [])
      };
      
      console.log('最终提交数据:', submitData);
      
      const response = await request(url, {
        method,
        body: qs.stringify(submitData),
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
      
      if (ResponseUtil.success(response)) {
        Swal.fire({
          icon: 'success',
          title: isEdit ? '任务更新成功' : '任务发布成功',
          text: isEdit ? '任务已更新，已重新提交审核' : '任务发布成功，等待审核',
        });
        router.push('/user/tasks/published');
      }
    } catch (error) {
      console.error(isEdit ? '更新任务失败' : '发布任务失败', error);
      Swal.fire({
        icon: 'error',
        title: isEdit ? '更新任务失败' : '发布任务失败',
        text: '请稍后重试',
      });
    } finally {
      setSubmitting(false);
    }
  };

  // 上传文件
  const handleUpload = async (options: any) => {
    const { file, onSuccess, onError, onProgress } = options;
    
    // 立即设置文件状态为上传中
    const uploadingFile = {
      uid: file.uid,
      name: file.name,
      status: 'uploading' as const,
      percent: 0,
    };
    
    setFileList(prev => {
      const exists = prev.some(f => f.uid === file.uid);
      return exists ? prev : [...prev, uploadingFile];
    });
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      // 模拟上传进度
      const progressInterval = setInterval(() => {
        const currentFile = fileList.find(f => f.uid === file.uid);
        if (currentFile && currentFile.status === 'uploading') {
          const newPercent = Math.min((currentFile.percent || 0) + Math.random() * 20, 90);
          setFileList(prev => prev.map(f => 
            f.uid === file.uid 
              ? { ...f, percent: newPercent }
              : f
          ));
        }
      }, 200);
      
      const response = await fetch('/api/common/upload?strictFormat=false', {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${getToken()}`
        }
      });

      clearInterval(progressInterval);
      
      const result = await response.json();
      if (ResponseUtil.success(result)) {
        const url = (result.data as {url:string}).url;
        
        // 设置上传完成状态
        setFileList(prev => prev.map(f => 
          f.uid === file.uid 
            ? { ...f, status: 'done' as const, url: url, percent: 100 }
            : f
        ));
        
        // 调用成功回调
        onSuccess({ url }, response);
      } else {
        // 设置上传失败状态
        setFileList(prev => prev.map(f => 
          f.uid === file.uid 
            ? { ...f, status: 'error' as const }
            : f
        ));
        
        Swal.fire({
          icon: 'error',
          title: '文件上传失败',
          text: '请稍后重试',
        });
        onError(new Error('文件上传失败'));
      }
    } catch (error) {
      // 设置上传失败状态
      setFileList(prev => prev.map(f => 
        f.uid === file.uid 
          ? { ...f, status: 'error' as const }
          : f
      ));
      
      console.error('文件上传失败:', error);
      Swal.fire({
        icon: 'error',
        title: '文件上传失败',
        text: '请稍后重试',
      });
      onError(error);
    }
  };

  // 处理文件列表变化
  const handleFileListChange = (info: any) => {
    console.log('文件列表变化:', info);
    console.log('info.fileList:', info.fileList);
    
    // 保留所有文件，包括已有的和新增的
    const allFiles = info.fileList.map((file: any) => {
      // 如果文件已经有uid和url，说明是已有的文件
      if (file.uid && file.response?.url && file.status === 'done') {
        return file;
      }
      // 如果是新上传的文件，保持原有逻辑
      return file;
    });
    
    console.log('处理后的allFiles:', allFiles);
    setFileList(allFiles);
  };

  // 处理删除文件
  const handleRemoveFile = (file: any) => {
    Swal.fire({
      title: '确定要删除此文件吗？',
      text: `您确定要删除文件 "${file.name}" 吗？此操作不可逆。`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#6c757d',
      confirmButtonText: '删除',
      cancelButtonText: '取消',
    }).then((result) => {
      if (result.isConfirmed) {
        // 直接从本地状态中移除文件
        setFileList(prev => prev.filter(f => f.uid !== file.uid));
        
        Swal.fire({
          icon: 'success',
          title: '文件删除成功',
          text: `文件 "${file.name}" 已从列表中移除。`,
        });
      }
    });
  };

  // 处理文件下载
  const handleDownloadFile = (file: any) => {
    try {
      // 创建一个临时的下载链接
      const a = document.createElement('a');
      a.href = file.response?.url || file.url;
      a.download = file.name;
      a.target = '_blank';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      Swal.fire({
        icon: 'success',
        title: '文件下载已开始',
        text: `文件 "${file.name}" 正在下载。`,
      });
    } catch (error) {
      console.error('文件下载失败:', error);
      Swal.fire({
        icon: 'error',
        title: '文件下载失败',
        text: '请稍后重试',
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* 页面标题 */}
        <div className="mb-8">
          <h1 className="text-3xl font-normal text-gray-900 mb-2">{isEdit ? '编辑任务' : '发布任务'}</h1>
          <p className="text-gray-600">{isEdit ? '编辑您的任务需求' : '发布您的任务需求，让合适的人来帮您完成'}</p>
        </div>

        <Card>
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
          
          >
            {/* 任务标题 */}
            <Form.Item
              label="任务标题"
              name="title"
              rules={[
                { required: true, message: '请输入任务标题' },
                { max: 200, message: '标题不能超过200个字符' },
              ]}
            >
              <Input 
                placeholder="请简要描述您的任务需求"
                maxLength={200}
                showCount
              />
            </Form.Item>

            {/* 任务分类 */}
            <Form.Item
              label="任务分类"
              name="categoryId"
              rules={[{ required: true, message: '请选择任务分类' }]}
            >
              <Select placeholder="请选择任务分类">
                {categories.map(category => (
                  <Option key={category.id} value={category.id}>
                    <div className="flex items-center">
                      <img 
                        src={category.imageUrl} 
                        alt={category.name}
                        className="w-6 h-6 mr-2 rounded"
                      />
                      <span>{category.name}</span>
                    </div>
                  </Option>
                ))}
              </Select>
            </Form.Item>

            {/* 任务完成时间 */}
            <Form.Item
              label="任务截止时间"
              name="completedAt"
            >
              <DatePicker
                showTime
                format="YYYY-MM-DD HH:mm"
                placeholder="请选择任务截止时间（可选）"
                style={{ width: '100%' }}
                disabledDate={(current) => current && current < dayjs().startOf('day')}
                locale={locale}
              />
            </Form.Item>

            {/* 悬赏积分 */}
            <Form.Item
              label="悬赏积分"
              name="points"
              rules={[
                { required: true, message: '请设置悬赏积分' },
                { type: 'number', min: 1, message: '积分不能少于1' },
                { type: 'number', max: 10000, message: '积分不能超过10000' },
              ]}
            >
              <InputNumber
                placeholder="请输入悬赏积分"
                min={1}
                max={10000}
                style={{ width: '100%' }}
                addonAfter="积分"
              />
            </Form.Item>

            {/* 任务详情 */}
            <Form.Item
              label="任务详情"
              name="content"
              rules={[
                { required: true, message: '请填写任务详情' },
                { min: 10, message: '任务详情不能少于10个字符' },
              ]}
            >
              <WangEditor
                placeholder="请详细描述您的任务需求、具体要求、完成标准等..."
                height={400}
                maxImageSize={10 * 1024 * 1024} // 10MB
                maxVideoSize={50 * 1024 * 1024} // 50MB
                maxImageNumber={10}
                maxVideoNumber={5}
                content={editorContent}
              />
            </Form.Item>

            {/* 任务附件 */}
            <Form.Item
              label="任务附件"
              name="attachments"
            >
              <Upload
                listType="text"
                customRequest={handleUpload}
                fileList={fileList}
                onChange={handleFileListChange}
                maxCount={5}
                onRemove={(file) => {
                  setFileList(prev => prev.filter(f => f.uid !== file.uid));
                }}
                itemRender={(originNode, file) => (
                  <div className="flex items-center justify-between w-full">
                    <span className="flex-1 truncate">{file.name}</span>
                    <div className="flex items-center gap-2">
                      {file.status === 'uploading' && (
                        <span className="text-blue-500 text-xs">
                          上传中... {Math.round(file.percent || 0)}%
                        </span>
                      )}
                      {file.status === 'done' && (
                        <>
                          <span className="text-green-500 text-xs">✓ 完成</span>
                          <Button
                            type="text"
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDownloadFile(file);
                            }}
                            className="text-blue-500 hover:text-blue-700"
                          >
                            下载
                          </Button>
                        </>
                      )}
                      {file.status === 'error' && (
                        <span className="text-red-500 text-xs">✗ 失败</span>
                      )}
                      <Button
                        type="text"
                        size="small"
                        danger
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveFile(file);
                        }}
                        className="text-red-500 hover:text-red-700"
                      >
                        删除
                      </Button>
                    </div>
                  </div>
                )}
              >
                <Button icon={<UploadOutlined />}>
                  上传附件
                </Button>
              </Upload>
              <div className="text-xs text-gray-500 mt-1">
                支持图片、文档等格式，最大5个文件
              </div>
            </Form.Item>

            <Divider />

            {/* 发布须知 */}
            <div className="bg-blue-50 p-4 rounded-lg mb-6">
              <div className="flex items-start">
                <ExclamationCircleOutlined className="text-blue-500 mr-2 mt-0.5" />
                <div className="text-sm text-blue-700">
                  <p className="font-medium mb-2">发布须知：</p>
                  <ul className="space-y-1 text-xs">
                    <li>• 请确保任务描述清晰明确，便于接单者理解</li>
                    <li>• 合理设置悬赏积分，过低可能无人接单，过高可能超出预算</li>
                    <li>• 任务发布后需要管理员审核，审核通过后才能被接单</li>
                    <li>• 任务一旦有人接单，您需要支付相应积分</li>
                    <li>• 请及时确认任务完成情况，确保双方权益</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* 提交按钮 */}
            <Form.Item>
              <Space>
                <Button 
                  type="primary" 
                  htmlType="submit"
                  loading={submitting}
                  icon={<PlusOutlined />}
                  size="large"
                >
                  {isEdit ? '更新任务' : '发布任务'}
                </Button>
                <Button 
                  onClick={() => router.back()}
                  size="large"
                >
                  取消
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </div>
  );
};

export default PublishTaskPage; 
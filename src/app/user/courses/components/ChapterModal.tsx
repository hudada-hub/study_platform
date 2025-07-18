import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Button, Table, Space, Upload, InputNumber, message, Progress } from 'antd';
import { PlusOutlined, UploadOutlined, DeleteOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';
import { request } from '@/utils/request';
import Swal from 'sweetalert2';
import { CosVideo } from '@/components/common/CosVideo';
import { addWatermark } from '@/utils/videowatermark'; // 参考上面函数
import VideoUploadWithWatermark from './VideoUploadWithWatermark';
interface ChapterModalProps {
  open: boolean;
  onCancel: () => void;
  courseId: number;
}

// 章节数据类型
interface ChapterData {
  id: number;
  title: string;
  description?: string;
  videoUrl?: string;
  points: number;
  sort: number;
  children?: ChapterData[];
  parentId?: number;
  uploader?: {
    id: number;
    name: string;
    avatar?: string;
  };
  createdAt: string;
}

const ChapterModal: React.FC<ChapterModalProps> = ({ open, onCancel, courseId }) => {
  const [form] = Form.useForm();
  const [chapters, setChapters] = useState<ChapterData[]>([]);
  const [expandedKeys, setExpandedKeys] = useState<number[]>([]);
  const [editingChapter, setEditingChapter] = useState<ChapterData | null>(null);
  const [isSubChapterModalOpen, setIsSubChapterModalOpen] = useState(false);
  const [selectedParentId, setSelectedParentId] = useState<number | null>(null);
  const [videoUrl, setVideoUrl] = useState<string>('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [duration, setDuration] = useState<number | undefined>(undefined); // 新增

  // 你可以在这里定义默认水印图片
  const defaultWatermarkUrl = '/watermark.png'; // 放在 public 目录下

  // 工具函数：将图片 url 转为 File
  async function urlToFile(url: string, filename: string): Promise<File> {
    const res = await fetch(url);
    const blob = await res.blob();
    return new File([blob], filename, { type: blob.type });
  }

  // 在组件内 useState 保存水印 File
  const [watermarkFile, setWatermarkFile] = useState<File | undefined>(undefined);

  // 初始化默认水印
  useEffect(() => {
    if (!watermarkFile) {
      urlToFile(defaultWatermarkUrl, 'watermark.png').then(setWatermarkFile);
    }
  }, [watermarkFile]);

  // 获取章节列表
  const fetchChapters = async () => {
    try {
      const response = await request< ChapterData[]>(`/courses/${courseId}/chapters`, {
        method: 'GET',
      });
      console.log(response.data,'response.data.data')
      setChapters(response.data);
      // 更新展开的行
      const keys = response.data.map(chapter => chapter.id);
      setExpandedKeys(keys);
    } catch (error) {
      console.log(error,'error')
      Swal.fire({
        title: '获取章节列表失败',
        icon: 'error',
        confirmButtonText: '确定'
      });
    }
  };

  useEffect(() => {
    if (open) {
      fetchChapters();
    }
  }, [open, courseId]);

  // 表格列定义
  const columns = [
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: '积分',
      dataIndex: 'points',
      key: 'points',
    },
    {
      title: '排序',
      dataIndex: 'sort',
      key: 'sort',
    },
    
    {
      title: '上传时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (text: string) => new Date(text).toLocaleString(),
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: ChapterData) => (
        <Space size="middle">
          {!record.parentId && (
            <Button type="link" onClick={() => handleAddSubChapter(record.id)}>
              添加子章节
            </Button>
          )}
          <Button type="link" onClick={() => handleEdit(record)}>
            编辑
          </Button>
          <Button type="link" danger onClick={() => handleDelete(record.id)}>
            删除
          </Button>
        </Space>
      ),
    },
  ];

  // 处理添加主章节
  const handleAddMainChapter = () => {
    setEditingChapter(null);
    setSelectedParentId(null);
    setVideoUrl(''); // 重置视频URL
    form.resetFields();
    setIsSubChapterModalOpen(true);
  };

  // 处理添加子章节
  const handleAddSubChapter = (parentId: number) => {
    setEditingChapter(null);
    setSelectedParentId(parentId);
    setVideoUrl(''); // 重置视频URL
    form.resetFields();
    setIsSubChapterModalOpen(true);
  };

  // 处理编辑章节
  const handleEdit = (chapter: ChapterData) => {
    setEditingChapter(chapter);
    setSelectedParentId(chapter.parentId || null);
    setVideoUrl(chapter.videoUrl || '');
    form.setFieldsValue({
      title: chapter.title,
      description: chapter.description,
      points: chapter.points,
      sort: chapter.sort,
      videoUrl: chapter.videoUrl?.split('?q-sign-algorithm')[0],
    });
    setIsSubChapterModalOpen(true);
  };

  // 处理删除章节
  const handleDelete = async (id: number) => {
    try {
      // 检查是否有子章节
      const hasChildren = chapters.some(chapter => chapter.parentId === id);
      if (hasChildren) {
        Swal.fire({
          title: '无法删除',
          text: '请先删除所有子章节',
          icon: 'error',
          confirmButtonText: '确定'
        });
        return;
      }

      // 显示确认弹窗
      const result = await Swal.fire({
        title: '确认删除',
        text: '确定要删除这个章节吗？此操作不可恢复！',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: '确定删除',
        cancelButtonText: '取消',
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6'
      });

      // 如果用户确认删除
      if (result.isConfirmed) {
        await request(`/courses/${courseId}/chapters/${id}`, {
          method: 'DELETE',
        });
        
        Swal.fire({
          title: '删除成功',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false
        });
        
        fetchChapters();
      }
    } catch (error:any) {
      Swal.fire({
        title: '删除失败',
        text: error.message,
        icon: 'error',
        confirmButtonText: '确定'
      });
    }
  };

  // 处理删除视频
  const handleRemoveVideo = () => {
    setVideoUrl('');
    form.setFieldValue('videoUrl', '');
  };

  // 处理表单提交
  const handleSubmit = async () => {
    try {
      let values = await form.validateFields();
      console.log(values,'values')
      if(values.videoUrl){
        values.videoUrl = values.videoUrl.split('?q-sign-algorithm')[0];
      }
      
      
      const data = {
        ...values,
        courseId,
        parentId: selectedParentId,
        duration:duration,
      };

      if (editingChapter) {
        await request(`/courses/${courseId}/chapters/${editingChapter.id}`, {
          method: 'PUT',
          body: JSON.stringify(data),
        });
        message.success('更新成功');
      } else {
        await request(`/courses/${courseId}/chapters`, {
          method: 'POST',
          body: JSON.stringify(data),
        });
        message.success('创建成功');
      }

      setIsSubChapterModalOpen(false);
      fetchChapters();
    } catch (error) {
      message.error('操作失败');
    }
  };

  // 自定义上传方法
  const customUpload = async ({ file, onSuccess, onError, onProgress }: any) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', '/api/common/upload', true);

      // 处理上传进度
      xhr.upload.addEventListener('progress', event => {
        if (event.lengthComputable) {
          const percent = Math.round((event.loaded / event.total) * 100);
          setUploadProgress(percent);
          onProgress({ percent });
        }
      });

      // 处理请求完成
      xhr.addEventListener('load', () => {
        if (xhr.status === 200) {
          const response = JSON.parse(xhr.response);
          onSuccess(response);
        } else {
          onError(new Error('上传失败'));
        }
      });

      // 处理请求错误
      xhr.addEventListener('error', () => {
        onError(new Error('上传失败'));
      });

      xhr.send(formData);
    } catch (error) {
      onError(new Error('上传失败'));
    }
  };

  // 上传视频配置
  

  // 重置表单和状态
  const handleModalClose = () => {
    setVideoUrl('');
    setIsSubChapterModalOpen(false);
    form.resetFields();
  };

  return (
    <>
      <Modal
        title="课程章节管理"
        open={open}
        onCancel={onCancel}
        width={1200}
        footer={[
          <Button key="add" type="primary" onClick={handleAddMainChapter}>
            新建主章节
          </Button>,
          <Button key="close" onClick={onCancel}>
            关闭
          </Button>,
        ]}
      >
        <Table
          columns={columns}
          dataSource={chapters}
          rowKey="id"
          pagination={false}
          expandable={{
            expandedRowKeys: expandedKeys,
            onExpandedRowsChange: (keys) => setExpandedKeys(keys as number[]),
            childrenColumnName: 'children'
          }}
        />
      </Modal>

      <Modal
        title={`${editingChapter ? '编辑' : '新建'}${selectedParentId ? '子' : '主'}章节`}
        open={isSubChapterModalOpen}
        onOk={handleSubmit}
        onCancel={handleModalClose}
        width={800}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="title"
            label="标题"
            rules={[{ required: true, message: '请输入标题' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item name="description" label="描述">
            <Input.TextArea />
          </Form.Item>

          <Form.Item
            name="points"
            label="积分"
            rules={[{ required: true, message: '请输入积分' }]}
          >
            <InputNumber min={0} />
          </Form.Item>

          <Form.Item
            name="sort"
            label="排序"
            rules={[{ required: true, message: '请输入排序' }]}
          >
            <InputNumber min={0} />
          </Form.Item>

          {/* 只有子章节才显示视频上传 */}
          {selectedParentId && (
            <Form.Item 
              name="videoUrl" 
              label="视频"
              rules={[{ required: true, message: '请上传视频' }]}
              extra="支持 mp4, mov, avi, wmv 格式，大小不超过500MB"
            >
              <div className="space-y-4">
                {!videoUrl ? (
                  <VideoUploadWithWatermark
                    value={videoUrl}
                    onChange={val => setVideoUrl(val)}
                    watermarkFile={undefined}
                    uploadAction="/api/common/upload"
                  />
                ) : (
                  <div className="space-y-4">
                    <div className="relative w-full aspect-video bg-gray-100 rounded-lg overflow-hidden">
                      <CosVideo
                        path={videoUrl.split('?q-sign-algorithm')[0]}
                        className="w-full h-full object-contain rounded-lg"
                      />
                    </div>
                    <div className="flex justify-end">
                      <Button 
                        danger 
                        icon={<DeleteOutlined />} 
                        onClick={handleRemoveVideo}
                      >
                        删除视频
                      </Button>
                    </div>
                  </div>
                )}
                {duration !== undefined && (
                  <div className="text-xs text-gray-500 mt-2">视频时长：{duration} 秒</div>
                )}
                {isUploading && (
                  <div className="mt-4">
                    <Progress 
                      percent={uploadProgress} 
                      status={uploadProgress === 100 ? 'success' : 'active'}
                      strokeColor={{
                        '0%': '#108ee9',
                        '100%': '#87d068',
                      }}
                    />
                  </div>
                )}
              </div>
            </Form.Item>
          )}
        </Form>
      </Modal>
    </>
  );
};

export default ChapterModal; 
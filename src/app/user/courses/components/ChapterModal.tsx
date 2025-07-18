import React, { useEffect, useRef, useState } from 'react';
import { Modal, Form, Input, Button, Table, Space, Upload, InputNumber, message, Progress } from 'antd';
import { PlusOutlined, UploadOutlined, DeleteOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';
import { request } from '@/utils/request';
import Swal from 'sweetalert2';
import { CosVideo } from '@/components/common/CosVideo';
import VideoCoverCapture from '@/components/common/VideoCoverCapture';
import VideoMultiCoverCapture, { MultiCover } from '@/components/common/VideoMultiCoverCapture';

const VIDEO_ACCEPTED_TYPES = [
  'video/mp4', 'video/quicktime', 'video/x-msvideo', 'video/x-ms-wmv', 'video/webm', 'video/ogg',
];
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
  const [duration, setDuration] = useState<number | undefined>(undefined); // 新增
  // 在组件内添加状态
  const [uploadPercent, setUploadPercent] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [coverUrl, setCoverUrl] = useState<string>('');
  const coverCaptureRef = useRef<{ handleCapture: () => Promise<void> }>(null);
  // 多帧抓取相关
  const multiCoverRef = useRef<{ handleCapture: () => Promise<MultiCover[]> }>(null);
  const [coverCandidates, setCoverCandidates] = useState<MultiCover[]>([]);
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
    setCoverUrl(''); // 重置封面URL
    form.resetFields();
    setIsSubChapterModalOpen(true);
  };

  // 处理编辑章节
  const handleEdit = (chapter: ChapterData) => {
    setEditingChapter(chapter);
    setSelectedParentId(chapter.parentId || null);
    setVideoUrl(chapter.videoUrl || '');
    setCoverUrl((chapter as any).coverUrl || ''); // 编辑时回显封面
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
    setCoverUrl(''); // 删除视频时同步清空封面
    form.setFieldValue('videoUrl', '');
  };

  // 处理表单提交
  const handleSubmit = async () => {
    try {
      let values = await form.validateFields();
      console.log(values,'values')
      if(videoUrl){
        values.videoUrl = videoUrl.split('?q-sign-algorithm')[0];
      }
      
      
      const data = {
        ...values,
        courseId,
        parentId: selectedParentId,
        duration:duration,
      };
      if (coverUrl) {
        data.coverUrl = coverUrl;
      }
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


  // 上传视频配置
  

  // 重置表单和状态
  const handleModalClose = () => {
    setVideoUrl('');
    setCoverUrl(''); // 重置封面URL
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
                  <Upload
                    showUploadList={false}
                    beforeUpload={async (file) => {
                      // 1. 校验格式
                      if (!VIDEO_ACCEPTED_TYPES.includes(file.type)) {
                        message.error('不支持的文件格式');
                        return false;
                      }
                      // 2. 校验原生video可播放性和获取duration
                      const url = URL.createObjectURL(file);
                      let videoDuration = 0;
                      const canPlay = await new Promise<boolean>((resolve) => {
                        const testVideo = document.createElement('video');
                        testVideo.preload = 'metadata';
                        testVideo.src = url;
                        testVideo.onloadedmetadata = () => {
                          videoDuration = testVideo.duration;
                          resolve(true);
                        };
                        testVideo.onerror = () => resolve(false);
                      });
                      URL.revokeObjectURL(url);
                      if (!canPlay || !videoDuration || isNaN(videoDuration)) {
                        message.error('无法识别视频或视频损坏');
                        return false;
                      }
                      setDuration(videoDuration);
                      setUploading(true);
                      setUploadPercent(0);
                      const formData = new FormData();
                      formData.append('file', file);
                      return new Promise((resolve, reject) => {
                        const xhr = new XMLHttpRequest();
                        xhr.open('POST', '/api/common/upload', true);
                        xhr.upload.onprogress = (event) => {
                          console.log(event,'event')
                          if (event.lengthComputable) {
                            const percent = Math.round((event.loaded / event.total) * 100);
                            console.log(percent,'percent')
                            setUploadPercent(percent);
                          }
                        };
                        xhr.onload = () => {
                          setUploading(false);
                          setUploadPercent(0);
                          try {
                            const data = JSON.parse(xhr.responseText);
                            if (data.code === 0 && data.data?.url) {
                              console.log(data.data.url,'data.data.url')
                              setVideoUrl(data.data.url);
                              message.success('上传成功');
                              setCoverUrl(''); // 上传新视频时重置封面，防止脏数据
                              setCoverCandidates([]);
                              if (multiCoverRef.current) {
                                message.loading({ content: '正在抓取视频多帧...', key: 'cover' });
                                multiCoverRef.current.handleCapture().then(async (covers: MultiCover[]) => {
  // 遍历上传到COS
  const uploadPromises = covers.map((item) => {
    const formData = new FormData();
    formData.append('file', item.blob, 'cover.jpg');
    return fetch('/api/common/upload', {
      method: 'POST',
      body: formData,
    }).then(res => res.json());
  });
  const results = await Promise.all(uploadPromises);
  const cosCovers: MultiCover[] = covers.map((item, idx) => {
    const url = results[idx]?.code === 0 && results[idx]?.data?.url ? results[idx].data.url : '';
    return { ...item, cosUrl: url };
  }).filter(item => !!item.cosUrl);
  setCoverCandidates(cosCovers);
  if (cosCovers.length > 0) {
    setCoverUrl(''); // 默认不选
    message.success({ content: '抓取封面成功，请选择喜欢的封面', key: 'cover' });
  } else {
    message.error({ content: '未能抓取到有效封面', key: 'cover' });
  }
}).catch(() => {
  message.error({ content: '视频多帧抓取失败', key: 'cover' });
});
                              }
                              resolve(false);
                            } else {
                              message.error(data.message || '上传失败');
                              reject();
                            }
                          } catch {
                            message.error('上传失败');
                            reject();
                          }
                        };
                        xhr.onerror = () => {
                          setUploading(false);
                          setUploadPercent(0);
                          message.error('上传失败');
                          reject();
                        };
                        xhr.send(formData);
                      });
                    }}
                  >
                    <Button icon={<UploadOutlined />} loading={uploading} disabled={uploading}>
                      {uploading ? '上传中...' : '上传视频'}
                    </Button>
                  </Upload>
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
                {uploading && (
                  <div className="mt-4">
                    <Progress 
                      percent={uploadPercent} 
                      status={uploadPercent === 100 ? 'success' : 'active'}
                      strokeColor={{
                        '0%': '#108ee9',
                        '100%': '#87d068',
                      }}
                    />
                  </div>
                )}
              {/* 多帧候选封面选择 */}
              {coverCandidates.length > 0 && (
                <div className="flex items-center space-x-4 mt-2">
                  {coverCandidates.map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <img
                        src={item.cosUrl}
                        alt={`封面${idx+1}`}
                        style={{
                          width: 120,
                          height: 68,
                          objectFit: 'cover',
                          borderRadius: 8,
                          border: coverUrl === item.cosUrl ? '2px solid #1677ff' : '1px solid #eee',
                          cursor: 'pointer',
                          boxShadow: coverUrl === item.cosUrl ? '0 0 8px #1677ff55' : undefined
                        }}
                        onClick={() => setCoverUrl(item.cosUrl!)}
                      />
                      <span style={{ fontSize: 12, color: '#888', marginTop: 2 }}>{Math.round(item.time)}s</span>
                      {coverUrl === item.cosUrl && <span style={{ color: '#1677ff', fontSize: 12 }}>已选</span>}
                    </div>
                  ))}
                </div>
              )}
              {/* 兼容单帧旧逻辑的预览与删除 */}
              {coverUrl && coverCandidates.length === 0 && (
                <div className="flex items-center space-x-4 mt-2">
                  <img src={coverUrl} alt="视频封面" style={{ width: 120, height: 68, objectFit: 'cover', borderRadius: 8, border: '1px solid #eee' }} />
                  <Button danger size="small" onClick={() => setCoverUrl('')}>删除封面</Button>
                </div>
              )}
              <VideoMultiCoverCapture
                ref={multiCoverRef}
                videoUrl={videoUrl}
                count={5}
                onCovers={() => {
                  
                }}
              />
              </div>
            </Form.Item>
          )}
        </Form>
      </Modal>
    </>
  );
};

export default ChapterModal; 
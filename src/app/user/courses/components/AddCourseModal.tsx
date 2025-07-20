'use client';
import { useState, useEffect, useRef } from 'react';
import { Modal, Form, Input, Button, Space, Upload, message, Select } from 'antd';
import { Image as ImageIcon } from 'lucide-react';
import { request } from '@/utils/request';
import { useCourseOptions } from '../hooks/useCourseOptions';
import { CosImage } from '@/components/common/CosImage';

interface AddCourseModalProps {
  visible: boolean;
  onClose: () => void;
  editingCourse?: any; // 编辑的课程数据
}

export default function AddCourseModal({ visible, onClose, editingCourse }: AddCourseModalProps) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [coverUrl, setCoverUrl] = useState('');
  const { categories, directions, loading: optionsLoading } = useCourseOptions();
  
  // 添加Upload组件的ref
  const uploadRef = useRef<any>(null);

  // 当编辑的课程数据变化时，设置表单数据
  useEffect(() => {
    console.log(editingCourse);
    if (editingCourse) {
      form.setFieldsValue({
        title: editingCourse.title,
        instructor: editingCourse.instructor,
        description: editingCourse.description,
        categoryId: editingCourse.categoryId,
        directionId: editingCourse.directionId,
        level: editingCourse.level,
        targetAudience: editingCourse.targetAudience,
        courseGoals: editingCourse.courseGoals,
        coverUrl: editingCourse.coverUrl,
        watermarkType: editingCourse.watermarkType,
        watermarkContent: editingCourse.watermarkContent,
        watermarkPosition: editingCourse.watermarkPosition,
      });
      setCoverUrl(editingCourse.coverUrl.split('?q-sign-algorithm')[0]);
    } else {
      form.resetFields();
      setCoverUrl('');
      // 重置Upload组件
      if (uploadRef.current) {
        uploadRef.current.fileList = [];
      }
    }
  }, [editingCourse, form]);

  const handleSubmit = async (values: any) => {
    try {
      setLoading(true);
      if (editingCourse) {
        // 编辑课程
        await request(`/courses/${editingCourse.id}`, {
          method: 'PUT',
          body: JSON.stringify({
            ...values,
            coverUrl,
          }),
        });
        message.success('课程编辑成功');
      } else {
        // 创建课程
        await request('/courses', {
          method: 'POST',
          body: JSON.stringify({
            ...values,
            coverUrl,
          }),
        });
        message.success('课程添加成功');
      }
      form.resetFields();
      setCoverUrl('');
      // 重置Upload组件
      if (uploadRef.current) {
        uploadRef.current.fileList = [];
      }
      onClose();
    } catch (error) {
      message.error(editingCourse ? '课程编辑失败' : '课程添加失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={editingCourse ? '编辑课程' : '添加课程'}
      open={visible}
      onCancel={onClose}
      footer={null}
      width={800}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
      >
        {/* 添加封面上传 */}
        <Form.Item
          label="课程封面"
          required
          help="建议尺寸: 800x450px，支持jpg、png格式"
        >
          <Upload
            ref={uploadRef}
            action="/api/common/upload"
            listType="picture-card"
            maxCount={1}
            accept=".jpg,.jpeg,.png"
            onChange={(info) => {
              console.log(info);
              if (info.file.status === 'done') {
                message.success(`${info.file.name} 上传成功`);
             
                setCoverUrl(info.file.response.data.url.split('?q-sign-algorithm')[0]);
              } else if (info.file.status === 'error') {
                message.error(`${info.file.name} 上传失败`);
              }
            }}
            onRemove={() => {
              setCoverUrl('');
              return true;
            }}
          >
           
              <div className="flex flex-col items-center justify-center">
                <ImageIcon className="w-6 h-6 mb-2" />
                <div>点击上传</div>
              </div>
          
          </Upload>
          {coverUrl && (
            <CosImage
              path={coverUrl}
              width={200}
              height={300}
            />
          )}
        </Form.Item>

        <Form.Item
          name="title"
          label="课程标题"
          rules={[{ required: true, message: '请输入课程标题' }]}
        >
          <Input placeholder="请输入课程标题" />
        </Form.Item>

        <Form.Item
          name="instructor"
          label="讲师"
          rules={[{ required: true, message: '请输入讲师姓名' }]}
        >
          <Input placeholder="请输入讲师姓名" />
        </Form.Item>

        <Form.Item
          name="categoryId"
          label="课程分类"
          rules={[{ required: true, message: '请选择课程分类' }]}
        >
          <Select
            placeholder="请选择课程分类"
            loading={optionsLoading}
            options={categories.map(cat => ({
              label: cat.name,
              value: cat.id,
            }))}
          />
        </Form.Item>

        <Form.Item
          name="directionId"
          label="课程方向"
          rules={[{ required: true, message: '请选择课程方向' }]}
        >
          <Select
            placeholder="请选择课程方向"
            loading={optionsLoading}
            options={directions.map(dir => ({
              label: dir.name,
              value: dir.id,
            }))}
          />
        </Form.Item>

        <Form.Item
          name="level"
          label="课程难度"
          rules={[{ required: true, message: '请选择课程难度' }]}
        >
          <Select
            placeholder="请选择课程难度"
            options={[
              { label: '入门', value: 'BEGINNER' },
              { label: '初级', value: 'INTERMEDIATE' },
          
              { label: '高级', value: 'ADVANCED' },
             
            ]}
          />
        </Form.Item>

        <Form.Item
          name="description"
          label="课程描述"
          rules={[{ required: true, message: '请输入课程描述' }]}
        >
          <Input.TextArea rows={4} placeholder="请输入课程描述" />
        </Form.Item>

        <Form.Item
          name="targetAudience"
          label="适合人群"
          rules={[{ required: true, message: '请输入适合人群' }]}
        >
          <Input.TextArea rows={2} placeholder="请输入适合人群，例如：零基础学习者、有一定编程基础的开发者等" />
        </Form.Item>

        <Form.Item
          name="courseGoals"
          label="课程目标"
          rules={[{ required: true, message: '请输入课程目标' }]}
        >
          <Input.TextArea rows={2} placeholder="请输入学完本课程可以达到的目标" />
        </Form.Item>

       
        

        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit" loading={loading}>
              {editingCourse ? '保存' : '提交'}
            </Button>
            <Button onClick={onClose}>取消</Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
} 
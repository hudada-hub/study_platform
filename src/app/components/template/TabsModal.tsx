import React, { useEffect } from 'react';
import { Modal, Form, Input } from 'antd';

interface TabsData {
  [key: string]: string;
}

interface TabsModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (tabs: TabsData, oldName?: string) => void;
  initialTab?: { name: string };
}

const TabsModal: React.FC<TabsModalProps> = ({
  open,
  onClose,
  onSubmit,
  initialTab
}) => {
  const [form] = Form.useForm();

  // 当 initialTab 改变时，设置表单初始值
  useEffect(() => {
    if (initialTab) {
      form.setFieldsValue({
        tabName: initialTab.name
      });
    }
  }, [initialTab, form]);

  // 处理表单提交
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const tabs: TabsData = {
        [values.tabName]: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      };
      onSubmit(tabs, initialTab?.name);
      form.resetFields();
      onClose();
    } catch (error) {
      console.error('表单验证失败:', error);
    }
  };

  // 处理模态框关闭
  const handleClose = () => {
    form.resetFields();
    onClose();
  };

  return (
    <Modal
      title={initialTab ? "编辑分类" : "添加分类"}
      open={open}
      onCancel={handleClose}
      onOk={handleSubmit}
      width={400}
    >
      <Form
        form={form}
        layout="vertical"
      >
        <Form.Item
          name="tabName"
          label="分类名称"
          rules={[{ required: true, message: '请输入分类名称' }]}
        >
          <Input placeholder="请输入分类名称" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default TabsModal; 
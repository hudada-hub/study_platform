import { useState, useEffect } from 'react';
import { Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import TabsModal from '../TabsModal';

// 标签页类型定义
export interface Tabs {
  [key: string]: string;
}

interface TabsListProps {
  tabs: Tabs;
  onChange: (tabs: Tabs) => void;
  onTabDelete?: (name: string, value: string) => void;
}

/**
 * 标签页列表管理组件
 * 用于管理标签页的添加、编辑和删除
 */
export default function TabsList({ tabs, onChange, onTabDelete }: TabsListProps) {
  const [tabModalVisible, setTabModalVisible] = useState(false);
  const [editingTab, setEditingTab] = useState<{ name: string } | undefined>();
  const [localTabs, setLocalTabs] = useState<Tabs>(tabs);

  // 当外部tabs变化时更新本地状态
  useEffect(() => {
    setLocalTabs(tabs);
  }, [tabs]);

  // 处理添加标签页
  const handleAddTabs = (newTabs: Record<string, string>, oldName?: string) => {
    const newTabsData = { ...localTabs };
    
    // 如果是编辑，删除旧的标签页
    if (oldName && oldName !== Object.keys(newTabs)[0]) {
      delete newTabsData[oldName];
    }
    
    const updatedTabs = {
      ...newTabsData,
      ...newTabs
    };
    
    // 更新本地状态
    setLocalTabs(updatedTabs);
    
    // 通知父组件更新
    onChange(updatedTabs);
  };

  // 处理删除标签页
  const handleDeleteTab = (name: string) => {
    const newTabs = { ...localTabs };
    const value = newTabs[name];
    delete newTabs[name];
    
    // 更新本地状态
    setLocalTabs(newTabs);
    
    // 通知父组件更新
    onChange(newTabs);
    
    // 如果提供了删除回调，则调用
    if (onTabDelete) {
      onTabDelete(name, value);
    }
  };

  // 处理编辑标签页
  const handleEditTab = (name: string) => {
    setEditingTab({ name });
    setTabModalVisible(true);
  };

  
  return (
    <div className="w-full">
      <div className="flex justify-end items-center mb-4">
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            setEditingTab(undefined);
            setTabModalVisible(true);
          }}
        >
          添加分类
        </Button>
      </div>

      {/* 显示现有的标签页 */}
      {Object.keys(localTabs).length === 0 ? (
        <div className="text-center text-gray-500 py-4">
          暂无分类，请点击上方按钮添加
        </div>
      ) : (
        Object.entries(localTabs).map(([name, value]) => (
          <div key={name} className="mb-4 p-3 bg-gray-50 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="font-medium">{name}</span>
              <div className="flex gap-2">
                <Button
                  type="text"
                  onClick={() => handleEditTab(name)}
                >
                  编辑
                </Button>
                <Button
                  type="text"
                  danger
                  onClick={() => handleDeleteTab(name)}
                >
                  删除
                </Button>
              </div>
            </div>
          </div>
        ))
      )}

      {/* 标签页编辑弹窗 */}
      <TabsModal
        open={tabModalVisible}
        onClose={() => {
          setTabModalVisible(false);
          setEditingTab(undefined);
        }}
        onSubmit={handleAddTabs}
        initialTab={editingTab}
      />
    </div>
  );
} 
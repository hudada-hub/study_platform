import React from 'react';
import { FiList, FiFileText } from 'react-icons/fi';

interface SideTabsProps {
  active: 'directory' | 'file';
  onChange: (tab: 'directory' | 'file') => void;
}

const tabs = [
  { key: 'directory', label: '目录', icon: <FiList className="w-5 h-5" /> },
  { key: 'file', label: '课件', icon: <FiFileText className="w-5 h-5" /> },
];

const SideTabs: React.FC<SideTabsProps> = ({ active, onChange }) => {
  return (
    <div className="flex flex-col items-center bg-[#23242a]  py-4 px-1 w-16 min-h-[200px]">
      {tabs.map(tab => (
        <button
          key={tab.key}
          className={`flex flex-col items-center gap-1 py-3 w-full text-xs font-medium rounded transition
            ${active === tab.key ? 'text-orange-400 bg-[#181A20]' : 'text-gray-400 hover:text-orange-400'}`}
          onClick={() => onChange(tab.key as 'directory' | 'file')}
        >
          {tab.icon}
          <span>{tab.label}</span>
        </button>
      ))}
    </div>
  );
};

export default SideTabs; 
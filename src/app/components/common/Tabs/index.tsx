import { useTheme } from '@/providers/theme-provider';
import React from 'react';

interface Tab {
  label: string;
  value: string;
}

interface TabsProps {
  tabs: Tab[];
  activeKey: string;
  onChange: (key: string) => void;
  className?: string;
}

/**
 * 自定义标签页组件
 */
const Tabs: React.FC<TabsProps> = ({ tabs, activeKey, onChange, className = '' }) => {
  const {theme} = useTheme();
  return (
    <div className={`flex p-1 bg-none ${className} rounded-sm`}>
      {tabs.map((tab) => (
        <div key={tab.value} className='relative'>
          <div
            style={{
              position:'relative',
              zIndex:1,
              backgroundColor: activeKey === tab.value ?theme.textColor.primary : 'transparent',
              borderRadius:'8px',
              backgroundBlendMode: 'luminosity',
              backgroundOrigin:'border-box',
              backgroundImage: `url(${activeKey === tab.value ? '/tab-active.png' : '/tab-unactive.png'})`,
              backgroundSize: '100% 100%',
              marginRight:'10px',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
            }}
            onClick={() => onChange(tab.value)}
            className={`
              md:w-[214px] w-[150px] h-[44px] flex items-center justify-center text-lg cursor-pointer
              ${activeKey === tab.value ? 'text-white' : 'text-white'}
            `}
          >
            {tab.label}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Tabs;
import { useState, useEffect } from 'react';

export type TextInputType = 'text' | 'dimension' | 'textarea';

interface TextInputProps {
  type: TextInputType;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  defaultValue?: string;
}

/**
 * 文本输入组件
 * 支持普通文本、带单位的尺寸输入和多行文本
 */
export default function TextInput({ type, value, onChange, placeholder, defaultValue = '' }: TextInputProps) {
  // 处理尺寸输入的数值和单位
  const [dimensionValue, setDimensionValue] = useState(() => {
    if (type === 'dimension') {
      return value.replace(/[^0-9.]/g, '');
    }
    return '';
  });

  const [dimensionUnit, setDimensionUnit] = useState(() => {
    if (type === 'dimension') {
      return value.match(/[^0-9.]+$/)?.[0] || 'px';
    }
    return 'px';
  });

  // 当外部value变化时更新内部状态
  useEffect(() => {
    if (type === 'dimension') {
      setDimensionValue(value.replace(/[^0-9.]/g, ''));
      setDimensionUnit(value.match(/[^0-9.]+$/)?.[0] || 'px');
    }
  }, [value, type]);

  // 处理尺寸数值变化
  const handleDimensionValueChange = (newValue: string) => {
    setDimensionValue(newValue);
    if (newValue === '') {
      onChange(defaultValue);
    } else {
      onChange(`${newValue}${dimensionUnit}`);
    }
  };

  // 处理尺寸单位变化
  const handleDimensionUnitChange = (newUnit: string) => {
    setDimensionUnit(newUnit);
    onChange(`${dimensionValue}${newUnit}`);
  };

  // 根据类型渲染不同的输入组件
  switch (type) {
    case 'dimension':
      return (
        <div className="flex gap-2">
          <input
            type="text"
            value={dimensionValue}
            onChange={(e) => handleDimensionValueChange(e.target.value)}
            placeholder={placeholder}
            className="w-24 px-3 py-2 border rounded-md"
          />
          <select
            value={dimensionUnit}
            onChange={(e) => handleDimensionUnitChange(e.target.value)}
            className="px-3 py-2 border rounded-md"
          >
            <option value="px">px</option>
            <option value="%">%</option>
            <option value="vh">vh</option>
            <option value="vw">vw</option>
            <option value="rem">rem</option>
            <option value="em">em</option>
          </select>
        </div>
      );
    case 'textarea':
      return (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full px-3 py-2 border rounded-md h-24"
        />
      );
    default:
      return (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full px-3 py-2 border rounded-md"
        />
      );
  }
} 
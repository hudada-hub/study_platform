export interface ThemeConfig {
  primaryColor: string;
  secondaryColor: string;
  successColor: string;
  warningColor: string;
  errorColor: string;
  infoColor: string;
  // 文字颜色
  textColor: {
    primary: string;
    secondary: string;
    disabled: string;
  };
  // 背景颜色
  backgroundColor: {
    primary: string;
    secondary: string;
    light: string;
  };
  // 边框颜色
  borderColor: {
    primary: string;
    secondary: string;
  };
}

export const defaultTheme: ThemeConfig = {
  primaryColor: '#333',
  secondaryColor: '#666',
  successColor: '#52c41a',
  warningColor: '#faad14',
  errorColor: '#ff4d4f',
  infoColor: '#1890ff',
  textColor: {
    primary: '#333',
    secondary: '#00000073',
    disabled: '#00000040',
  },
  backgroundColor: {
    primary: '#22272f',
    secondary: '#fff',
    light: '#f5f5f5',
  },
  borderColor: {
    primary: '#d9d9d9',
    secondary: '#f0f0f0',
  },
}; 
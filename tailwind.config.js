/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  important: true,
  theme: {
    extend: {
      width: {
        'cwi': '100% !important', // 自定义宽度
      },
      container: {
        screens: {
          sm: '640px',
          md: '768px',
          lg: '1024px',
          xl: '1280px',
        },
      },
      colors: {
        primary: 'var(--primary-color)',
        secondary: 'var(--secondary-color)',
        success: 'var(--success-color)',
        warning: 'var(--warning-color)',
        error: 'var(--error-color)',
        info: 'var(--info-color)',
      },
      textColor: {
        primary: 'var(--text-color-primary)',
        secondary: 'var(--text-color-secondary)',
        disabled: 'var(--text-color-disabled)',
      },
      backgroundColor: {
        primary: 'var(--background-color-primary)',
        secondary: 'var(--background-color-secondary)',
        light: 'var(--background-color-light)',
      },
      borderColor: {
        primary: 'var(--border-color-primary)',
        secondary: 'var(--border-color-secondary)',
        light: 'var(--border-color-light)',
      },
      
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
} 
/**
 * 将十六进制颜色转换为RGB对象
 */
function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : { r: 0, g: 0, b: 0 };
}

/**
 * 将RGB对象转换为十六进制颜色
 */
function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map(x => {
    const hex = Math.round(x).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('');
}

/**
 * 调整颜色的亮度
 * @param hex 十六进制颜色
 * @param percent 亮度调整百分比 (-1 到 1)
 */
function adjustBrightness(hex: string, percent: number): string {
  const rgb = hexToRgb(hex);
  const adjustColor = (value: number) => {
    return Math.min(255, Math.max(0, value + (value * percent)));
  };

  return rgbToHex(
    adjustColor(rgb.r),
    adjustColor(rgb.g),
    adjustColor(rgb.b)
  );
}

/**
 * 根据主色调生成颜色变体
 * @param primaryColor 主色调
 */
export function generateColorVariants(primaryColor: string) {
  return {
    primary: primaryColor,
    // 次级颜色：比主色深 15%
    secondary: adjustBrightness(primaryColor, -0.15),
    // 浅色：比主色浅 15%
    light: adjustBrightness(primaryColor, 0.60),
  };
}

/**
 * 检查颜色是否为浅色
 * @param hex 十六进制颜色
 */
export function isLightColor(hex: string): boolean {
  const rgb = hexToRgb(hex);
  // 使用相对亮度公式
  const brightness = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
  return brightness > 128;
}

/**
 * 获取适合背景色的文本颜色
 * @param backgroundColor 背景色
 */
export function getContrastTextColor(backgroundColor: string): string {
  return isLightColor(backgroundColor) ? '#000000' : '#ffffff';
} 
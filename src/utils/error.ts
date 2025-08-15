/**
 * 获取错误信息
 * @param error 错误对象
 * @returns 错误信息字符串
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  return String(error);
} 
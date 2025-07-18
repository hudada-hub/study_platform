import Swal, { SweetAlertIcon, SweetAlertOptions } from 'sweetalert2';

// Toast 配置
const ToastConfig: Partial<SweetAlertOptions> = {
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 2000,
  timerProgressBar: true,
};

// 成功提示
export const showSuccess = (title: string, text?: string) => {
  return Swal.fire({
    ...ToastConfig,
    icon: 'success' as SweetAlertIcon,
    title,
    text,
  } as SweetAlertOptions);
};

// 错误提示
export const showError = (title: string, text?: string) => {
  return Swal.fire({
    ...ToastConfig,
    icon: 'error' as SweetAlertIcon,
    title,
    text,
    timer: 3000,
  } as SweetAlertOptions);
};

// 警告提示
export const showWarning = (title: string, text?: string) => {
  return Swal.fire({
    ...ToastConfig,
    icon: 'warning' as SweetAlertIcon,
    title,
    text,
  } as SweetAlertOptions);
};

// 信息提示
export const showInfo = (title: string, text?: string) => {
  return Swal.fire({
    ...ToastConfig,
    icon: 'info' as SweetAlertIcon,
    title,
    text,
  } as SweetAlertOptions);
};

// 确认对话框
export const showConfirm = async (
  title: string,
  text?: string,
  options?: {
    confirmButtonText?: string;
    cancelButtonText?: string;
    icon?: SweetAlertIcon;
  }
): Promise<boolean> => {
  const result = await Swal.fire({
    title,
    text,
    icon: options?.icon || 'warning',
    showCancelButton: true,
    confirmButtonText: options?.confirmButtonText || '确定',
    cancelButtonText: options?.cancelButtonText || '取消',
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
  } as SweetAlertOptions);

  return result.isConfirmed;
};

// 加载提示
export const showLoading = (title: string = '加载中...') => {
  return Swal.fire({
    title,
    allowOutsideClick: false,
    showConfirmButton: false,
    didOpen: () => {
      Swal.showLoading();
    },
  } as SweetAlertOptions);
};

// 关闭加载提示
export const closeLoading = () => {
  Swal.close();
}; 
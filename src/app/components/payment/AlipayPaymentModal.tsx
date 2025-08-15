import { Modal } from 'antd';
import { useEffect, useRef } from 'react';
import Swal from 'sweetalert2';

interface AlipayPaymentModalProps {
  open: boolean;
  onCancel: () => void;
  paymentForm: string;
  orderNo: string;
}

export default function AlipayPaymentModal({ open, onCancel, paymentForm, orderNo }: AlipayPaymentModalProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open && formRef.current) {
      // 创建一个临时div来放置支付表单
      formRef.current.innerHTML = paymentForm;
      
      // 获取表单并修改target为iframe
      const form = formRef.current.querySelector('form');
      if (form) {
        form.target = 'alipayIframe';
        form.submit();
      }
    }
  }, [open, paymentForm]);

  const handleCancel = () => {
    Swal.fire({
      title: '确认取消支付？',
      text: '取消支付后，您需要重新发起支付',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: '确认取消',
      cancelButtonText: '继续支付'
    }).then((result) => {
      if (result.isConfirmed) {
        onCancel();
      }
    });
  };

  return (
    <Modal
      open={open}
      onCancel={handleCancel}
      footer={null}
      width={800}
      title="支付宝支付"
      destroyOnClose
    >
      <div className="relative w-full h-[600px]">
        {/* 隐藏的表单容器 */}
        <div ref={formRef} className="hidden" />
        
        {/* 支付宝支付iframe */}
        <iframe
          ref={iframeRef}
          name="alipayIframe"
          className="w-full h-full border-0"
          title="支付宝支付"
        />
      </div>
    </Modal>
  );
} 
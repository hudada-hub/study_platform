import { cookies } from 'next/headers';

export default async function PaymentPage() {
  const cookieStore = await cookies();
  const paymentForm = cookieStore.get('payment_form')?.value;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-4xl w-full bg-white rounded-lg shadow-sm p-8">
        <h1 className="text-2xl font-normal text-center mb-8">正在跳转到支付宝...</h1>
        
        {/* 支付表单容器 */}
        <div 
          id="payment-form-container" 
          dangerouslySetInnerHTML={{ __html: paymentForm || '' }} 
        />

        {/* 自动提交脚本 */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.onload = function() {
                const form = document.querySelector('form');
                if (form) {
                  form.submit();
                }
              }
            `
          }}
        />
      </div>
    </div>
  );
} 
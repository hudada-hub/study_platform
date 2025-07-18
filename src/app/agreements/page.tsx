'use client';
import { useSearchParams } from 'next/navigation';

export default function AgreementsPage() {
  const searchParams = useSearchParams();
  const type = searchParams.get('type');

  const agreements = {
    user: {
      title: '用户协议',
      content: `
        <h1 class="text-2xl font-bold mb-4">用户协议</h1>
        <div class="space-y-4">
          <p>欢迎使用我们的服务！</p>
          <h2 class="text-xl font-semibold">1. 协议的范围</h2>
          <p>本协议是您与平台之间关于使用平台服务所订立的协议。</p>
          <h2 class="text-xl font-semibold">2. 账号注册</h2>
          <p>您承诺提供真实、准确、完整的注册信息。</p>
          <h2 class="text-xl font-semibold">3. 用户行为规范</h2>
          <p>您在使用服务时需遵守相关法律法规。</p>
        </div>
      `
    },
    copyright: {
      title: '版权与免责声明',
      content: `
        <h1 class="text-2xl font-bold mb-4">版权与免责声明</h1>
        <div class="space-y-4">
          <h2 class="text-xl font-semibold">1. 知识产权声明</h2>
          <p>平台上的所有内容均受著作权法及其他相关法律法规的保护。</p>
          <h2 class="text-xl font-semibold">2. 免责声明</h2>
          <p>平台不对用户发布的内容承担责任。</p>
        </div>
      `
    },
    privacy: {
      title: '用户隐私协议',
      content: `
        <h1 class="text-2xl font-bold mb-4">用户隐私协议</h1>
        <div class="space-y-4">
          <h2 class="text-xl font-semibold">1. 信息收集</h2>
          <p>我们收集的信息类型及其用途。</p>
          <h2 class="text-xl font-semibold">2. 信息使用</h2>
          <p>我们如何使用和保护您的个人信息。</p>
          <h2 class="text-xl font-semibold">3. 信息共享</h2>
          <p>在何种情况下我们会共享您的信息。</p>
        </div>
      `
    },
    payment: {
      title: '用户付费协议',
      content: `
        <h1 class="text-2xl font-bold mb-4">用户付费协议</h1>
        <div class="space-y-4">
          <h2 class="text-xl font-semibold">1. 付费内容</h2>
          <p>关于平台付费内容的说明。</p>
          <h2 class="text-xl font-semibold">2. 支付方式</h2>
          <p>支持的支付方式及流程说明。</p>
          <h2 class="text-xl font-semibold">3. 退款政策</h2>
          <p>关于退款的政策说明。</p>
        </div>
      `
    }
  };

  const currentAgreement = type ? agreements[type as keyof typeof agreements] : agreements.user;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div 
        className="prose dark:prose-invert max-w-none"
        dangerouslySetInnerHTML={{ __html: currentAgreement.content }}
      />
    </div>
  );
} 
'use client';

import React from 'react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white overflow-hidden relative">
      {/* 动画容器 */}
      <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
        {/* 工具提示 */}
        <div className="absolute w-24 h-20 bg-green-400 top-[-260px] left-[-160px] rounded-[20px] p-1 animate-bounce">
          <div className="absolute w-0 h-0 border-5 border-transparent border-b-5 border-b-green-400 top-14 left-8"></div>
          <div className="absolute w-0.5 h-11 bg-green-400 top-24 left-12"></div>
          <span className="block text-center text-white text-sm font-bold">Oh no...</span>
          <span className="block text-center text-white text-xs">something wrong</span>
        </div>

        {/* 蜗牛 */}
        <div className="relative top-[-186px] left-[-70px] animate-snail">
          {/* 蜗牛头部 */}
          <div className="animate-head">
            {/* 左眼 */}
            <div className="absolute w-5 h-5 bg-black rounded-full left-4 top-0 animate-eye-blink">
              <span className="absolute w-2 h-2 bg-white rounded-full left-1 top-1 animate-pupil"></span>
            </div>
            {/* 右眼 */}
            <div className="absolute w-5 h-5 bg-black rounded-full left-10 top-0 animate-eye-blink">
              <span className="absolute w-2 h-2 bg-white rounded-full left-1 top-1 animate-pupil"></span>
            </div>
            
            {/* 触角 */}
            <div className="absolute w-0.5 h-10 bg-black left-4 top-1.5 -rotate-30 -z-10"></div>
            <div className="absolute w-0.5 h-10 bg-black left-11 top-1.5 rotate-30 -z-10"></div>
            
            {/* 嘴巴 */}
            <div className="absolute w-5.5 h-5.5 bg-white rounded-full top-5.5 left-[-1.5px]">
              <div className="absolute w-5.5 h-5.5 bg-green-400 rounded-full top-1.5 left-0"></div>
            </div>
            
            {/* 身体上部 */}
            <div className="absolute w-7.5 h-20 bg-green-400 rounded-[50%_50%_20%_20%] top-7 left-4.5 -rotate-5 overflow-hidden"></div>
          </div>
          
          {/* 身体下部 */}
          <div className="absolute w-25 h-10 bg-green-400 rounded-[90%_50%_30%_50%] top-20 left-6.5 overflow-hidden"></div>
          
          {/* 尾部 */}
          <div className="absolute w-15 h-6.5 bg-green-400 rounded-[10%_100%_8%_10%] left-27.5 top-23.5 animate-caud"></div>
          
          {/* 壳 */}
          <div className="absolute w-25 h-25 bg-amber-700 rounded-full left-13.5 top-[-2.5px] animate-shell">
            <div className="absolute w-17.5 h-17.5 bg-orange-500 rounded-full left-5.5 top-5.5"></div>
            <div className="absolute w-12.5 h-12.5 bg-orange-300 rounded-full left-9 top-9"></div>
          </div>
        </div>
        
        {/* 404 文字 */}
        <div className="absolute text-[200px] font-bold text-green-400 left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <span className="absolute left-[-140px] top-[-112px] text-amber-700 animate-word-bounce">4</span>
          <span className="absolute left-[-40px] top-[-112px] text-orange-500 animate-word-bounce-2">0</span>
          <span className="absolute left-[60px] top-[-112px] text-orange-300 animate-word-bounce-3">4</span>
        </div>
      </div>

      {/* 返回按钮 */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2">
        <Link 
          href="/"
          className="px-8 py-3 bg-green-400 text-white rounded-lg hover:bg-green-500 transition-colors shadow-lg"
        >
          返回首页
        </Link>
      </div>

      {/* 自定义样式 */}
      <style jsx>{`
        @keyframes eye_blink {
          0% { transform: scaleY(1); }
          5% { transform: scaleY(0); }
          6% { transform: scaleY(1); }
          100% { transform: scaleY(1); }
        }
        
        @keyframes pupil {
          0% { transform: translate(0, 0); }
          20% { transform: translate(5px, -2px); }
          30% { transform: translate(-2px, 2px); }
          60% { transform: translate(5px, 2px); }
          100% { transform: translate(0, 0); }
        }
        
        @keyframes snail {
          0% { transform: translateX(40px) rotateY(0deg); }
          45% { transform: translateX(-60px) rotateY(0deg); }
          50% { transform: translateX(-60px) rotateY(-180deg); }
          95% { transform: translateX(40px) rotateY(-180deg); }
          100% { transform: translateX(40px) rotateY(0deg); }
        }
        
        @keyframes head {
          0% { transform: rotate(0); }
          50% { transform: rotate(-5deg); }
          100% { transform: rotate(0); }
        }
        
        @keyframes caud {
          0% { transform: translate(0); }
          50% { transform: translate(-5px); }
          100% { transform: translate(0); }
        }
        
        @keyframes shell {
          0% { transform: rotate(0); }
          50% { transform: rotate(5deg); }
          100% { transform: rotate(0); }
        }
        
        @keyframes word_bounce {
          0% { transform: rotate(0deg); }
          50% { transform: rotate(10deg); }
          80% { transform: rotate(-10deg); }
          100% { transform: rotate(0deg); }
        }
        
        .animate-snail {
          animation: snail 3s linear infinite;
        }
        
        .animate-head {
          animation: head 1s linear infinite;
        }
        
        .animate-caud {
          animation: caud 1s linear infinite;
        }
        
        .animate-shell {
          animation: shell 1s linear infinite;
        }
        
        .animate-word-bounce {
          animation: word_bounce 3s ease infinite;
        }
        
        .animate-word-bounce-2 {
          animation: word_bounce 5s linear infinite;
        }
        
        .animate-word-bounce-3 {
          animation: word_bounce 4s ease infinite;
        }
        
        .animate-eye-blink {
          animation: eye_blink 2s ease infinite;
        }
        
        .animate-pupil {
          animation: pupil 5s linear infinite;
        }
        
        @media screen and (max-width: 430px) {
          .snail {
            top: -140px;
          }
          .text-content {
            top: 46px;
          }
        }
      `}</style>
    </div>
  );
} 
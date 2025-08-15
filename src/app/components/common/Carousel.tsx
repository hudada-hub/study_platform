'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';

// 引入 Swiper 样式
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

interface CarouselProps {
  children: React.ReactNode;
  className?: string;
}

// 图片项接口
interface ImageItemProps {
  imageUrl: string;
  title?: string;
  link?: string;
  alt?: string;
}

// 图片项组件
export const ImageItem: React.FC<ImageItemProps> = ({
  imageUrl,
  title,
  link,
  alt,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const startPos = useRef({ x: 0, y: 0 });
  const linkRef = useRef<HTMLAnchorElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    startPos.current = { x: e.clientX, y: e.clientY };
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (e.buttons === 1) {
      const deltaX = Math.abs(e.clientX - startPos.current.x);
      const deltaY = Math.abs(e.clientY - startPos.current.y);
      if (deltaX > 5 || deltaY > 5) {
        setIsDragging(true);
      }
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    if (isDragging) {
      e.preventDefault();
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    startPos.current = { x: touch.clientX, y: touch.clientY };
    setIsDragging(false);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    const deltaX = Math.abs(touch.clientX - startPos.current.x);
    const deltaY = Math.abs(touch.clientY - startPos.current.y);
    if (deltaX > 5 || deltaY > 5) {
      setIsDragging(true);
    }
  };

  const content = (
    <div className="relative w-[800px] h-[300px] group">
      <Image
        src={imageUrl}
        alt={alt || title || ''}
        fill
        className="object-cover rounded-lg transition-transform duration-300 group-hover:scale-105"
        sizes="(max-width: 768px) 100vw, 800px"
        draggable={false}
      />
      {title && (
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent text-white rounded-b-lg">
          <h3 className="text-sm  line-clamp-1">{title}</h3>
        </div>
      )}
    </div>
  );

  if (link) {
    return (
      <Link 
        target='_blank'
        ref={linkRef}
        href={link} 
        className="block select-none"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onClick={handleClick}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
      >
        {content}
      </Link>
    );
  }

  return content;
};

export const Carousel: React.FC<CarouselProps> = ({
  children,
  className = '',
}) => {
  return (
    <div className={`carousel-container ${className}`}>
      <style jsx global>{`
        .carousel-container {
          padding: 20px 0;
          width: 100%;
          overflow: hidden;
        }
        .carousel-container .swiper {
          overflow: visible;
        }
        .carousel-container .swiper-slide {
          width: 800px !important;
          transition: all 0.3s ease;
        }
        .carousel-container .swiper-slide-active {
          opacity: 1;
        }
        .carousel-container .swiper-button-prev,
        .carousel-container .swiper-button-next {
          color: #fff;
          text-shadow: 0 2px 4px rgba(0,0,0,0.3);
        }
        .carousel-container .swiper-pagination-bullet {
          width: 20px;
          height: 4px;
          border-radius: 2px;
          background: rgba(255, 255, 255, 0.6);
          transition: all 0.3s ease;
        }
        .carousel-container .swiper-pagination-bullet-active {
          width: 30px;
          background: #fff;
          opacity: 1;
        }
        @media (max-width: 1024px) {
          .carousel-container .swiper-slide {
            width: 600px !important;
          }
        }
        @media (max-width: 768px) {
          .carousel-container .swiper-slide {
            width: 100% !important;
          }
          .carousel-container .swiper-pagination-bullet {
            width: 16px;
            height: 3px;
          }
          .carousel-container .swiper-pagination-bullet-active {
            width: 24px;
          }
        }
      `}</style>
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        slidesPerView="auto"
        centeredSlides={true}
        spaceBetween={30}
        loop={true}
        pagination={{
          clickable: true,
        }}
        navigation={true}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
      >
        {React.Children.map(children, (child) => (
          <SwiperSlide>{child}</SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};





 
'use client';

import React from 'react';
import { useConfig } from '@/providers/config-provider';
import { MultiContentValue } from '@/types/config';
import Image from 'next/image';
import Link from 'next/link';

// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

// import required modules
import { Pagination, Navigation, Autoplay } from 'swiper/modules';

// 论坛轮播图组件
export const ForumCarousel: React.FC = () => {
  const { configs } = useConfig();
  
  // 获取论坛轮播图配置
  const forumCarouselConfig = configs.find(config => config.key === 'forum_carousel');
  
  if (!forumCarouselConfig || !forumCarouselConfig.value) {
    return null;
  }

  // 解析轮播图数据
  let carouselData: MultiContentValue[] = [];
  
  try {
    if (typeof forumCarouselConfig.value === 'string') {
      carouselData = JSON.parse(forumCarouselConfig.value);
    } else if (Array.isArray(forumCarouselConfig.value)) {
      carouselData = forumCarouselConfig.value as MultiContentValue[];
    }
  } catch (error) {
    console.error('解析论坛轮播图配置失败:', error);
    return null;
  }

  if (!carouselData.length) {
    return null;
  }

  return (
    <div className="mb-8 w-[868px]">
      <Swiper
        slidesPerView={1}
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
        modules={[Pagination, Navigation, Autoplay]}
        className="forum-carousel"
      >
        {carouselData.map((item, idx) => (
          <SwiperSlide key={idx}>
            {item.link ? (
              <Link href={item.link} target="_blank" className="block select-none">
                <div className="relative w-[868px] h-[300px] group">
                  <Image
                    src={item.imageUrl || ''}
                    alt={item.title || ''}
                    fill
                    className="object-cover rounded-lg transition-transform duration-300 group-hover:scale-105"
                    sizes="868px"
                    draggable={false}
                  />
                  {item.title && (
                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent text-white rounded-b-lg">
                      <h3 className="text-sm line-clamp-1">{item.title}</h3>
                    </div>
                  )}
                </div>
              </Link>
            ) : (
              <div className="relative w-[868px] h-[300px] group">
                <Image
                  src={item.imageUrl || ''}
                  alt={item.title || ''}
                  fill
                  className="object-cover rounded-lg transition-transform duration-300 group-hover:scale-105"
                  sizes="200px"
                  draggable={false}
                />
                {item.title && (
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent text-white rounded-b-lg">
                    <h3 className="text-sm line-clamp-1">{item.title}</h3>
                  </div>
                )}
              </div>
            )}
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}; 
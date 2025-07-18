import { Carousel, ImageItem } from './components/common/Carousel';
import { getConfigs } from '@/services/config';
import { ConfigValue, MultiImageValue } from '@/types/config';

import FriendLinks, { FriendLink } from '@/components/FriendLinks';

import prisma from '@/lib/prisma';
import MenuRow from '@/components/common/Menu/MenuRow';


export interface FriendLinksProps {
  links: FriendLink[];
}
export default async function HomePage() {
  // 获取轮播图配置
  const configs = await getConfigs();
  const carouselConfig = configs.find(config => config.key === 'carousel');
  const friendWikis = configs.find(config => config.key === 'friend_links')
  const guide_group = configs.find(config => config.key === 'guide_group')


 
 
  // 转换配置数据为轮播图所需格式
  const carouselItems = carouselConfig?.value as MultiImageValue[];
  const friendLinks:FriendLink[] = friendWikis?.value as unknown as FriendLink[];
  
  
  return (
    <div className="min-h-screen max-w-7xl mx-auto bg-white mt-4">

      <MenuRow className='mt-4 mb-4'  />
      {/* 轮播图区域 */}
      <section className="relative w-full max-w-7xl mx-auto">
        <Carousel>
          {carouselItems?.map((item, index) => (
            <div key={index}>
              <ImageItem imageUrl={item.imageUrl!} title={item.title} link={item.link} alt={item.title} />
            </div>
          ))}
        </Carousel>
      </section>

     
      {/* 友情链接区域 */}
      <FriendLinks links={friendLinks} />
    </div>
  );
} 
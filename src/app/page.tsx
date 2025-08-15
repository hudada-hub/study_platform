'use client';

import React, { useState, useEffect } from 'react';
import { Carousel, Card, Button, Row, Col, Statistic } from 'antd';
import { 
  PlayCircleOutlined, 
  BookOutlined, 
  MessageOutlined, 
  TrophyOutlined,
  UserOutlined,
  EyeOutlined,
  StarOutlined,
  FireOutlined
} from '@ant-design/icons';
import Link from 'next/link';
import CourseSection from './components/home/CourseSection';
import ForumSection from './components/home/ForumSection';
import TaskSection from './components/home/TaskSection';
import GameSection from './components/home/GameSection';
import { request } from '@/utils/request';
import { ResponseUtil } from '@/utils/response';

const HomePage: React.FC = () => {
  const [stats, setStats] = useState([
    { title: "注册用户", value: 0, icon: <UserOutlined />, color: "#1890ff" },
    { title: "精品课程", value: 0, icon: <BookOutlined />, color: "#52c41a" },
    { title: "完成任务", value: 0, icon: <TrophyOutlined />, color: "#faad14" },
    { title: "论坛帖子", value: 0, icon: <MessageOutlined />, color: "#722ed1" }
  ]);

  // 获取统计数据
  const fetchStats = async () => {
    try {
      const response = await request('/analytics/stats', {
        method: 'GET',
      });
      if (ResponseUtil.success(response)) {
        const data = response.data as {
          userCount: number;
          courseCount: number;
          taskCount: number;
          postCount: number;
        };
        setStats([
          { title: "注册用户", value: data.userCount, icon: <UserOutlined />, color: "#1890ff" },
          { title: "精品课程", value: data.courseCount, icon: <BookOutlined />, color: "#52c41a" },
          { title: "完成任务", value: data.taskCount, icon: <TrophyOutlined />, color: "#faad14" },
          { title: "论坛帖子", value: data.postCount, icon: <MessageOutlined />, color: "#722ed1" }
        ]);
      }
    } catch (error) {
      console.error('获取统计数据失败:', error);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const bannerItems = [
    {
      id: 1,
      title: "网络安全学习平台",
      subtitle: "专业的CTF训练与技能提升",
      description: "从入门到精通，一站式网络安全学习平台",
      image: "/background.jpg",
      buttonText: "开始学习",
      buttonLink: "/courses"
    },
    {
      id: 2,
      title: "实战任务接单",
      subtitle: "真实项目经验积累",
      description: "通过接单获得实战经验，提升技能水平",
      image: "/background1.jpg",
      buttonText: "查看任务",
      buttonLink: "/tasks"
    },
    {
      id: 3,
      title: "技术交流论坛",
      subtitle: "与同行交流学习",
      description: "分享经验，讨论技术，共同进步",
      image: "/background2.jpg",
      buttonText: "加入讨论",
      buttonLink: "/forum"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 轮播图 */}
      <section className="mb-12">
        <Carousel 
          autoplay 
          className="home-carousel"
          draggable={true}
          dots={{ className: 'carousel-dots-bottom' }}
          effect="fade"
          swipeToSlide={true}
          touchMove={true}
          beforeChange={(from, to) => {
            // 可以在这里添加切换前的逻辑
          }}
          afterChange={(current) => {
            // 可以在这里添加切换后的逻辑
          }}
        >
          {bannerItems.map((item) => (
            <div key={item.id} className="relative h-96 md:h-[500px] cursor-grab active:cursor-grabbing">
              <div 
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${item.image})` }}
              >
                <div className="absolute inset-0 bg-black bg-opacity-40"></div>
              </div>
              <div className="relative h-full flex items-center justify-center">
                <div className="text-center text-white max-w-4xl mx-auto px-4">
                  <h1 className="text-4xl md:text-6xl font-normal mb-4">
                    {item.title}
                  </h1>
                  <h2 className="text-xl md:text-2xl mb-4 opacity-90">
                    {item.subtitle}
                  </h2>
                  <p className="text-lg md:text-xl mb-8 opacity-80">
                    {item.description}
                  </p>
                  <Link href={item.buttonLink}>
                    <Button 
                      type="primary" 
                      size="large"
                      className="text-lg px-8 py-4 h-auto"
                    >
                      {item.buttonText}
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </Carousel>
      </section>

      {/* 统计数据 */}
      <section className="mb-12">
        <div className="max-w-7xl mx-auto px-4">
          <Row gutter={[24, 24]}>
            {stats.map((stat, index) => (
              <Col xs={12} sm={6} key={index}>
                <Card className="text-center hover:shadow-md transition-shadow">
                  <Statistic
                    title={stat.title}
                    value={stat.value}
                    valueStyle={{ color: stat.color }}
                    prefix={stat.icon}
                    suffix={index === 0 ? "人" : index === 1 ? "门" : index === 2 ? "个" : "条"}
                  />
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </section>

      {/* 主要内容区域 */}
      <section className="max-w-7xl mx-auto px-4">
        {/* 课程模块 */}
        <CourseSection />
        
        {/* 论坛模块 */}
        <ForumSection />
        
        {/* 任务模块 */}
        <TaskSection />
        
        {/* 游戏入口模块 */}
        <GameSection />
      </section>

      {/* 特色功能 */}
      <section className="mb-12 bg-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-normal text-gray-900 mb-4">
              平台特色功能
            </h2>
            <p className="text-gray-600 text-lg">
              一站式网络安全学习与技能提升平台
            </p>
          </div>
          
          <Row gutter={[32, 32]}>
            <Col xs={24} md={8}>
              <Card className="text-center h-full hover:shadow-lg transition-shadow">
                <div className="text-cyan-500 text-4xl mb-4">
                  <BookOutlined />
                </div>
                <h3 className="text-xl font-normal text-gray-900 mb-3">
                  精品课程
                </h3>
                <p className="text-gray-600">
                  专业的网络安全课程体系，从基础到高级，循序渐进
                </p>
              </Card>
            </Col>
            
            <Col xs={24} md={8}>
              <Card className="text-center h-full hover:shadow-lg transition-shadow">
                <div className="text-cyan-500 text-4xl mb-4">
                  <TrophyOutlined />
                </div>
                <h3 className="text-xl font-normal text-gray-900 mb-3">
                  实战任务
                </h3>
                <p className="text-gray-600">
                  真实项目任务，积累实战经验，提升技能水平
                </p>
              </Card>
            </Col>
            
            <Col xs={24} md={8}>
              <Card className="text-center h-full hover:shadow-lg transition-shadow">
                <div className="text-cyan-500 text-4xl mb-4">
                  <MessageOutlined />
                </div>
                <h3 className="text-xl font-normal text-gray-900 mb-3">
                  技术交流
                </h3>
                <p className="text-gray-600">
                  活跃的技术社区，与同行交流学习，共同进步
                </p>
              </Card>
            </Col>
          </Row>
        </div>
      </section>
    </div>
  );
};

export default HomePage; 
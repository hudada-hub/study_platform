'use client';

import React, { useState, useEffect } from 'react';
import { Card, Tag, Space, Button } from 'antd';
import { PlayCircleOutlined, DownloadOutlined } from '@ant-design/icons';
import Link from 'next/link';

interface Game {
  id: number;
  name: string;
  announcement?: string;
  carouselImages?: string[];
  status: string;
  createdAt: string;
  updatedAt: string;
  downloadLink?: string;
  userRegistration?: {
    gameId: number;
    status: string;
    registeredAt: string;
  };
}

const GameSection: React.FC = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(false);

  // 从API获取游戏数据
  useEffect(() => {
    const fetchGames = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/games');
        if (response.ok) {
          const data = await response.json();
                  if (data.code === 0) {
          setGames(data.data || []);
        }
        }
      } catch (error) {
        console.error('获取游戏列表失败:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
  }, []);

  const renderGameCard = (game: Game) => (
    <Card key={game.id} className="h-full">
      <div className="text-center">
        <div className="relative mb-4">
          <img 
            src={game.carouselImages && game.carouselImages.length > 0 ? game.carouselImages[0] : "/puzzle.png"} 
            alt={game.name}
            className="w-full h-48 object-cover rounded-lg"
          />
          <Tag color="blue" className="absolute top-2 left-2">
            {game.status === 'ACTIVE' ? '活跃' : '维护中'}
          </Tag>
          {game.userRegistration && (
            <Tag color="green" className="absolute top-2 right-2">
              已报名
            </Tag>
          )}
        </div>
        
        <h3 className="text-lg font-normal text-gray-900 mb-2">{game.name}</h3>
        {game.announcement && (
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">{game.announcement}</p>
        )}
        
        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <span>创建时间: {new Date(game.createdAt).toLocaleDateString()}</span>
          {game.userRegistration && (
            <span className="text-green-600">
              报名时间: {new Date(game.userRegistration.registeredAt).toLocaleDateString()}
            </span>
          )}
        </div>
        
        <div className="flex gap-2">
          <Button 
            type="primary" 
            icon={<PlayCircleOutlined />}
            className="flex-1"
            onClick={() => window.open(`/games/${game.id}`, '_blank')}
          >
            启动游戏
          </Button>
          {game.downloadLink && (
            <Button 
              icon={<DownloadOutlined />}
              onClick={() => window.open(game.downloadLink, '_blank')}
            >
              下载
            </Button>
          )}
        </div>
      </div>
    </Card>
  );

  const renderGameGrid = (games: Game[]) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {games.map(renderGameCard)}
    </div>
  );

  return (
    <div className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-normal text-gray-900">游戏入口</h2>
        <Link 
          href="/games" 
          className="text-cyan-500 hover:text-cyan-600 transition-colors"
        >
          查看更多 →
        </Link>
      </div>
      
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <div className="h-48 bg-gray-200 rounded mb-4"></div>
              <div className="space-y-3">
                <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="flex gap-2">
                  <div className="h-8 bg-gray-200 rounded flex-1"></div>
                  <div className="h-8 bg-gray-200 rounded w-16"></div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        renderGameGrid(games)
      )}
    </div>
  );
};

export default GameSection; 
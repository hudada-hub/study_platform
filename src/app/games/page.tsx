'use client';

import React, { useState, useEffect } from 'react';
import { Card, Button, Carousel } from 'antd';
import Swal from 'sweetalert2';
import { PlayCircleOutlined, DownloadOutlined, UserAddOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { request } from '@/utils/request';

interface Game {
  id: number;
  name: string;
  announcement?: string;
  carouselImages?: string[];
  status: 'ACTIVE' | 'DELETED';
  downloadLink?: string;
  startTime?: string;
  endTime?: string;
  description?: string;
  version?: string;
}

interface GameRegistration {
  id: number;
  gameId: number;
  status: 'REGISTERED' | 'CANCELLED' | 'COMPLETED';
  registeredAt: string;
}

const GamesPage: React.FC = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [registrations, setRegistrations] = useState<GameRegistration[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await request<Game[]>('/games', { method: 'GET' });
        if (response.code === 0) {
          const gamesData = response.data || [];
          console.log(gamesData,'gameData')
          setGames(gamesData);
          // 设置用户的报名状态
          const userRegistrations = gamesData
            .filter((game: any) => game.userRegistration)
            .map((game: any) => ({
              id: game.userRegistration.id,
              gameId: game.id,
              status: game.userRegistration.status,
              registeredAt: game.userRegistration.registeredAt
            }));
          setRegistrations(userRegistrations);
        }
      } catch (error) {
        console.error('获取游戏列表失败:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
  }, []);

  const getRegistrationStatus = (gameId: number) => {
    const registration = registrations.find(r => r.gameId === gameId);
    return registration?.status || null;
  };

  const getGameStatus = (game: Game) => {
    const now = new Date();
    const startTime = game.startTime ? new Date(game.startTime) : null;
    const endTime = game.endTime ? new Date(game.endTime) : null;
    const registration = getRegistrationStatus(game.id);

    if (registration === 'REGISTERED') {
      return 'registered';
    }

    if (startTime && now >= startTime) {
      return 'active';
    }

    return 'upcoming';
  };

  const getButtonText = (game: Game) => {
    const status = getGameStatus(game);
    switch (status) {
      case 'registered':
        return '已报名';
      case 'active':
        return '进入游戏';
      default:
        return '报名';
    }
  };

  const getButtonType = (game: Game) => {
    const status = getGameStatus(game);
    switch (status) {
      case 'registered':
        return 'default';
      case 'active':
        return 'primary';
      default:
        return 'primary';
    }
  };

  const getButtonColor = (game: Game) => {
    const status = getGameStatus(game);
    switch (status) {
      case 'registered':
        return '#d3adf7'; // 浅紫色
      case 'active':
        return '#95de64'; // 浅绿色
      default:
        return '#52c41a'; // 绿色
    }
  };

  const getButtonIcon = (game: Game) => {
    const status = getGameStatus(game);
    switch (status) {
      case 'registered':
        return <UserAddOutlined />;
      case 'active':
        return <PlayCircleOutlined />;
      default:
        return <UserAddOutlined />;
    }
  };

  const handleGameAction = async (game: Game) => {
    const status = getGameStatus(game);
    
    try {
      if (status === 'registered') {
        Swal.fire({
          icon: 'info',
          title: '已报名',
          text: '您已报名此游戏',
        });
        return;
      }

      if (status === 'active') {
        // 检查游戏是否已下载
        if (game.downloadLink) {
          // 尝试启动本地游戏
          try {
            window.open(game.downloadLink, '_blank');
          } catch (error) {
            // 如果无法启动本地游戏，跳转到下载页面
            router.push(`/games/download/${game.id}`);
          }
        } else {
          router.push(`/games/download/${game.id}`);
        }
        return;
      }

      // 报名游戏
      const response = await request('/games/register', {
        method: 'POST',
        body: JSON.stringify({
          gameId: game.id
        })
      });

      if (response.code === 0) {
        Swal.fire({
          icon: 'success',
          title: '报名成功！',
          text: '您已成功报名该游戏',
        });
        // 更新报名状态
        setRegistrations(prev => [...prev, {
          id: Date.now(),
          gameId: game.id,
          status: 'REGISTERED',
          registeredAt: new Date().toISOString()
        }]);
      } else {
        Swal.fire({
          icon: 'error',
          title: '报名失败',
          text: response.message || '报名失败，请重试',
        });
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: '操作失败',
        text: '请重试',
      });
    }
  };



  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <Card key={i} loading={true} className="h-80" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-gray-800 mb-2">游戏中心</h1>
          <p className="text-gray-600">参与精彩游戏活动，赢取丰厚奖励</p>
        </div>

        <div className="space-y-6">
          {games.map((game) => {
            console.log('Game carousel images:', game.carouselImages);
            return (
              <div key={game.id} className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden game-item">
                <div className="flex flex-col md:flex-row">
                  {/* 左侧游戏横幅 */}
                  <div className="w-[65%] relative h-48 md:h-48">
                    {game.carouselImages && game.carouselImages.length > 0 && (
                      <Carousel
                        autoplay
                        dots={{ className: 'game-carousel' }}
                        arrows={true}
                        className="h-full"
                      >
                        {game.carouselImages.map((image, index) => (
                          <div key={index} className="h-48">
                            <div 
                              className="w-full h-full game-banner relative"
                              style={{
                                backgroundImage: `url(${image})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center'
                              }}
                            >
                          

                         
                            </div>
                          </div>
                        ))}
                      </Carousel>
                    ) }
                  </div>

                  {/* 右侧信息面板 */}
                  <div className="flex-1 md:w-64 p-6 flex flex-col justify-between">
                    <div>
                      <p className="text-gray-800 text-sm mb-2">{game.announcement}</p>
                
                    </div>

                    {/* 操作按钮 */}
                    <div className="mt-4">
                      <Button
                        type={getButtonType(game) as any}
                        icon={getButtonIcon(game)}
                        onClick={() => handleGameAction(game)}
                        className="w-full h-10"
                        style={{
                          backgroundColor: getButtonColor(game),
                          borderColor: 'transparent',
                          color: 'white'
                        }}
                      >
                        {getButtonText(game)}
                      </Button>
                      
                      {game.downloadLink && (
                        <Button
                          type="default"
                          icon={<DownloadOutlined />}
                          onClick={() => router.push(`/games/download/${game.id}`)}
                          size="small"
                          className="mt-2 w-full"
                        >
                          下载游戏
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* 空状态 */}
        {games.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🎮</div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">暂无游戏活动</h3>
            <p className="text-gray-500">敬请期待更多精彩游戏</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GamesPage; 
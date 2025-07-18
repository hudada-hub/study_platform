import { NextRequest } from 'next/server';
import { ResponseUtil } from '@/utils/response';
import createPuzzle from 'node-puzzle';
import path from 'path';
import fs from 'fs';

// 定义返回类型
interface PuzzleResult {
  bg: Buffer;
  puzzle: Buffer;
  x: number;
  y: number;
}

// 处理GET请求，生成拼图验证码
export async function GET(request: NextRequest) {
  try {
    // 从预设的背景图中随机选择一张
    const bgImages = ['bg1.jpg', 'bg2.jpg', 'bg3.jpg'];
    const randomBg = bgImages[Math.floor(Math.random() * bgImages.length)];
    const bgPath = path.join(process.cwd(), 'public', randomBg);

    // 生成拼图
    const result = await createPuzzle(bgPath, {
      bg: fs.createWriteStream(path.join(process.cwd(), 'public', 'bg.jpg')),
      puzzle: fs.createWriteStream(path.join(process.cwd(), 'public', 'puzzle.png'))
    },{
      width: 60,
      height: 60,
      bgWidth: 320,
      bgHeight:   160,
    }) as PuzzleResult;

    // 等待文件写入完成
    await new Promise(resolve => setTimeout(resolve, 100));

    // 读取生成的图片文件并转换为Base64
    const bgBuffer = fs.readFileSync(path.join(process.cwd(), 'public', 'bg.jpg'));
    const puzzleBuffer = fs.readFileSync(path.join(process.cwd(), 'public', 'puzzle.png'));
    
    const bgBase64 = `data:image/jpeg;base64,${bgBuffer.toString('base64')}`;
    const puzzleBase64 = `data:image/png;base64,${puzzleBuffer.toString('base64')}`;

    return ResponseUtil.success({
      bgUrl: bgBase64,
      puzzleUrl: puzzleBase64,
      x: result.x,
      y: result.y
    });
  } catch (error) {
    console.error('生成验证码失败:', error);
    return ResponseUtil.error('生成验证码失败');
  }
} 
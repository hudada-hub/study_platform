'use client'
import React, { useRef, useState } from 'react';
import { Upload, Button, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import NoSSRWrapper from './NoSSRWrapper';
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile, toBlobURL } from "@ffmpeg/util";

interface VideoUploadWithWatermarkProps {
  value?: string;
  onChange?: (url: string) => void;
  watermarkFile?: File; // 可选，图片水印
  uploadAction: string; // 上传接口地址
}

const VideoUploadWithWatermark: React.FC<VideoUploadWithWatermarkProps> = ({ value, onChange, watermarkFile, uploadAction }) => {
  const [uploading, setUploading] = useState(false);
  const ffmpegRef = useRef(new FFmpeg());
  const messageRef = useRef<HTMLParagraphElement | null>(null);

  // 生成 drawtext 位置参数（右上角）
  const getDrawtextPosition = () => "x=10:y=10";

  // 选择水印图片（可扩展为用户自选）
  const getWatermarkFile = async (): Promise<File | undefined> => {
    if (watermarkFile) return watermarkFile;
    return undefined;
  };

  async function addWatermark(videoFile: File, watermarkFile?: File): Promise<File> {
    const baseURL = "/ffmpeg";
    const ffmpeg = ffmpegRef.current;
    ffmpeg.on("log", ({ message }) => {
      if (messageRef.current) messageRef.current.innerHTML = message;
    });
    await ffmpeg.load({
      coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, "text/javascript"),
      wasmURL: await toBlobURL(
        `${baseURL}/ffmpeg-core.wasm`,
        "application/wasm",
        
      ),
      workerURL: await toBlobURL(`${baseURL}/ffmpeg-core.worker.js`, 'text/javascript')
    });
    await ffmpeg.writeFile("input.mp4", await fetchFile(videoFile));
    let outputName = "output.mp4";
    if (watermarkFile) {
      // 图片水印逻辑（保留，默认不走）
      await ffmpeg.writeFile("watermark.png", await fetchFile(watermarkFile));
      await ffmpeg.exec([
        "-i", "input.mp4",
        "-i", "watermark.png",
        "-filter_complex", "overlay=W-w-10:10",
        "-c:a", "copy",
        outputName
      ]);
    } else {
      await ffmpeg.writeFile('font.ttf', await fetchFile('/ffmpeg/font.ttf'));
      // 默认文字水印，右上角，内容为“感谢观看”
      await ffmpeg.exec([
        "-i",
         "input.mp4",
        "-vf", 
        `drawtext=fontfile=font.ttf:text='感谢观看':fontcolor=white:fontsize=36:${getDrawtextPosition()}`,
        'output.mp4',
        outputName
      ]);
    
    }
    const data = await ffmpeg.readFile(outputName);
    console.log(111,data);
    return new File([data], outputName, { type: "video/mp4" });
  }

  const uploadProps = {
    showUploadList: false,
    beforeUpload: async (file: File) => {
      setUploading(true);
      try {
        // 默认走文字水印
        const wmFile = await getWatermarkFile();
        const watermarkedFile = await addWatermark(file, wmFile);
        // 上传到后端
        const formData = new FormData();
        formData.append('file', watermarkedFile);
        const resp = await fetch(uploadAction, {
          method: 'POST',
          body: formData,
        });
        const data = await resp.json();
        if (data.code === 0 && data.data?.url) {
          onChange?.(data.data.url);
          message.success('上传成功');
        } else {
          message.error(data.message || '上传失败');
        }
      } catch (e: any) {
        message.error(e.message || '处理失败');
      } finally {
        setUploading(false);
      }
      // 阻止 antd 自动上传
      return false;
    },
  };

  return (
    <NoSSRWrapper>
      <div ref={messageRef}></div>
      <Upload {...uploadProps}>
        <Button icon={<UploadOutlined />} loading={uploading} disabled={uploading}>
          {uploading ? '处理中...' : '上传视频'}
        </Button>
      </Upload>
      {value && (
        <div className="mt-4">
          <video src={value} controls className="w-full rounded-lg" />
        </div>
      )}
    </NoSSRWrapper>
  );
};

export default VideoUploadWithWatermark; 
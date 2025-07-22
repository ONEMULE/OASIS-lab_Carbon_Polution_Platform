'use client';

import { useEffect, useState } from 'react';
import CssDither from './CssDither';

interface SimpleDitherProps {
  waveSpeed?: number;
  waveFrequency?: number;
  waveAmplitude?: number;
  waveColor?: [number, number, number];
  colorNum?: number;
  pixelSize?: number;
  enableMouseInteraction?: boolean;
  mouseRadius?: number;
}

export default function SimpleDither(props: SimpleDitherProps) {
  const [mounted, setMounted] = useState(false);
  const [webglSupported, setWebglSupported] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // 检测WebGL支持
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      setWebglSupported(!!gl);
      canvas.remove();
    } catch (e) {
      setWebglSupported(false);
    }
  }, []);

  // 在服务端或未挂载时显示CSS版本
  if (!mounted || !webglSupported) {
    return (
      <CssDither 
        waveSpeed={props.waveSpeed} 
        waveColor={props.waveColor}
      />
    );
  }

  // 客户端且支持WebGL时，尝试加载原始dither效果
  // 如果加载失败，会fallback到CSS版本
  return (
    <div className="w-full h-full relative">
      <CssDither 
        waveSpeed={props.waveSpeed} 
        waveColor={props.waveColor}
      />
      {/* 这里可以在未来添加WebGL版本的覆盖层 */}
    </div>
  );
}
'use client';

import { useEffect, useState } from 'react';
import CssDither from './CssDither';

interface SafeDitherProps {
  waveSpeed?: number;
  waveFrequency?: number;
  waveAmplitude?: number;
  waveColor?: [number, number, number];
  colorNum?: number;
  pixelSize?: number;
  enableMouseInteraction?: boolean;
  mouseRadius?: number;
}

export default function SafeDither(props: SafeDitherProps) {
  const [DitherComponent, setDitherComponent] = useState<React.ComponentType<SafeDitherProps> | null>(null);
  const [mounted, setMounted] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    const loadDither = async () => {
      try {
        setMounted(true);
        // 延迟加载以确保客户端环境完全初始化
        await new Promise(resolve => setTimeout(resolve, 100));
        
        const { default: Dither } = await import('./OfficialDither');
        setDitherComponent(() => Dither);
      } catch (err) {
        console.warn('Failed to load Dither component:', err);
        setError(true);
      }
    };

    loadDither();
  }, []);

  // 未加载或发生错误时显示CSS版本的dither效果
  if (!mounted || !DitherComponent || error) {
    return (
      <CssDither 
        waveSpeed={props.waveSpeed} 
        waveColor={props.waveColor}
      />
    );
  }

  // 渲染真实的Dither组件
  return <DitherComponent {...props} />;
}
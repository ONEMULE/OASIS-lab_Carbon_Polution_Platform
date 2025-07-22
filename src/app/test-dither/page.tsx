'use client';

import Dither from '@/components/effects/Dither';

export default function TestDitherPage() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Dither背景测试 */}
      <div className="absolute inset-0 z-0">
        <Dither
          waveSpeed={0.025}
          waveFrequency={2.5}
          waveAmplitude={0.4}
          waveColor={[0.15, 0.2, 0.35]}
          colorNum={8}
          pixelSize={2}
          enableMouseInteraction={true}
          mouseRadius={1.2}
        />
      </div>
      
      {/* 测试内容 */}
      <div className="relative z-20 min-h-screen flex items-center justify-center p-4">
        <div className="bg-dark-gray/40 backdrop-blur-md border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.3)] rounded-2xl p-8">
          <h1 className="text-2xl text-white mb-4">Dither效果测试</h1>
          <p className="text-gray-300">毛玻璃效果悬浮在dither背景上</p>
          <p className="text-gray-400 mt-2">移动鼠标查看交互效果</p>
        </div>
      </div>
    </div>
  );
}
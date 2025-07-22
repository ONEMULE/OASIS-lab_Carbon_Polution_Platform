'use client';

interface CssDitherProps {
  waveSpeed?: number;
  waveColor?: [number, number, number];
}

export default function CssDither({ 
  waveSpeed = 0.025, 
  waveColor = [0.15, 0.2, 0.35] 
}: CssDitherProps) {
  const r = Math.round(waveColor[0] * 255);
  const g = Math.round(waveColor[1] * 255);
  const b = Math.round(waveColor[2] * 255);
  
  const animationDuration = `${40 / waveSpeed}s`;

  return (
    <div className="w-full h-full relative overflow-hidden">
      {/* 基础渐变背景 */}
      <div 
        className="absolute inset-0"
        style={{
          background: `radial-gradient(circle at 30% 20%, rgba(${r}, ${g}, ${b}, 0.8) 0%, transparent 50%), 
                      radial-gradient(circle at 80% 80%, rgba(${r + 20}, ${g + 30}, ${b + 50}, 0.6) 0%, transparent 50%), 
                      radial-gradient(circle at 40% 70%, rgba(${r + 10}, ${g + 20}, ${b + 40}, 0.7) 0%, transparent 50%),
                      linear-gradient(135deg, rgba(${r}, ${g}, ${b}, 0.4) 0%, rgba(${r + 30}, ${g + 40}, ${b + 60}, 0.6) 100%)`
        }}
      />
      
      {/* 动态波浪层1 */}
      <div 
        className="absolute inset-0 opacity-60"
        style={{
          background: `radial-gradient(circle at var(--x, 50%) var(--y, 50%), rgba(${r + 15}, ${g + 25}, ${b + 35}, 0.5) 0%, transparent 60%)`,
          animation: `wave1 ${animationDuration} ease-in-out infinite`
        }}
      />
      
      {/* 动态波浪层2 */}
      <div 
        className="absolute inset-0 opacity-40"
        style={{
          background: `radial-gradient(ellipse at var(--x2, 30%) var(--y2, 70%), rgba(${r + 25}, ${g + 35}, ${b + 45}, 0.6) 0%, transparent 70%)`,
          animation: `wave2 ${(parseFloat(animationDuration) * 1.3).toFixed(1)}s ease-in-out infinite reverse`
        }}
      />
      
      {/* Dither模式覆盖层 */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '8px 8px',
          animation: `dither ${(parseFloat(animationDuration) * 0.5).toFixed(1)}s linear infinite`
        }}
      />

      <style jsx>{`
        @keyframes wave1 {
          0% { --x: 20%; --y: 30%; }
          25% { --x: 80%; --y: 20%; }
          50% { --x: 70%; --y: 80%; }
          75% { --x: 30%; --y: 70%; }
          100% { --x: 20%; --y: 30%; }
        }
        
        @keyframes wave2 {
          0% { --x2: 70%; --y2: 80%; }
          33% { --x2: 20%; --y2: 40%; }
          66% { --x2: 90%; --y2: 60%; }
          100% { --x2: 70%; --y2: 80%; }
        }
        
        @keyframes dither {
          0% { transform: translate(0, 0); }
          25% { transform: translate(-2px, 2px); }
          50% { transform: translate(2px, -1px); }
          75% { transform: translate(-1px, -2px); }
          100% { transform: translate(0, 0); }
        }
      `}</style>
    </div>
  );
}
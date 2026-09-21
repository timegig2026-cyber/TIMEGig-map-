import React, { useState } from 'react';
import { LucideIcon } from 'lucide-react';

interface SpatialIcon3DProps {
  icon: LucideIcon;
  size?: 'sm' | 'md' | 'lg';
  active?: boolean;
  interactive?: boolean;
  className?: string;
}

export default function SpatialIcon3D({
  icon: Icon,
  size = 'md',
  active = true,
  interactive = true,
  className = '',
}: SpatialIcon3DProps) {
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const config = {
    sm: {
      pedestal: 'w-9 h-9 rounded-xl',
      iconSize: 18,
      shadowSpread: '0 3px 0 #059669, 0 6px 12px rgba(0, 0, 0, 0.2)',
      inactiveShadow: '0 3px 0 #e5e5e5, 0 6px 10px rgba(0, 0, 0, 0.1)',
      extrusionOffset: 1,
    },
    md: {
      pedestal: 'w-11 h-11 rounded-2xl',
      iconSize: 22,
      shadowSpread: '0 4px 0 #059669, 0 8px 16px rgba(0, 0, 0, 0.25)',
      inactiveShadow: '0 4px 0 #e5e5e5, 0 8px 14px rgba(0, 0, 0, 0.15)',
      extrusionOffset: 1.5,
    },
    lg: {
      pedestal: 'w-24 h-24 rounded-3xl',
      iconSize: 46,
      shadowSpread: '0 8px 0 #059669, 0 16px 28px rgba(0, 0, 0, 0.3)',
      inactiveShadow: '0 8px 0 #e5e5e5, 0 16px 24px rgba(0, 0, 0, 0.2)',
      extrusionOffset: 3,
    },
  }[size];

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!interactive) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setRotate({
      x: -y * 24,
      y: x * 24,
    });
  };

  const handleMouseLeave = () => {
    setRotate({ x: 0, y: 0 });
    setIsHovered(false);
  };

  const baseExtrusionColor = active ? 'text-emerald-950/20' : 'text-neutral-200';
  const layer3Color = active ? 'text-emerald-900/30' : 'text-neutral-100';
  const layer2Color = active ? 'text-emerald-800/40' : 'text-neutral-100';
  const layer1Color = active ? 'text-emerald-600/50' : 'text-neutral-200';
  const frontColor = active ? 'text-emerald-600' : 'text-neutral-400';

  return (
    <div
      id={`spatial-icon-3d-wrapper-${size}`}
      className={`relative inline-flex items-center justify-center select-none ${className}`}
      style={{ perspective: '700px' }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
    >
      {/* 3D Rotating Assembly */}
      <div
        className="relative transition-transform duration-200 ease-out transform-gpu"
        style={{
          transformStyle: 'preserve-3d',
          transform: `rotateX(${rotate.x}deg) rotateY(${rotate.y}deg) ${isHovered ? 'scale(1.08)' : 'scale(1)'}`,
        }}
      >
        {/* Ambient Contact Shadow */}
        <div
          className="absolute -bottom-2 inset-x-1.5 h-3 rounded-full bg-black/60 blur-md pointer-events-none transform-gpu"
          style={{ transform: 'translateZ(-14px) scale(0.92)' }}
        />

        {/* 3D Pedestal Body */}
        <div
          className={`relative flex items-center justify-center ${config.pedestal} transition-all duration-200 transform-gpu ${
            active
              ? 'bg-gradient-to-b from-white via-emerald-50 to-emerald-100 border border-emerald-400/30'
              : 'bg-gradient-to-b from-white via-neutral-50 to-neutral-100 border border-neutral-200'
          }`}
          style={{
            boxShadow: active
              ? `${config.shadowSpread}, inset 0 1.5px 0.5px rgba(255, 255, 255, 1), inset 0 -2px 4px rgba(0, 0, 0, 0.1)`
              : `${config.inactiveShadow}, inset 0 1px 0 rgba(255, 255, 255, 1), inset 0 -2px 4px rgba(0, 0, 0, 0.05)`,
            transformStyle: 'preserve-3d',
          }}
        >
          {/* Top Surface Specular Gloss Arc */}
          <div className="absolute inset-x-1.5 top-0.5 h-1/2 rounded-t-xl bg-gradient-to-b from-white/20 to-transparent pointer-events-none" />

          {/* 3D Extruded Icon Stack */}
          <div
            className="relative flex items-center justify-center transform-gpu"
            style={{ transform: 'translateZ(10px)' }}
          >
            {/* Extrusion Base Shadow Layer (Deepest) */}
            <Icon
              size={config.iconSize}
              className={`absolute pointer-events-none ${baseExtrusionColor} opacity-90 blur-[0.4px]`}
              style={{
                transform: `translate(${config.extrusionOffset * 0.4}px, ${config.extrusionOffset * 2.4}px)`,
              }}
              strokeWidth={2.4}
            />

            {/* Extrusion Layer 3 */}
            <Icon
              size={config.iconSize}
              className={`absolute pointer-events-none ${layer3Color} opacity-95`}
              style={{
                transform: `translateY(${config.extrusionOffset * 1.8}px)`,
              }}
              strokeWidth={2.4}
            />

            {/* Extrusion Layer 2 */}
            <Icon
              size={config.iconSize}
              className={`absolute pointer-events-none ${layer2Color} opacity-95`}
              style={{
                transform: `translateY(${config.extrusionOffset * 1.2}px)`,
              }}
              strokeWidth={2.3}
            />

            {/* Extrusion Layer 1 (Mid-tone bevel) */}
            <Icon
              size={config.iconSize}
              className={`absolute pointer-events-none ${layer1Color} opacity-90`}
              style={{
                transform: `translateY(${config.extrusionOffset * 0.6}px)`,
              }}
              strokeWidth={2.2}
            />

            {/* Front Light Reflection Highlight (Rim light) */}
            <Icon
              size={config.iconSize}
              className="absolute pointer-events-none text-white -translate-y-[0.5px] -translate-x-[0.5px] opacity-40"
              strokeWidth={2.2}
            />

            {/* Front Face (Primary Vibrant Icon) */}
            <Icon
              size={config.iconSize}
              className={`relative transition-colors duration-150 ${frontColor} drop-shadow-[0_1px_1px_rgba(0,0,0,0.1)]`}
              strokeWidth={2.3}
            />
          </div>

          {/* Micro 3D Corner Glint */}
          {active && (
            <span
              className="absolute top-1.5 right-1.5 w-1 h-1 rounded-full bg-white/75 blur-[0.2px] pointer-events-none"
              style={{ transform: 'translateZ(12px)' }}
            />
          )}
        </div>
      </div>
    </div>
  );
}


import React, { useRef } from 'react';

export interface TiltCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
  tiltMaxAngle?: number;
  translateZ?: number;
  disabled?: boolean;
}

const TiltCard: React.FC<TiltCardProps> = ({
  children,
  className = '',
  onClick,
  tiltMaxAngle = 10,
  translateZ = 12,
  disabled = false,
  style,
  ...rest
}) => {
  const cardRef = useRef<HTMLDivElement | null>(null);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (disabled) return;
    const card = cardRef.current;
    if (!card) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const rect = card.getBoundingClientRect();
    const r = (e.clientX - rect.left) / rect.width;
    const i = (e.clientY - rect.top) / rect.height;

    card.style.setProperty('--mx', `${r * 100}%`);
    card.style.setProperty('--my', `${i * 100}%`);
    card.style.transition = 'none';
    card.style.transform = `perspective(1000px) rotateY(${(r - 0.5) * tiltMaxAngle}deg) rotateX(${
      (0.5 - i) * tiltMaxAngle
    }deg) translateZ(${translateZ}px)`;
  };

  const handlePointerLeave = () => {
    if (disabled) return;
    const card = cardRef.current;
    if (!card) return;
    card.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
    card.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg) translateZ(0px)';
    window.setTimeout(() => {
      if (card) card.style.transition = '';
    }, 520);
  };

  return (
    <div
      ref={cardRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      onClick={onClick}
      style={style}
      className={`tilt-fcard ${onClick ? 'cursor-pointer' : ''} ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
};

export default TiltCard;

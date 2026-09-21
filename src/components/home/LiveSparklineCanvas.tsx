import React, { useEffect, useRef } from 'react';

const clamp = (val: number, min: number, max: number) => Math.min(max, Math.max(min, val));

const LiveSparklineCanvas: React.FC<{ className?: string }> = ({ className = '' }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const numPoints = 68;
    const points: number[] = [];
    let currentVal = 0.42;

    for (let i = 0; i < numPoints; i++) {
      currentVal = clamp(currentVal + (Math.random() - 0.44) * 0.07, 0.08, 0.94);
      points.push(currentVal);
    }

    let width = 0;
    let height = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio, 2);
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener('resize', resize);

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      const plotW = width - 20;
      const plotH = height - 20;
      const getCoord = (i: number): [number, number] => [
        10 + (i / (numPoints - 1)) * plotW,
        10 + (1 - points[i]) * plotH,
      ];

      // Gridlines
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.10)';
      ctx.lineWidth = 1;
      for (let g = 1; g < 4; g++) {
        const y = 10 + (plotH / 4) * g;
        ctx.beginPath();
        ctx.moveTo(10, y);
        ctx.lineTo(width - 10, y);
        ctx.stroke();
      }

      // Fill Gradient Area
      const areaGrad = ctx.createLinearGradient(0, 10, 0, height);
      areaGrad.addColorStop(0, 'rgba(16, 185, 129, 0.34)');
      areaGrad.addColorStop(1, 'rgba(16, 185, 129, 0)');

      ctx.beginPath();
      ctx.moveTo(10, height - 10);
      for (let i = 0; i < numPoints; i++) {
        const [x, y] = getCoord(i);
        ctx.lineTo(x, y);
      }
      ctx.lineTo(width - 10, height - 10);
      ctx.closePath();
      ctx.fillStyle = areaGrad;
      ctx.fill();

      // Stroke Line
      const strokeGrad = ctx.createLinearGradient(10, 0, width - 10, 0);
      strokeGrad.addColorStop(0, 'rgba(59, 130, 246, 0.35)');
      strokeGrad.addColorStop(0.65, 'rgba(96, 165, 250, 0.95)');
      strokeGrad.addColorStop(1, '#10b981');

      ctx.strokeStyle = strokeGrad;
      ctx.lineWidth = 2.1;
      ctx.lineJoin = 'round';
      ctx.beginPath();
      for (let i = 0; i < numPoints; i++) {
        const [x, y] = getCoord(i);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Leading Glowing Point
      const [lastX, lastY] = getCoord(numPoints - 1);
      ctx.fillStyle = 'rgba(16, 185, 129, 0.22)';
      ctx.beginPath();
      ctx.arc(lastX, lastY, 7, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#6ee7b7';
      ctx.beginPath();
      ctx.arc(lastX, lastY, 2.9, 0, Math.PI * 2);
      ctx.fill();
    };

    render();

    let intervalId: number | null = null;
    if (!prefersReducedMotion) {
      intervalId = window.setInterval(() => {
        points.shift();
        currentVal = clamp(currentVal + (Math.random() - 0.44) * 0.08, 0.08, 0.94);
        points.push(currentVal);
        render();
      }, 900);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      id="spark"
      className={`w-full h-28 block rounded-xl border border-nova-border/60 bg-gradient-to-b from-nova-accent/[0.05] to-nova-primary/[0.03] ${className}`}
    />
  );
};

export default LiveSparklineCanvas;
